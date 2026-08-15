import mongoose from "mongoose";
import schema from "./schema.js";

const model = mongoose.model("MeetingModel", schema);
export default model;
