import express from 'express';
import mongoose from 'mongoose';
import { pazzaSeedData } from '../../Database/pazza.js';

const router = express.Router();

// Define Mongoose schemas
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
                                           author: String,  // String to match seed data
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

const Folder = mongoose.model('PazzaFolder', folderSchema);
const Post = mongoose.model('PazzaPost', postSchema);

// Initialize database with seed data (IDEMPOTENT)
async function initializeDatabase() {
    try {
        console.log('Checking Pazza initialization...');

        /** ---------- FOLDERS: upsert by _id ---------- */
        const folderOps = (pazzaSeedData.folders || []).map((f) => ({
            updateOne: {
                filter: { _id: f._id },
                update: { $setOnInsert: f },
                upsert: true
            }
        }));
        if (folderOps.length) {
            await Folder.bulkWrite(folderOps, { ordered: false });
            const count = await Folder.countDocuments();
            console.log(`✅ Folders upserted. Count now: ${count}`);
        }

        /** ---------- POSTS: process answers/followups then upsert by _id ---------- */
        const processedPosts = (pazzaSeedData.posts || []).map((post) => {
            const p = { ...post };

            const postAnswers = (pazzaSeedData.answers || []).filter(a => a.postId === post._id);

            p.studentAnswers = postAnswers
                .filter(a => a.authorRole === 'STUDENT')
                .map(a => ({
                    _id: a._id,
                    author: a.author,
                    authorRole: a.authorRole,
                    authorName: a.authorName,
                    content: a.content,
                    timestamp: new Date(a.createdAt)
                }));

            p.instructorAnswers = postAnswers
                .filter(a => ['FACULTY', 'TA', 'INSTRUCTOR'].includes(a.authorRole))
                .map(a => ({
                    _id: a._id,
                    author: a.author,
                    authorRole: a.authorRole,
                    authorName: a.authorName,
                    content: a.content,
                    timestamp: new Date(a.createdAt)
                }));

            const postFollowups = (pazzaSeedData.followups || [])
                .filter(f => f.postId === post._id && !f.parentId)
                .map(f => {
                    const replies = (pazzaSeedData.followups || [])
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

            p.followups = postFollowups;
            p.hasInstructorAnswer = (p.instructorAnswers?.length || 0) > 0;
            p.hasStudentAnswer = (p.studentAnswers?.length || 0) > 0;

            return p;
        });

        const postOps = processedPosts.map((p) => ({
            updateOne: {
                filter: { _id: p._id },
                update: { $setOnInsert: p },
                upsert: true
            }
        }));
        if (postOps.length) {
            await Post.bulkWrite(postOps, { ordered: false });
            const count = await Post.countDocuments();
            console.log(`✅ Posts upserted (with answers/followups). Count now: ${count}`);
        }
    } catch (error) {
        console.error('❌ Error initializing Pazza data:', error);
    }
}

// Initialize on import (keep your pattern)
setTimeout(initializeDatabase, 1000); // Delay to ensure DB connection

// Get folders for a course
router.get('/courses/:courseId/pazza/folders', async (req, res) => {
    try {
        const { courseId } = req.params;
        const folders = await Folder.find({ course: courseId }).sort({ order: 1 });
        res.json(folders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get posts for a course
router.get('/courses/:courseId/pazza/posts', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { folder, search } = req.query;

        const query = { course: courseId };

        if (folder) {
            query.folders = folder; // folder is the folder NAME
        }

        if (search) {
            query.$or = [
                { summary: { $regex: search, $options: 'i' } },
                { details: { $regex: search, $options: 'i' } }
            ];
        }

        const posts = await Post.find(query).sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get post details
router.get('/courses/:courseId/pazza/posts/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Increment view count
        post.views = (post.views || 0) + 1;
        await post.save();

        // Format response
        const answers = [
            ...(post.studentAnswers || []).map(a => ({
                ...a.toObject(),
                createdAt: a.timestamp
            })),
            ...(post.instructorAnswers || []).map(a => ({
                ...a.toObject(),
                createdAt: a.timestamp,
                isInstructorAnswer: true
            }))
        ];

        // Flatten followups
        const allFollowups = [];
        (post.followups || []).forEach(f => {
            allFollowups.push({
                                  _id: f._id,
                                  content: f.content,
                                  isResolved: f.isResolved,
                                  authorName: f.authorName,
                                  authorRole: f.authorRole,
                                  createdAt: f.timestamp,
                                  updatedAt: f.timestamp,
                                  parentId: null
                              });
            (f.replies || []).forEach(r => {
                allFollowups.push({
                                      _id: r._id,
                                      content: r.content,
                                      authorName: r.authorName,
                                      authorRole: r.authorRole,
                                      createdAt: r.timestamp,
                                      parentId: f._id
                                  });
            });
        });

        res.json({
                     post: post.toObject(),
                     answers,
                     followups: allFollowups
                 });
    } catch (error) {
        console.error('Error fetching post details:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create new folder
router.post('/courses/:courseId/pazza/folders', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { name } = req.body;

        const newFolder = new Folder({
                                         _id: `${courseId}-${name.toLowerCase().replace(/\s+/g, '-')}`,
                                         name,
                                         course: courseId,
                                         isDefault: false,
                                         order: 100
                                     });

        await newFolder.save();
        res.json(newFolder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update folder
router.put('/courses/:courseId/pazza/folders/:folderId', async (req, res) => {
    try {
        const { folderId } = req.params;
        const { name } = req.body;

        const folder = await Folder.findByIdAndUpdate(
            folderId,
            { name },
            { new: true }
        );

        res.json(folder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete folder
router.delete('/courses/:courseId/pazza/folders/:folderId', async (req, res) => {
    try {
        const { folderId } = req.params;

        const folder = await Folder.findById(folderId);
        if (folder && !folder.isDefault) {
            await Folder.findByIdAndDelete(folderId);
            res.json({ message: 'Folder deleted' });
        } else {
            res.status(400).json({ error: 'Cannot delete default folder' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new post
router.post('/courses/:courseId/pazza/posts', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { type, postTo, visibleTo, folders, summary, details, title } = req.body;

        const newPost = new Post({
                                     _id: `${courseId}-post-${Date.now()}`,
                                     course: courseId,
                                     type,
                                     postTo,
                                     visibleTo: visibleTo || [],
                                     folders,
                                     summary: summary || title,
                                     details,
                                     author: req.session?.currentUser?._id || "current-user",
                                     authorRole: req.session?.currentUser?.role || "STUDENT",
                                     authorName: req.session?.currentUser
                                                 ? `${req.session.currentUser.firstName} ${req.session.currentUser.lastName}`
                                                 : "Anonymous",
                                     createdAt: new Date(),
                                     updatedAt: new Date(),
                                     views: 0,
                                     studentAnswers: [],
                                     instructorAnswers: [],
                                     followups: []
                                 });

        await newPost.save();
        res.json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get stats
router.get('/courses/:courseId/pazza/stats', async (req, res) => {
    try {
        const { courseId } = req.params;
        const posts = await Post.find({ course: courseId });

        const stats = {
            totalPosts: posts.length,
            unreadPosts: 0,
            unansweredQuestions: posts.filter(p =>
                                                  p.type === 'question' &&
                                                  (p.studentAnswers?.length || 0) === 0 &&
                                                  (p.instructorAnswers?.length || 0) === 0
            ).length,
            unansweredFollowups: posts.reduce((count, p) =>
                                                  count + (p.followups || []).filter(f => !f.isResolved).length, 0
            ),
            instructorResponses: posts.reduce((count, p) =>
                                                  count + (p.instructorAnswers?.length || 0), 0
            ),
            studentResponses: posts.reduce((count, p) =>
                                               count + (p.studentAnswers?.length || 0), 0
            ),
            totalContributions: posts.reduce((count, p) =>
                                                 count + (p.studentAnswers?.length || 0)
                                                 + (p.instructorAnswers?.length || 0)
                                                 + (p.followups?.length || 0), 0
            )
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add remaining CRUD routes for answers, followups, etc...

export default router;
