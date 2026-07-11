import model from "./model.js";
import commentModel from "../Comments/model.js";
import { v4 as uuidv4 } from "uuid";

export const findPostsForCourse = (courseId) => model.find({ course: courseId });
export const findPostById = (postId) => model.findById(postId);
export const createPost = (courseId, post) =>
    model.create({
        ...post,
        _id: uuidv4(),
        course: courseId,
        viewers: post.viewers || [],
        createdAt: new Date().toISOString(),
    });
export const updatePost = async (postId, updates) => {
    const { _id, ...rest } = updates;
    await model.updateOne({ _id: postId }, { $set: rest });
    return model.findById(postId);
};
// Deleting a post also removes its comments (answers, discussions, replies).
export const deletePost = async (postId) => {
    await commentModel.deleteMany({ post: postId });
    return model.deleteOne({ _id: postId });
};
