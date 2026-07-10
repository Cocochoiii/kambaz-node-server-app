import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
    app.get("/api/courses/:courseId/assignments", async (req, res) => {
        res.json(await dao.findAssignmentsForCourse(req.params.courseId));
    });
    app.post("/api/courses/:courseId/assignments", async (req, res) => {
        const assignment = { ...req.body, course: req.params.courseId };
        res.json(await dao.createAssignment(assignment));
    });
    app.put("/api/assignments/:assignmentId", async (req, res) => {
        res.json(await dao.updateAssignment(req.params.assignmentId, req.body));
    });
    app.delete("/api/assignments/:assignmentId", async (req, res) => {
        await dao.deleteAssignment(req.params.assignmentId);
        res.sendStatus(200);
    });
}
