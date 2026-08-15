import * as modulesDao from "./dao.js";

export default function ModuleRoutes(app) {
    const deleteModule = async (req, res) => {
        const { moduleId } = req.params;
        await modulesDao.deleteModule(moduleId);
        res.sendStatus(200);
    };

    const updateModule = async (req, res) => {
        const { moduleId } = req.params;
        const moduleUpdates = req.body;
        await modulesDao.updateModule(moduleId, moduleUpdates);
        const updated = await modulesDao.findModuleById(moduleId);
        if (!updated) {
            res.status(404).json({ message: `Unable to update module ${moduleId}` });
            return;
        }
        res.json(updated);
    };

    app.delete("/api/modules/:moduleId", deleteModule);
    app.put("/api/modules/:moduleId", updateModule);
}
