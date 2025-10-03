import mongoose from "mongoose";

/*
 * A Mongoose schema describing the structure of documents stored in the
 * `users` collection. MongoDB documents are flexible and do not require a
 * schema, but declaring one here enables Mongoose to validate data and
 * provides IntelliSense when writing queries. Each user has a unique
 * identifier `_id` of type String and a number of other fields. The
 * `role` field is restricted to one of the enumerated values and
 * defaults to `USER` when not provided.
 */
const userSchema = new mongoose.Schema(
  {
    _id: { type: String },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    dob: { type: Date },
    role: {
      type: String,
      enum: ["STUDENT", "FACULTY", "ADMIN", "USER"],
      default: "USER",
    },
    loginId: { type: String },
    section: { type: String },
    lastActivity: { type: Date },
    totalActivity: { type: String },
  },
  { collection: "users" }
);

export default userSchema;