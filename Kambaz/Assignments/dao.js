import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

// The assignment CRUD. An assignment always belongs to one course.

export function findAssignmentsForCourse(courseId) {
    return model.find({ course: courseId });
}

export function findAssignmentById(assignmentId) {
    return model.findById(assignmentId);
}

export function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    return model.create(newAssignment);
}

// I drop _id and __v first. Mongo does not let me change them.
export function updateAssignment(assignmentId, assignmentUpdates) {
    const { _id, __v, ...updates } = assignmentUpdates;
    return model.updateOne({ _id: assignmentId }, { $set: updates });
}

export function deleteAssignment(assignmentId) {
    return model.deleteOne({ _id: assignmentId });
}

// When a course is deleted, its assignments are deleted too.
export function deleteAssignmentsForCourse(courseId) {
    return model.deleteMany({ course: courseId });
}
