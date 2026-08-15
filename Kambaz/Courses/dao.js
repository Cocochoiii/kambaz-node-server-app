import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

// The course CRUD, written with the mongoose model.

export function findAllCourses() {
    return model.find();
}

export function findCourseById(courseId) {
    return model.findById(courseId);
}

export function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    return model.create(newCourse);
}

export function deleteCourse(courseId) {
    return model.deleteOne({ _id: courseId });
}

// I drop _id and __v first. Mongo does not let me change them.
export function updateCourse(courseId, courseUpdates) {
    const { _id, __v, ...updates } = courseUpdates;
    return model.updateOne({ _id: courseId }, { $set: updates });
}
