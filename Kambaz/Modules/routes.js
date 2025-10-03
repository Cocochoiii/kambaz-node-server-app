import * as modulesDao from "./dao.js";

/*
 * Defines routes for module operations that are not tied directly to
 * courses, such as updating or deleting a module. Creation and
 * retrieval of modules for a course are handled in CourseRoutes.
 */
export default function ModuleRoutes(app) {
  // Update a module by its ID
  app.put("/api/modules/:moduleId", async (req, res) => {
    const { moduleId } = req.params;
    const moduleUpdates = req.body;
    const status = await modulesDao.updateModule(moduleId, moduleUpdates);
    res.json(status);
  });

  // Delete a module by its ID
  app.delete("/api/modules/:moduleId", async (req, res) => {
    const { moduleId } = req.params;
    const status = await modulesDao.deleteModule(moduleId);
    res.json(status);
  });
}