// Kambaz/People/dao.js
import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findPeopleForCourse(courseId) {
    const { users, enrollments } = Database;
    const members = enrollments
        .filter((e) => e.course === courseId)
        .map((e) => users.find((u) => u._id === e.user))
        .filter(Boolean);
    return members;
}

export function enrollUserInCourse(userId, courseId) {
    const { enrollments } = Database;
    const already = enrollments.find((e) => e.user === userId && e.course === courseId);
    if (already) return already;
    const enrollment = { _id: uuidv4(), user: userId, course: courseId };
    Database.enrollments = [...enrollments, enrollment];
    return enrollment;
}

export function unenrollUserFromCourse(userId, courseId) {
    const before = Database.enrollments.length;
    Database.enrollments = Database.enrollments.filter(
        (e) => !(e.user === userId && e.course === courseId)
    );
    return { removed: before - Database.enrollments.length };
}
