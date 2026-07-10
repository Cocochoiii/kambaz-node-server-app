import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        _id: String,
        student: String,
        assignment: String,
        course: String,
        score: Number,
        submitted: String,
        released: Boolean,
        type: String,
    },
    { collection: "grades", strict: false }
);
export default schema;
