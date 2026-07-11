import mongoose from "mongoose";

// One student attempt at a quiz. Answers are stored so the student can review
// their last attempt. score is computed on the server.
const schema = new mongoose.Schema(
    {
        _id: String,
        quiz: String,
        course: String,
        user: String,
        answers: { type: Array, default: [] },   // [{ questionId, answer }]
        score: { type: Number, default: 0 },
        timeTaken: { type: Number, default: 0 },   // seconds
        attemptNumber: { type: Number, default: 1 },
        submittedAt: String,
    },
    { collection: "quiz_attempts", strict: false }
);
export default schema;
