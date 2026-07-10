import Database from "../Database/index.js";

export function findGradesForCourse(courseId) {
    return Database.grades.filter((g) => g.course === courseId);
}
// Upsert a single grade by (course, student, assignment).
export function upsertGrade(courseId, { student, assignment, score, submitted }) {
    let g = Database.grades.find(
        (x) => x.course === courseId && x.student === student && x.assignment === assignment
    );
    if (g) {
        g.score = score;
        g.submitted = submitted;
    } else {
        g = {
            _id: `G${Date.now()}`,
            student,
            assignment,
            course: courseId,
            score,
            submitted,
            released: false,
            type: "assignment",
        };
        Database.grades.push(g);
    }
    return g;
}
export function releaseGradesForCourse(courseId) {
    Database.grades = Database.grades.map((g) =>
        g.course === courseId ? { ...g, released: true } : g
    );
    return true;
}
