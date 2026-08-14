import Database from "../Database/index.js";

// The Calendar keeps no data. It collects dates that already exist:
// assignment due dates, Zoom meetings and announcements.
// Faculty sees every course. A student sees the enrolled ones.
function coursesForUser(userId) {
    const user = Database.users.find((u) => u._id === userId);
    if (user && user.role === "FACULTY") {
        return Database.courses;
    }
    const courseIds = Database.enrollments
        .filter((e) => e.user === userId)
        .map((e) => e.course);
    return Database.courses.filter((c) => courseIds.includes(c._id));
}

export function findEventsForUser(userId) {
    const courses = coursesForUser(userId);
    const courseIds = courses.map((c) => c._id);
    const nameOf = (courseId) => {
        const course = courses.find((c) => c._id === courseId);
        return course ? course.name : "";
    };
    const events = [];

    Database.assignments
        .filter((a) => courseIds.includes(a.course))
        .forEach((a) => {
            events.push({
                _id: `assignment-${a._id}`,
                title: a.title,
                // Every event carries a plain date, so the screen can sort them.
                date: a.dueDate,
                type: "assignment",
                course: a.course,
                courseName: nameOf(a.course),
                detail: `${a.points} pts`,
            });
        });

    Database.meetings
        .filter((m) => courseIds.includes(m.course))
        .forEach((m) => {
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

    Database.announcements
        .filter((a) => courseIds.includes(a.course))
        .forEach((a) => {
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
