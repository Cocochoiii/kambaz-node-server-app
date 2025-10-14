import mongoose from "mongoose";
import schema from "./attemptSchema.js";

const AttemptModel = mongoose.models.AttemptModel || mongoose.model("AttemptModel", schema);
export default AttemptModel;