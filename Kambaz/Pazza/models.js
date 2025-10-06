// Kambaz/Pazza/models.js
import mongoose from "mongoose";

/** Folders */
const folderSchema = new mongoose.Schema({
                                             _id: String,
                                             name: String,
                                             course: String,
                                             isDefault: Boolean,
                                             order: Number,
                                             createdAt: { type: Date, default: Date.now },
                                         });

/** Posts */
const answerSub = new mongoose.Schema(
    {
        _id: String,
        author: String,
        authorRole: String,
        authorName: String,
        content: String,
        timestamp: Date,
        isGoodAnswer: Boolean,
    },
    { _id: false }
);

const replySub = new mongoose.Schema(
    {
        _id: String,
        author: String,
        authorRole: String,
        authorName: String,
        content: String,
        timestamp: Date,
    },
    { _id: false }
);

const followupSub = new mongoose.Schema(
    {
        _id: String,
        author: String,
        authorRole: String,
        authorName: String,
        content: String,
        isResolved: Boolean,
        timestamp: Date,
        replies: [replySub],
    },
    { _id: false }
);

const postSchema = new mongoose.Schema({
                                           _id: String,
                                           course: String,
                                           type: { type: String, enum: ["question", "note"] },
                                           postTo: { type: String, enum: ["entire_class", "individual"] },
                                           visibleTo: [String],
                                           folders: [String],
                                           summary: String,
                                           details: String,
                                           author: String,
                                           authorRole: String,
                                           authorName: String,
                                           createdAt: Date,
                                           updatedAt: Date,
                                           views: { type: Number, default: 0 },
                                           hasInstructorAnswer: { type: Boolean, default: false },
                                           hasStudentAnswer: { type: Boolean, default: false },
                                           isPinned: { type: Boolean, default: false },
                                           isInstructorEndorsed: { type: Boolean, default: false },
                                           studentAnswers: [answerSub],
                                           instructorAnswers: [answerSub],
                                           followups: [followupSub],
                                       });

export const Folder = mongoose.model("PazzaFolder", folderSchema);
export const Post = mongoose.model("PazzaPost", postSchema);
