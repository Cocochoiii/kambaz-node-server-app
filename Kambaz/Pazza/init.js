// Kambaz/Pazza/init.js
import mongoose from "mongoose";
import { pazzaSeedData } from "../Database/pazza.js";

const folderSchema = new mongoose.Schema({
                                             _id: String,
                                             name: String,
                                             course: String,
                                             isDefault: Boolean,
                                             order: Number,
                                             createdAt: { type: Date, default: Date.now }
                                         });

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
                                           studentAnswers: [{
                                               _id: String,
                                               author: String,
                                               authorRole: String,
                                               authorName: String,
                                               content: String,
                                               timestamp: Date,
                                               isGoodAnswer: Boolean
                                           }],
                                           instructorAnswers: [{
                                               _id: String,
                                               author: String,
                                               authorRole: String,
                                               authorName: String,
                                               content: String,
                                               timestamp: Date,
                                               isGoodAnswer: Boolean
                                           }],
                                           followups: [{
                                               _id: String,
                                               author: String,
                                               authorRole: String,
                                               authorName: String,
                                               content: String,
                                               isResolved: Boolean,
                                               timestamp: Date,
                                               replies: [{
                                                   _id: String,
                                                   author: String,
                                                   authorRole: String,
                                                   authorName: String,
                                                   content: String,
                                                   timestamp: Date
                                               }]
                                           }]
                                       });

const PazzaFolder = mongoose.models.PazzaFolder || mongoose.model('PazzaFolder', folderSchema);
const PazzaPost = mongoose.models.PazzaPost || mongoose.model('PazzaPost', postSchema);

export async function initializePazzaData() {
    try {
        // Check if we already have data
        const existingFolders = await PazzaFolder.countDocuments();
        if (existingFolders === 0) {
            console.log('Inserting Pazza folders...');
            await PazzaFolder.insertMany(pazzaSeedData.folders);
            console.log(`✅ Inserted ${pazzaSeedData.folders.length} folders`);
        }

        const existingPosts = await PazzaPost.countDocuments();
        if (existingPosts === 0) {
            console.log('Inserting Pazza posts...');

            const processedPosts = pazzaSeedData.posts.map(post => {
                const postCopy = { ...post };

                const postAnswers = pazzaSeedData.answers.filter(a => a.postId === post._id);
                postCopy.studentAnswers = postAnswers
                    .filter(a => a.authorRole === 'STUDENT')
                    .map(a => ({
                        _id: a._id,
                        author: a.author,
                        authorRole: a.authorRole,
                        authorName: a.authorName,
                        content: a.content,
                        timestamp: new Date(a.createdAt),
                        isGoodAnswer: a.isGoodAnswer
                    }));

                postCopy.instructorAnswers = postAnswers
                    .filter(a => ['FACULTY', 'TA', 'INSTRUCTOR'].includes(a.authorRole))
                    .map(a => ({
                        _id: a._id,
                        author: a.author,
                        authorRole: a.authorRole,
                        authorName: a.authorName,
                        content: a.content,
                        timestamp: new Date(a.createdAt),
                        isGoodAnswer: a.isGoodAnswer
                    }));

                const postFollowups = pazzaSeedData.followups
                    .filter(f => f.postId === post._id && !f.parentId)
                    .map(f => {
                        const replies = pazzaSeedData.followups
                            .filter(r => r.parentId === f._id)
                            .map(r => ({
                                _id: r._id,
                                author: r.author,
                                authorRole: r.authorRole,
                                authorName: r.authorName,
                                content: r.content,
                                timestamp: new Date(r.createdAt)
                            }));

                        return {
                            _id: f._id,
                            author: f.author,
                            authorRole: f.authorRole,
                            authorName: f.authorName,
                            content: f.content,
                            isResolved: f.isResolved,
                            timestamp: new Date(f.createdAt),
                            replies
                        };
                    });

                postCopy.followups = postFollowups;
                postCopy.hasInstructorAnswer = postCopy.instructorAnswers.length > 0;
                postCopy.hasStudentAnswer = postCopy.studentAnswers.length > 0;

                return postCopy;
            });

            await PazzaPost.insertMany(processedPosts);
            console.log(`✅ Inserted ${processedPosts.length} posts with answers and followups`);
        }
    } catch (error) {
        console.error('Error initializing Pazza data:', error);
        throw error;
    }
}