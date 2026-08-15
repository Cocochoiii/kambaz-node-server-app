import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

// The oldest comment comes first. A thread reads top to bottom.
export function findCommentsForPost(postId) {
    return model.find({ post: postId }).sort({ createdAt: 1 });
}

// The Class at a Glance screen counts every comment of the course.
export function findCommentsForCourse(courseId) {
    return model.find({ course: courseId });
}

export function createComment(postId, comment) {
    const now = new Date().toISOString();
    return model.create({
        ...comment,
        _id: uuidv4(),
        post: postId,
        resolved: comment.resolved === true,
        createdAt: now,
        updatedAt: now,
    });
}

export async function updateComment(commentId, updates) {
    const { _id, __v, post, course, createdAt, ...rest } = updates;
    rest.updatedAt = new Date().toISOString();
    await model.updateOne({ _id: commentId }, { $set: rest });
    return model.findById(commentId);
}

// A reply can hold its own replies, so I walk down the tree.
async function collectDescendants(commentId, found = []) {
    const children = await model.find({ parent: commentId });
    for (const child of children) {
        found.push(child._id);
        await collectDescendants(child._id, found);
    }
    return found;
}

export async function deleteComment(commentId) {
    const ids = await collectDescendants(commentId);
    if (ids.length > 0) {
        await model.deleteMany({ _id: { $in: ids } });
    }
    return model.deleteOne({ _id: commentId });
}

export function deleteCommentsForCourse(courseId) {
    return model.deleteMany({ course: courseId });
}
