// REST routes for quizzes: list, read one, create, update, delete.
import * as dao from "./dao.js";

export default function QuizRoutes(app) {
    app.get("/api/courses/:courseId/quizzes", async (req, res) => {
        res.json(await dao.findQuizzesForCourse(req.params.courseId));
    });
    app.post("/api/courses/:courseId/quizzes", async (req, res) => {
        const quiz = { ...req.body, course: req.params.courseId };
        res.json(await dao.createQuiz(quiz));
    });
    app.get("/api/quizzes/:quizId", async (req, res) => {
        res.json(await dao.findQuizById(req.params.quizId));
    });
    app.put("/api/quizzes/:quizId", async (req, res) => {
        res.json(await dao.updateQuiz(req.params.quizId, req.body));
    });
    app.delete("/api/quizzes/:quizId", async (req, res) => {
        await dao.deleteQuiz(req.params.quizId);
        res.sendStatus(200);
    });
}
