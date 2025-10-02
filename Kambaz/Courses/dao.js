import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findAllCourses() {
    return Database.courses;
}

export function findCoursesForEnrolledUser(userId) {
    const { courses, enrollments } = Database;
    return courses.filter((course) =>
                              enrollments.some((enr) => enr.user === userId && enr.course === course._id)
    );
}

export function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    Database.courses = [...Database.courses, newCourse];
    return newCourse;
}

export function deleteCourse(courseId) {
    const { courses, enrollments } = Database;
    Database.courses = courses.filter((c) => c._id !== courseId);
    Database.enrollments = enrollments.filter((e) => e.course !== courseId);
    return true;
}

export function updateCourse(courseId, courseUpdates) {
    const c = Database.courses.find((c) => c._id === courseId);
    Object.assign(c, courseUpdates);
    return c;
}
