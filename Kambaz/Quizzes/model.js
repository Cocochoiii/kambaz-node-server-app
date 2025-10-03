import mongoose from "mongoose";
import schema from "./schema.js";

// The QuizModel is used to interact with the quizzes collection. It
// provides methods like find, create, updateOne and deleteOne.
const QuizModel = mongoose.model("QuizModel", schema);

export default QuizModel;