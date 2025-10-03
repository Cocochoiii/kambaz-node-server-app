import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

/*
 * RESTful routes for courses and their related modules. The routes
 * return promises and should be awaited by the caller. Creating a
 * course does not automatically enroll the author; the user route
 * handles that use case.
 */
export default function CourseRoutes(app) {
  // Retrieve all courses
  app.get("/api/courses", async (req, res) => {
    const courses = await dao.findAllCourses();
    res.json(courses);
  });

  // Retrieve a single course by ID
  app.get("/api/courses/:courseId", async (req, res) => {
    const course = await dao.findCourseById(req.params.courseId);
    res.json(course);
  });

  // Create a new course
  app.post("/api/courses", async (req, res) => {
    const course = await dao.createCourse(req.body);
    res.json(course);
  });

  // Update a course
  app.put("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.json(status);
  });

  // Delete a course
  app.delete("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const status = await dao.deleteCourse(courseId);
    res.json(status);
  });

  // Retrieve modules for a course
  app.get("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const modules = await modulesDao.findModulesForCourse(courseId);
    res.json(modules);
  });

  // Create a new module for a course
  app.post("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const module = { ...req.body, course: courseId };
    const newModule = await modulesDao.createModule(module);
    res.json(newModule);
  });

  // Retrieve users enrolled in a course. Delegates to the enrollments DAO
  // but defines the route here to co‑locate course related API paths.
  app.get("/api/courses/:cid/users", async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  });
}