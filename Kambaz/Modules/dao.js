import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

// The module CRUD. A module always belongs to one course.

export function findModulesForCourse(courseId) {
    return model.find({ course: courseId });
}

export function findModuleById(moduleId) {
    return model.findById(moduleId);
}

export function createModule(module) {
    const newModule = { lessons: [], ...module, _id: uuidv4() };
    return model.create(newModule);
}

export function deleteModule(moduleId) {
    return model.deleteOne({ _id: moduleId });
}

// I drop _id and __v first. Mongo does not let me change them.
export function updateModule(moduleId, moduleUpdates) {
    const { _id, __v, ...updates } = moduleUpdates;
    return model.updateOne({ _id: moduleId }, { $set: updates });
}

// When a course is deleted, its modules are deleted too.
export function deleteModulesForCourse(courseId) {
    return model.deleteMany({ course: courseId });
}
