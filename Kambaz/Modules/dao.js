import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const findModulesForCourse = (courseId) => model.find({ course: courseId });

export const createModule = (module) => {
    const newModule = { lessons: [], ...module, _id: module._id || uuidv4() };
    return model.create(newModule);
};

export const deleteModule = (moduleId) => model.deleteOne({ _id: moduleId });

export const updateModule = async (moduleId, moduleUpdates) => {
    const { _id, ...rest } = moduleUpdates;
    await model.updateOne({ _id: moduleId }, { $set: rest });
    return model.findById(moduleId);
};
