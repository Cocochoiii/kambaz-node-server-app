// Database access for quizzes.
import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const findQuizzesForCourse = (courseId) => model.find({ course: courseId });

export const findQuizById = (quizId) => model.findById(quizId);

export const createQuiz = (quiz) => {
    const newQuiz = { ...quiz, _id: quiz._id || uuidv4() };
    return model.create(newQuiz);
};

export const updateQuiz = async (quizId, updates) => {
    const { _id, ...rest } = updates;
    await model.updateOne({ _id: quizId }, { $set: rest });
    return model.findById(quizId);
};

export const deleteQuiz = (quizId) => model.deleteOne({ _id: quizId });
