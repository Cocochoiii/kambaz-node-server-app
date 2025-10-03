import mongoose from "mongoose";
import schema from "./schema.js";

// Create a Mongoose model for the enrollments collection
const model = mongoose.model("EnrollmentModel", schema);
export default model;