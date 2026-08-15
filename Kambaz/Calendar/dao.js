import userModel from "../Users/model.js";
import courseModel from "../Courses/model.js";
import assignmentModel from "../Assignments/model.js";
import enrollmentModel from "../Enrollments/model.js";
import meetingModel from "../Meetings/model.js";
import announcementModel from "../Announcements/model.js";

// The Calendar keeps no data. It only collects dates that exist:
// assignment due dates, Zoom meetings and announcements.
// Faculty sees every course. A student sees only their courses.
async function coursesForUser(userId) {
    const user = await userModel.findById(userId);
    if (user && (user.role === "FACULTY" || user.role === "ADMIN")) {
        return courseModel.find();
    }
    const enrollments = await enrollmentModel.find({ user: userId });
    const courseIds = enrollments.map((enrollment) => enrollment.course);
    return courseModel.find({ _id: { $in: courseIds } });
}

export async function findEventsForUser(userId) {
    const courses = await coursesForUser(userId);
    const courseIds = courses.map((course) => course._id);
    const nameOf = (courseId) => {
        const course = courses.find((course) => course._id === courseId);
        return course ? course.name : "";
    };
    const events = [];

    const assignments = await assignmentModel.find({ course: { $in: courseIds } });
    assignments.forEach((a) => {
        events.push({
            _id: `assignment-${a._id}`,
            title: a.title,
            // Every event has a plain date, so the screen can sort them.
            date: a.dueDate,
            type: "assignment",
            course: a.course,
            courseName: nameOf(a.course),
            detail: `${a.points} pts`,
        });
    });

    const meetings = await meetingModel.find({ course: { $in: courseIds } });
    meetings.forEach((m) => {
        events.push({
            _id: `meeting-${m._id}`,
            title: m.topic,
            date: m.startTime,
            type: "meeting",
            course: m.course,
            courseName: nameOf(m.course),
            detail: `${m.duration} min`,
        });
    });

    const announcements = await announcementModel.find({ course: { $in: courseIds } });
    announcements.forEach((a) => {
        events.push({
            _id: `announcement-${a._id}`,
            title: a.title,
            date: a.date,
            type: "announcement",
            course: a.course,
            courseName: nameOf(a.course),
            detail: a.author,
        });
    });

    // Oldest first. The screen groups them by day in that order.
    return events
        .filter((e) => e.date)
        .sort((a, b) => (a.date > b.date ? 1 : -1));
}
