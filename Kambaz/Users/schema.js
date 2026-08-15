import mongoose from "mongoose";

// The shape of one user document in the users collection.
// I keep _id a String, so my seed ids like "123" still work.
// dob stays a String, because the Profile screen shows a date input.
const userSchema = new mongoose.Schema(
    {
        _id: String,
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        firstName: String,
        lastName: String,
        email: String,
        dob: String,
        role: {
            type: String,
            enum: ["STUDENT", "TA", "FACULTY", "ADMIN", "USER"],
            default: "USER",
        },
        loginId: String,
        section: String,
        lastActivity: String,
        totalActivity: String,
    },
    { collection: "users" }
);
export default userSchema;
