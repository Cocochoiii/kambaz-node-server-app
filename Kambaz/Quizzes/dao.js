import model from "./model.js";

export function findQuizzesForCourse(courseId) {
    return model.find({ course: courseId });
}

// When a course is deleted, its quizzes are deleted too.
export function deleteQuizzesForCourse(courseId) {
    return model.deleteMany({ course: courseId });
}
