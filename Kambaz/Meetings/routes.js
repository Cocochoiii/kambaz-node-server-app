import * as dao from "./dao.js";

export default function MeetingRoutes(app) {
    // The meetings of one course.
    const findMeetingsForCourse = async (req, res) => {
        const meetings = await dao.findMeetingsForCourse(req.params.courseId);
        res.json(meetings);
    };

    const createMeetingForCourse = async (req, res) => {
        const meeting = { ...req.body, course: req.params.courseId };
        const created = await dao.createMeeting(meeting);
        res.json(created);
    };

    const deleteMeeting = async (req, res) => {
        await dao.deleteMeeting(req.params.meetingId);
        res.sendStatus(200);
    };

    app.get("/api/courses/:courseId/meetings", findMeetingsForCourse);
    app.post("/api/courses/:courseId/meetings", createMeetingForCourse);
    app.delete("/api/meetings/:meetingId", deleteMeeting);
}
