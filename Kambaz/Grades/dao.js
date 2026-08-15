import { gradeModel, categoryModel } from "./model.js";

export function findGradesForCourse(courseId) {
    return gradeModel.find({ course: courseId });
}

// Change one score, or add the row if it is not there yet.
export async function upsertGrade(courseId, grade) {
    const { student, assignment, score, submitted } = grade;
    const found = await gradeModel.findOne({
        course: courseId,
        student: student,
        assignment: assignment,
    });
    if (found) {
        await gradeModel.updateOne(
            { _id: found._id },
            { $set: { score: score, submitted: submitted } }
        );
        return gradeModel.findById(found._id);
    }
    const newGrade = {
        _id: `G-${new Date().getTime()}`,
        student: student,
        assignment: assignment,
        course: courseId,
        score: score,
        submitted: submitted,
        released: false,
        type: "assignment",
    };
    return gradeModel.create(newGrade);
}

export function releaseGradesForCourse(courseId) {
    return gradeModel.updateMany({ course: courseId }, { $set: { released: true } });
}

// When a course is deleted, its grades are deleted too.
export function deleteGradesForCourse(courseId) {
    return gradeModel.deleteMany({ course: courseId });
}

// The weights shown on the student side of the Grades screen.
export function findGradeCategoriesForCourse(courseId) {
    return categoryModel.findOne({ course: courseId });
}
