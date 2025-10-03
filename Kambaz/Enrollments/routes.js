import * as enrollmentsDao from "./dao.js";

/*
 * Routes specific to enrollments. These endpoints expose enrollment
 * related queries such as retrieving the students for a course. Other
 * enrollment operations such as enrolling and unenrolling users are
 * defined in UserRoutes.
 */
export default function EnrollmentRoutes(app) {
  // Retrieve all users enrolled in a course
  app.get("/api/courses/:cid/users", async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  });
}