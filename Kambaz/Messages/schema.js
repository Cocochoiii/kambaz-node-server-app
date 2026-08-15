import mongoose from "mongoose";

// One message goes from one user to one user.
// The three ref names let populate read the real documents.
const schema = new mongoose.Schema(
    {
        _id: String,
        from: { type: String, ref: "UserModel" },
        to: { type: String, ref: "UserModel" },
        course: { type: String, ref: "CourseModel" },
        subject: String,
        body: String,
        date: String,
        read: Boolean,
    },
    { collection: "messages" }
);
export default schema;
