import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        _id: { type: String, required: true },

        // course FK (one-to-many Course -> Assignments)
        course: { type: String, ref: "CourseModel", required: true },

        // UI fields
        title: { type: String, required: true },
        description: { type: String, default: "" },
        points: { type: Number, default: 100 },

        // dates rendered by your UI
        dueDate: { type: Date },
        availableFrom: { type: Date },
        availableUntil: { type: Date },

        // optional authorship/audit
        authorId: { type: String, ref: "UserModel" },
        author: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date },
    },
    { collection: "assignments" }
);

export default schema;
