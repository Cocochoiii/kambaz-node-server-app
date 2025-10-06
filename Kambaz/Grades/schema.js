// Kambaz/Grades/schema.js
import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        _id: String, // string IDs across the app
        student: { type: String, ref: "UserModel", required: true },
        assignment: { type: String, ref: "AssignmentModel", required: true },
        course: { type: String, ref: "CourseModel", required: true },
        score: { type: Number, default: null },
        submitted: { type: Date, default: null },
        released: { type: Boolean, default: false },
        type: {
            // NOTE: allow midterm/final so your seed data works
            type: String,
            enum: ["assignment", "quiz", "exam", "midterm", "final", "project", "other"],
            default: "assignment",
        },
        comment: { type: String, default: "" },
    },
    { collection: "grades", timestamps: true }
);

// prevent duplicate grade rows for the same student/assignment/course
schema.index({ student: 1, assignment: 1, course: 1 }, { unique: true });

export default schema;
