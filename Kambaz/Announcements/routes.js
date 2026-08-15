import * as dao from "./dao.js";

export default function AnnouncementRoutes(app) {
    const findAnnouncementsForCourse = async (req, res) => {
        const announcements = await dao.findAnnouncementsForCourse(req.params.courseId);
        res.json(announcements);
    };

    const createAnnouncementForCourse = async (req, res) => {
        const announcement = { ...req.body, course: req.params.courseId };
        const created = await dao.createAnnouncement(announcement);
        res.json(created);
    };

    const updateAnnouncement = async (req, res) => {
        const { announcementId } = req.params;
        await dao.updateAnnouncement(announcementId, req.body);
        const updated = await dao.findAnnouncementById(announcementId);
        if (!updated) {
            res.status(404).json({
                message: `Unable to update announcement ${announcementId}`,
            });
            return;
        }
        res.json(updated);
    };

    const deleteAnnouncement = async (req, res) => {
        await dao.deleteAnnouncement(req.params.announcementId);
        res.sendStatus(200);
    };

    app.get("/api/courses/:courseId/announcements", findAnnouncementsForCourse);
    app.post("/api/courses/:courseId/announcements", createAnnouncementForCourse);
    app.put("/api/announcements/:announcementId", updateAnnouncement);
    app.delete("/api/announcements/:announcementId", deleteAnnouncement);
}
