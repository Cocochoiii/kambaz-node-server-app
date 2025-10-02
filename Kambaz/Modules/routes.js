import * as modulesDao from "./dao.js";

export default function ModuleRoutes(app) {
    app.delete("/api/modules/:moduleId", (req, res) => {
        modulesDao.deleteModule(req.params.moduleId);
        res.sendStatus(200);
    });
    app.put("/api/modules/:moduleId", (req, res) => {
        const updated = modulesDao.updateModule(req.params.moduleId, req.body);
        res.json(updated);
    });
}
