import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

/*
 * Data access functions for the courses collection. Provide CRUD
 * operations implemented in terms of the Mongoose model. All
 * functions return promises to allow the caller to await completion.
 */

export const findAllCourses = () => model.find();

export const findCourseById = (courseId) => model.findById(courseId);

export const createCourse = async (course) => {
  const newCourse = { ...course };
  if (!newCourse._id) newCourse._id = uuidv4();
  const inserted = await model.create(newCourse);
  return inserted;
};

export const updateCourse = (courseId, courseUpdates) =>
  model.updateOne({ _id: courseId }, { $set: courseUpdates });

export const deleteCourse = (courseId) => model.deleteOne({ _id: courseId });