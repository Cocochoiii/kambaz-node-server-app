// Kambaz/Seed/routes.js
import mongoose from "mongoose";
import { Folder, Post } from "../Pazza/models.js";
import QuizModel from "../Quizzes/model.js";
import QuestionModel from "../Quizzes/questionModel.js";
import { pazzaSeedData } from "../Database/pazza.js";
import { quizzesSeed } from "../Database/quizzes.js";
import { questionsSeed } from "../Database/questions.js";

export default function SeedRoutes(app) {
    // Protected seed endpoint - only use this once or when needed
    app.post("/api/seed/initialize", async (req, res) => {
        try {
            const { seedKey } = req.body;

            // Simple protection - you can change this key
            if (seedKey !== "kambaz-seed-2024") {
                return res.status(403).json({ error: "Invalid seed key" });
            }

            console.log("🔄 Starting database seeding...");

            // Check what already exists
            const existingFolders = await Folder.countDocuments();
            const existingPosts = await Post.countDocuments();
            const existingQuizzes = await QuizModel.countDocuments();
            const existingQuestions = await QuestionModel.countDocuments();

            const results = {
                folders: { before: existingFolders, added: 0 },
                posts: { before: existingPosts, added: 0 },
                quizzes: { before: existingQuizzes, added: 0 },
                questions: { before: existingQuestions, added: 0 }
            };

            // Seed Pazza folders if none exist
            if (existingFolders === 0 && pazzaSeedData?.folders) {
                await Folder.insertMany(pazzaSeedData.folders);
                results.folders.added = pazzaSeedData.folders.length;
            }

            // Seed Pazza posts if none exist
            if (existingPosts === 0 && pazzaSeedData?.posts) {
                const processedPosts = pazzaSeedData.posts.map(post => {
                    const postCopy = { ...post };

                    // Process answers
                    const postAnswers = pazzaSeedData.answers?.filter(a => a.postId === post._id) || [];
                    postCopy.studentAnswers = postAnswers
                        .filter(a => a.authorRole === 'STUDENT')
                        .map(a => ({
                            _id: a._id,
                            author: a.author,
                            authorRole: a.authorRole,
                            authorName: a.authorName,
                            content: a.content,
                            timestamp: new Date(a.createdAt),
                            isGoodAnswer: a.isGoodAnswer || false
                        }));

                    postCopy.instructorAnswers = postAnswers
                        .filter(a => ['FACULTY', 'TA', 'INSTRUCTOR'].includes(a.authorRole))
                        .map(a => ({
                            _id: a._id,
                            author: a.author,
                            authorRole: a.authorRole,
                            authorName: a.authorName,
                            content: a.content,
                            timestamp: new Date(a.createdAt),
                            isGoodAnswer: a.isGoodAnswer || false
                        }));

                    // Process followups
                    const postFollowups = (pazzaSeedData.followups || [])
                        .filter(f => f.postId === post._id && !f.parentId)
                        .map(f => {
                            const replies = (pazzaSeedData.followups || [])
                                .filter(r => r.parentId === f._id)
                                .map(r => ({
                                    _id: r._id,
                                    author: r.author,
                                    authorRole: r.authorRole,
                                    authorName: r.authorName,
                                    content: r.content,
                                    timestamp: new Date(r.createdAt)
                                }));

                            return {
                                _id: f._id,
                                author: f.author,
                                authorRole: f.authorRole,
                                authorName: f.authorName,
                                content: f.content,
                                isResolved: f.isResolved || false,
                                timestamp: new Date(f.createdAt),
                                replies
                            };
                        });

                    postCopy.followups = postFollowups;
                    postCopy.hasInstructorAnswer = postCopy.instructorAnswers.length > 0;
                    postCopy.hasStudentAnswer = postCopy.studentAnswers.length > 0;
                    postCopy.createdAt = new Date(postCopy.createdAt);
                    postCopy.updatedAt = new Date(postCopy.updatedAt);

                    return postCopy;
                });

                await Post.insertMany(processedPosts);
                results.posts.added = processedPosts.length;
            }

            // Seed Quizzes if none exist
            if (existingQuizzes === 0 && quizzesSeed) {
                await QuizModel.insertMany(quizzesSeed);
                results.quizzes.added = quizzesSeed.length;
            }

            // Seed Questions if none exist
            if (existingQuestions === 0 && questionsSeed) {
                await QuestionModel.insertMany(questionsSeed);
                results.questions.added = questionsSeed.length;

                // Update quiz points
                const quizIds = [...new Set(questionsSeed.map(q => q.quiz))];
                for (const quizId of quizIds) {
                    const questions = questionsSeed.filter(q => q.quiz === quizId);
                    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
                    await QuizModel.updateOne(
                        { _id: quizId },
                        { $set: { points: totalPoints } }
                    );
                }
            }

            res.json({
                         success: true,
                         message: "Database seeding completed",
                         results
                     });

        } catch (error) {
            console.error("Seed error:", error);
            res.status(500).json({ error: error.message });
        }
    });

    // Check seed status endpoint
    app.get("/api/seed/status", async (req, res) => {
        try {
            const counts = {
                folders: await Folder.countDocuments(),
                posts: await Post.countDocuments(),
                quizzes: await QuizModel.countDocuments(),
                questions: await QuestionModel.countDocuments()
            };
            res.json(counts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}