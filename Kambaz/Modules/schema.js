import mongoose from "mongoose";

/*
 * Modules belong to courses in a one‑to‑many relationship. Each module
 * references its parent course via the `course` field which stores the
 * primary key of a Course document. The `ref` property tells Mongoose
 * which model the key refers to. When using populate() on this field
 * the course document will automatically be fetched.
 */
const schema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String },
    description: { type: String },
    course: { type: String, ref: "CourseModel" },
  },
  { collection: "modules" }
);

export default schema;