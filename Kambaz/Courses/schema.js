import mongoose from "mongoose";

// The shape of one course document.
// The dates stay Strings. The course form uses date inputs.
const courseSchema = new mongoose.Schema(
    {
        _id: String,
        name: String,
        number: String,
        startDate: String,
        endDate: String,
        department: String,
        credits: Number,
        term: String,
        semester: String,
        description: String,
        image: String,
        published: Boolean,
    },
    { collection: "courses" }
);
export default courseSchema;
