import mongoose from "mongoose";
import schema from "./attemptSchema.js";

// Model for attempts. Used to record and retrieve quiz attempts by
// students. Each attempt stores a copy of the answers and the
// computed score.
const AttemptModel = mongoose.model("AttemptModel", schema);

export default AttemptModel;