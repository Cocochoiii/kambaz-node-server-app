import mongoose from "mongoose";

// A Pazza folder scoped to one course (e.g. hw1, project, office_hours).
const schema = new mongoose.Schema(
    { _id: String, course: String, name: String },
    { collection: "pazza_folders", strict: false }
);
export default schema;
