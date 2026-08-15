import * as dao from "./dao.js";
import * as attemptsDao from "../QuizAttempts/dao.js";

export default function QuizRoutes(app) {
    // The quizzes of one course.
    const findQuizzesForCourse = async (req, res) => {
        const { courseId } = req.params;
        const quizzes = await dao.findQuizzesForCourse(courseId);
        res.json(quizzes);
    };

    // + Quiz sends me an almost empty quiz.
    // A new quiz always starts not published.
    const createQuizForCourse = async (req, res) => {
        const { courseId } = req.params;
        const quiz = { ...req.body, course: courseId, published: false };
        const newQuiz = await dao.createQuiz(quiz);
        res.json(newQuiz);
    };

    const findQuizById = async (req, res) => {
        const { quizId } = req.params;
        const quiz = await dao.findQuizById(quizId);
        if (!quiz) {
            res.status(404).json({ message: `Quiz ${quizId} not found` });
            return;
        }
        res.json(quiz);
    };

    const updateQuiz = async (req, res) => {
        const { quizId } = req.params;
        await dao.updateQuiz(quizId, req.body);
        const updated = await dao.findQuizById(quizId);
        if (!updated) {
            res.status(404).json({ message: `Unable to update quiz ${quizId}` });
            return;
        }
        res.json(updated);
    };

    // When a quiz goes away, the attempts of that quiz go away too.
    const deleteQuiz = async (req, res) => {
        const { quizId } = req.params;
        await dao.deleteQuiz(quizId);
        await attemptsDao.deleteAttemptsForQuiz(quizId);
        res.sendStatus(200);
    };

    app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
    app.post("/api/courses/:courseId/quizzes", createQuizForCourse);
    app.get("/api/quizzes/:quizId", findQuizById);
    app.put("/api/quizzes/:quizId", updateQuiz);
    app.delete("/api/quizzes/:quizId", deleteQuiz);
}
