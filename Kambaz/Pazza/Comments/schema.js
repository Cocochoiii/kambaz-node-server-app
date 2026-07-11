import mongoose from "mongoose";

// A Pazza comment: an answer, a follow-up discussion, or a nested reply.
const schema = new mongoose.Schema(
    {
        _id: String,
        course: String,
        post: String,
        kind: String,        // "answer", "discussion", or "reply"
        parent: String,      // for a reply: the discussion or reply it replies to
        authorRole: String,  // used to split student vs instructor answers
        resolved: Boolean,   // for a discussion
        endorsed: Boolean,   // instructor-endorsed answer
        author: String,
        authorName: String,
        text: String,        // rich text (HTML)
        createdAt: String,
    },
    { collection: "pazza_comments", strict: false }
);
export default schema;
