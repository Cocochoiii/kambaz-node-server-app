import * as dao from "./dao.js";

export default function QuizRoutes(app) {
    // The quizzes of one course. The screen only reads them.
    const findQuizzesForCourse = async (req, res) => {
        const quizzes = await dao.findQuizzesForCourse(req.params.courseId);
        res.json(quizzes);
    };

    app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
}
