import * as dao from "./dao.js";

export default function MeetingRoutes(app) {
    // The meetings of one course.
    app.get("/api/courses/:courseId/meetings", (req, res) => {
        res.json(dao.findMeetingsForCourse(req.params.courseId));
    });
    app.post("/api/courses/:courseId/meetings", (req, res) => {
        const meeting = { ...req.body, course: req.params.courseId };
        res.json(dao.createMeeting(meeting));
    });
    app.delete("/api/meetings/:meetingId", (req, res) => {
        dao.deleteMeeting(req.params.meetingId);
        res.sendStatus(200);
    });
}
