import mongoose from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import QuizModel from "./Kambaz/Quizzes/model.js";
import QuestionModel from "./Kambaz/Quizzes/questionModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read JSON files
const quizzesSeed = JSON.parse(
    readFileSync(join(__dirname, "Database", "quizzes.json"), "utf-8")
);
const questionsSeed = JSON.parse(
    readFileSync(join(__dirname, "Database", "questions.json"), "utf-8")
);

const CONNECTION_STRING = "mongodb://127.0.0.1:27017/kambaz";

async function seedQuizzes() {
    try {
        // Connect to MongoDB
        await mongoose.connect(CONNECTION_STRING);
        console.log("✅ Connected to MongoDB");

        // Clear existing data
        await QuizModel.deleteMany({});
        await QuestionModel.deleteMany({});
        console.log("🗑️ Cleared existing quizzes and questions");

        // Insert quizzes
        const insertedQuizzes = await QuizModel.insertMany(quizzesSeed);
        console.log(`✅ Inserted ${insertedQuizzes.length} quizzes`);

        // Insert questions
        const insertedQuestions = await QuestionModel.insertMany(questionsSeed);
        console.log(`✅ Inserted ${insertedQuestions.length} questions`);

        // Update quiz points based on questions
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

        console.log("🎉 Quiz seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding quizzes:", error);
        process.exit(1);
    }
}

seedQuizzes();