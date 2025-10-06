// Kambaz/Grades/dao.js
import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

/** Read */
export const findGradeById = (id) => model.findById(id);
export const findGradesForCourse = (courseId) => model.find({ course: courseId });
export const findGradesForAssignment = (assignmentId) => model.find({ assignment: assignmentId });
export const findGradesForStudentInCourse = (uid, cid) =>
    model.find({ student: uid, course: cid });

/** Create */
export const createGrade = (grade) => {
    const doc = { ...grade, _id: uuidv4() };
    return model.create(doc);
};

/** Update */
export const updateGrade = (id, updates) =>
    model.updateOne({ _id: id }, { $set: updates });

/** Delete */
export const deleteGrade = (id) => model.deleteOne({ _id: id });

/** Bulk release for a course */
export const releaseGradesForCourse = (courseId) =>
    model.updateMany({ course: courseId }, { $set: { released: true } });

/** Upsert by (student, assignment, course) triplet */
export const upsertGradeBySAC = async ({ student, assignment, course, ...rest }) => {
    const now = rest.submitted ?? (typeof rest.score === "number" ? new Date() : null);
    const update = {
        $set: { ...rest, submitted: now, student, assignment, course },
        $setOnInsert: { _id: uuidv4(), type: rest.type ?? "assignment", released: false },
    };
    await model.updateOne({ student, assignment, course }, update, { upsert: true });
    return model.findOne({ student, assignment, course });
};
