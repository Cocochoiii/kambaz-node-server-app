import mongoose from "mongoose";
import schema from "./schema.js";

// Create a Mongoose model for the course schema. The model name is
// `CourseModel` which is referenced in other schemas via the ref field.
const model = mongoose.model("CourseModel", schema);
export default model;