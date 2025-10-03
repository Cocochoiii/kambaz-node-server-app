import mongoose from "mongoose";
import schema from "./schema.js";

// Create a model for modules. The model name is `ModuleModel`.
const model = mongoose.model("ModuleModel", schema);
export default model;