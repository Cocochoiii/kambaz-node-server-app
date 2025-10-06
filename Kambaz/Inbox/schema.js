import mongoose from "mongoose";

/*
 * Inbox messages. We keep a denormalized fromName for fast list rendering.
 * Per-user read status is tracked in readBy (array of user _id strings).
 */
const schema = new mongoose.Schema(
    {
        _id: { type: String },                // uuid
        subject: { type: String, required: true },
        body: { type: String, default: "" },
        preview: { type: String, default: "" }, // first 140 chars (server populates)
        course: { type: String },               // e.g., "5610"
        toText: { type: String, default: "" },  // whatever the UI typed in “To”
        from: { type: String, ref: "UserModel" },
        fromName: { type: String },             // denormalized for quick list
        readBy: [{ type: String }],             // user ids that have read
        createdAt: { type: Date, default: Date.now },
    },
    { collection: "inbox_messages" }
);

// Simple text index for searching
schema.index({ subject: "text", body: "text", fromName: "text" });

export default schema;
