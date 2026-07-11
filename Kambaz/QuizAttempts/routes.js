import * as dao from "./dao.js";
import * as quizzesDao from "../Quizzes/dao.js";

// Grade an attempt against the quiz's questions (server is authoritative).
const gradeAttempt = (quiz, answers) => {
    const byId = new Map((answers || []).map((a) => [a.questionId, a.answer]));
    let score = 0;
    for (const q of quiz.questions || []) {
        const given = byId.get(q._id);
        const pts = Number(q.points) || 0;
        if (q.type === "TRUE_FALSE") {
            if (typeof given === "boolean" && given === !!q.correctAnswer) score += pts;
        } else if (q.type === "FILL_BLANK") {
            const norm = (s) => String(s ?? "").trim().toLowerCase();
            if (given != null && (q.answers || []).some((a) => norm(a) === norm(given))) score += pts;
        } else {
            // MULTIPLE_CHOICE: single correct choice
            const correct = (q.choices || []).find((c) => c.correct);
            if (correct && given === correct._id) score += pts;
        }
    }
    return score;
};

export default function QuizAttemptRoutes(app) {
    // Current user's attempt summary for a quiz.
    app.get("/api/quizzes/:quizId/attempts", async (req, res) => {
        const userId = req.query.userId || req.session?.currentUser?._id;
        if (!userId) return res.json({ count: 0, last: null });
        const count = await dao.countAttempts(req.params.quizId, userId);
        const last = await dao.findLastAttempt(req.params.quizId, userId);
        res.json({ count, last });
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
            answers, score, attemptNumber: prior + 1, submittedAt: new Date().toISOString(),
        });
        res.json(attempt);
    });
}
