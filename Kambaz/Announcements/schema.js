import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        _id: String,
        title: String,
        message: String,
        course: String,
        date: String,
        author: String,
    },
    { collection: "announcements", strict: false }
);
export default schema;
