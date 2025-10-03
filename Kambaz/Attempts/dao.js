import { v4 as uuidv4 } from "uuid";
import attempts from "./model.js";
import quizzes from "../Quizzes/model.js";

// grade one answer based on question type
function gradeAnswer(question, answer) {
    if (!question) return { correct: false, awarded: 0 };
    const pts = Number(question.points) || 0;

    if (question.type === "MCQ") {
        const correct = answer.choiceId === question.correctChoiceId;
        return { correct, awarded: correct ? pts : 0 };
    }
    if (question.type === "TF") {
        const correct = Boolean(answer.boolean) === Boolean(question.correctBoolean);
        return { correct, awarded: correct ? pts : 0 };
    }
    // FILL
    const candidates = (question.correctAnswers || []).map((s) =>
                                                               String(s).trim().toLowerCase()
    );
    const user = String(answer.text || "").trim().toLowerCase();
    const correct = candidates.includes(user);
    return { correct, awarded: correct ? pts : 0 };
}

export async function submitAttempt(userId, quizId, rawAnswers) {
    const quiz = await quizzes.findById(quizId);
    if (!quiz) throw new Error("Quiz not found");

    // enforce attempts limit
    const count = await attempts.countDocuments({ user: userId, quiz: quizId });
    const allowed = quiz.multipleAttempts ? quiz.allowedAttempts : 1;
    if (count >= allowed) {
        return { blocked: true, message: "No remaining attempts" };
    }

    // grade
    let total = 0;
    const answers = rawAnswers.map((a) => {
        const q = quiz.questions.find((x) => x._id === a.questionId);
        const { correct, awarded } = gradeAnswer(q, a);
        total += awarded;
        return { ...a, correct, awarded };
    });

    const attemptNumber = count + 1;
    const doc = {
        _id: uuidv4(),
        user: userId,
        quiz: quizId,
        attemptNumber,
        totalAwarded: total,
        answers,
    };
    await attempts.create(doc);
    return doc;
}

export const findLastAttemptForUser = async (userId, quizId) =>
    attempts
        .find({ user: userId, quiz: quizId })
        .sort({ attemptNumber: -1 })
        .limit(1)
        .then((arr) => arr[0] || null);
