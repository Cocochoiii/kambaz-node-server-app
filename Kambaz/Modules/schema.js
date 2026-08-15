import mongoose from "mongoose";

// One course has many modules. The many side keeps the key.
// So course holds the _id of a course. ref names that model.
const schema = new mongoose.Schema(
    {
        _id: String,
        name: String,
        description: String,
        course: { type: String, ref: "CourseModel" },
        lessons: { type: Array, default: [] },
        published: Boolean,
    },
    { collection: "modules" }
);
export default schema;
