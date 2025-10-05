// Kambaz/Pazza/dao.js
import mongoose from "mongoose";
import pazzaSchemas, { pazzaSeedData } from "../Database/pazza.js";
import { v4 as uuidv4 } from "uuid";

const PostModel = mongoose.model("pazzaPosts", pazzaSchemas.posts);
const FolderModel = mongoose.model("pazzaFolders", pazzaSchemas.folders);

// Initialize default folders for a course
export const initializeCourseData = async (courseId) => {
    const existingFolders = await FolderModel.find({ course: courseId });
    if (existingFolders.length === 0) {
        const defaultFolders = pazzaSeedData.folders.filter(f => f.course === courseId);
        await FolderModel.insertMany(defaultFolders);
    }
};

// Folder operations
export const getFoldersByCourse = async (courseId) => {
    await initializeCourseData(courseId);
    return await FolderModel.find({ course: courseId }).sort({ name: 1 });
};

export const createFolder = async (courseId, folderData) => {
    const folder = {
        _id: `${courseId}-${folderData.name.replace(/\s+/g, '_').toLowerCase()}`,
        name: folderData.name,
        course: courseId,
        isDefault: false,
        createdAt: new Date()
    };
    return await FolderModel.create(folder);
};

export const updateFolder = async (folderId, updates) => {
    return await FolderModel.findByIdAndUpdate(
        folderId,
        { name: updates.name },
        { new: true }
    );
};

export const deleteFolder = async (folderId) => {
    // Remove folder from all posts first
    await PostModel.updateMany(
        { folders: folderId },
        { $pull: { folders: folderId } }
    );
    return await FolderModel.findByIdAndDelete(folderId);
};

export const deleteFolders = async (folderIds) => {
    // Remove folders from all posts first
    await PostModel.updateMany(
        { folders: { $in: folderIds } },
        { $pull: { folders: { $in: folderIds } } }
    );
    return await FolderModel.deleteMany({ _id: { $in: folderIds } });
};

// Post operations
export const getPostsByCourse = async (courseId, userId, userRole) => {
    const query = { course: courseId };

    // Students can only see posts visible to entire class or specifically to them
    if (userRole === 'STUDENT') {
        query.$or = [
            { postTo: "entire_class" },
            { visibleTo: userId }
        ];
    }

    return await PostModel.find(query)
        .populate('author', 'username firstName lastName role')
        .populate('studentAnswers.author', 'username firstName lastName role')
        .populate('instructorAnswers.author', 'username firstName lastName role')
        .populate('followups.author', 'username firstName lastName role')
        .populate('followups.replies.author', 'username firstName lastName role')
        .sort({ createdAt: -1 });
};

export const getPostsByCourseAndFolder = async (courseId, folderId, userId, userRole) => {
    const query = {
        course: courseId,
        folders: folderId
    };

    if (userRole === 'STUDENT') {
        query.$or = [
            { postTo: "entire_class" },
            { visibleTo: userId }
        ];
    }

    return await PostModel.find(query)
        .populate('author', 'username firstName lastName role')
        .populate('studentAnswers.author', 'username firstName lastName role')
        .populate('instructorAnswers.author', 'username firstName lastName role')
        .populate('followups.author', 'username firstName lastName role')
        .populate('followups.replies.author', 'username firstName lastName role')
        .sort({ createdAt: -1 });
};

export const getPostById = async (postId) => {
    const post = await PostModel.findById(postId)
        .populate('author', 'username firstName lastName role')
        .populate('studentAnswers.author', 'username firstName lastName role')
        .populate('instructorAnswers.author', 'username firstName lastName role')
        .populate('followups.author', 'username firstName lastName role')
        .populate('followups.replies.author', 'username firstName lastName role');

    // Increment view count
    if (post) {
        post.views = (post.views || 0) + 1;
        await post.save();
    }

    return post;
};

export const createPost = async (courseId, postData, userId) => {
    const post = {
        _id: uuidv4(),
        course: courseId,
        type: postData.type || "question",
        postTo: postData.postTo || "entire_class",
        visibleTo: postData.visibleTo || [],
        folders: postData.folders || [],
        summary: postData.summary,
        details: postData.details,
        author: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        studentAnswers: [],
        instructorAnswers: [],
        followups: []
    };

    const created = await PostModel.create(post);
    return await getPostById(created._id);
};

export const updatePost = async (postId, updates) => {
    updates.updatedAt = new Date();
    return await PostModel.findByIdAndUpdate(
        postId,
        updates,
        { new: true }
    ).populate('author', 'username firstName lastName role');
};

export const deletePost = async (postId) => {
    return await PostModel.findByIdAndDelete(postId);
};

export const searchPosts = async (courseId, searchTerm, userId, userRole) => {
    const query = {
        course: courseId,
        $or: [
            { summary: { $regex: searchTerm, $options: 'i' } },
            { details: { $regex: searchTerm, $options: 'i' } }
        ]
    };

    if (userRole === 'STUDENT') {
        query.$and = [
            {
                $or: [
                    { postTo: "entire_class" },
                    { visibleTo: userId }
                ]
            }
        ];
    }

    return await PostModel.find(query)
        .populate('author', 'username firstName lastName role')
        .sort({ createdAt: -1 });
};

// Answer operations
export const addAnswer = async (postId, answerData, userId, userRole) => {
    const answer = {
        _id: uuidv4(),
        author: userId,
        content: answerData.content,
        timestamp: new Date(),
        isInstructorAnswer: userRole === 'FACULTY' || userRole === 'TA'
    };

    const updateField = answer.isInstructorAnswer ? 'instructorAnswers' : 'studentAnswers';

    return await PostModel.findByIdAndUpdate(
        postId,
        {
            $push: { [updateField]: answer },
            updatedAt: new Date()
        },
        { new: true }
    ).populate('author', 'username firstName lastName role')
        .populate('studentAnswers.author', 'username firstName lastName role')
        .populate('instructorAnswers.author', 'username firstName lastName role');
};

export const updateAnswer = async (postId, answerId, content, isInstructorAnswer) => {
    const field = isInstructorAnswer ? 'instructorAnswers' : 'studentAnswers';
    const arrayFilter = isInstructorAnswer ? 'instructorAnswer' : 'studentAnswer';

    return await PostModel.findOneAndUpdate(
        { _id: postId },
        {
            $set: {
                [`${field}.$[${arrayFilter}].content`]: content,
                updatedAt: new Date()
            }
        },
        {
            arrayFilters: [{ [`${arrayFilter}._id`]: answerId }],
            new: true
        }
    ).populate('author', 'username firstName lastName role')
        .populate('studentAnswers.author', 'username firstName lastName role')
        .populate('instructorAnswers.author', 'username firstName lastName role');
};

export const deleteAnswer = async (postId, answerId, isInstructorAnswer) => {
    const field = isInstructorAnswer ? 'instructorAnswers' : 'studentAnswers';

    return await PostModel.findByIdAndUpdate(
        postId,
        {
            $pull: { [field]: { _id: answerId } },
            updatedAt: new Date()
        },
        { new: true }
    ).populate('author', 'username firstName lastName role')
        .populate('studentAnswers.author', 'username firstName lastName role')
        .populate('instructorAnswers.author', 'username firstName lastName role');
};

// Followup operations
export const addFollowup = async (postId, followupData, userId) => {
    const followup = {
        _id: uuidv4(),
        author: userId,
        content: followupData.content,
        isResolved: false,
        timestamp: new Date(),
        replies: []
    };

    return await PostModel.findByIdAndUpdate(
        postId,
        {
            $push: { followups: followup },
            updatedAt: new Date()
        },
        { new: true }
    ).populate('followups.author', 'username firstName lastName role');
};

export const updateFollowupStatus = async (postId, followupId, isResolved) => {
    return await PostModel.findOneAndUpdate(
        { _id: postId },
        {
            $set: {
                'followups.$[followup].isResolved': isResolved,
                updatedAt: new Date()
            }
        },
        {
            arrayFilters: [{ 'followup._id': followupId }],
            new: true
        }
    ).populate('followups.author', 'username firstName lastName role');
};

export const deleteFollowup = async (postId, followupId) => {
    return await PostModel.findByIdAndUpdate(
        postId,
        {
            $pull: { followups: { _id: followupId } },
            updatedAt: new Date()
        },
        { new: true }
    ).populate('followups.author', 'username firstName lastName role');
};

// Reply operations
export const addReply = async (postId, followupId, replyData, userId) => {
    const reply = {
        _id: uuidv4(),
        author: userId,
        content: replyData.content,
        timestamp: new Date()
    };

    return await PostModel.findOneAndUpdate(
        { _id: postId },
        {
            $push: { 'followups.$[followup].replies': reply },
            updatedAt: new Date()
        },
        {
            arrayFilters: [{ 'followup._id': followupId }],
            new: true
        }
    ).populate('followups.author', 'username firstName lastName role')
        .populate('followups.replies.author', 'username firstName lastName role');
};

export const deleteReply = async (postId, followupId, replyId) => {
    return await PostModel.findOneAndUpdate(
        { _id: postId },
        {
            $pull: { 'followups.$[followup].replies': { _id: replyId } },
            updatedAt: new Date()
        },
        {
            arrayFilters: [{ 'followup._id': followupId }],
            new: true
        }
    ).populate('followups.author', 'username firstName lastName role')
        .populate('followups.replies.author', 'username firstName lastName role');
};

// Statistics
export const getCourseStatistics = async (courseId) => {
    const posts = await PostModel.find({ course: courseId });

    const unreadPosts = 0; // Would need user-specific tracking
    const unansweredQuestions = posts.filter(p =>
                                                 p.type === 'question' &&
                                                 p.studentAnswers.length === 0 &&
                                                 p.instructorAnswers.length === 0
    ).length;

    const unansweredFollowups = posts.reduce((count, post) => {
        return count + post.followups.filter(f => !f.isResolved).length;
    }, 0);

    const totalPosts = posts.length;
    const instructorResponses = posts.reduce((count, post) => {
        return count + post.instructorAnswers.length;
    }, 0);

    const studentResponses = posts.reduce((count, post) => {
        return count + post.studentAnswers.length;
    }, 0);

    const totalContributions = posts.reduce((count, post) => {
        return count + 1 + // the post itself
               post.studentAnswers.length +
               post.instructorAnswers.length +
               post.followups.length +
               post.followups.reduce((fc, f) => fc + f.replies.length, 0);
    }, 0);

    return {
        unreadPosts,
        unansweredQuestions,
        unansweredFollowups,
        totalPosts,
        instructorResponses,
        studentResponses,
        totalContributions
    };
};