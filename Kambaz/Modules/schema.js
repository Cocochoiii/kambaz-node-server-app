import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
    { _id: String, name: String, published: { type: Boolean, default: true } },
    { _id: false }
);

const schema = new mongoose.Schema(
    {
            _id: { type: String },
            name: { type: String },
            description: { type: String },
            course: { type: String, ref: "CourseModel" },
            published: { type: Boolean, default: true },        // NEW
            lessons: { type: [lessonSchema], default: [] },     // NEW
    },
    { collection: "modules" }
);

export default schema;
