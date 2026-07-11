import * as dao from "./dao.js";

export default function PazzaFolderRoutes(app) {
    app.get("/api/courses/:courseId/pazza/folders", async (req, res) => {
        res.json(await dao.findFoldersForCourse(req.params.courseId));
    });
    app.post("/api/courses/:courseId/pazza/folders", async (req, res) => {
        res.json(await dao.createFolder(req.params.courseId, req.body.name));
    });
    app.put("/api/pazza/folders/:folderId", async (req, res) => {
        res.json(await dao.updateFolder(req.params.folderId, req.body.name));
    });
    app.delete("/api/pazza/folders/:folderId", async (req, res) => {
        await dao.deleteFolder(req.params.folderId);
        res.sendStatus(200);
    });
}
