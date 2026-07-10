import * as dao from "./dao.js";

export default function QuizRoutes(app) {
    app.get("/api/courses/:courseId/quizzes", (req, res) => {
        res.json(dao.findQuizzesForCourse(req.params.courseId));
    });
    app.post("/api/courses/:courseId/quizzes", (req, res) => {
        const quiz = { ...req.body, course: req.params.courseId };
        res.json(dao.createQuiz(quiz));
    });
    app.put("/api/quizzes/:quizId", (req, res) => {
        res.json(dao.updateQuiz(req.params.quizId, req.body));
    });
    app.delete("/api/quizzes/:quizId", (req, res) => {
        dao.deleteQuiz(req.params.quizId);
        res.sendStatus(200);
    });
}
