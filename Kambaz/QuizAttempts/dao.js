import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const countAttempts = (quizId, userId) =>
    model.countDocuments({ quiz: quizId, user: userId });

export const findLastAttempt = (quizId, userId) =>
    model.findOne({ quiz: quizId, user: userId }).sort({ attemptNumber: -1 });

export const createAttempt = (attempt) =>
    model.create({ ...attempt, _id: attempt._id || uuidv4() });
