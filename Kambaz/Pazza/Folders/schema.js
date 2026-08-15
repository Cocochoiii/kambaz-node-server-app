import mongoose from "mongoose";

// One Pazza folder. It belongs to a single course.
// The name is what the user sees, like hw1 or office_hours.
const schema = new mongoose.Schema(
    {
        _id: String,
        course: String,
        name: String,
    },
    { collection: "pazza_folders" }
);

export default schema;
