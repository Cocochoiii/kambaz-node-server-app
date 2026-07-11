import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

// Folders every new course starts with.
const DEFAULTS = ["hw1", "hw2", "hw3", "project", "exam", "logistics", "other", "office_hours"];

// Return a course's folders; seed the defaults the first time a course is opened.
export const findFoldersForCourse = async (courseId) => {
    let list = await model.find({ course: courseId });
    if (list.length === 0) {
        await model.insertMany(DEFAULTS.map((name) => ({ _id: uuidv4(), course: courseId, name })));
        list = await model.find({ course: courseId });
    }
    return list;
};
export const createFolder = (courseId, name) =>
    model.create({ _id: uuidv4(), course: courseId, name });
export const updateFolder = async (folderId, name) => {
    await model.updateOne({ _id: folderId }, { $set: { name } });
    return model.findById(folderId);
};
export const deleteFolder = (folderId) => model.deleteOne({ _id: folderId });
