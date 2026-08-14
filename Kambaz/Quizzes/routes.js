import * as dao from "./dao.js";

export default function QuizRoutes(app) {
    // The quizzes of one course. The screen only reads them.
    app.get("/api/courses/:courseId/quizzes", (req, res) => {
        res.json(dao.findQuizzesForCourse(req.params.courseId));
    });
}
