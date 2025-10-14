// Kambaz/Quizzes/init.js
import mongoose from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import QuizModel from "./model.js";
import QuestionModel from "./questionModel.js";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read JSON files
const quizzesSeed = JSON.parse(
    readFileSync(join(__dirname, "../Database/quizzes.json"), "utf-8")
);
const questionsSeed = JSON.parse(
    readFileSync(join(__dirname, "../Database/questions.json"), "utf-8")
);

export async function initializeQuizData() {
    try {
        // Check if we already have data
        const existingQuizzes = await QuizModel.countDocuments();
        if (existingQuizzes === 0) {
            console.log('Inserting quiz data...');

            // Insert quizzes
            await QuizModel.insertMany(quizzesSeed);
            console.log(`✅ Inserted ${quizzesSeed.length} quizzes`);

            // Insert questions
            await QuestionModel.insertMany(questionsSeed);
            console.log(`✅ Inserted ${questionsSeed.length} questions`);

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
        } else {
            console.log(`✅ Quiz data already exists (${existingQuizzes} quizzes)`);
        }
    } catch (error) {
        console.error('Error initializing Quiz data:', error);
        // Don't throw - let the server continue
    }
}