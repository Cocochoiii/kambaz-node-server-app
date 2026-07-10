import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        _id: String,
        name: String,
        description: String,
        course: String,
        lessons: { type: Array, default: [] },
        published: Boolean,
    },
    { collection: "modules", strict: false }
);
export default schema;
