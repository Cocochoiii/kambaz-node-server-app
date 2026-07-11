import * as dao from "./dao.js";
import * as quizzesDao from "../Quizzes/dao.js";

// Grade one question. Multiple choice can have many correct options and gives
// partial credit. True/false and fill in the blank are all or nothing.
const gradeQuestion = (q, given) => {
    const pts = Number(q.points) || 0;
    if (q.type === "TRUE_FALSE") {
        return typeof given === "boolean" && given === !!q.correctAnswer ? pts : 0;
    }
    if (q.type === "FILL_BLANK") {
        const n = (s) => String(s ?? "").trim().toLowerCase();
        const ok = given != null && String(given).length > 0 && (q.answers || []).some((a) => n(a) === n(given));
        return ok ? pts : 0;
    }
    // MULTIPLE_CHOICE (single or multiple correct)
    const correct = (q.choices || []).filter((c) => c.correct).map((c) => c._id);
    const sel = Array.isArray(given) ? given : given != null ? [given] : [];
    if (correct.length === 0) return 0;
    const cc = sel.filter((id) => correct.includes(id)).length;
    const wc = sel.filter((id) => !correct.includes(id)).length;
    const frac = Math.max(0, Math.min(1, (cc - wc) / correct.length));
    return pts * frac;
};

const gradeAttempt = (quiz, answers) => {
    const byId = new Map((answers || []).map((a) => [a.questionId, a.answer]));
    let score = 0;
    for (const q of quiz.questions || []) score += gradeQuestion(q, byId.get(q._id));
    return Math.round(score * 100) / 100;
};

export default function QuizAttemptRoutes(app) {
    // Current user's attempts for a quiz (count, last, best, and the full list).
    app.get("/api/quizzes/:quizId/attempts", async (req, res) => {
        const userId = req.query.userId || req.session?.currentUser?._id;
        if (!userId) return res.json({ count: 0, last: null, best: 0, attempts: [] });
        const all = await dao.findAttemptsForUser(req.params.quizId, userId);
        const count = all.length;
        const last = all[count - 1] || null;
        const best = all.reduce((m, a) => Math.max(m, Number(a.score) || 0), 0);
        res.json({ count, last, best, attempts: all });
    });

    // Submit a new attempt. Server grades and enforces the attempt limit.
    app.post("/api/quizzes/:quizId/attempts", async (req, res) => {
        const userId = req.body.user || req.session?.currentUser?._id;
        if (!userId) return res.status(401).json({ message: "Not signed in" });
        const quiz = await quizzesDao.findQuizById(req.params.quizId);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });
        const prior = await dao.countAttempts(req.params.quizId, userId);
        const maxAttempts = quiz.multipleAttempts ? Number(quiz.howManyAttempts) || 1 : 1;
        if (prior >= maxAttempts) return res.status(403).json({ message: "No attempts left" });
        const answers = req.body.answers || [];
        const score = gradeAttempt(quiz, answers);
        const attempt = await dao.createAttempt({
            quiz: req.params.quizId, course: quiz.course, user: userId,
            answers, score, timeTaken: Number(req.body.timeTaken) || 0,
            attemptNumber: prior + 1, submittedAt: new Date().toISOString(),
        });
        res.json(attempt);
    });
}
