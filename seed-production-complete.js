// seed-production-complete.js
// Run this script locally with: node seed-production-complete.js
// Make sure to set MONGODB_URI in your .env file to your MongoDB Atlas connection string

import mongoose from "mongoose";
import "dotenv/config";
import { Folder, Post } from "./Kambaz/Pazza/models.js";
import QuizModel from "./Kambaz/Quizzes/model.js";
import QuestionModel from "./Kambaz/Quizzes/questionModel.js";
import { pazzaSeedData } from "./Kambaz/Database/pazza.js";
import { quizzesSeed } from "./Kambaz/Database/quizzes.js";
import { questionsSeed } from "./Kambaz/Database/questions.js";

// Use your MongoDB Atlas URI - this should match what's in Vercel
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://choicoco_db_user:0328ChaeSeoaa%21%21@cluster0.vld501g.mongodb.net/kambaz?retryWrites=true&w=majority&appName=cluster0";

// Helper function to fix question type values
function fixQuestionType(type) {
    const typeMap = {
        "MC": "MULTIPLE_CHOICE",
        "MULTIPLE_CHOICE": "MULTIPLE_CHOICE",
        "TF": "TRUE_FALSE",
        "TRUE_FALSE": "TRUE_FALSE",
        "FB": "FILL_BLANK",
        "FILL_BLANK": "FILL_BLANK",
        "FILL_IN_BLANK": "FILL_BLANK"
    };
    return typeMap[type?.toUpperCase()] || "MULTIPLE_CHOICE";
}

// Helper function to validate and fix choices
function fixChoices(choices, type) {
    if (type !== "MULTIPLE_CHOICE") return undefined;

    // If choices is not an array or is invalid, create default choices
    if (!Array.isArray(choices)) {
        console.warn("⚠️ Invalid choices detected, creating default choices");
        return [
            { _id: `choice-1`, text: "Option A", correct: true },
            { _id: `choice-2`, text: "Option B", correct: false },
            { _id: `choice-3`, text: "Option C", correct: false },
            { _id: `choice-4`, text: "Option D", correct: false }
        ];
    }

    // Process each choice
    return choices.map((choice, index) => {
        // Handle string choices or corrupted data
        if (typeof choice === 'string') {
            return {
                _id: `choice-${index + 1}`,
                text: choice,
                correct: index === 0 // First choice is correct by default
            };
        }

        // Ensure choice has required structure
        return {
            _id: choice._id || `choice-${Date.now()}-${index}`,
            text: choice.text || `Option ${String.fromCharCode(65 + index)}`,
            correct: choice.correct || false
        };
    });
}

async function seedProduction() {
    try {
        console.log("🔄 Connecting to MongoDB Atlas...");
        console.log("URI:", MONGODB_URI.substring(0, 50) + "...");

        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB Atlas");

        // Check if we should clear or preserve data
        const args = process.argv.slice(2);
        const shouldClear = args.includes('--clear');

        if (shouldClear) {
            console.log("\n🗑️ Clearing existing data...");
            await Folder.deleteMany({});
            await Post.deleteMany({});
            await QuizModel.deleteMany({});
            await QuestionModel.deleteMany({});
            console.log("✅ Data cleared");
        }

        // Check existing data counts
        const existingFolders = await Folder.countDocuments();
        const existingPosts = await Post.countDocuments();
        const existingQuizzes = await QuizModel.countDocuments();
        const existingQuestions = await QuestionModel.countDocuments();

        console.log("\n📊 Current data counts:");
        console.log(`  Pazza Folders: ${existingFolders}`);
        console.log(`  Pazza Posts: ${existingPosts}`);
        console.log(`  Quizzes: ${existingQuizzes}`);
        console.log(`  Questions: ${existingQuestions}`);

        // ===== SEED PAZZA DATA =====
        if (existingFolders === 0 && pazzaSeedData?.folders) {
            console.log("\n📁 Seeding Pazza folders...");
            await Folder.insertMany(pazzaSeedData.folders);
            console.log(`✅ Inserted ${pazzaSeedData.folders.length} folders`);
        } else if (existingFolders > 0) {
            console.log("⏭️ Skipping folders - data already exists");
        }

        if (existingPosts === 0 && pazzaSeedData?.posts) {
            console.log("\n📝 Seeding Pazza posts...");

            const processedPosts = pazzaSeedData.posts.map(post => {
                const postCopy = { ...post };

                // Process student answers
                const postAnswers = pazzaSeedData.answers?.filter(a => a.postId === post._id) || [];
                postCopy.studentAnswers = postAnswers
                    .filter(a => a.authorRole === 'STUDENT')
                    .map(a => ({
                        _id: a._id,
                        author: a.author || "current-user",
                        authorRole: a.authorRole,
                        authorName: a.authorName || "Student User",
                        content: a.content,
                        timestamp: new Date(a.createdAt || Date.now()),
                        isGoodAnswer: a.isGoodAnswer || false
                    }));

                // Process instructor answers
                postCopy.instructorAnswers = postAnswers
                    .filter(a => ['FACULTY', 'TA', 'INSTRUCTOR'].includes(a.authorRole))
                    .map(a => ({
                        _id: a._id,
                        author: a.author || "instructor-user",
                        authorRole: a.authorRole,
                        authorName: a.authorName || "Instructor",
                        content: a.content,
                        timestamp: new Date(a.createdAt || Date.now()),
                        isGoodAnswer: a.isGoodAnswer || false
                    }));

                // Process followups with nested replies
                const postFollowups = (pazzaSeedData.followups || [])
                    .filter(f => f.postId === post._id && !f.parentId)
                    .map(f => {
                        const replies = (pazzaSeedData.followups || [])
                            .filter(r => r.parentId === f._id)
                            .map(r => ({
                                _id: r._id,
                                author: r.author || "current-user",
                                authorRole: r.authorRole || "STUDENT",
                                authorName: r.authorName || "User",
                                content: r.content,
                                timestamp: new Date(r.createdAt || Date.now())
                            }));

                        return {
                            _id: f._id,
                            author: f.author || "current-user",
                            authorRole: f.authorRole || "STUDENT",
                            authorName: f.authorName || "User",
                            content: f.content,
                            isResolved: f.isResolved || false,
                            timestamp: new Date(f.createdAt || Date.now()),
                            replies
                        };
                    });

                // Set computed fields
                postCopy.followups = postFollowups;
                postCopy.hasInstructorAnswer = postCopy.instructorAnswers.length > 0;
                postCopy.hasStudentAnswer = postCopy.studentAnswers.length > 0;
                postCopy.createdAt = new Date(postCopy.createdAt || Date.now());
                postCopy.updatedAt = new Date(postCopy.updatedAt || Date.now());
                postCopy.views = postCopy.views || 0;
                postCopy.isPinned = postCopy.isPinned || false;
                postCopy.isInstructorEndorsed = postCopy.isInstructorEndorsed || false;

                // Ensure required fields have defaults
                postCopy.course = postCopy.course || "5610";
                postCopy.author = postCopy.author || "current-user";
                postCopy.authorRole = postCopy.authorRole || "STUDENT";
                postCopy.authorName = postCopy.authorName || "Anonymous";
                postCopy.postTo = postCopy.postTo || "entire_class";
                postCopy.visibleTo = postCopy.visibleTo || [];
                postCopy.folders = postCopy.folders || [];

                return postCopy;
            });

            await Post.insertMany(processedPosts);
            console.log(`✅ Inserted ${processedPosts.length} posts with answers and followups`);
        } else if (existingPosts > 0) {
            console.log("⏭️ Skipping posts - data already exists");
        }

        // ===== SEED QUIZ DATA =====
        if (existingQuizzes === 0 && quizzesSeed) {
            console.log("\n📋 Seeding quizzes...");

            // Ensure all quizzes have required fields
            const processedQuizzes = quizzesSeed.map(quiz => ({
                ...quiz,
                course: quiz.course || "5610",
                published: quiz.published !== undefined ? quiz.published : false,
                createdAt: new Date(quiz.createdAt || Date.now()),
                points: quiz.points || 0,
                timeLimit: quiz.timeLimit || null,
                multipleAttempts: quiz.multipleAttempts || false,
                allowedAttempts: quiz.allowedAttempts || 1,
                showAnswers: quiz.showAnswers || false
            }));

            await QuizModel.insertMany(processedQuizzes);
            console.log(`✅ Inserted ${processedQuizzes.length} quizzes`);
        } else if (existingQuizzes > 0) {
            console.log("⏭️ Skipping quizzes - data already exists");
        }

        if (existingQuestions === 0 && questionsSeed) {
            console.log("\n❓ Validating and seeding questions...");

            const validQuestions = [];
            const skippedQuestions = [];

            // Process and validate each question
            for (const question of questionsSeed) {
                try {
                    const q = { ...question };

                    // Fix type field
                    const originalType = q.type;
                    q.type = fixQuestionType(q.type);
                    if (originalType !== q.type) {
                        console.log(`  📝 Fixed type: "${originalType}" → "${q.type}"`);
                    }

                    // Ensure prompt exists (use title or question as fallback)
                    if (!q.prompt) {
                        q.prompt = q.title || q.question || `Question for ${q.quiz || "quiz"}`;
                        console.log(`  📝 Added missing prompt for question ${q._id}`);
                    }

                    // Ensure title exists
                    if (!q.title) {
                        q.title = q.prompt.substring(0, 50) + (q.prompt.length > 50 ? "..." : "");
                    }

                    // Fix choices for MULTIPLE_CHOICE questions
                    if (q.type === "MULTIPLE_CHOICE") {
                        q.choices = fixChoices(q.choices, q.type);

                        // Ensure at least one correct choice
                        const hasCorrect = q.choices.some(c => c.correct);
                        if (!hasCorrect && q.choices.length > 0) {
                            q.choices[0].correct = true;
                            console.log(`  📝 Set first choice as correct for question ${q._id}`);
                        }
                    } else {
                        // Remove choices for non-multiple choice questions
                        delete q.choices;
                    }

                    // Handle TRUE_FALSE questions
                    if (q.type === "TRUE_FALSE") {
                        if (q.correctAnswer === undefined) {
                            q.correctAnswer = true; // Default to true
                            console.log(`  📝 Set default correctAnswer for TRUE_FALSE question ${q._id}`);
                        }
                    }

                    // Handle FILL_BLANK questions
                    if (q.type === "FILL_BLANK") {
                        if (!q.correctAnswers || !Array.isArray(q.correctAnswers)) {
                            q.correctAnswers = ["answer"]; // Default answer
                            console.log(`  📝 Set default correctAnswers for FILL_BLANK question ${q._id}`);
                        }
                    }

                    // Set defaults
                    q.quiz = q.quiz || "quiz-1";
                    q.points = q.points || 1;

                    validQuestions.push(q);
                } catch (err) {
                    console.error(`  ⚠️ Skipping invalid question ${question._id}:`, err.message);
                    skippedQuestions.push(question._id);
                }
            }

            if (validQuestions.length > 0) {
                await QuestionModel.insertMany(validQuestions);
                console.log(`✅ Inserted ${validQuestions.length} valid questions`);
                if (skippedQuestions.length > 0) {
                    console.log(`⚠️ Skipped ${skippedQuestions.length} invalid questions: ${skippedQuestions.join(', ')}`);
                }
            } else {
                console.log("⚠️ No valid questions to insert");
            }

            // Update quiz points based on questions
            console.log("\n🔢 Updating quiz points...");
            const quizIds = [...new Set(validQuestions.map(q => q.quiz))];
            for (const quizId of quizIds) {
                const questions = validQuestions.filter(q => q.quiz === quizId);
                const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
                await QuizModel.updateOne(
                    { _id: quizId },
                    { $set: { points: totalPoints } }
                );
                console.log(`  Quiz ${quizId}: ${totalPoints} points`);
            }
        } else if (existingQuestions > 0) {
            console.log("⏭️ Skipping questions - data already exists");
        }

        // ===== VERIFICATION =====
        console.log("\n📊 Final data counts:");
        console.log(`  Pazza Folders: ${await Folder.countDocuments()}`);
        console.log(`  Pazza Posts: ${await Post.countDocuments()}`);
        console.log(`  Quizzes: ${await QuizModel.countDocuments()}`);
        console.log(`  Questions: ${await QuestionModel.countDocuments()}`);

        // Test sample queries
        console.log("\n🔍 Testing sample queries...");

        const sampleFolders = await Folder.find({ course: "5610" }).limit(3);
        console.log(`  Found ${sampleFolders.length} folders for course 5610`);
        if (sampleFolders.length > 0) {
            console.log(`  Sample folder: ${sampleFolders[0].name}`);
        }

        const samplePosts = await Post.find({ course: "5610" }).limit(3);
        console.log(`  Found ${samplePosts.length} posts for course 5610`);
        if (samplePosts.length > 0) {
            console.log(`  Sample post: ${samplePosts[0].summary || samplePosts[0].title || "Untitled"}`);
            console.log(`    - Student answers: ${samplePosts[0].studentAnswers?.length || 0}`);
            console.log(`    - Instructor answers: ${samplePosts[0].instructorAnswers?.length || 0}`);
            console.log(`    - Followups: ${samplePosts[0].followups?.length || 0}`);
        }

        const sampleQuizzes = await QuizModel.find({ course: "5610" }).limit(3);
        console.log(`  Found ${sampleQuizzes.length} quizzes for course 5610`);
        if (sampleQuizzes.length > 0) {
            const quiz = sampleQuizzes[0];
            const questionCount = await QuestionModel.countDocuments({ quiz: quiz._id });
            console.log(`  Sample quiz: ${quiz.title} (${questionCount} questions, ${quiz.points} points)`);

            // Show sample question
            const sampleQuestion = await QuestionModel.findOne({ quiz: quiz._id });
            if (sampleQuestion) {
                console.log(`    Sample question: ${sampleQuestion.title}`);
                console.log(`      Type: ${sampleQuestion.type}`);
                console.log(`      Points: ${sampleQuestion.points}`);
            }
        }

        console.log("\n✨ Production seeding completed successfully!");
        console.log("\n📌 Next steps:");
        console.log("1. Restart your Vercel deployment");
        console.log("2. Check your application at https://kambaz-next-js-final-2.vercel.app");
        console.log("3. Verify data appears in Pazza and Quizzes sections");

        process.exit(0);
    } catch (error) {
        console.error("\n❌ Error seeding production:", error);
        console.error("\nTroubleshooting tips:");
        console.error("1. Verify your MongoDB Atlas connection string");
        console.error("2. Check network access in MongoDB Atlas (whitelist IPs)");
        console.error("3. Ensure database user has write permissions");
        console.error("4. Check if data files exist in Kambaz/Database/");
        console.error("5. Review questions.json for invalid data formats");
        process.exit(1);
    }
}

// Run the seeding
console.log("🚀 Starting production seed script...");
console.log("Options: --clear to reset all data first");
seedProduction();