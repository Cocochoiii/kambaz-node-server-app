import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import * as usersDao from "../Users/dao.js";

export default function CourseRoutes(app) {
    // courses
    app.get("/api/courses", async (req, res) => res.json(await dao.findAllCourses()));
    app.delete("/api/courses/:courseId", async (req, res) => {
        await dao.deleteCourse(req.params.courseId);
        res.sendStatus(200);
    });
    app.put("/api/courses/:courseId", async (req, res) => {
        const updated = await dao.updateCourse(req.params.courseId, req.body);
        res.json(updated);
    });

    // modules of a course
    app.get("/api/courses/:courseId/modules", async (req, res) => {
        res.json(await modulesDao.findModulesForCourse(req.params.courseId));
    });
    app.post("/api/courses/:courseId/modules", async (req, res) => {
        const module = { ...req.body, course: req.params.courseId };
        res.json(await modulesDao.createModule(module));
    });

    // A6: users enrolled in a course (Course > People table)
    app.get("/api/courses/:courseId/users", async (req, res) => {
        const enrollments = await enrollmentsDao.findEnrollmentsForCourse(req.params.courseId);
        const userIds = enrollments.map((e) => e.user);
        const users = await usersDao.findUsersByIds(userIds);
        res.json(users);
    });
}
