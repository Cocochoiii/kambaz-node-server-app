import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        _id: String,
        title: String,
        course: String,
        points: Number,
        published: Boolean,
    },
    { collection: "quizzes", strict: false }
);
export default schema;
