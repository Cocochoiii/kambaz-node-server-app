import mongoose from "mongoose";

// One score of one student on one assignment.
// student and course keep the keys of the real documents.
const gradeSchema = new mongoose.Schema(
    {
        _id: String,
        student: { type: String, ref: "UserModel" },
        course: { type: String, ref: "CourseModel" },
        assignment: String,
        score: Number,
        submitted: String,
        released: Boolean,
        type: String,
    },
    { collection: "grades" }
);

// The weights of one course. Mongo makes the _id here, because my
// sample rows have no _id of their own.
const categorySchema = new mongoose.Schema(
    {
        course: { type: String, ref: "CourseModel" },
        courseName: String,
        categories: { type: Array, default: [] },
    },
    { collection: "gradeCategories" }
);

export { gradeSchema, categorySchema };
