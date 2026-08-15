import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
    const findAssignmentsForCourse = async (req, res) => {
        const { courseId } = req.params;
        const assignments = await dao.findAssignmentsForCourse(courseId);
        res.json(assignments);
    };

    const createAssignmentForCourse = async (req, res) => {
        const { courseId } = req.params;
        const assignment = { ...req.body, course: courseId };
        const newAssignment = await dao.createAssignment(assignment);
        res.json(newAssignment);
    };

    const updateAssignment = async (req, res) => {
        const { assignmentId } = req.params;
        await dao.updateAssignment(assignmentId, req.body);
        const updated = await dao.findAssignmentById(assignmentId);
        if (!updated) {
            res.status(404).json({ message: `Unable to update assignment ${assignmentId}` });
            return;
        }
        res.json(updated);
    };

    const deleteAssignment = async (req, res) => {
        const { assignmentId } = req.params;
        await dao.deleteAssignment(assignmentId);
        res.sendStatus(200);
    };

    app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
    app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
    app.put("/api/assignments/:assignmentId", updateAssignment);
    app.delete("/api/assignments/:assignmentId", deleteAssignment);
}
