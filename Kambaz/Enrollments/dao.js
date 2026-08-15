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

// A deleted user leaves no enrollments behind.
export function deleteEnrollmentsForUser(userId) {
    Database.enrollments = Database.enrollments.filter((e) => e.user !== userId);
    return true;
}

// The People screen needs the users, not the courses.
export function findUsersForCourse(courseId) {
    const userIds = Database.enrollments
        .filter((e) => e.course === courseId)
        .map((e) => e.user);
    return Database.users.filter((u) => userIds.includes(u._id));
}
