import mongoose from "mongoose";
import schema from "./schema.js";

// The model gives me find, create, updateOne and deleteOne.
// Other schemas point at this name, UserModel, with ref.
const model = mongoose.model("UserModel", schema);
export default model;
