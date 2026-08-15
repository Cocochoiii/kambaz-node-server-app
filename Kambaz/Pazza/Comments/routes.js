import * as dao from "./dao.js";

export default function PazzaCommentRoutes(app) {
    const findCommentsForPost = async (req, res) => {
        const comments = await dao.findCommentsForPost(req.params.postId);
        res.json(comments);
    };

    const findCommentsForCourse = async (req, res) => {
        const comments = await dao.findCommentsForCourse(req.params.courseId);
        res.json(comments);
    };

    const createComment = async (req, res) => {
        const comment = await dao.createComment(req.params.postId, req.body);
        res.json(comment);
    };

    const updateComment = async (req, res) => {
        const comment = await dao.updateComment(req.params.commentId, req.body);
        res.json(comment);
    };

    const deleteComment = async (req, res) => {
        await dao.deleteComment(req.params.commentId);
        res.sendStatus(200);
    };

    app.get("/api/posts/:postId/pazza/comments", findCommentsForPost);
    app.get("/api/courses/:courseId/pazza/comments", findCommentsForCourse);
    app.post("/api/posts/:postId/pazza/comments", createComment);
    app.put("/api/pazza/comments/:commentId", updateComment);
    app.delete("/api/pazza/comments/:commentId", deleteComment);
}
