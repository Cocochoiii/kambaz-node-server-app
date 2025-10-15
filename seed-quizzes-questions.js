// seed-quizzes-questions.js
// Complete seed script for quizzes and questions
// Run: node seed-quizzes-questions.js

import mongoose from "mongoose";
import "dotenv/config";
import QuizModel from "./Kambaz/Quizzes/model.js";
import QuestionModel from "./Kambaz/Quizzes/questionModel.js";
import { quizzesSeed } from "./Kambaz/Database/quizzes.js";
import { questionsSeed } from "./Kambaz/Database/questions.js";

// MongoDB Atlas URI
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://choicoco_db_user:0328ChaeSeoaa%21%21@cluster0.vld501g.mongodb.net/kambaz?retryWrites=true&w=majority&appName=cluster0";

// Course information for reference
const COURSES = {
    "5610": "CS5610 Web Development",
    "5520": "CS5520 Mobile Application Development",
    "5004": "CS5004 Object-Oriented Design",
    "5200": "CS5200 Database Management Systems",
    "5800": "CS5800 Algorithms",
    "6510": "CS6510 Advanced Software Development",
    "6620": "CS6620 Fundamentals of Cloud Computing"
};

// Fix question type to match model enum
function fixQuestionType(type) {
    const typeMap = {
        "MC": "MULTIPLE_CHOICE",
        "MULTIPLE_CHOICE": "MULTIPLE_CHOICE",
        "TF": "TRUE_FALSE",
        "TRUE_FALSE": "TRUE_FALSE",
        "FB": "FILL_BLANK",
        "FILL_BLANK": "FILL_BLANK",
        "FILL_IN_BLANK": "FILL_BLANK",
        "SA": "FILL_BLANK", // Short answer mapped to FILL_BLANK
        "SHORT_ANSWER": "FILL_BLANK"
    };
    return typeMap[type?.toUpperCase()] || "MULTIPLE_CHOICE";
}

// Process choices for multiple choice questions
function processChoices(question) {
    if (question.type !== "MULTIPLE_CHOICE") {
        return undefined;
    }

    // Handle old format with separate 'choices' and 'answer' fields
    if (question.choices && question.answer) {
        return question.choices.map(choice => ({
            _id: `choice-${question._id}-${question.choices.indexOf(choice)}`,
            text: choice,
            correct: choice === question.answer
        }));
    }

    // Handle new format with choices containing correct flag
    if (question.choices && Array.isArray(question.choices)) {
        return question.choices.map((choice, index) => {
            if (typeof choice === 'string') {
                return {
                    _id: `choice-${question._id}-${index}`,
                    text: choice,
                    correct: index === 0 // Default first as correct if not specified
                };
            }
            return {
                _id: choice._id || `choice-${question._id}-${index}`,
                text: choice.text || choice,
                correct: choice.correct || false
            };
        });
    }

    // Default choices if none provided
    return [
        { _id: `choice-${question._id}-1`, text: "Option A", correct: true },
        { _id: `choice-${question._id}-2`, text: "Option B", correct: false },
        { _id: `choice-${question._id}-3`, text: "Option C", correct: false },
        { _id: `choice-${question._id}-4`, text: "Option D", correct: false }
    ];
}

// Process each question for database
function processQuestion(question) {
    const processed = { ...question };

    // Fix type
    processed.type = fixQuestionType(question.type);

    // Ensure required fields
    if (!processed.prompt) {
        processed.prompt = question.title || question.question || "Question";
    }
    if (!processed.title) {
        processed.title = processed.prompt.substring(0, 60);
    }

    // Process based on type
    switch (processed.type) {
        case "MULTIPLE_CHOICE":
            processed.choices = processChoices(question);
            delete processed.answer; // Remove old format field
            delete processed.correctAnswer;
            delete processed.correctAnswers;
            break;

        case "TRUE_FALSE":
            // Convert answer to boolean
            if (question.answer === "True" || question.answer === true) {
                processed.correctAnswer = true;
            } else if (question.answer === "False" || question.answer === false) {
                processed.correctAnswer = false;
            } else {
                processed.correctAnswer = true; // Default
            }
            delete processed.choices;
            delete processed.answer;
            delete processed.correctAnswers;
            break;

        case "FILL_BLANK":
            // Handle short answer and fill in blank
            if (question.answer && typeof question.answer === 'string') {
                processed.correctAnswers = [question.answer];
            } else if (question.correctAnswers && Array.isArray(question.correctAnswers)) {
                processed.correctAnswers = question.correctAnswers;
            } else {
                processed.correctAnswers = ["answer"]; // Default
            }
            delete processed.choices;
            delete processed.answer;
            delete processed.correctAnswer;
            break;

        default:
            console.warn(`Unknown question type: ${processed.type}`);
    }

    // Set defaults
    processed.quiz = processed.quiz || "quiz-default";
    processed.points = processed.points || 1;

    return processed;
}

async function seedQuizzesAndQuestions() {
    try {
        console.log("🔄 Connecting to MongoDB Atlas...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected successfully\n");

        // Check command line arguments
        const args = process.argv.slice(2);
        const clearData = args.includes('--clear');
        const onlyQuizzes = args.includes('--quizzes-only');
        const onlyQuestions = args.includes('--questions-only');

        // Clear existing data if requested
        if (clearData) {
            console.log("🗑️ Clearing existing data...");
            if (!onlyQuestions) {
                await QuizModel.deleteMany({});
                console.log("  ✅ Cleared all quizzes");
            }
            if (!onlyQuizzes) {
                await QuestionModel.deleteMany({});
                console.log("  ✅ Cleared all questions");
            }
            console.log();
        }

        // Get current counts
        const currentQuizCount = await QuizModel.countDocuments();
        const currentQuestionCount = await QuestionModel.countDocuments();

        console.log("📊 Current database state:");
        console.log(`  Quizzes: ${currentQuizCount}`);
        console.log(`  Questions: ${currentQuestionCount}\n`);

        // Seed quizzes
        if (!onlyQuestions) {
            console.log("📋 Seeding quizzes...");

            // Process quizzes
            const processedQuizzes = quizzesSeed.map(quiz => ({
                ...quiz,
                course: quiz.course || "5610",
                published: quiz.published !== undefined ? quiz.published : false,
                createdAt: new Date(quiz.createdAt || Date.now()),
                dueDate: quiz.dueDate ? new Date(quiz.dueDate) : null,
                availableDate: quiz.availableDate ? new Date(quiz.availableDate) : null,
                untilDate: quiz.untilDate ? new Date(quiz.untilDate) : null,
                points: quiz.points || 0,
                timeLimit: quiz.timeLimit || 60,
                multipleAttempts: quiz.multipleAttempts || false,
                allowedAttempts: quiz.allowedAttempts || 1,
                shuffleAnswers: quiz.shuffleAnswers !== undefined ? quiz.shuffleAnswers : false,
                showCorrectAnswers: quiz.showCorrectAnswers || "Never",
                oneQuestionAtATime: quiz.oneQuestionAtATime || false,
                webcamRequired: quiz.webcamRequired || false,
                lockQuestionsAfterAnswering: quiz.lockQuestionsAfterAnswering || false,
                type: quiz.type || "Graded Quiz",
                assignmentGroup: quiz.assignmentGroup || "Quizzes",
                description: quiz.description || ""
            }));

            // Insert or update quizzes
            for (const quiz of processedQuizzes) {
                await QuizModel.findOneAndUpdate(
                    { _id: quiz._id },
                    quiz,
                    { upsert: true, new: true }
                );
            }

            console.log(`  ✅ Seeded ${processedQuizzes.length} quizzes\n`);

            // Display quiz summary by course
            console.log("📚 Quiz distribution by course:");
            for (const [courseId, courseName] of Object.entries(COURSES)) {
                const count = processedQuizzes.filter(q => q.course === courseId).length;
                console.log(`  ${courseName}: ${count} quizzes`);
            }
            console.log();
        }

        // Seed questions
        if (!onlyQuizzes) {
            console.log("❓ Seeding questions...");

            const validQuestions = [];
            const skippedQuestions = [];
            const questionStats = {};

            // Initialize stats
            Object.keys(COURSES).forEach(courseId => {
                questionStats[courseId] = {
                    total: 0,
                    mc: 0,
                    tf: 0,
                    fb: 0,
                    quizzes: new Set()
                };
            });

            // Process each question
            for (const question of questionsSeed) {
                try {
                    const processed = processQuestion(question);
                    validQuestions.push(processed);

                    // Update statistics
                    const courseId = processed.quiz.split('-')[0].replace('Q', '');
                    if (questionStats[courseId]) {
                        questionStats[courseId].total++;
                        questionStats[courseId].quizzes.add(processed.quiz);

                        switch (processed.type) {
                            case "MULTIPLE_CHOICE": questionStats[courseId].mc++; break;
                            case "TRUE_FALSE": questionStats[courseId].tf++; break;
                            case "FILL_BLANK": questionStats[courseId].fb++; break;
                        }
                    }
                } catch (err) {
                    console.error(`  ⚠️ Error processing question ${question._id}: ${err.message}`);
                    skippedQuestions.push(question._id);
                }
            }

            // Insert questions in batches
            const BATCH_SIZE = 100;
            for (let i = 0; i < validQuestions.length; i += BATCH_SIZE) {
                const batch = validQuestions.slice(i, i + BATCH_SIZE);

                // Use bulkWrite for better performance
                const operations = batch.map(q => ({
                    updateOne: {
                        filter: { _id: q._id },
                        update: q,
                        upsert: true
                    }
                }));

                await QuestionModel.bulkWrite(operations);
                console.log(`  ✅ Inserted batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(validQuestions.length/BATCH_SIZE)}`);
            }

            console.log(`\n  ✅ Total questions seeded: ${validQuestions.length}`);
            if (skippedQuestions.length > 0) {
                console.log(`  ⚠️ Skipped questions: ${skippedQuestions.length}`);
            }

            // Display question statistics
            console.log("\n📈 Question statistics by course:");
            for (const [courseId, stats] of Object.entries(questionStats)) {
                if (stats.total > 0) {
                    console.log(`  ${COURSES[courseId]}:`);
                    console.log(`    Total: ${stats.total} questions across ${stats.quizzes.size} quizzes`);
                    console.log(`    Types: MC:${stats.mc}, TF:${stats.tf}, FB:${stats.fb}`);
                }
            }

            // Update quiz points based on questions
            if (!onlyQuestions) {
                console.log("\n🔢 Updating quiz points...");
                const allQuizzes = await QuizModel.find({});

                for (const quiz of allQuizzes) {
                    const questions = await QuestionModel.find({ quiz: quiz._id });
                    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);

                    if (totalPoints > 0) {
                        await QuizModel.updateOne(
                            { _id: quiz._id },
                            { $set: { points: totalPoints } }
                        );
                        console.log(`  Updated ${quiz._id}: ${totalPoints} points (${questions.length} questions)`);
                    }
                }
            }
        }

        // Final verification
        console.log("\n✅ Seeding completed successfully!");

        const finalQuizCount = await QuizModel.countDocuments();
        const finalQuestionCount = await QuestionModel.countDocuments();

        console.log("\n📊 Final database state:");
        console.log(`  Total quizzes: ${finalQuizCount}`);
        console.log(`  Total questions: ${finalQuestionCount}`);

        // Sample verification
        console.log("\n🔍 Sample verification:");
        for (const courseId of Object.keys(COURSES)) {
            const quiz = await QuizModel.findOne({ course: courseId });
            if (quiz) {
                const questionCount = await QuestionModel.countDocuments({ quiz: quiz._id });
                console.log(`  ${COURSES[courseId]}: ${quiz.title}`);
                console.log(`    Questions: ${questionCount}, Points: ${quiz.points}`);
            }
        }

        console.log("\n✨ All done! Your quiz system is ready to use.");
        console.log("\n📌 Next steps:");
        console.log("1. Restart your Vercel deployment");
        console.log("2. Visit the Quizzes section to verify the data");
        console.log("3. Test taking a quiz to ensure questions load properly");

        process.exit(0);

    } catch (error) {
        console.error("\n❌ Error during seeding:", error);
        console.error("\n💡 Troubleshooting tips:");
        console.error("1. Check your MongoDB connection string");
        console.error("2. Ensure MongoDB Atlas allows connections from your IP");
        console.error("3. Verify the database user has write permissions");
        console.error("4. Check that all seed data files are present");
        console.error("\nError details:", error.message);
        process.exit(1);
    }
}

// Display usage information
console.log("🚀 Quiz and Question Seeding Script");
console.log("====================================");
console.log("Usage: node seed-quizzes-questions.js [options]");
console.log("Options:");
console.log("  --clear           Clear existing data before seeding");
console.log("  --quizzes-only    Only seed quizzes");
console.log("  --questions-only  Only seed questions");
console.log("====================================\n");

// Run the seeding
seedQuizzesAndQuestions();