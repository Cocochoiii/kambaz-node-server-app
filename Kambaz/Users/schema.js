import mongoose from "mongoose";

// _id is String so seeded ids like "123"/"1000" are preserved.
// strict:false keeps any extra fields present in the seed data.
const schema = new mongoose.Schema(
    {
        _id: String,
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        dob: String,
        role: { type: String, default: "STUDENT" },
        loginId: String,
        section: String,
        lastActivity: String,
        totalActivity: String,
    },
    { collection: "users", strict: false }
);
export default schema;
