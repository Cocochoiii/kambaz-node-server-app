import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        _id: String,
        name: String,
        number: String,
        startDate: String,
        endDate: String,
        department: String,
        credits: Number,
        description: String,
        image: String,
        color: String,
        author: String,
        published: Boolean,
    },
    { collection: "courses", strict: false }
);
export default schema;
