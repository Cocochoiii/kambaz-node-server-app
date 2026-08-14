import * as dao from "./dao.js";

export default function AnnouncementRoutes(app) {
    app.get("/api/courses/:courseId/announcements", (req, res) => {
        res.json(dao.findAnnouncementsForCourse(req.params.courseId));
    });
    app.post("/api/courses/:courseId/announcements", (req, res) => {
        const announcement = { ...req.body, course: req.params.courseId };
        res.json(dao.createAnnouncement(announcement));
    });
    app.delete("/api/announcements/:announcementId", (req, res) => {
        dao.deleteAnnouncement(req.params.announcementId);
        res.sendStatus(200);
    });
}
