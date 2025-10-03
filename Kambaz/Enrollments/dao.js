import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

/*
 * Data access functions for enrollments. Enrollments implement a
 * many‑to‑many relationship between users and courses. Mongoose's
 * populate() API is used to automatically retrieve related course and
 * user documents when needed.
 */

export async function findCoursesForUser(userId) {
  const enrollments = await model
    .find({ user: userId })
    .populate("course");
  return enrollments.map((enrollment) => enrollment.course);
}

export async function findUsersForCourse(courseId) {
  const enrollments = await model
    .find({ course: courseId })
    .populate("user");
  return enrollments.map((enrollment) => enrollment.user);
}

export async function enrollUserInCourse(user, course) {
  const newEnrollment = {
    _id: `${user}-${course}`,
    user,
    course,
    enrollmentDate: new Date(),
    status: "ENROLLED",
  };
  return model.findOneAndUpdate(
    { _id: newEnrollment._id },
    newEnrollment,
    { upsert: true, new: true }
  );
}

export async function unenrollUserFromCourse(user, course) {
  return model.deleteOne({ user, course });
}