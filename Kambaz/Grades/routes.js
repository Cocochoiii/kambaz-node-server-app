import * as dao from "./dao.js";

export default function GradeRoutes(app) {
    app.get("/api/courses/:courseId/grades", (req, res) => {
        res.json(dao.findGradesForCourse(req.params.courseId));
    });
    app.post("/api/courses/:courseId/grades", (req, res) => {
        res.json(dao.upsertGrade(req.params.courseId, req.body));
    });
    // The weights of the categories. They are read only.
    app.get("/api/courses/:courseId/gradeCategories", (req, res) => {
        res.json(dao.findGradeCategoriesForCourse(req.params.courseId));
    });
    app.put("/api/courses/:courseId/grades/release", (req, res) => {
        dao.releaseGradesForCourse(req.params.courseId);
        res.sendStatus(200);
    });
}
