// Kambaz/Grades/model.js
import mongoose from "mongoose";
import schema from "./schema.js";

const model = mongoose.model("GradeModel", schema);
export default model;
