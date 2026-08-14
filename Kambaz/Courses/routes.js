import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";

export default function CourseRoutes(app) {
    // The courses.
    app.get("/api/courses", (req, res) => res.json(dao.findAllCourses()));
    app.delete("/api/courses/:courseId", (req, res) => {
        dao.deleteCourse(req.params.courseId);
        res.sendStatus(200);
    });
    app.put("/api/courses/:courseId", (req, res) => {
        const updated = dao.updateCourse(req.params.courseId, req.body);
        if (!updated) {
            return res
                .status(404)
                .json({ message: `Unable to update course ${req.params.courseId}` });
        }
        res.json(updated);
    });

    // The modules of one course.
    app.get("/api/courses/:courseId/modules", (req, res) => {
        const modules = modulesDao.findModulesForCourse(req.params.courseId);
        res.json(modules);
    });
    app.post("/api/courses/:courseId/modules", (req, res) => {
        const module = { ...req.body, course: req.params.courseId };
        const created = modulesDao.createModule(module);
        res.json(created);
    });
}
