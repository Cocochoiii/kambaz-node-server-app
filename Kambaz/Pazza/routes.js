// Kambaz/Pazza/routes.js
import express from 'express';
import { Folder, Post } from './models.js';
import { pazzaSeedData } from '../Database/pazza.js';

const router = express.Router();

// ======================= Initialization =======================
let initialized = false;

async function ensureInitialized() {
    if (initialized) return;

    try {
        const existingFolders = await Folder.countDocuments().catch(() => 0);
        if (existingFolders === 0 && pazzaSeedData?.folders) {
            console.log('Initializing Pazza folders...');
            await Folder.insertMany(pazzaSeedData.folders);
            console.log(`✅ Initialized ${pazzaSeedData.folders.length} folders`);
        }

        const existingPosts = await Post.countDocuments().catch(() => 0);
        if (existingPosts === 0 && pazzaSeedData?.posts) {
            console.log('Initializing Pazza posts...');

            const processedPosts = pazzaSeedData.posts.map(post => {
                const postCopy = { ...post };

                const postAnswers = pazzaSeedData.answers?.filter(a => a.postId === post._id) || [];
                postCopy.studentAnswers = postAnswers
                    .filter(a => a.authorRole === 'STUDENT')
                    .map(a => ({
                        _id: a._id,
                        author: a.author,
                        authorRole: a.authorRole,
                        authorName: a.authorName,
                        content: a.content,
                        timestamp: new Date(a.createdAt),
                        isGoodAnswer: a.isGoodAnswer || false
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
                        isGoodAnswer: a.isGoodAnswer || false
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
                            isResolved: f.isResolved || false,
                            timestamp: new Date(f.createdAt),
                            replies
                        };
                    });

                postCopy.followups = postFollowups;
                postCopy.hasInstructorAnswer = postCopy.instructorAnswers.length > 0;
                postCopy.hasStudentAnswer = postCopy.studentAnswers.length > 0;
                postCopy.createdAt = new Date(postCopy.createdAt);
                postCopy.updatedAt = new Date(postCopy.updatedAt);

                return postCopy;
            });

            await Post.insertMany(processedPosts);
            console.log(`✅ Initialized ${processedPosts.length} posts`);
        }

        initialized = true;
    } catch (error) {
        console.error('Error initializing Pazza data:', error);
    }
}

// ======================= Middleware =======================
router.use(async (req, res, next) => {
    try {
        await ensureInitialized();
    } catch (error) {
        console.error("Pazza init error:", error);
    }
    next();
});

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
                                         _id: `${courseId}-${name.toLowerCase().replace(/\s+/g, '-')}`,
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

        const newPost = new Post({
                                     _id: `${courseId}-post-${Date.now()}`,
                                     course: courseId,
                                     type,
                                     postTo,
                                     visibleTo: postTo === 'individual' ? (visibleTo || []) : [],
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
        console.error('Error creating post:', error);
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