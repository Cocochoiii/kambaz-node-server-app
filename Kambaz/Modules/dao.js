import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

/*
 * Data access functions for modules. Each module belongs to a single
 * course identified by the `course` field.
 */

export const findModulesForCourse = (courseId) =>
  model.find({ course: courseId });

export const createModule = async (module) => {
  const newModule = { ...module };
  if (!newModule._id) newModule._id = uuidv4();
  const inserted = await model.create(newModule);
  return inserted;
};

export const updateModule = (moduleId, moduleUpdates) =>
  model.updateOne({ _id: moduleId }, { $set: moduleUpdates });

export const deleteModule = (moduleId) =>
  model.deleteOne({ _id: moduleId });