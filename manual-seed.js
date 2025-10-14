// manual-seed.js
import mongoose from "mongoose";
import "dotenv/config";
import { Folder, Post } from "./Kambaz/Pazza/models.js";
import QuizModel from "./Kambaz/Quizzes/model.js";
import QuestionModel from "./Kambaz/Quizzes/questionModel.js";
import { pazzaSeedData } from "./Kambaz/Database/pazza.js";
import { quizzesSeed } from "./Kambaz/Database/quizzes.js";
import { questionsSeed } from "./Kambaz/Database/questions.js";

// IMPORTANT: Replace this with your actual MongoDB Atlas URI
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://choicoco_db_user:0328ChaeSeoaa%21%21@cluster0.vld501g.mongodb.net/kambaz?retryWrites=true&w=majority&appName=cluster0";

async function seedDatabase() {
    try {
        console.log("🔄 Connecting to MongoDB Atlas...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to:", MONGODB_URI.substring(0, 50) + "...");

        // Clear existing data first (optional - comment out if you want to preserve existing data)
        console.log("\n🗑️ Clearing existing data...");
        await Folder.deleteMany({});
        await Post.deleteMany({});
        await QuizModel.deleteMany({});
        await QuestionModel.deleteMany({});

        // Seed Pazza folders
        console.log("\n📁 Seeding Pazza folders...");
        await Folder.insertMany(pazzaSeedData.folders);
        console.log(`✅ Inserted ${pazzaSeedData.folders.length} folders`);

        // Seed Pazza posts with embedded answers and followups
        console.log("\n📝 Seeding Pazza posts...");
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

        // Seed Quizzes
        console.log("\n📋 Seeding quizzes...");
        await QuizModel.insertMany(quizzesSeed);
        console.log(`✅ Inserted ${quizzesSeed.length} quizzes`);

        // Seed Questions
        console.log("\n❓ Seeding questions...");
        await QuestionModel.insertMany(questionsSeed);
        console.log(`✅ Inserted ${questionsSeed.length} questions`);

        // Update quiz points
        console.log("\n🔢 Updating quiz points...");
        const quizIds = [...new Set(questionsSeed.map(q => q.quiz))];
        for (const quizId of quizIds) {
            const questions = questionsSeed.filter(q => q.quiz === quizId);
            const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
            await QuizModel.updateOne(
                { _id: quizId },
                { $set: { points: totalPoints } }
            );
        }

        // Verify the data
        console.log("\n📊 Final verification:");
        console.log(`  Pazza Folders: ${await Folder.countDocuments()}`);
        console.log(`  Pazza Posts: ${await Post.countDocuments()}`);
        console.log(`  Quizzes: ${await QuizModel.countDocuments()}`);
        console.log(`  Questions: ${await QuestionModel.countDocuments()}`);

        // Test queries
        console.log("\n🔍 Testing queries:");
        const testFolders = await Folder.find({ course: "5610" }).limit(3);
        console.log(`  Found ${testFolders.length} folders for course 5610`);

        const testPosts = await Post.find({ course: "5610" }).limit(3);
        console.log(`  Found ${testPosts.length} posts for course 5610`);

        const testQuizzes = await QuizModel.find({ course: "5610" }).limit(3);
        console.log(`  Found ${testQuizzes.length} quizzes for course 5610`);

        console.log("\n✅ Database seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("\n❌ Error seeding database:", error);
        process.exit(1);
    }
}

seedDatabase();