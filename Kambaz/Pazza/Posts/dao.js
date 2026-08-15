import model from "./model.js";
import commentModel from "../Comments/model.js";
import { v4 as uuidv4 } from "uuid";

// The newest post comes first. The sidebar wants that order.
export function findPostsForCourse(courseId) {
    return model.find({ course: courseId }).sort({ createdAt: -1 });
}

export function findPostById(postId) {
    return model.findById(postId);
}

export function createPost(courseId, post) {
    const now = new Date().toISOString();
    return model.create({
        ...post,
        _id: uuidv4(),
        course: courseId,
        viewers: [],
        createdAt: now,
        updatedAt: now,
    });
}

// I drop the keys Mongo will not let me change.
export async function updatePost(postId, updates) {
    const { _id, __v, course, createdAt, viewers, ...rest } = updates;
    rest.updatedAt = new Date().toISOString();
    await model.updateOne({ _id: postId }, { $set: rest });
    return model.findById(postId);
}

// One reader counts once. $addToSet keeps the list unique.
export async function addViewer(postId, userId) {
    if (userId) {
        await model.updateOne({ _id: postId }, { $addToSet: { viewers: userId } });
    }
    return model.findById(postId);
}

// The post goes away, so its answers and replies go too.
export async function deletePost(postId) {
    await commentModel.deleteMany({ post: postId });
    return model.deleteOne({ _id: postId });
}

export async function deletePostsForCourse(courseId) {
    await commentModel.deleteMany({ course: courseId });
    return model.deleteMany({ course: courseId });
}
