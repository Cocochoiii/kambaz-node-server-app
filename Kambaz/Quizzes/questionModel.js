import mongoose from "mongoose";
import schema from "./questionSchema.js";

const QuestionModel = mongoose.models.QuestionModel || mongoose.model("QuestionModel", schema);
export default QuestionModel;