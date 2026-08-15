import model from "./model.js";

// Enrollments join users and courses.
// populate changes a key into the real document.

export async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    // A deleted course leaves an empty link. I drop those rows.
    return enrollments
        .map((enrollment) => enrollment.course)
        .filter((course) => course);
}

export async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments
        .map((enrollment) => enrollment.user)
        .filter((user) => user);
}

// One user joins one course only once. So I look before I insert.
export async function enrollUserInCourse(user, course) {
    const found = await model.findOne({ user: user, course: course });
    if (found) {
        return found;
    }
    const newEnrollment = { user, course, _id: `${user}-${course}` };
    return model.create(newEnrollment);
}

export function unenrollUserFromCourse(user, course) {
    return model.deleteOne({ user: user, course: course });
}

// When a course or a user is deleted, its rows are deleted too.
export function deleteEnrollmentsForCourse(courseId) {
    return model.deleteMany({ course: courseId });
}

export function deleteEnrollmentsForUser(userId) {
    return model.deleteMany({ user: userId });
}
