import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const findCommentsForPost = (postId) => model.find({ post: postId });
export const findCommentsForCourse = (courseId) => model.find({ course: courseId });
export const createComment = (postId, comment) =>
    model.create({
        ...comment,
        _id: uuidv4(),
        post: postId,
        resolved: comment.resolved || false,
        createdAt: new Date().toISOString(),
    });
export const updateComment = async (commentId, updates) => {
    const { _id, ...rest } = updates;
    await model.updateOne({ _id: commentId }, { $set: rest });
    return model.findById(commentId);
};
// Deleting a comment also removes its direct replies.
export const deleteComment = async (commentId) => {
    await model.deleteMany({ parent: commentId });
    return model.deleteOne({ _id: commentId });
};
