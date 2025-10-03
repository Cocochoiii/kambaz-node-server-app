import mongoose from "mongoose";
import schema from "./schema.js";

/*
 * The Mongoose model binds a schema to a specific collection. Creating a
 * separate model file decouples the schema definition from its usage
 * within DAOs. The first argument to mongoose.model() is the unique
 * model name used by Mongoose internally; it is referenced in other
 * schemas via `ref`. The second argument is the schema imported above.
 */
const model = mongoose.model("UserModel", schema);
export default model;