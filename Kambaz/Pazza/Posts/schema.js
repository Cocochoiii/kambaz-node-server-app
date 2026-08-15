import mongoose from "mongoose";

// One Pazza post. It is a question or a note.
// postTo says who may read it. "all" means the whole class.
// viewers holds every user id that opened the post once.
const schema = new mongoose.Schema(
    {
        _id: String,
        course: String,
        type: { type: String, enum: ["question", "note"], default: "question" },
        author: String,
        authorName: String,
        authorRole: String,
        postTo: { type: String, enum: ["all", "individual"], default: "all" },
        recipients: [String],
        folders: [String],
        summary: String,
        details: String,
        pinned: { type: Boolean, default: false },
        viewers: [String],
        createdAt: String,
        updatedAt: String,
    },
    { collection: "pazza_posts" }
);

export default schema;
