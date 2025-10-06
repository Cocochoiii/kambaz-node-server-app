import mongoose from "mongoose";

/**
 * One preferences document per user.
 * displayName & email are denormalized for quick reads in Settings.
 * We also store UI prefs (darkMode, emailAlerts, pushAlerts).
 */
const schema = new mongoose.Schema(
    {
        _id: { type: String },               // equals user _id (easy lookup)
        user: { type: String, ref: "UserModel", unique: true },
        displayName: { type: String, default: "" },
        email: { type: String, default: "" },
        darkMode: { type: Boolean, default: false },
        emailAlerts: { type: Boolean, default: true },
        pushAlerts: { type: Boolean, default: false },
        updatedAt: { type: Date, default: Date.now },
    },
    { collection: "user_preferences" }
);

export default schema;
