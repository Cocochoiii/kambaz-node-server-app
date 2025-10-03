import mongoose from "mongoose";

// Schema for quiz attempts. An attempt records a student's answers
// during a single quiz session along with the computed score. The
// `answers` array stores each answer keyed by the question id. For
// multiple choice questions the answer is the id of the selected
// choice. For true/false questions the answer is a boolean encoded
// as a string "true" or "false". For fill in the blank questions the
// answer is the student's text answer.

const attemptSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },

    // Quiz that was attempted. References QuizModel.
    quiz: { type: String, ref: "QuizModel", required: true },

    // User who took the quiz. References UserModel.
    user: { type: String, ref: "UserModel", required: true },

    // Answers provided by the student. Each entry references the
    // question id and stores the answer. For multiple choice
    // questions the answer is the choice id. For true/false
    // questions the answer is "true" or "false". For fill blank the
    // answer is a string typed by the user.
    answers: [
      {
        question: { type: String, ref: "QuestionModel" },
        answer: String,
      },
    ],

    // Computed score for this attempt expressed as a number of points.
    score: { type: Number, default: 0 },

    // Incremental attempt number for each student/quiz combination. The
    // first attempt has attemptNumber=1.
    attemptNumber: { type: Number, required: true },

    // Timestamp of when the attempt was submitted. Useful for
    // ordering and display.
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "attempts" }
);

export default attemptSchema;