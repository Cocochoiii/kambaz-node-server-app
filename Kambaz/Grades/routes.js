import * as dao from "./dao.js";

export default function GradeRoutes(app) {
    app.get("/api/courses/:courseId/grades", async (req, res) => {
        res.json(await dao.findGradesForCourse(req.params.courseId));
    });
    app.post("/api/courses/:courseId/grades", async (req, res) => {
        res.json(await dao.upsertGrade(req.params.courseId, req.body));
    });
    app.put("/api/courses/:courseId/grades/release", async (req, res) => {
        await dao.releaseGradesForCourse(req.params.courseId);
        res.sendStatus(200);
    });
}
