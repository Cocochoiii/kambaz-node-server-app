import mongoose from "mongoose";

// One student's submission for one assignment. Denormalizes the assignment
// title/points so the dashboard can show feedback without extra lookups.
const schema = new mongoose.Schema(
    {
        _id: String,
        assignment: String,
        course: String,
        user: String,
        title: String,
        points: Number,
        text: String,
        status: String, // "submitted" or "graded"
        submittedAt: String,
        grade: Number,
        feedback: String,
        gradedAt: String,
    },
    { collection: "submissions", strict: false }
);
export default schema;
