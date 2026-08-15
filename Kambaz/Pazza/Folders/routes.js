import * as dao from "./dao.js";

export default function PazzaFolderRoutes(app) {
    // The folder list of one course.
    const findFoldersForCourse = async (req, res) => {
        const { courseId } = req.params;
        const folders = await dao.findFoldersForCourse(courseId);
        res.json(folders);
    };

    const createFolder = async (req, res) => {
        const { courseId } = req.params;
        const name = (req.body.name || "").trim();
        if (!name) {
            res.status(400).json({ message: "A folder needs a name" });
            return;
        }
        const folder = await dao.createFolder(courseId, name);
        res.json(folder);
    };

    const updateFolder = async (req, res) => {
        const { folderId } = req.params;
        const name = (req.body.name || "").trim();
        if (!name) {
            res.status(400).json({ message: "A folder needs a name" });
            return;
        }
        const folder = await dao.updateFolder(folderId, name);
        res.json(folder);
    };

    const deleteFolder = async (req, res) => {
        await dao.deleteFolder(req.params.folderId);
        res.sendStatus(200);
    };

    app.get("/api/courses/:courseId/pazza/folders", findFoldersForCourse);
    app.post("/api/courses/:courseId/pazza/folders", createFolder);
    app.put("/api/pazza/folders/:folderId", updateFolder);
    app.delete("/api/pazza/folders/:folderId", deleteFolder);
}
