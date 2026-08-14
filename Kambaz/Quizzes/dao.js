import Database from "../Database/index.js";

export function findQuizzesForCourse(courseId) {
    return Database.quizzes.filter((q) => q.course === courseId);
}
