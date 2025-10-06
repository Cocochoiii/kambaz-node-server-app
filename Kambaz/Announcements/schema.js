import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        _id: { type: String, required: true },

        // Course this announcement belongs to
        course: { type: String, ref: "CourseModel", required: true },

        // Front-end fields
        title: { type: String, required: true },
        content: { type: String, default: "" },
        section: { type: String, default: "All Sections" },

        // Author info (store both id and display name; FE reads `author`)
        authorId: { type: String, ref: "UserModel" },
        author: { type: String }, // display name or username

        // Posted timestamp (FE reads `date`)
        date: { type: Date, default: Date.now },

        // For auditing
        updatedAt: { type: Date },
        pinned: { type: Boolean, default: false },
    },
    { collection: "announcements" }
);

export default schema;
