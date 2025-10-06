import * as dao from "./dao.js";

const canManage = (u) => u && ["FACULTY", "ADMIN", "TA"].includes(u.role);

export default function AnnouncementRoutes(app) {
    // List announcements for a course
    app.get("/api/courses/:cid/announcements", async (req, res) => {
        try {
            const items = await dao.listForCourse(req.params.cid);
            res.json(items);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    // Create announcement (FACULTY/ADMIN/TA)
    app.post("/api/courses/:cid/announcements", async (req, res) => {
        try {
            const me = req.session?.currentUser;
            if (!me) return res.status(401).json({ error: "Login required" });
            if (!canManage(me)) return res.status(403).json({ error: "Not allowed" });

            const { title, content, section, pinned } = req.body || {};
            if (!title || !content) {
                return res.status(400).json({ error: "title and content are required" });
            }

            const created = await dao.createForCourse(
                req.params.cid,
                { title, content, section, pinned },
                me
            );
            res.json(created);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    // Update announcement
    app.put("/api/announcements/:id", async (req, res) => {
        try {
            const me = req.session?.currentUser;
            if (!me) return res.status(401).json({ error: "Login required" });
            if (!canManage(me)) return res.status(403).json({ error: "Not allowed" });

            const updated = await dao.updateAnnouncement(req.params.id, req.body || {});
            if (!updated) return res.status(404).json({ error: "Not found" });
            res.json(updated);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    // Delete announcement
    app.delete("/api/announcements/:id", async (req, res) => {
        try {
            const me = req.session?.currentUser;
            if (!me) return res.status(401).json({ error: "Login required" });
            if (!canManage(me)) return res.status(403).json({ error: "Not allowed" });

            await dao.deleteAnnouncement(req.params.id);
            res.json({ status: "deleted" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
}
