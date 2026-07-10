import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function enrollUserInCourse(userId, courseId) {
    const exists = Database.enrollments.some(
        (e) => e.user === userId && e.course === courseId
    );
    if (!exists) {
        Database.enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
    }
    return true;
}

export function unenrollUserFromCourse(userId, courseId) {
    Database.enrollments = Database.enrollments.filter(
        (e) => !(e.user === userId && e.course === courseId)
    );
    return true;
}

export function findCoursesForUser(userId) {
    const courseIds = Database.enrollments
        .filter((e) => e.user === userId)
        .map((e) => e.course);
    return Database.courses.filter((c) => courseIds.includes(c._id));
}
