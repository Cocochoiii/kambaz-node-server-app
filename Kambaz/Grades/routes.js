import * as dao from "./dao.js";

export default function GradeRoutes(app) {
    const findGradesForCourse = async (req, res) => {
        const grades = await dao.findGradesForCourse(req.params.courseId);
        res.json(grades);
    };

    const saveGrade = async (req, res) => {
        const saved = await dao.upsertGrade(req.params.courseId, req.body);
        res.json(saved);
    };

    // The weights of the categories. They are read only.
    const findGradeCategories = async (req, res) => {
        const categories = await dao.findGradeCategoriesForCourse(req.params.courseId);
        res.json(categories);
    };

    const releaseGrades = async (req, res) => {
        await dao.releaseGradesForCourse(req.params.courseId);
        res.sendStatus(200);
    };

    // The long path comes first, so it wins over /grades.
    app.put("/api/courses/:courseId/grades/release", releaseGrades);
    app.get("/api/courses/:courseId/grades", findGradesForCourse);
    app.post("/api/courses/:courseId/grades", saveGrade);
    app.get("/api/courses/:courseId/gradeCategories", findGradeCategories);
}
