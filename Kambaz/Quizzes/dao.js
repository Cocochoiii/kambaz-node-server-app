import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findQuizzesForCourse(courseId) {
    return Database.quizzes.filter((q) => q.course === courseId);
}
export function createQuiz(quiz) {
    const newQuiz = { ...quiz, _id: uuidv4() };
    Database.quizzes = [...Database.quizzes, newQuiz];
    return newQuiz;
}
export function updateQuiz(quizId, updates) {
    const q = Database.quizzes.find((q) => q._id === quizId);
    if (q) Object.assign(q, updates);
    return q;
}
export function deleteQuiz(quizId) {
    Database.quizzes = Database.quizzes.filter((q) => q._id !== quizId);
    return true;
}
