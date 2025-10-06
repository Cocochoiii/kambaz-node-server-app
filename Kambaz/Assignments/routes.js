import * as dao from "./dao.js";

const canManage = (u) => u && ["FACULTY", "ADMIN", "TA"].includes(u.role);

export default function AssignmentRoutes(app) {
    // List for a course
    app.get("/api/courses/:cid/assignments", async (req, res) => {
        try {
            const rows = await dao.listForCourse(req.params.cid);
            res.json(rows);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    // Read one
    app.get("/api/assignments/:id", async (req, res) => {
        try {
            const row = await dao.findById(req.params.id);
            if (!row) return res.status(404).json({ error: "Not found" });
            res.json(row);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    // Create (FACULTY/ADMIN/TA)
    app.post("/api/courses/:cid/assignments", async (req, res) => {
        try {
            const me = req.session?.currentUser;
            if (!me) return res.status(401).json({ error: "Login required" });
            if (!canManage(me)) return res.status(403).json({ error: "Not allowed" });

            const { title } = req.body || {};
            if (!title) return res.status(400).json({ error: "title is required" });

            const created = await dao.createForCourse(req.params.cid, req.body, me);
            res.json(created);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    // Update (FACULTY/ADMIN/TA)
    app.put("/api/assignments/:id", async (req, res) => {
        try {
            const me = req.session?.currentUser;
            if (!me) return res.status(401).json({ error: "Login required" });
            if (!canManage(me)) return res.status(403).json({ error: "Not allowed" });

            const updated = await dao.updateAssignment(req.params.id, req.body || {});
            if (!updated) return res.status(404).json({ error: "Not found" });
            res.json(updated);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    // Delete (FACULTY/ADMIN/TA)
    app.delete("/api/assignments/:id", async (req, res) => {
        try {
            const me = req.session?.currentUser;
            if (!me) return res.status(401).json({ error: "Login required" });
            if (!canManage(me)) return res.status(403).json({ error: "Not allowed" });

            await dao.deleteAssignment(req.params.id);
            res.json({ status: "deleted" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
}
