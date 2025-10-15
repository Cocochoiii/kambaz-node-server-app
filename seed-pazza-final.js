// seed-pazza-final.js
// This script will properly seed all your Pazza data
import mongoose from "mongoose";
import "dotenv/config";
import { pazzaSeedData } from "./Kambaz/Database/pazza.js";

const MONGODB_URI = process.env.MONGODB_URI ||
                    "mongodb+srv://choicoco_db_user:0328ChaeSeoaa%21%21@cluster0.vld501g.mongodb.net/kambaz?retryWrites=true&w=majority&appName=cluster0";

// Define schemas exactly as in your models
const answerSub = new mongoose.Schema({
                                          _id: String,
                                          author: String,
                                          authorRole: String,
                                          authorName: String,
                                          content: String,
                                          timestamp: Date,
                                          isGoodAnswer: Boolean,
                                      }, { _id: false });

const replySub = new mongoose.Schema({
                                         _id: String,
                                         author: String,
                                         authorRole: String,
                                         authorName: String,
                                         content: String,
                                         timestamp: Date,
                                     }, { _id: false });

const followupSub = new mongoose.Schema({
                                            _id: String,
                                            author: String,
                                            authorRole: String,
                                            authorName: String,
                                            content: String,
                                            isResolved: Boolean,
                                            timestamp: Date,
                                            replies: [replySub],
                                        }, { _id: false });

const postSchema = new mongoose.Schema({
                                           _id: String,
                                           course: String,  // ENSURE THIS IS STRING
                                           type: { type: String, enum: ["question", "note"] },
                                           postTo: { type: String, enum: ["entire_class", "individual"] },
                                           visibleTo: [String],
                                           folders: [String],
                                           summary: String,
                                           details: String,
                                           author: String,
                                           authorRole: String,
                                           authorName: String,
                                           createdAt: Date,
                                           updatedAt: Date,
                                           views: { type: Number, default: 0 },
                                           hasInstructorAnswer: { type: Boolean, default: false },
                                           hasStudentAnswer: { type: Boolean, default: false },
                                           isPinned: { type: Boolean, default: false },
                                           isInstructorEndorsed: { type: Boolean, default: false },
                                           studentAnswers: [answerSub],
                                           instructorAnswers: [answerSub],
                                           followups: [followupSub],
                                       });

const folderSchema = new mongoose.Schema({
                                             _id: String,
                                             name: String,
                                             course: String,  // ENSURE THIS IS STRING
                                             isDefault: Boolean,
                                             order: Number,
                                             createdAt: { type: Date, default: Date.now },
                                         });

// Use specific collection names
const Post = mongoose.model('PazzaPost', postSchema, 'pazzaposts');
const Folder = mongoose.model('PazzaFolder', folderSchema, 'pazzafolders');

async function seedEverything() {
    try {
        console.log("🔄 Connecting to MongoDB Atlas...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected successfully\n");

        // Ask for confirmation
        console.log("⚠️  WARNING: This will DELETE all existing Pazza data!");
        console.log("Press Ctrl+C to cancel, or wait 3 seconds to continue...\n");
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Clear existing data
        console.log("🗑️  Clearing existing data...");
        await Post.deleteMany({});
        await Folder.deleteMany({});
        console.log("✅ Cleared all existing Pazza data\n");

        // STEP 1: Seed Folders
        console.log("📁 Seeding folders...");
        const foldersToInsert = pazzaSeedData.folders.map(folder => ({
            ...folder,
            course: String(folder.course), // Ensure course is string
            createdAt: new Date(folder.createdAt || Date.now())
        }));

        await Folder.insertMany(foldersToInsert);
        console.log(`✅ Inserted ${foldersToInsert.length} folders`);

        // STEP 2: Process and Seed Posts with Embedded Data
        console.log("\n📝 Processing posts with answers and followups...");

        const postsToInsert = [];

        for (const post of pazzaSeedData.posts) {
            const processedPost = {
                _id: post._id,
                course: String(post.course), // CRITICAL: Ensure course is string!
                type: post.type || "note",
                postTo: post.postTo || "entire_class",
                visibleTo: post.visibleTo || [],
                folders: post.folders || [],
                summary: post.summary || post.title || "Untitled",
                details: post.details || "",
                author: post.author || "current-user",
                authorRole: post.authorRole || "STUDENT",
                authorName: post.authorName || "Anonymous User",
                createdAt: new Date(post.createdAt || Date.now()),
                updatedAt: new Date(post.updatedAt || Date.now()),
                views: post.views || Math.floor(Math.random() * 100),
                isPinned: post.isPinned || false,
                isInstructorEndorsed: post.isInstructorEndorsed || false,
                studentAnswers: [],
                instructorAnswers: [],
                followups: []
            };

            // Add answers for this post
            if (pazzaSeedData.answers) {
                const postAnswers = pazzaSeedData.answers.filter(a => a.postId === post._id);

                for (const answer of postAnswers) {
                    const answerObj = {
                        _id: answer._id,
                        author: answer.author || "user",
                        authorRole: answer.authorRole || "STUDENT",
                        authorName: answer.authorName || "User",
                        content: answer.content || "Answer content",
                        timestamp: new Date(answer.createdAt || Date.now()),
                        isGoodAnswer: answer.isGoodAnswer || false
                    };

                    if (answer.authorRole === 'STUDENT') {
                        processedPost.studentAnswers.push(answerObj);
                    } else if (['FACULTY', 'TA', 'INSTRUCTOR'].includes(answer.authorRole)) {
                        processedPost.instructorAnswers.push(answerObj);
                    }
                }
            }

            // Add followups for this post
            if (pazzaSeedData.followups) {
                const mainFollowups = pazzaSeedData.followups.filter(
                    f => f.postId === post._id && !f.parentId
                );

                for (const followup of mainFollowups) {
                    const followupObj = {
                        _id: followup._id,
                        author: followup.author || "user",
                        authorRole: followup.authorRole || "STUDENT",
                        authorName: followup.authorName || "User",
                        content: followup.content || "Followup content",
                        isResolved: followup.isResolved || false,
                        timestamp: new Date(followup.createdAt || Date.now()),
                        replies: []
                    };

                    // Add replies to this followup
                    const replies = pazzaSeedData.followups.filter(
                        r => r.parentId === followup._id
                    );

                    for (const reply of replies) {
                        followupObj.replies.push({
                                                     _id: reply._id,
                                                     author: reply.author || "user",
                                                     authorRole: reply.authorRole || "STUDENT",
                                                     authorName: reply.authorName || "User",
                                                     content: reply.content || "Reply content",
                                                     timestamp: new Date(reply.createdAt || Date.now())
                                                 });
                    }

                    processedPost.followups.push(followupObj);
                }
            }

            // Set computed fields
            processedPost.hasStudentAnswer = processedPost.studentAnswers.length > 0;
            processedPost.hasInstructorAnswer = processedPost.instructorAnswers.length > 0;

            postsToInsert.push(processedPost);
        }

        // Insert all posts
        console.log(`💾 Inserting ${postsToInsert.length} posts...`);
        await Post.insertMany(postsToInsert);
        console.log("✅ Posts inserted successfully!");

        // STEP 3: Verify the data
        console.log("\n📊 VERIFICATION:");
        console.log("================");

        const courses = ["5610", "5520", "5004", "5200", "5800", "6510", "6620"];
        let totalPostCount = 0;
        let totalAnswerCount = 0;
        let totalFollowupCount = 0;

        for (const courseId of courses) {
            const folders = await Folder.countDocuments({ course: courseId });
            const posts = await Post.find({ course: courseId });

            let courseAnswers = 0;
            let courseFollowups = 0;

            posts.forEach(p => {
                courseAnswers += (p.studentAnswers?.length || 0) + (p.instructorAnswers?.length || 0);
                courseFollowups += (p.followups?.length || 0);
            });

            console.log(`\nCourse ${courseId}:`);
            console.log(`  ✓ ${folders} folders`);
            console.log(`  ✓ ${posts.length} posts`);
            console.log(`  ✓ ${courseAnswers} answers`);
            console.log(`  ✓ ${courseFollowups} followup discussions`);

            if (posts.length > 0) {
                console.log(`  Sample post: "${posts[0].summary}"`);
            }

            totalPostCount += posts.length;
            totalAnswerCount += courseAnswers;
            totalFollowupCount += courseFollowups;
        }

        console.log("\n📈 TOTAL SUMMARY:");
        console.log(`  Total Posts: ${totalPostCount}`);
        console.log(`  Total Answers: ${totalAnswerCount}`);
        console.log(`  Total Followups: ${totalFollowupCount}`);

        // Test specific query for course 6620
        console.log("\n🔍 Test Query - Course 6620:");
        const test6620 = await Post.find({ course: "6620" }).limit(3);
        console.log(`  Found ${test6620.length} posts`);
        test6620.forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.summary}`);
            console.log(`     - ${p.studentAnswers.length} student answers`);
            console.log(`     - ${p.instructorAnswers.length} instructor answers`);
            console.log(`     - ${p.followups.length} followups`);
        });

        console.log("\n✨ SEEDING COMPLETED SUCCESSFULLY!");
        console.log("\n📌 Next Steps:");
        console.log("1. Go to your browser");
        console.log("2. Clear cache: Press F12 → Application → Clear Storage");
        console.log("3. Refresh the Pazza page");
        console.log("4. Your posts should now appear!");

        process.exit(0);
    } catch (error) {
        console.error("\n❌ ERROR:", error);
        console.error("\nTroubleshooting:");
        console.error("1. Check your MongoDB URI is correct");
        console.error("2. Ensure pazza.js file exists in Kambaz/Database/");
        console.error("3. Check network connectivity to MongoDB Atlas");
        process.exit(1);
    }
}

// Run the seed
console.log("🚀 Starting Complete Pazza Seed...\n");
seedEverything();