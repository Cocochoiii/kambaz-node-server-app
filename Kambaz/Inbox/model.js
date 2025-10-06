import mongoose from "mongoose";
import schema from "./schema.js";

const model = mongoose.model("InboxMessageModel", schema);
export default model;
