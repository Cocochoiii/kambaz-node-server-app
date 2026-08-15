import mongoose from "mongoose";

// One course has many assignments. So course keeps the course key.
// The three dates stay Strings. The editor uses date inputs.
const schema = new mongoose.Schema(
    {
        _id: String,
        title: String,
        course: { type: String, ref: "CourseModel" },
        description: String,
        points: Number,
        dueDate: String,
        availableFrom: String,
        availableUntil: String,
        published: Boolean,
    },
    { collection: "assignments" }
);
export default schema;
