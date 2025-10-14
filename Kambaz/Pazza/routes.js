// Kambaz/Pazza/routes.js
import express from 'express';
import { Folder, Post } from './models.js';

const router = express.Router();

// Remove automatic initialization - data should be seeded manually

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
        const folders = await Folder.find({ course: courseId }).sort({ order: 1 });
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

        const query = { course: courseId };

        if (folder) query.folders = folder;

        if (search) {
            query.$or = [
                { summary: { $regex: search, $options: 'i' } },
                { details: { $regex: search, $options: 'i' } }
            ];
        }

        query.$and = [{ $or: buildVisibilityFilter(userId) }];

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
        const userId = req.session?.currentUser?._id || null;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const canSee =
            post.postTo === 'entire_class' ||
            (userId && (post.visibleTo || []).includes(userId)) ||
            (userId && post.author === userId);

        if (!canSee) {
            return res.status(403).json({ error: 'Not authorized to view this post' });
        }

        post.views = (post.views || 0) + 1;
        await post.save();

        const answers = [
            ...post.studentAnswers.map(a => ({
                ...a.toObject ? a.toObject() : a,
                createdAt: a.timestamp
            })),
            ...post.instructorAnswers.map(a => ({
                ...a.toObject ? a.toObject() : a,
                createdAt: a.timestamp,
                isInstructorAnswer: true
            }))
        ];

        const allFollowups = [];
        post.followups.forEach(f => {
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
            if (f.replies) {
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
                                         course: courseId,
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

        // Debug log
        console.log('Creating post with session:', req.session);
        console.log('Current user:', req.session?.currentUser);

        const newPost = new Post({
                                     _id: `${courseId}-post-${Date.now()}`,
                                     course: courseId,
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

        if (answer.authorRole === 'FACULTY' || answer.authorRole === 'TA') {
            post.instructorAnswers.push(answer);
            post.hasInstructorAnswer = true;
        } else {
            post.studentAnswers.push(answer);
            post.hasStudentAnswer = true;
        }

        await post.save();
        res.json(post);
    } catch (error) {
        console.error('Error adding answer:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add followup to post
router.post('/courses/:courseId/pazza/posts/:postId/followups', async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const followup = {
            _id: `followup-${Date.now()}`,
            author: req.session?.currentUser?._id || "current-user",
            authorRole: req.session?.currentUser?.role || "STUDENT",
            authorName: req.session?.currentUser
                        ? `${req.session.currentUser.firstName} ${req.session.currentUser.lastName}`
                        : "Anonymous",
            content,
            isResolved: false,
            timestamp: new Date(),
            replies: []
        };

        post.followups.push(followup);
        await post.save();
        res.json(post);
    } catch (error) {
        console.error('Error adding followup:', error);
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

        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;