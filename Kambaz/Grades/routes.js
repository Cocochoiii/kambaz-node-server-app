import * as dao from "./dao.js";

export default function GradeRoutes(app) {
    app.get("/api/courses/:courseId/grades", (req, res) => {
        res.json(dao.findGradesForCourse(req.params.courseId));
    });
    app.post("/api/courses/:courseId/grades", (req, res) => {
        res.json(dao.upsertGrade(req.params.courseId, req.body));
    });
    app.put("/api/courses/:courseId/grades/release", (req, res) => {
        dao.releaseGradesForCourse(req.params.courseId);
        res.sendStatus(200);
    });
}
