import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const findAssignmentsForCourse = (courseId) => model.find({ course: courseId });

export const createAssignment = (assignment) => {
    const newAssignment = { ...assignment, _id: assignment._id || uuidv4() };
    return model.create(newAssignment);
};

export const updateAssignment = async (assignmentId, updates) => {
    const { _id, ...rest } = updates;
    await model.updateOne({ _id: assignmentId }, { $set: rest });
    return model.findById(assignmentId);
};

export const deleteAssignment = (assignmentId) => model.deleteOne({ _id: assignmentId });
