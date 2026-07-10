import model from "./model.js";
import courseModel from "../Courses/model.js";
import { v4 as uuidv4 } from "uuid";

export const enrollUserInCourse = async (userId, courseId) => {
    const exists = await model.findOne({ user: userId, course: courseId });
    if (!exists) {
        await model.create({ _id: uuidv4(), user: userId, course: courseId });
    }
    return true;
};

export const unenrollUserFromCourse = (userId, courseId) =>
    model.deleteOne({ user: userId, course: courseId });

export const findCoursesForUser = async (userId) => {
    const enrollments = await model.find({ user: userId });
    const courseIds = enrollments.map((e) => e.course);
    return courseModel.find({ _id: { $in: courseIds } });
};

export const findEnrollmentsForCourse = (courseId) => model.find({ course: courseId });
