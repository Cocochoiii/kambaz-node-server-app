import mongoose from "mongoose";

/*
 * Defines the structure of documents in the `courses` collection. Each
 * course has a string primary key `_id` and a number of fields
 * describing the course. Many of these fields are optional but
 * included here to mirror the fields used in the client application.
 */
const courseSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String },
    number: { type: String },
    credits: { type: Number },
    description: { type: String },
    term: { type: String },
    semester: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    image: { type: String },
  },
  { collection: "courses" }
);

export default courseSchema;