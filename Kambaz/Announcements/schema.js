import mongoose from "mongoose";

// One course has many announcements.
// So course keeps the _id of a course, and ref names that model.
const schema = new mongoose.Schema(
    {
        _id: String,
        course: { type: String, ref: "CourseModel" },
        title: String,
        author: String,
        section: String,
        content: String,
        date: String,
        read: Boolean,
    },
    { collection: "announcements" }
);
export default schema;
