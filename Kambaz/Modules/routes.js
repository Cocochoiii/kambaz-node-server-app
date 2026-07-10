import * as modulesDao from "./dao.js";

export default function ModuleRoutes(app) {
    app.delete("/api/modules/:moduleId", async (req, res) => {
        await modulesDao.deleteModule(req.params.moduleId);
        res.sendStatus(200);
    });
    app.put("/api/modules/:moduleId", async (req, res) => {
        res.json(await modulesDao.updateModule(req.params.moduleId, req.body));
    });
}
