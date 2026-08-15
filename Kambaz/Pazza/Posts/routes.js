import * as dao from "./dao.js";

export default function PazzaPostRoutes(app) {
    // The posts of one course. The client filters by folder and by reader.
    const findPostsForCourse = async (req, res) => {
        const posts = await dao.findPostsForCourse(req.params.courseId);
        res.json(posts);
    };

    const createPost = async (req, res) => {
        const { courseId } = req.params;
        const post = await dao.createPost(courseId, req.body);
        res.json(post);
    };

    const updatePost = async (req, res) => {
        const post = await dao.updatePost(req.params.postId, req.body);
        res.json(post);
    };

    // The reader id comes from the session when there is one.
    const addViewer = async (req, res) => {
        const currentUser = req.session["currentUser"];
        const userId = currentUser ? currentUser._id : req.body.userId;
        const post = await dao.addViewer(req.params.postId, userId);
        res.json(post);
    };

    const deletePost = async (req, res) => {
        await dao.deletePost(req.params.postId);
        res.sendStatus(200);
    };

    app.get("/api/courses/:courseId/pazza/posts", findPostsForCourse);
    app.post("/api/courses/:courseId/pazza/posts", createPost);
    app.put("/api/pazza/posts/:postId", updatePost);
    app.post("/api/pazza/posts/:postId/view", addViewer);
    app.delete("/api/pazza/posts/:postId", deletePost);
}
