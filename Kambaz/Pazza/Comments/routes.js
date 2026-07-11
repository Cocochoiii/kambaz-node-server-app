import * as dao from "./dao.js";

export default function PazzaCommentRoutes(app) {
    app.get("/api/posts/:postId/pazza/comments", async (req, res) => {
        res.json(await dao.findCommentsForPost(req.params.postId));
    });
    app.get("/api/courses/:courseId/pazza/comments", async (req, res) => {
        res.json(await dao.findCommentsForCourse(req.params.courseId));
    });
    app.post("/api/posts/:postId/pazza/comments", async (req, res) => {
        res.json(await dao.createComment(req.params.postId, req.body));
    });
    app.put("/api/pazza/comments/:commentId", async (req, res) => {
        res.json(await dao.updateComment(req.params.commentId, req.body));
    });
    app.delete("/api/pazza/comments/:commentId", async (req, res) => {
        await dao.deleteComment(req.params.commentId);
        res.sendStatus(200);
    });
}
