import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

// The quiz CRUD. A quiz always belongs to one course.

export function findQuizzesForCourse(courseId) {
    return model.find({ course: courseId });
}

export function findQuizById(quizId) {
    return model.findById(quizId);
}

export function createQuiz(quiz) {
    const newQuiz = { ...quiz, _id: uuidv4() };
    return model.create(newQuiz);
}

// I drop _id and __v first. Mongo does not let me change them.
export function updateQuiz(quizId, quizUpdates) {
    const { _id, __v, ...updates } = quizUpdates;
    return model.updateOne({ _id: quizId }, { $set: updates });
}

export function deleteQuiz(quizId) {
    return model.deleteOne({ _id: quizId });
}

// When a course is deleted, its quizzes are deleted too.
export function deleteQuizzesForCourse(courseId) {
    return model.deleteMany({ course: courseId });
}
