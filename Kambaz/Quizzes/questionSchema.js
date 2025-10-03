import mongoose from "mongoose";

// Schema for questions. Each question belongs to a quiz via the
// `quiz` field. Questions support multiple types including multiple
// choice, true/false and fill‑in‑the‑blank. Depending on the type,
// different fields may be populated. Choices for multiple choice
// questions are stored as an array with an internal _id so that
// submissions can reference them by id. For true/false questions the
// correct answer is stored as a boolean in `correctAnswer`. Fill in
// the blank questions use `correctAnswers` to store an array of
// acceptable answers.

const questionSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },

    // The quiz this question belongs to. References the QuizModel.
    quiz: { type: String, ref: "QuizModel", required: true },

    // Human‑readable title of the question. Separate from the prompt to
    // allow succinct listing of questions.
    title: { type: String, required: true },

    // Points awarded for correctly answering this question.
    points: { type: Number, default: 1 },

    // Prompt presented to the student. May include markdown or HTML.
    prompt: { type: String, required: true },

    // Type of the question. Determines which of the optional fields
    // below are used.
    type: {
      type: String,
      enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_BLANK"],
      required: true,
    },

    // Choices used for multiple choice questions. Each choice has a
    // string id so that submissions can reference it directly. Exactly
    // one of the choices should have correct=true.
    choices: [
      {
        _id: String,
        text: String,
        correct: Boolean,
      },
    ],

    // The correct answer for true/false questions. Must be true or false.
    correctAnswer: { type: Boolean },

    // Acceptable answers for fill in the blank questions. Answers are
    // compared case‑insensitively.
    correctAnswers: [String],
  },
  { collection: "questions" }
);

export default questionSchema;