import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findAssignmentsForCourse(courseId) {
    return Database.assignments.filter((a) => a.course === courseId);
}
export function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    Database.assignments = [...Database.assignments, newAssignment];
    return newAssignment;
}
export function updateAssignment(assignmentId, updates) {
    const a = Database.assignments.find((a) => a._id === assignmentId);
    if (a) Object.assign(a, updates);
    return a;
}
export function deleteAssignment(assignmentId) {
    Database.assignments = Database.assignments.filter((a) => a._id !== assignmentId);
    return true;
}
