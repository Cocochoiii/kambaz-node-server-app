import mongoose from "mongoose";
import schema from "./questionSchema.js";

// Model for questions. Used to create, read, update and delete
// individual questions for a quiz.
const QuestionModel = mongoose.model("QuestionModel", schema);

export default QuestionModel;