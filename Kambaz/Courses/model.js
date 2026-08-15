import mongoose from "mongoose";
import schema from "./schema.js";

// Modules and enrollments point at this name, CourseModel.
const model = mongoose.model("CourseModel", schema);
export default model;
