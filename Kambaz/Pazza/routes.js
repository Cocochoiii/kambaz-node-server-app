// Kambaz/Pazza/routes.js
import express from 'express';
import { Folder, Post } from './models.js';

const router = express.Router();

// ======================= Helper Functions =======================
function buildVisibilityFilter(userId) {
    if (!userId) return [{ postTo: 'entire_class' }];
    return [
        { postTo: 'entire_class' },
        { postTo: 'individual', visibleTo: userId },
        { author: userId }
    ];
}

// ======================= Routes =======================

// Get folders for a course
router.get('/courses/:courseId/pazza/folders', async (req, res) => {
    try {
        const { courseId } = req.params;
        // Ensure courseId is string for consistent querying
        const folders = await Folder.find({ course: String(courseId) }).sort({ order: 1 });
        console.log(`Found ${folders.length} folders for course ${courseId}`);
        res.json(folders);
    } catch (error) {
        console.error('Error fetching folders:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get posts for a course
router.get('/courses/:courseId/pazza/posts', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { folder, search } = req.query;
        const userId = req.session?.currentUser?._id || null;

        // Build query with string courseId
        const query = { course: String(courseId) };

        if (folder) {
            query.folders = folder;
        }

        if (search) {
            query.$or = [
                { summary: { $regex: search, $options: 'i' } },
                { details: { $regex: search, $options: 'i' } }
            ];
        }

        // Add visibility filter
        query.$and = [{ $or: buildVisibilityFilter(userId) }];

        // Debug logging
        console.log(`Fetching posts for course ${courseId}, query:`, JSON.stringify(query));

        const posts = await Post.find(query).sort({ createdAt: -1 });

        console.log(`Found ${posts.length} posts for course ${courseId}`);
        if (posts.length > 0) {
            console.log(`Sample post: ${posts[0].summary}, has ${posts[0].studentAnswers?.length || 0} student answers`);
        }

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
        const userId = req.session?.currentUser?._id || null;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        // Check visibility
        const canSee =
            post.postTo === 'entire_class' ||
            (userId && (post.visibleTo || []).includes(userId)) ||
            (userId && post.author === userId);

        if (!canSee) {
            return res.status(403).json({ error: 'Not authorized to view this post' });
        }

        // Increment views
        post.views = (post.views || 0) + 1;
        await post.save();

        // Format response with answers and followups
        const answers = [
            ...post.studentAnswers.map(a => ({
                ...a.toObject ? a.toObject() : a,
                _id: a._id,
                content: a.content,
                authorName: a.authorName,
                authorRole: a.authorRole || 'STUDENT',
                createdAt: a.timestamp,
                isGoodAnswer: a.isGoodAnswer || false
            })),
            ...post.instructorAnswers.map(a => ({
                ...a.toObject ? a.toObject() : a,
                _id: a._id,
                content: a.content,
                authorName: a.authorName,
                authorRole: a.authorRole || 'INSTRUCTOR',
                createdAt: a.timestamp,
                isGoodAnswer: a.isGoodAnswer || false,
                isInstructorAnswer: true
            }))
        ];

        // Flatten followups with their replies
        const allFollowups = [];
        post.followups.forEach(f => {
            // Add main followup
            allFollowups.push({
                                  _id: f._id,
                                  content: f.content,
                                  isResolved: f.isResolved || false,
                                  authorName: f.authorName,
                                  authorRole: f.authorRole,
                                  createdAt: f.timestamp,
                                  updatedAt: f.timestamp,
                                  parentId: null
                              });

            // Add replies
            if (f.replies && f.replies.length > 0) {
                f.replies.forEach(r => {
                    allFollowups.push({
                                          _id: r._id,
                                          content: r.content,
                                          authorName: r.authorName,
                                          authorRole: r.authorRole,
                                          createdAt: r.timestamp,
                                          parentId: f._id
                                      });
                });
            }
        });

        res.json({
                     post: post.toObject ? post.toObject() : post,
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
                                         _id: `${courseId}-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
                                         name,
                                         course: String(courseId),
                                         isDefault: false,
                                         order: 100
                                     });

        await newFolder.save();
        res.json(newFolder);
    } catch (error) {
        console.error('Error creating folder:', error);
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
        console.error('Error updating folder:', error);
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
        console.error('Error deleting folder:', error);
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
                                     course: String(courseId),
                                     type: type || 'note',
                                     postTo: postTo || 'entire_class',
                                     visibleTo: postTo === 'individual' ? (visibleTo || []) : [],
                                     folders: folders || [],
                                     summary: summary || title || 'New Post',
                                     details: details || '',
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
                                     followups: [],
                                     hasInstructorAnswer: false,
                                     hasStudentAnswer: false,
                                     isPinned: false,
                                     isInstructorEndorsed: false
                                 });

        await newPost.save();
        console.log('Post created successfully:', newPost._id);
        res.json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add answer to post
router.post('/courses/:courseId/pazza/posts/:postId/answers', async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const answer = {
            _id: `answer-${Date.now()}`,
            author: req.session?.currentUser?._id || "current-user",
            authorRole: req.session?.currentUser?.role || "STUDENT",
            authorName: req.session?.currentUser
                        ? `${req.session.currentUser.firstName} ${req.session.currentUser.lastName}`
                        : "Anonymous",
            content,
            timestamp: new Date(),
            isGoodAnswer: false
        };

        if (['FACULTY', 'TA', 'INSTRUCTOR'].includes(answer.authorRole)) {
            post.instructorAnswers.push(answer);
            post.hasInstructorAnswer = true;
        } else {
            post.studentAnswers.push(answer);
            post.hasStudentAnswer = true;
        }

        await post.save();

        // Return the answer in the expected format
        res.json({
                     ...answer,
                     createdAt: answer.timestamp
                 });
    } catch (error) {
        console.error('Error adding answer:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add followup to post
router.post('/courses/:courseId/pazza/posts/:postId/followups', async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, parentId } = req.body;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const currentUser = req.session?.currentUser;
        const timestamp = new Date();

        if (parentId) {
            // This is a reply to a followup
            const followup = post.followups.find(f => f._id === parentId);
            if (!followup) return res.status(404).json({ error: 'Parent followup not found' });

            const reply = {
                _id: `reply-${Date.now()}`,
                author: currentUser?._id || "current-user",
                authorRole: currentUser?.role || "STUDENT",
                authorName: currentUser
                            ? `${currentUser.firstName} ${currentUser.lastName}`
                            : "Anonymous",
                content,
                timestamp
            };

            if (!followup.replies) followup.replies = [];
            followup.replies.push(reply);

            await post.save();

            // Return reply in expected format
            res.json({
                         _id: reply._id,
                         content: reply.content,
                         authorName: reply.authorName,
                         authorRole: reply.authorRole,
                         createdAt: reply.timestamp,
                         parentId
                     });
        } else {
            // This is a new followup thread
            const followup = {
                _id: `followup-${Date.now()}`,
                author: currentUser?._id || "current-user",
                authorRole: currentUser?.role || "STUDENT",
                authorName: currentUser
                            ? `${currentUser.firstName} ${currentUser.lastName}`
                            : "Anonymous",
                content,
                isResolved: false,
                timestamp,
                replies: []
            };

            post.followups.push(followup);
            await post.save();

            // Return followup in expected format
            res.json({
                         _id: followup._id,
                         content: followup.content,
                         isResolved: followup.isResolved,
                         authorName: followup.authorName,
                         authorRole: followup.authorRole,
                         createdAt: followup.timestamp,
                         updatedAt: followup.timestamp,
                         parentId: null
                     });
        }
    } catch (error) {
        console.error('Error adding followup:', error);
        res.status(500).json({ error: error.message });
    }
});

// Toggle followup resolved status
router.put('/courses/:courseId/pazza/followups/:followupId/resolve', async (req, res) => {
    try {
        const { courseId, followupId } = req.params;

        // Find the post containing this followup
        const post = await Post.findOne({
                                            course: String(courseId),
                                            'followups._id': followupId
                                        });

        if (!post) return res.status(404).json({ error: 'Followup not found' });

        const followup = post.followups.find(f => f._id === followupId);
        if (!followup) return res.status(404).json({ error: 'Followup not found' });

        // Toggle resolved status
        followup.isResolved = !followup.isResolved;
        await post.save();

        res.json({
                     _id: followup._id,
                     content: followup.content,
                     isResolved: followup.isResolved,
                     authorName: followup.authorName,
                     authorRole: followup.authorRole,
                     createdAt: followup.timestamp,
                     updatedAt: followup.timestamp,
                     parentId: null
                 });
    } catch (error) {
        console.error('Error toggling followup resolved:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update answer
router.put('/courses/:courseId/pazza/answers/:answerId', async (req, res) => {
    try {
        const { courseId, answerId } = req.params;
        const { content } = req.body;

        // Find post containing this answer
        const post = await Post.findOne({
                                            course: String(courseId),
                                            $or: [
                                                { 'studentAnswers._id': answerId },
                                                { 'instructorAnswers._id': answerId }
                                            ]
                                        });

        if (!post) return res.status(404).json({ error: 'Answer not found' });

        // Find and update the answer
        let answer = post.studentAnswers.find(a => a._id === answerId);
        let isInstructor = false;

        if (!answer) {
            answer = post.instructorAnswers.find(a => a._id === answerId);
            isInstructor = true;
        }

        if (!answer) return res.status(404).json({ error: 'Answer not found' });

        answer.content = content;
        await post.save();

        res.json({
                     _id: answer._id,
                     content: answer.content,
                     authorName: answer.authorName,
                     authorRole: answer.authorRole,
                     createdAt: answer.timestamp,
                     isGoodAnswer: answer.isGoodAnswer,
                     isInstructorAnswer: isInstructor
                 });
    } catch (error) {
        console.error('Error updating answer:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete answer
router.delete('/courses/:courseId/pazza/answers/:answerId', async (req, res) => {
    try {
        const { courseId, answerId } = req.params;

        // Find post containing this answer
        const post = await Post.findOne({
                                            course: String(courseId),
                                            $or: [
                                                { 'studentAnswers._id': answerId },
                                                { 'instructorAnswers._id': answerId }
                                            ]
                                        });

        if (!post) return res.status(404).json({ error: 'Answer not found' });

        // Remove the answer
        const studentIndex = post.studentAnswers.findIndex(a => a._id === answerId);
        if (studentIndex !== -1) {
            post.studentAnswers.splice(studentIndex, 1);
            post.hasStudentAnswer = post.studentAnswers.length > 0;
        } else {
            const instructorIndex = post.instructorAnswers.findIndex(a => a._id === answerId);
            if (instructorIndex !== -1) {
                post.instructorAnswers.splice(instructorIndex, 1);
                post.hasInstructorAnswer = post.instructorAnswers.length > 0;
            }
        }

        await post.save();
        res.json({ message: 'Answer deleted' });
    } catch (error) {
        console.error('Error deleting answer:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update post
router.put('/courses/:courseId/pazza/posts/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const { title, details } = req.body;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        if (title !== undefined) post.summary = title;
        if (details !== undefined) post.details = details;
        post.updatedAt = new Date();

        await post.save();
        res.json(post);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete post
router.delete('/courses/:courseId/pazza/posts/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        await Post.findByIdAndDelete(postId);
        res.json({ message: 'Post deleted' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get stats
router.get('/courses/:courseId/pazza/stats', async (req, res) => {
    try {
        const { courseId } = req.params;
        const posts = await Post.find({ course: String(courseId) });

        const stats = {
            totalPosts: posts.length,
            unreadPosts: 0,
            unansweredQuestions: posts.filter(
                p => p.type === 'question' &&
                     p.studentAnswers.length === 0 &&
                     p.instructorAnswers.length === 0
            ).length,
            unansweredFollowups: posts.reduce(
                (count, p) => count + p.followups.filter(f => !f.isResolved).length, 0
            ),
            instructorResponses: posts.reduce(
                (count, p) => count + p.instructorAnswers.length, 0
            ),
            studentResponses: posts.reduce(
                (count, p) => count + p.studentAnswers.length, 0
            ),
            totalContributions: posts.reduce(
                (count, p) => count + p.studentAnswers.length + p.instructorAnswers.length + p.followups.length, 0
            )
        };

        console.log(`Stats for course ${courseId}:`, stats);
        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
