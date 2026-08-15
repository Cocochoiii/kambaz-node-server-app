import mongoose from "mongoose";

// Many users take many courses. This collection is in the middle.
// Each row keeps one user key and one course key.
// The two ref names let populate read the real documents.
const enrollmentSchema = new mongoose.Schema(
    {
        _id: String,
        course: { type: String, ref: "CourseModel" },
        user: { type: String, ref: "UserModel" },
        grade: Number,
        letterGrade: String,
        enrollmentDate: Date,
        status: {
            type: String,
            enum: ["ENROLLED", "DROPPED", "COMPLETED"],
            default: "ENROLLED",
        },
    },
    { collection: "enrollments" }
);
export default enrollmentSchema;
