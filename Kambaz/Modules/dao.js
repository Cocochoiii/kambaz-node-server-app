import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findModulesForCourse(courseId) {
    return Database.modules.filter((m) => m.course === courseId);
}

export function createModule(module) {
    const newModule = { ...module, _id: uuidv4() };
    Database.modules = [...Database.modules, newModule];
    return newModule;
}

export function deleteModule(moduleId) {
    Database.modules = Database.modules.filter((m) => m._id !== moduleId);
    return true;
}

export function updateModule(moduleId, moduleUpdates) {
    const m = Database.modules.find((m) => m._id === moduleId);
    Object.assign(m, moduleUpdates);
    return m;
}
