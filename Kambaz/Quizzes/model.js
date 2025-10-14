// Kambaz/Quizzes/models.js
import mongoose from "mongoose";

// Quiz Schema
const quizSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        course: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, default: "" },
        type: {
            type: String,
            enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"],
            default: "Graded Quiz",
        },
        points: { type: Number, default: 0 },
        assignmentGroup: {
            type: String,
            enum: ["Quizzes", "Exams", "Assignments", "Project"],
            default: "Quizzes",
        },
        shuffleAnswers: { type: Boolean, default: true },
        timeLimit: { type: Number, default: 20 },
        multipleAttempts: { type: Boolean, default: false },
        allowedAttempts: { type: Number, default: 1 },
        showCorrectAnswers: {
            type: String,
            enum: ["Immediately", "After Last Attempt", "Never"],
            default: "Immediately",
        },
        accessCode: { type: String, default: "" },
        oneQuestionAtATime: { type: Boolean, default: true },
        webcamRequired: { type: Boolean, default: false },
        lockQuestionsAfterAnswering: { type: Boolean, default: false },
        dueDate: { type: Date },
        availableDate: { type: Date },
        untilDate: { type: Date },
        published: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
    },
    { collection: "quizzes" }
);

// Question Schema
const questionSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        quiz: { type: String, required: true },
        title: { type: String, required: true },
        points: { type: Number, default: 1 },
        prompt: { type: String, required: true },
        type: {
            type: String,
            enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_BLANK"],
            required: true,
        },
        choices: [
            {
                _id: String,
                text: String,
                correct: Boolean,
            },
        ],
        correctAnswer: { type: Boolean },
        correctAnswers: [String],
    },
    { collection: "questions" }
);

// Attempt Schema
const attemptSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        quiz: { type: String, required: true },
        user: { type: String, required: true },
        answers: [
            {
                question: { type: String },
                answer: String,
            },
        ],
        score: { type: Number, default: 0 },
        attemptNumber: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { collection: "attempts" }
);

// Export models with serverless caching
export const QuizModel = mongoose.models.QuizModel || mongoose.model("QuizModel", quizSchema);
export const QuestionModel = mongoose.models.QuestionModel || mongoose.model("QuestionModel", questionSchema);
export const AttemptModel = mongoose.models.AttemptModel || mongoose.model("AttemptModel", attemptSchema);