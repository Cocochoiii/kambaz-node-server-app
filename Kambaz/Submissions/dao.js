import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

// Student submits: create a submission, or overwrite the existing one so a
// student keeps a single submission per assignment.
export const submitAssignment = async (assignmentId, submission) => {
    const now = new Date().toISOString();
    const existing = await model.findOne({ assignment: assignmentId, user: submission.user });
    if (existing) {
        await model.updateOne(
            { _id: existing._id },
            { $set: { text: submission.text || "", course: submission.course,
                      title: submission.title, points: submission.points,
                      status: "submitted", submittedAt: now } }
        );
        return model.findById(existing._id);
    }
    return model.create({
        _id: uuidv4(),
        assignment: assignmentId,
        course: submission.course,
        user: submission.user,
        title: submission.title,
        points: submission.points,
        text: submission.text || "",
        status: "submitted",
        submittedAt: now,
    });
};

export const findSubmissionsForAssignment = (assignmentId) => model.find({ assignment: assignmentId });
export const findSubmissionsForUser = (userId) => model.find({ user: userId });
export const findAllSubmissions = () => model.find();

// Faculty grades a submission.
export const gradeSubmission = async (submissionId, updates) => {
    const now = new Date().toISOString();
    await model.updateOne(
        { _id: submissionId },
        { $set: { grade: updates.grade, feedback: updates.feedback || "", status: "graded", gradedAt: now } }
    );
    return model.findById(submissionId);
};
