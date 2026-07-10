import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        _id: String,
        title: String,
        course: String,
        description: String,
        points: Number,
        dueDate: String,
        availableFromDate: String,
        availableUntilDate: String,
        published: Boolean,
    },
    { collection: "assignments", strict: false }
);
export default schema;
