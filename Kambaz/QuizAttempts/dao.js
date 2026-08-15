import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

// The attempts of one student on one quiz, oldest first.
export function findAttempts(quizId, userId) {
    return model.find({ quiz: quizId, user: userId }).sort({ attemptNumber: 1 });
}

export function countAttempts(quizId, userId) {
    return model.countDocuments({ quiz: quizId, user: userId });
}

export function createAttempt(attempt) {
    const newAttempt = { ...attempt, _id: uuidv4() };
    return model.create(newAttempt);
}

// When a quiz is deleted, its attempts are deleted too.
export function deleteAttemptsForQuiz(quizId) {
    return model.deleteMany({ quiz: quizId });
}
