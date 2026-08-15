import * as dao from "./dao.js";

export default function AnnouncementRoutes(app) {
    app.get("/api/courses/:courseId/announcements", (req, res) => {
        res.json(dao.findAnnouncementsForCourse(req.params.courseId));
    });
    app.post("/api/courses/:courseId/announcements", (req, res) => {
        const announcement = { ...req.body, course: req.params.courseId };
        res.json(dao.createAnnouncement(announcement));
    });
    app.put("/api/announcements/:announcementId", (req, res) => {
        const updated = dao.updateAnnouncement(req.params.announcementId, req.body);
        if (!updated) {
            return res.status(404).json({
                message: `Unable to update announcement ${req.params.announcementId}`,
            });
        }
        res.json(updated);
    });

    app.delete("/api/announcements/:announcementId", (req, res) => {
        dao.deleteAnnouncement(req.params.announcementId);
        res.sendStatus(200);
    });
}
