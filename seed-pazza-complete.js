// seed-pazza-complete.js
// Run this script to properly seed your MongoDB with Pazza data
// Usage: node seed-pazza-complete.js

import mongoose from "mongoose";
import "dotenv/config";
import { Folder, Post } from "./Kambaz/Pazza/models.js";
import { pazzaSeedData } from "./Kambaz/Database/pazza.js";

// MongoDB Atlas URI - use from environment or fallback
const MONGODB_URI = process.env.MONGODB_URI ||
                    "mongodb+srv://choicoco_db_user:0328ChaeSeoaa%21%21@cluster0.vld501g.mongodb.net/kambaz?retryWrites=true&w=majority&appName=cluster0";

async function seedPazzaData() {
    try {
        console.log("🔄 Connecting to MongoDB Atlas...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        // Clear existing Pazza data
        console.log("\n🗑️ Clearing existing Pazza data...");
        await Folder.deleteMany({});
        await Post.deleteMany({});
        console.log("✅ Cleared existing data");

        // Seed folders
        console.log("\n📁 Seeding Pazza folders...");
        const folders = pazzaSeedData.folders.map(folder => ({
            ...folder,
            createdAt: new Date(folder.createdAt || Date.now())
        }));
        await Folder.insertMany(folders);
        console.log(`✅ Inserted ${folders.length} folders`);

        // Process and seed posts with embedded answers and followups
        console.log("\n📝 Processing Pazza posts...");
        const processedPosts = pazzaSeedData.posts.map(post => {
            console.log(`  Processing post ${post._id} for course ${post.course}`);

            // Deep copy the post
            const processedPost = {
                _id: post._id,
                course: String(post.course), // Ensure course is string
                type: post.type,
                postTo: post.postTo || "entire_class",
                visibleTo: post.visibleTo || [],
                folders: post.folders || [],
                summary: post.summary || post.title || "Untitled Post",
                details: post.details || "",
                author: post.author || "current-user",
                authorRole: post.authorRole || "STUDENT",
                authorName: post.authorName || "Anonymous",
                createdAt: new Date(post.createdAt || Date.now()),
                updatedAt: new Date(post.updatedAt || Date.now()),
                views: post.views || 0,
                isPinned: post.isPinned || false,
                isInstructorEndorsed: post.isInstructorEndorsed || false,
                studentAnswers: [],
                instructorAnswers: [],
                followups: []
            };

            // Process answers for this post
            const postAnswers = (pazzaSeedData.answers || []).filter(a => a.postId === post._id);

            // Separate student and instructor answers
            postAnswers.forEach(answer => {
                const answerObj = {
                    _id: answer._id,
                    author: answer.author || "user",
                    authorRole: answer.authorRole,
                    authorName: answer.authorName || "Anonymous",
                    content: answer.content || "",
                    timestamp: new Date(answer.createdAt || Date.now()),
                    isGoodAnswer: answer.isGoodAnswer || false
                };

                if (answer.authorRole === 'STUDENT') {
                    processedPost.studentAnswers.push(answerObj);
                } else if (['FACULTY', 'TA', 'INSTRUCTOR'].includes(answer.authorRole)) {
                    processedPost.instructorAnswers.push(answerObj);
                }
            });

            // Process followups for this post
            const postFollowups = (pazzaSeedData.followups || [])
                .filter(f => f.postId === post._id && !f.parentId);

            postFollowups.forEach(followup => {
                // Get replies to this followup
                const replies = (pazzaSeedData.followups || [])
                    .filter(r => r.parentId === followup._id)
                    .map(reply => ({
                        _id: reply._id,
                        author: reply.author || "user",
                        authorRole: reply.authorRole || "STUDENT",
                        authorName: reply.authorName || "Anonymous",
                        content: reply.content || "",
                        timestamp: new Date(reply.createdAt || Date.now())
                    }));

                processedPost.followups.push({
                                                 _id: followup._id,
                                                 author: followup.author || "user",
                                                 authorRole: followup.authorRole || "STUDENT",
                                                 authorName: followup.authorName || "Anonymous",
                                                 content: followup.content || "",
                                                 isResolved: followup.isResolved || false,
                                                 timestamp: new Date(followup.createdAt || Date.now()),
                                                 replies
                                             });
            });

            // Set computed fields
            processedPost.hasInstructorAnswer = processedPost.instructorAnswers.length > 0;
            processedPost.hasStudentAnswer = processedPost.studentAnswers.length > 0;

            console.log(`    ✓ ${processedPost.studentAnswers.length} student answers`);
            console.log(`    ✓ ${processedPost.instructorAnswers.length} instructor answers`);
            console.log(`    ✓ ${processedPost.followups.length} followups`);

            return processedPost;
        });

        // Insert all processed posts
        console.log("\n💾 Inserting processed posts...");
        await Post.insertMany(processedPosts);
        console.log(`✅ Inserted ${processedPosts.length} posts`);

        // Verification
        console.log("\n📊 Verification:");
        const courses = ["5610", "5520", "5004", "5200", "5800", "6510", "6620"];

        for (const courseId of courses) {
            const courseFolders = await Folder.countDocuments({ course: courseId });
            const coursePosts = await Post.find({ course: courseId });
            console.log(`  Course ${courseId}:`);
            console.log(`    - ${courseFolders} folders`);
            console.log(`    - ${coursePosts.length} posts`);

            if (coursePosts.length > 0) {
                const totalAnswers = coursePosts.reduce((sum, p) =>
                                                            sum + p.studentAnswers.length + p.instructorAnswers.length, 0);
                const totalFollowups = coursePosts.reduce((sum, p) =>
                                                              sum + p.followups.length, 0);
                console.log(`    - ${totalAnswers} total answers`);
                console.log(`    - ${totalFollowups} total followups`);
            }
        }

        // Test query
        console.log("\n🔍 Test query for course 6620:");
        const testPosts = await Post.find({ course: "6620" }).limit(5);
        testPosts.forEach(post => {
            console.log(`  - ${post.summary}`);
            console.log(`    Answers: ${post.studentAnswers.length + post.instructorAnswers.length}`);
            console.log(`    Followups: ${post.followups.length}`);
        });

        console.log("\n✨ Seeding completed successfully!");
        console.log("\n📌 Next steps:");
        console.log("1. Restart your Vercel deployment");
        console.log("2. Check your Pazza section");
        console.log("3. Posts should now appear with all their answers and followups");

        process.exit(0);
    } catch (error) {
        console.error("\n❌ Error seeding data:", error);
        console.error("\nDebug info:");
        console.error("- MongoDB URI:", MONGODB_URI.substring(0, 50) + "...");
        console.error("- Error details:", error.message);
        process.exit(1);
    }
}

// Run the seed
console.log("🚀 Starting Pazza data seeding...");
seedPazzaData();