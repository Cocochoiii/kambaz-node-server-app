import model from "./model.js";

export const findGradesForCourse = (courseId) => model.find({ course: courseId });

// Upsert a single grade by (course, student, assignment).
export const upsertGrade = async (courseId, { student, assignment, score, submitted }) => {
    const existing = await model.findOne({ course: courseId, student, assignment });
    if (existing) {
        await model.updateOne({ _id: existing._id }, { $set: { score, submitted } });
        return model.findById(existing._id);
    }
    const newGrade = {
        _id: `G${Date.now()}`,
        student,
        assignment,
        course: courseId,
        score,
        submitted,
        released: false,
        type: "assignment",
    };
    return model.create(newGrade);
};

export const releaseGradesForCourse = (courseId) =>
    model.updateMany({ course: courseId }, { $set: { released: true } });
