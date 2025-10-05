// Kambaz/Server/Routes/pazzaRoutes.js

import express from 'express';
import mongoose from 'mongoose';
import { pazzaSeedData } from '../../Database/pazza.js';

const router = express.Router();

// Define Mongoose models
const folderSchema = new mongoose.Schema({
                                             _id: String,
                                             name: String,
                                             course: String,
                                             isDefault: Boolean,
                                             createdAt: Date
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
                                           author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                                           createdAt: Date,
                                           updatedAt: Date,
                                           views: { type: Number, default: 0 },
                                           studentAnswers: [{
                                               _id: String,
                                               author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                                               content: String,
                                               timestamp: Date,
                                               isInstructorAnswer: Boolean
                                           }],
                                           instructorAnswers: [{
                                               _id: String,
                                               author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                                               content: String,
                                               timestamp: Date,
                                               isInstructorAnswer: Boolean
                                           }],
                                           followups: [{
                                               _id: String,
                                               author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                                               content: String,
                                               isResolved: Boolean,
                                               timestamp: Date,
                                               replies: [{
                                                   _id: String,
                                                   author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                                                   content: String,
                                                   timestamp: Date
                                               }]
                                           }]
                                       });

const Folder = mongoose.model('PazzaFolder', folderSchema);
const Post = mongoose.model('PazzaPost', postSchema);

// Initialize database with seed data
async function initializeDatabase() {
    try {
        // Check if data already exists
        const existingPosts = await Post.countDocuments();
        if (existingPosts === 0) {
            console.log('Initializing Pazza with seed data...');

            // Insert folders
            await Folder.insertMany(pazzaSeedData.folders);

            // Insert posts
            await Post.insertMany(pazzaSeedData.posts);

            console.log('Pazza seed data initialized successfully');
        }
    } catch (error) {
        console.error('Error initializing Pazza data:', error);
    }
}

// Call initialization when server starts
initializeDatabase();

// Initialize Pazza for a course (if needed)
router.post('/courses/:courseId/pazza/init', async (req, res) => {
    try {
        const { courseId } = req.params;

        // Check if folders exist for this course
        const existingFolders = await Folder.find({ course: courseId });

        if (existingFolders.length === 0) {
            // Create default folders for this course
            const defaultFolders = pazzaSeedData.folders
                .filter(f => f.course === courseId);

            if (defaultFolders.length > 0) {
                await Folder.insertMany(defaultFolders);
            }
        }

        res.json({ message: 'Pazza initialized for course' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get folders for a course
router.get('/courses/:courseId/pazza/folders', async (req, res) => {
    try {
        const { courseId } = req.params;
        const folders = await Folder.find({ course: courseId });
        res.json(folders);
    } catch (error) {
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
                                         createdAt: new Date()
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

// Get posts for a course
router.get('/courses/:courseId/pazza/posts', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { folder, search } = req.query;
        const userId = req.session?.userId || req.user?._id;

        let query = { course: courseId };

        // Filter by folder if specified
        if (folder) {
            const folderDoc = await Folder.findOne({ course: courseId, name: folder });
            if (folderDoc) {
                query.folders = folderDoc._id;
            }
        }

        // Filter by search term
        if (search) {
            query.$or = [
                { summary: { $regex: search, $options: 'i' } },
                { details: { $regex: search, $options: 'i' } }
            ];
        }

        const posts = await Post.find(query)
            .populate('author', 'firstName lastName role email')
            .populate('studentAnswers.author', 'firstName lastName role')
            .populate('instructorAnswers.author', 'firstName lastName role')
            .populate('followups.author', 'firstName lastName role')
            .populate('followups.replies.author', 'firstName lastName role')
            .sort({ createdAt: -1 });

        // Filter posts based on visibility
        const visiblePosts = posts.filter(post => {
            if (post.postTo === 'entire_class') return true;
            if (post.author?.toString() === userId?.toString()) return true;
            if (post.postTo === 'individual' && post.visibleTo.includes(userId)) return true;
            return false;
        });

        res.json(visiblePosts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new post
router.post('/courses/:courseId/pazza/posts', async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.session?.userId || req.user?._id;
        const { type, postTo, visibleTo, folders, summary, details, title } = req.body;

        const postId = `${courseId}-post-${Date.now()}`;

        const newPost = new Post({
                                     _id: postId,
                                     course: courseId,
                                     type,
                                     postTo,
                                     visibleTo: visibleTo || [],
                                     folders,
                                     summary: summary || title,
                                     details,
                                     author: userId,
                                     createdAt: new Date(),
                                     updatedAt: new Date(),
                                     views: 0,
                                     studentAnswers: [],
                                     instructorAnswers: [],
                                     followups: []
                                 });

        await newPost.save();

        // Populate author info before sending
        await newPost.populate('author', 'firstName lastName role email');

        res.json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get post details with answers and followups
router.get('/courses/:courseId/pazza/posts/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId)
            .populate('author', 'firstName lastName role email')
            .populate('studentAnswers.author', 'firstName lastName role')
            .populate('instructorAnswers.author', 'firstName lastName role')
            .populate('followups.author', 'firstName lastName role')
            .populate('followups.replies.author', 'firstName lastName role');

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Increment view count
        post.views = (post.views || 0) + 1;
        await post.save();

        // Format response with separated answers and followups
        const answers = [
            ...post.studentAnswers.map(a => ({
                ...a.toObject(),
                authorRole: 'STUDENT',
                authorName: a.author ? `${a.author.firstName} ${a.author.lastName}` : 'Unknown',
                authorId: a.author?._id,
                createdAt: a.timestamp
            })),
            ...post.instructorAnswers.map(a => ({
                ...a.toObject(),
                authorRole: a.author?.role || 'FACULTY',
                authorName: a.author ? `${a.author.firstName} ${a.author.lastName}` : 'Instructor',
                authorId: a.author?._id,
                createdAt: a.timestamp,
                isInstructorAnswer: true
            }))
        ];

        // Format followups with nested structure
        const followups = post.followups.map(f => ({
            _id: f._id,
            content: f.content,
            isResolved: f.isResolved,
            authorName: f.author ? `${f.author.firstName} ${f.author.lastName}` : 'Unknown',
            authorId: f.author?._id,
            authorRole: f.author?.role,
            createdAt: f.timestamp,
            updatedAt: f.timestamp,
            parentId: null,
            replies: f.replies.map(r => ({
                _id: r._id,
                content: r.content,
                authorName: r.author ? `${r.author.firstName} ${r.author.lastName}` : 'Unknown',
                authorId: r.author?._id,
                authorRole: r.author?.role,
                createdAt: r.timestamp,
                parentId: f._id
            }))
        }));

        // Flatten replies into main followups array for frontend
        const allFollowups = [];
        followups.forEach(f => {
            allFollowups.push({
                                  ...f,
                                  replies: undefined
                              });
            if (f.replies) {
                allFollowups.push(...f.replies);
            }
        });

        res.json({
                     post: {
                         ...post.toObject(),
                         hasInstructorAnswer: post.instructorAnswers.length > 0,
                         hasStudentAnswer: post.studentAnswers.length > 0
                     },
                     answers,
                     followups: allFollowups
                 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update post
router.put('/courses/:courseId/pazza/posts/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const { title, details } = req.body;

        const post = await Post.findByIdAndUpdate(
            postId,
            {
                summary: title,
                details,
                updatedAt: new Date()
            },
            { new: true }
        ).populate('author', 'firstName lastName role email');

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete post
router.delete('/courses/:courseId/pazza/posts/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        await Post.findByIdAndDelete(postId);
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create answer
router.post('/courses/:courseId/pazza/posts/:postId/answers', async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.session?.userId || req.user?._id;
        const user = req.user || { role: 'STUDENT', firstName: 'Test', lastName: 'User' };

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const answer = {
            _id: `${postId}-answer-${Date.now()}`,
            author: userId,
            content,
            timestamp: new Date(),
            isInstructorAnswer: ['FACULTY', 'TA'].includes(user.role)
        };

        // Add to appropriate array based on role
        if (['FACULTY', 'TA'].includes(user.role)) {
            post.instructorAnswers.push(answer);
        } else {
            post.studentAnswers.push(answer);
        }

        await post.save();

        // Return formatted answer
        res.json({
                     ...answer,
                     authorRole: user.role,
                     authorName: `${user.firstName} ${user.lastName}`,
                     authorId: userId,
                     createdAt: answer.timestamp
                 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update answer
router.put('/courses/:courseId/pazza/answers/:answerId', async (req, res) => {
    try {
        const { answerId } = req.params;
        const { content } = req.body;

        // Find post containing this answer
        const post = await Post.findOne({
                                            $or: [
                                                { 'studentAnswers._id': answerId },
                                                { 'instructorAnswers._id': answerId }
                                            ]
                                        });

        if (!post) {
            return res.status(404).json({ error: 'Answer not found' });
        }

        // Update the answer
        let answer;
        const studentAnswer = post.studentAnswers.find(a => a._id === answerId);
        if (studentAnswer) {
            studentAnswer.content = content;
            answer = studentAnswer;
        } else {
            const instructorAnswer = post.instructorAnswers.find(a => a._id === answerId);
            if (instructorAnswer) {
                instructorAnswer.content = content;
                answer = instructorAnswer;
            }
        }

        await post.save();
        res.json(answer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete answer
router.delete('/courses/:courseId/pazza/answers/:answerId', async (req, res) => {
    try {
        const { answerId } = req.params;

        // Find and update post
        const post = await Post.findOne({
                                            $or: [
                                                { 'studentAnswers._id': answerId },
                                                { 'instructorAnswers._id': answerId }
                                            ]
                                        });

        if (post) {
            post.studentAnswers = post.studentAnswers.filter(a => a._id !== answerId);
            post.instructorAnswers = post.instructorAnswers.filter(a => a._id !== answerId);
            await post.save();
        }

        res.json({ message: 'Answer deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create followup
router.post('/courses/:courseId/pazza/posts/:postId/followups', async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, parentId } = req.body;
        const userId = req.session?.userId || req.user?._id;
        const user = req.user || { firstName: 'Test', lastName: 'User', role: 'STUDENT' };

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const followupData = {
            _id: `${postId}-followup-${Date.now()}`,
            author: userId,
            content,
            timestamp: new Date()
        };

        if (parentId) {
            // This is a reply to an existing followup
            const parentFollowup = post.followups.find(f => f._id === parentId);
            if (parentFollowup) {
                parentFollowup.replies = parentFollowup.replies || [];
                parentFollowup.replies.push(followupData);
            }
        } else {
            // This is a new root followup
            post.followups.push({
                                    ...followupData,
                                    isResolved: false,
                                    replies: []
                                });
        }

        await post.save();

        res.json({
                     ...followupData,
                     authorName: `${user.firstName} ${user.lastName}`,
                     authorRole: user.role,
                     authorId: userId,
                     createdAt: followupData.timestamp,
                     updatedAt: followupData.timestamp,
                     parentId: parentId || null,
                     isResolved: false
                 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Toggle followup resolved status
router.put('/courses/:courseId/pazza/followups/:followupId/resolve', async (req, res) => {
    try {
        const { followupId } = req.params;

        const post = await Post.findOne({ 'followups._id': followupId });
        if (!post) {
            return res.status(404).json({ error: 'Followup not found' });
        }

        const followup = post.followups.find(f => f._id === followupId);
        if (followup) {
            followup.isResolved = !followup.isResolved;
            await post.save();

            res.json({
                         ...followup.toObject(),
                         updatedAt: new Date()
                     });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get statistics for a course
router.get('/courses/:courseId/pazza/stats', async (req, res) => {
    try {
        const { courseId } = req.params;

        const posts = await Post.find({ course: courseId });

        const stats = {
            totalPosts: posts.length,
            unreadPosts: 0, // Would need to track per user
            unansweredQuestions: posts.filter(p =>
                                                  p.type === 'question' &&
                                                  p.studentAnswers.length === 0 &&
                                                  p.instructorAnswers.length === 0
            ).length,
            unansweredFollowups: posts.reduce((count, p) =>
                                                  count + p.followups.filter(f => !f.isResolved).length, 0
            ),
            instructorResponses: posts.reduce((count, p) =>
                                                  count + p.instructorAnswers.length, 0
            ),
            studentResponses: posts.reduce((count, p) =>
                                               count + p.studentAnswers.length, 0
            ),
            totalContributions: posts.reduce((count, p) =>
                                                 count + p.studentAnswers.length + p.instructorAnswers.length + p.followups.length, 0
            )
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;