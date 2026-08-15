import mongoose from "mongoose";
import schema from "./schema.js";

const model = mongoose.model("AnnouncementModel", schema);
export default model;
