import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
    app.get("/api/courses/:courseId/assignments", (req, res) => {
        res.json(dao.findAssignmentsForCourse(req.params.courseId));
    });
    app.post("/api/courses/:courseId/assignments", (req, res) => {
        const assignment = { ...req.body, course: req.params.courseId };
        res.json(dao.createAssignment(assignment));
    });
    app.put("/api/assignments/:assignmentId", (req, res) => {
        res.json(dao.updateAssignment(req.params.assignmentId, req.body));
    });
    app.delete("/api/assignments/:assignmentId", (req, res) => {
        dao.deleteAssignment(req.params.assignmentId);
        res.sendStatus(200);
    });
}
