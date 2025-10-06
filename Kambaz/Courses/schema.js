// Kambaz/Courses/schema.js
import mongoose from "mongoose";

/*
 * Courses collection schema
 */
const courseSchema = new mongoose.Schema(
    {
        _id: { type: String },
        name: { type: String },
        number: { type: String },
        credits: { type: Number },
        description: { type: String },
        term: { type: String },
        semester: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        image: { type: String },

        // --- Home / Status additions ---
        isPublished: { type: Boolean, default: false },
        homePage: {
            type: String,
            enum: ["modules", "stream", "assignments", "syllabus"],
            default: "modules",
        },
    },
    { collection: "courses" }
);

export default courseSchema;
