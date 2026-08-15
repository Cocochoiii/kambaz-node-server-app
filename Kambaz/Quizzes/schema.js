import mongoose from "mongoose";

// One course has many quizzes. The screen only reads them.
const schema = new mongoose.Schema(
    {
        _id: String,
        course: { type: String, ref: "CourseModel" },
        category: String,
        title: String,
        points: Number,
        score: Number,
        dueDate: String,
        status: String,
        questions: Number,
    },
    { collection: "quizzes" }
);
export default schema;
