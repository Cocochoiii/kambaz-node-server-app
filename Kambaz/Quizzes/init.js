// Kambaz/Quizzes/init.js
import QuizModel from "./model.js";
import QuestionModel from "./questionModel.js";
import { quizzesSeed } from "../Database/quizzes.js";
import { questionsSeed } from "../Database/questions.js";

export async function initializeQuizData() {
    try {
        // Don't use initTracker - check actual data instead
        const existingQuizzes = await QuizModel.countDocuments();
        const existingQuestions = await QuestionModel.countDocuments();

        console.log(`📊 Quiz data check: ${existingQuizzes} quizzes, ${existingQuestions} questions`);

        // Initialize quizzes if none exist
        if (existingQuizzes === 0 && quizzesSeed && quizzesSeed.length > 0) {
            console.log('Inserting quiz data...');
            await QuizModel.insertMany(quizzesSeed);
            console.log(`✅ Inserted ${quizzesSeed.length} quizzes`);
        }

        // Initialize questions if none exist
        if (existingQuestions === 0 && questionsSeed && questionsSeed.length > 0) {
            console.log('Inserting question data...');
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
        }

        console.log("✅ Quiz initialization check complete");
        return true;

    } catch (error) {
        console.error('❌ Error initializing Quiz data:', error);
        return false;
    }
}