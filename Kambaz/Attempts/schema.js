import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
    {
        questionId: String,
        // one of the following will be used based on question type
        choiceId: String,      // MCQ
        boolean: Boolean,      // TF
        text: String,          // FILL
        correct: Boolean,
        awarded: { type: Number, default: 0 },
    },
    { _id: false }
);

const attemptSchema = new mongoose.Schema(
    {
        _id: String,                     // `${userId}-${quizId}-${n}`
        user: { type: String, ref: "UserModel", required: true },
        quiz: { type: String, ref: "QuizModel", required: true },
        attemptNumber: Number,
        submittedAt: { type: Date, default: Date.now },
        totalAwarded: { type: Number, default: 0 },
        answers: [answerSchema],
    },
    { collection: "attempts" }
);

export default attemptSchema;
