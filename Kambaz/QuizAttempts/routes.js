import * as dao from "./dao.js";
import * as quizzesDao from "../Quizzes/dao.js";

// I grade on the server. The browser never learns the right answers,
// and a student can not send me a score of their own.

function sameText(one, two) {
    return String(one || "").trim().toLowerCase() === String(two || "").trim().toLowerCase();
}

// One question is right or wrong. There is no half point.
function isCorrect(question, given) {
    if (question.type === "TRUE_FALSE") {
        return given === true || given === false
            ? given === (question.correctAnswer === true)
            : false;
    }
    if (question.type === "FILL_BLANK") {
        const answers = question.answers || [];
        return answers.some((answer) => sameText(answer, given));
    }
    // A multiple choice question can have more than one right choice.
    const right = (question.choices || [])
        .filter((choice) => choice.correct)
        .map((choice) => choice._id);
    const picked = given || [];
    if (right.length === 0 || picked.length !== right.length) {
        return false;
    }
    return right.every((id) => picked.includes(id));
}

function gradeAttempt(quiz, answers) {
    const questions = Array.isArray(quiz.questions) ? quiz.questions : [];
    let score = 0;
    for (const question of questions) {
        const mine = answers.find((answer) => answer.questionId === question._id);
        if (mine && isCorrect(question, mine.answer)) {
            score = score + (Number(question.points) || 0);
        }
    }
    return score;
}

// How many times a student may take this quiz.
function attemptLimit(quiz) {
    if (!quiz.multipleAttempts) {
        return 1;
    }
    return Number(quiz.howManyAttempts) || 1;
}

export default function QuizAttemptRoutes(app) {
    // Who is asking. The session first, the query or the body after it.
    const userOf = (req, fromBody) => {
        if (req.session && req.session.currentUser) {
            return req.session.currentUser._id;
        }
        return fromBody;
    };

    // The attempts of the current user, with the count and the last one.
    const findAttempts = async (req, res) => {
        const { quizId } = req.params;
        const userId = userOf(req, req.query.userId);
        if (!userId) {
            res.json({ count: 0, last: null, best: 0, attempts: [] });
            return;
        }
        const attempts = await dao.findAttempts(quizId, userId);
        const last = attempts.length > 0 ? attempts[attempts.length - 1] : null;
        let best = 0;
        for (const attempt of attempts) {
            if (attempt.score > best) {
                best = attempt.score;
            }
        }
        res.json({ count: attempts.length, last, best, attempts });
    };

    // A new attempt. I grade it and I count the older ones first.
    const createAttempt = async (req, res) => {
        const { quizId } = req.params;
        const userId = userOf(req, req.body.user);
        if (!userId) {
            res.status(401).json({ message: "Not signed in" });
            return;
        }
        const quiz = await quizzesDao.findQuizById(quizId);
        if (!quiz) {
            res.status(404).json({ message: `Quiz ${quizId} not found` });
            return;
        }
        const taken = await dao.countAttempts(quizId, userId);
        if (taken >= attemptLimit(quiz)) {
            res.status(403).json({ message: "No attempts left" });
            return;
        }
        const answers = req.body.answers || [];
        const attempt = await dao.createAttempt({
            quiz: quizId,
            course: quiz.course,
            user: userId,
            answers,
            score: gradeAttempt(quiz, answers),
            timeTaken: Number(req.body.timeTaken) || 0,
            attemptNumber: taken + 1,
            submittedAt: new Date().toISOString(),
        });
        res.json(attempt);
    };

    app.get("/api/quizzes/:quizId/attempts", findAttempts);
    app.post("/api/quizzes/:quizId/attempts", createAttempt);
}
