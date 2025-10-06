// Kambaz/Pazza/dao.js
// ❗️NOTE: from Kambaz/Pazza/* to Kambaz/Database/* is ONE directory up.
import { pazzaSeedData } from "../Database/pazza.js";
import { Folder, Post } from "./models.js";

/** -------------- Seed once -------------- */
export async function seedIfNeeded() {
    // Folders
    const folderCount = await Folder.countDocuments();
    if (folderCount === 0) {
        await Folder.insertMany(pazzaSeedData.folders);
    }

    // Posts + nested content
    const postCount = await Post.countDocuments();
    if (postCount === 0) {
        const processed = pazzaSeedData.posts.map((p) => {
            const post = { ...p };

            const answers = pazzaSeedData.answers.filter((a) => a.postId === p._id);
            post.studentAnswers = answers
                .filter((a) => a.authorRole === "STUDENT")
                .map((a) => ({
                    _id: a._id,
                    author: a.author,
                    authorRole: a.authorRole,
                    authorName: a.authorName,
                    content: a.content,
                    timestamp: new Date(a.createdAt),
                    isGoodAnswer: !!a.isGoodAnswer,
                }));

            post.instructorAnswers = answers
                .filter((a) => ["FACULTY", "TA", "INSTRUCTOR"].includes(a.authorRole))
                .map((a) => ({
                    _id: a._id,
                    author: a.author,
                    authorRole: a.authorRole,
                    authorName: a.authorName,
                    content: a.content,
                    timestamp: new Date(a.createdAt),
                    isGoodAnswer: !!a.isGoodAnswer,
                }));

            const followups = pazzaSeedData.followups
                .filter((f) => f.postId === p._id && !f.parentId)
                .map((f) => {
                    const replies = pazzaSeedData.followups
                        .filter((r) => r.parentId === f._id)
                        .map((r) => ({
                            _id: r._id,
                            author: r.author,
                            authorRole: r.authorRole,
                            authorName: r.authorName,
                            content: r.content,
                            timestamp: new Date(r.createdAt),
                        }));
                    return {
                        _id: f._id,
                        author: f.author,
                        authorRole: f.authorRole,
                        authorName: f.authorName,
                        content: f.content,
                        isResolved: !!f.isResolved,
                        timestamp: new Date(f.createdAt),
                        replies,
                    };
                });

            post.followups = followups;
            post.hasInstructorAnswer = post.instructorAnswers.length > 0;
            post.hasStudentAnswer = post.studentAnswers.length > 0;
            return post;
        });

        await Post.insertMany(processed);
    }
}

/** -------------- Helpers -------------- */
const visibleOr = (userId) =>
    userId
    ? [
            { postTo: "entire_class" },
            { postTo: "individual", visibleTo: userId },
            { author: userId },
        ]
    : [{ postTo: "entire_class" }];

/** Folders */
export const listFolders = (courseId) =>
    Folder.find({ course: courseId }).sort({ order: 1 });

export const createFolder = (courseId, name) =>
    new Folder({
                   _id: `${courseId}-${name.toLowerCase().replace(/\s+/g, "-")}`,
                   name,
                   course: courseId,
                   isDefault: false,
                   order: 100,
               }).save();

export const renameFolder = (folderId, name) =>
    Folder.findByIdAndUpdate(folderId, { name }, { new: true });

export async function removeFolder(folderId) {
    const f = await Folder.findById(folderId);
    if (!f) return null;
    if (f.isDefault) throw new Error("Cannot delete default folder");
    await Folder.findByIdAndDelete(folderId);
    return { ok: true };
}

/** Posts */
export function listPosts(courseId, { folder, search, userId }) {
    const q = { course: courseId, $and: [{ $or: visibleOr(userId) }] };
    if (folder) q.folders = folder;
    if (search) {
        q.$or = [
            { summary: { $regex: search, $options: "i" } },
            { details: { $regex: search, $options: "i" } },
        ];
    }
    return Post.find(q).sort({ createdAt: -1 });
}

export function getPost(postId) {
    return Post.findById(postId);
}

export function savePost(courseId, payload, sessionUser) {
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
