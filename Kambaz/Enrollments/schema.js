import mongoose from "mongoose";

/*
 * Enrollments capture a many‑to‑many relationship between users and
 * courses. Each enrollment stores references to the primary keys of
 * the corresponding user and course documents. Additional metadata
 * fields can be used to track the user's grade, the date of
 * enrollment, and the enrollment status. The default status when
 * creating an enrollment is `ENROLLED`.
 */
const enrollmentSchema = new mongoose.Schema(
  {
    _id: { type: String },
    course: { type: String, ref: "CourseModel" },
    user: { type: String, ref: "UserModel" },
    grade: { type: Number },
    letterGrade: { type: String },
    enrollmentDate: { type: Date },
    status: {
      type: String,
      enum: ["ENROLLED", "DROPPED", "COMPLETED"],
      default: "ENROLLED",
    },
  },
  { collection: "enrollments" }
);

export default enrollmentSchema;