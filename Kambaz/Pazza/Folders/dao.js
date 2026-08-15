import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

// Every course starts with this list of folders.
export const DEFAULT_FOLDERS = [
    "hw1", "hw2", "hw3", "project",
    "exam", "logistics", "other", "office_hours",
];

// I only read here. I never seed on a read.
// If I seeded here, a deleted folder would come back on refresh.
export function findFoldersForCourse(courseId) {
    return model.find({ course: courseId });
}

// The seed and a brand new course both call this.
// I skip the work when the course already has folders.
export async function seedDefaultFolders(courseId) {
    const count = await model.countDocuments({ course: courseId });
    if (count > 0) {
        return [];
    }
    const folders = DEFAULT_FOLDERS.map((name) => ({
        _id: uuidv4(),
        course: courseId,
        name,
    }));
    await model.insertMany(folders);
    return folders;
}

export function createFolder(courseId, name) {
    return model.create({ _id: uuidv4(), course: courseId, name });
}

export async function updateFolder(folderId, name) {
    await model.updateOne({ _id: folderId }, { $set: { name } });
    return model.findById(folderId);
}

export function deleteFolder(folderId) {
    return model.deleteOne({ _id: folderId });
}

export function deleteFoldersForCourse(courseId) {
    return model.deleteMany({ course: courseId });
}
