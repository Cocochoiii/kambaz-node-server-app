import mongoose from "mongoose";

// A Pazza post (question or note) inside one course.
const schema = new mongoose.Schema(
    {
        _id: String,
        course: String,
        type: String,        // "question" or "note"
        author: String,
        authorName: String,
        authorRole: String,  // e.g. STUDENT, TA, FACULTY
        postTo: String,      // "all" or "individual"
        recipients: [String],
        folders: [String],
        summary: String,
        details: String,     // rich text (HTML)
        pinned: Boolean,
        viewers: [String],
        createdAt: String,
    },
    { collection: "pazza_posts", strict: false }
);
export default schema;
