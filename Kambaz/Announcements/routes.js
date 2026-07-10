import * as dao from "./dao.js";

export default function AnnouncementRoutes(app) {
    app.get("/api/courses/:courseId/announcements", async (req, res) => {
        res.json(await dao.findAnnouncementsForCourse(req.params.courseId));
    });
    app.post("/api/courses/:courseId/announcements", async (req, res) => {
        const announcement = { ...req.body, course: req.params.courseId };
        res.json(await dao.createAnnouncement(announcement));
    });
    app.put("/api/announcements/:announcementId", async (req, res) => {
        res.json(await dao.updateAnnouncement(req.params.announcementId, req.body));
    });
    app.delete("/api/announcements/:announcementId", async (req, res) => {
        await dao.deleteAnnouncement(req.params.announcementId);
        res.sendStatus(200);
    });
}
