import model from "./model.js";
import enrollmentModel from "../Enrollments/model.js";
import { v4 as uuidv4 } from "uuid";

export const findAllCourses = () => model.find();

export const findCoursesForEnrolledUser = async (userId) => {
    const enrollments = await enrollmentModel.find({ user: userId });
    const courseIds = enrollments.map((e) => e.course);
    return model.find({ _id: { $in: courseIds } });
};

export const createCourse = (course) => {
    const newCourse = { ...course, _id: course._id || uuidv4() };
    return model.create(newCourse);
};

export const deleteCourse = async (courseId) => {
    await enrollmentModel.deleteMany({ course: courseId });
    return model.deleteOne({ _id: courseId });
};

export const updateCourse = async (courseId, courseUpdates) => {
    const { _id, ...rest } = courseUpdates;
    await model.updateOne({ _id: courseId }, { $set: rest });
    return model.findById(courseId);
};
