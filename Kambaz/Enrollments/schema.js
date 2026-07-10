import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        _id: String,
        user: String,
        course: String,
    },
    { collection: "enrollments", strict: false }
);
export default schema;
