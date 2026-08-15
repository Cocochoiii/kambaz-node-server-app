import mongoose from "mongoose";

// One Pazza comment. The kind says what it is.
// "answer" sits under the post. "discussion" starts a followup.
// "reply" answers a discussion or another reply, so it keeps a parent.
const schema = new mongoose.Schema(
    {
        _id: String,
        course: String,
        post: String,
        kind: { type: String, enum: ["answer", "discussion", "reply"], default: "answer" },
        parent: String,
        author: String,
        authorName: String,
        authorRole: String,
        text: String,
        resolved: { type: Boolean, default: false },
        createdAt: String,
        updatedAt: String,
    },
    { collection: "pazza_comments" }
);

export default schema;
