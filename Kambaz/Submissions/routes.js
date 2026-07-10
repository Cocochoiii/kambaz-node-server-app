import * as dao from "./dao.js";

export default function SubmissionRoutes(app) {
    // Student submits (create or overwrite their submission).
    app.post("/api/assignments/:assignmentId/submissions", async (req, res) => {
        const submission = { ...req.body, assignment: req.params.assignmentId };
        res.json(await dao.submitAssignment(req.params.assignmentId, submission));
    });
    // All submissions for one assignment (faculty grading view).
    app.get("/api/assignments/:assignmentId/submissions", async (req, res) => {
        res.json(await dao.findSubmissionsForAssignment(req.params.assignmentId));
    });
    // One user's submissions (student "Recent Feedback").
    app.get("/api/users/:userId/submissions", async (req, res) => {
        res.json(await dao.findSubmissionsForUser(req.params.userId));
    });
    // All submissions in a course (gradebook).
    app.get("/api/courses/:courseId/submissions", async (req, res) => {
        res.json(await dao.findSubmissionsForCourse(req.params.courseId));
    });
    // All submissions (faculty "to grade" queue filters this).
    app.get("/api/submissions", async (req, res) => {
        res.json(await dao.findAllSubmissions());
    });
    // Faculty grades a submission.
    app.put("/api/submissions/:submissionId", async (req, res) => {
        res.json(await dao.gradeSubmission(req.params.submissionId, req.body));
    });
}
