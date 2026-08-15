import mongoose from "mongoose";

// One row is one attempt of one student on one quiz.
// I keep the answers, so the student can see the last attempt again.
const schema = new mongoose.Schema(
    {
        _id: String,
        quiz: { type: String, ref: "QuizModel" },
        course: { type: String, ref: "CourseModel" },
        user: { type: String, ref: "UserModel" },
        answers: { type: mongoose.Schema.Types.Mixed, default: [] },
        score: { type: Number, default: 0 },
        timeTaken: { type: Number, default: 0 },
        attemptNumber: { type: Number, default: 1 },
        submittedAt: String,
    },
    { collection: "quizAttempts" }
);
export default schema;
