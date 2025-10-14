// seed-production.js
import mongoose from "mongoose";
import "dotenv/config";
import { Folder, Post } from "./Kambaz/Pazza/models.js";
import QuizModel from "./Kambaz/Quizzes/model.js";
import QuestionModel from "./Kambaz/Quizzes/questionModel.js";
import { pazzaSeedData } from "./Kambaz/Database/pazza.js";
import { quizzesSeed } from "./Kambaz/Database/quizzes.js";
import { questionsSeed } from "./Kambaz/Database/questions.js";

// Use your production MongoDB URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kambaz";

async function seedProduction() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB:", MONGODB_URI.substring(0, 30) + "...");

        // Check existing data
        const existingFolders = await Folder.countDocuments();
        const existingPosts = await Post.countDocuments();
        const existingQuizzes = await QuizModel.countDocuments();
        const existingQuestions = await QuestionModel.countDocuments();

        console.log("\n📊 Current data counts:");
        console.log(`  Pazza Folders: ${existingFolders}`);
        console.log(`  Pazza Posts: ${existingPosts}`);
        console.log(`  Quizzes: ${existingQuizzes}`);
        console.log(`  Questions: ${existingQuestions}`);

        // Seed Pazza data
        if (existingFolders === 0) {
            console.log("\n🔄 Seeding Pazza folders...");
            await Folder.insertMany(pazzaSeedData.folders);
            console.log(`✅ Inserted ${pazzaSeedData.folders.length} folders`);
        }

        if (existingPosts === 0) {
            console.log("\n🔄 Seeding Pazza posts...");
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
            console.log(`✅ Inserted ${processedPosts.length} posts`);
        }

        // Seed Quiz data
        if (existingQuizzes === 0) {
            console.log("\n🔄 Seeding quizzes...");
            await QuizModel.insertMany(quizzesSeed);
            console.log(`✅ Inserted ${quizzesSeed.length} quizzes`);
        }

        if (existingQuestions === 0) {
            console.log("\n🔄 Seeding questions...");
            await QuestionModel.insertMany(questionsSeed);
            console.log(`✅ Inserted ${questionsSeed.length} questions`);

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
            console.log("✅ Updated quiz points");
        }

        // Final verification
        console.log("\n📊 Final data counts:");
        console.log(`  Pazza Folders: ${await Folder.countDocuments()}`);
        console.log(`  Pazza Posts: ${await Post.countDocuments()}`);
        console.log(`  Quizzes: ${await QuizModel.countDocuments()}`);
        console.log(`  Questions: ${await QuestionModel.countDocuments()}`);

        console.log("\n🎉 Production seeding completed!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

seedProduction();