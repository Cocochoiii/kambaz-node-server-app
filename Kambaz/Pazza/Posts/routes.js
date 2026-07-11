import * as dao from "./dao.js";

export default function PazzaPostRoutes(app) {
    app.get("/api/courses/:courseId/pazza/posts", async (req, res) => {
        res.json(await dao.findPostsForCourse(req.params.courseId));
    });
    app.post("/api/courses/:courseId/pazza/posts", async (req, res) => {
        res.json(await dao.createPost(req.params.courseId, req.body));
    });
    app.put("/api/pazza/posts/:postId", async (req, res) => {
        res.json(await dao.updatePost(req.params.postId, req.body));
    });
    app.delete("/api/pazza/posts/:postId", async (req, res) => {
        await dao.deletePost(req.params.postId);
        res.sendStatus(200);
    });
}
