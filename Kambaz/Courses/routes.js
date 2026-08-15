import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as assignmentsDao from "../Assignments/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import * as announcementsDao from "../Announcements/dao.js";
import * as meetingsDao from "../Meetings/dao.js";
import * as quizzesDao from "../Quizzes/dao.js";
import * as gradesDao from "../Grades/dao.js";

export default function CourseRoutes(app) {
    const findAllCourses = async (req, res) => {
        const courses = await dao.findAllCourses();
        res.json(courses);
    };

    // A new course. The author is enrolled right away.
    // So the course is on their Dashboard after a refresh.
    const createCourse = async (req, res) => {
        const course = await dao.createCourse(req.body);
        const currentUser = req.session["currentUser"];
        if (currentUser) {
            await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
        }
        res.json(course);
    };

    // The course goes away. Everything that hangs on it goes too.
    const deleteCourse = async (req, res) => {
        const { courseId } = req.params;
        await modulesDao.deleteModulesForCourse(courseId);
        await assignmentsDao.deleteAssignmentsForCourse(courseId);
        await enrollmentsDao.deleteEnrollmentsForCourse(courseId);
        await announcementsDao.deleteAnnouncementsForCourse(courseId);
        await meetingsDao.deleteMeetingsForCourse(courseId);
        await quizzesDao.deleteQuizzesForCourse(courseId);
        await gradesDao.deleteGradesForCourse(courseId);
        await dao.deleteCourse(courseId);
        res.sendStatus(200);
    };

    const updateCourse = async (req, res) => {
        const { courseId } = req.params;
        const courseUpdates = req.body;
        await dao.updateCourse(courseId, courseUpdates);
        const updated = await dao.findCourseById(courseId);
        if (!updated) {
            res.status(404).json({ message: `Unable to update course ${courseId}` });
            return;
        }
        res.json(updated);
    };

    const findModulesForCourse = async (req, res) => {
        const { courseId } = req.params;
        const modules = await modulesDao.findModulesForCourse(courseId);
        res.json(modules);
    };

    const createModuleForCourse = async (req, res) => {
        const { courseId } = req.params;
        const module = { ...req.body, course: courseId };
        const newModule = await modulesDao.createModule(module);
        res.json(newModule);
    };

    // The People screen. It lists the users enrolled in this course.
    const findUsersForCourse = async (req, res) => {
        const { courseId } = req.params;
        const users = await enrollmentsDao.findUsersForCourse(courseId);
        res.json(users);
    };

    app.get("/api/courses", findAllCourses);
    app.post("/api/courses", createCourse);
    app.delete("/api/courses/:courseId", deleteCourse);
    app.put("/api/courses/:courseId", updateCourse);
    app.get("/api/courses/:courseId/modules", findModulesForCourse);
    app.post("/api/courses/:courseId/modules", createModuleForCourse);
    app.get("/api/courses/:courseId/users", findUsersForCourse);
}
