// Kambaz/Pazza/dao.js
import { Folder, Post } from "./models.js";
import { pazzaSeedData } from "../Database/pazza.js";

// Remove initialization from DAO - let routes handle it
export const listFolders = async (courseId) => {
    return Folder.find({ course: courseId }).sort({ order: 1 });
};

export const createFolder = async (courseId, name) => {
    return new Folder({
                          _id: `${courseId}-${name.toLowerCase().replace(/\s+/g, "-")}`,
                          name,
                          course: courseId,
                          isDefault: false,
                          order: 100,
                      }).save();
};

export const renameFolder = async (folderId, name) => {
    return Folder.findByIdAndUpdate(folderId, { name }, { new: true });
};

export async function removeFolder(folderId) {
    const f = await Folder.findById(folderId);
    if (!f) return null;
    if (f.isDefault) throw new Error("Cannot delete default folder");
    await Folder.findByIdAndDelete(folderId);
    return { ok: true };
}

export async function listPosts(courseId, { folder, search, userId }) {
    const visibleOr = userId
                      ? [
            { postTo: "entire_class" },
            { postTo: "individual", visibleTo: userId },
            { author: userId },
        ]
                      : [{ postTo: "entire_class" }];

    const q = { course: courseId, $and: [{ $or: visibleOr }] };
    if (folder) q.folders = folder;
    if (search) {
        q.$or = [
            { summary: { $regex: search, $options: "i" } },
            { details: { $regex: search, $options: "i" } },
        ];
    }
    return Post.find(q).sort({ createdAt: -1 });
}

export async function getPost(postId) {
    return Post.findById(postId);
}

export async function savePost(courseId, payload, sessionUser) {
    const { type, postTo, visibleTo, folders, summary, details, title } = payload;
    return new Post({
                        _id: `${courseId}-post-${Date.now()}`,
                        course: courseId,
                        type,
                        postTo,
                        visibleTo: postTo === "individual" ? visibleTo || [] : [],
                        folders,
                        summary: summary || title,
                        details,
                        author: sessionUser?._id || "current-user",
                        authorRole: sessionUser?.role || "STUDENT",
                        authorName: sessionUser
                                    ? `${sessionUser.firstName} ${sessionUser.lastName}`
                                    : "Anonymous",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        views: 0,
                        studentAnswers: [],
                        instructorAnswers: [],
                        followups: [],
                    }).save();
}

export async function computeStats(courseId) {
    const posts = await Post.find({ course: courseId });
    return {
        totalPosts: posts.length,
        unreadPosts: 0,
        unansweredQuestions: posts.filter(
            (p) =>
                p.type === "question" &&
                p.studentAnswers.length === 0 &&
                p.instructorAnswers.length === 0
        ).length,
        unansweredFollowups: posts.reduce(
            (acc, p) => acc + p.followups.filter((f) => !f.isResolved).length,
            0
        ),
        instructorResponses: posts.reduce(
            (acc, p) => acc + p.instructorAnswers.length,
            0
        ),
        studentResponses: posts.reduce(
            (acc, p) => acc + p.studentAnswers.length,
            0
        ),
        totalContributions: posts.reduce(
            (acc, p) =>
                acc + p.studentAnswers.length + p.instructorAnswers.length + p.followups.length,
            0
        ),
    };
}