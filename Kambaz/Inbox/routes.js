import express from "express";
import * as dao from "./dao.js";

/** format relative time like “2h”, “yesterday”, etc. */
function relTime(d) {
    const now = Date.now();
    const ts = new Date(d).getTime();
    const diff = Math.max(0, now - ts);
    const min = Math.floor(diff / 60000);
    if (min < 1) return "now";
    if (min < 60) return `${min}m`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h`;
    const days = Math.floor(hr / 24);
    if (days === 1) return "yesterday";
    return `${days}d`;
}

/** map DB row -> UI message shape your page uses */
function toMsg(row, currentUserId) {
    return {
        id: row._id,
        from: row.fromName || "User",
        subject: row.subject,
        preview: row.preview || "",
        time: relTime(row.createdAt),
        unread: !(row.readBy || []).includes(currentUserId),
        course: row.course || undefined,
    };
}

export default function InboxRoutes(app) {
    const router = express.Router();

    // All routes require a logged-in user
    router.use((req, res, next) => {
        if (!req.session?.currentUser) return res.sendStatus(401);
        next();
    });

    // GET /api/inbox?q=&course=
    router.get("/inbox", async (req, res) => {
        const me = req.session.currentUser;
        const { q = "", course = "" } = req.query;
        const rows = await dao.findMessagesForUser(me._id, { q, course });
        res.json(rows.map((r) => toMsg(r, me._id)));
    });

    // POST /api/inbox  { to, subject, body, course }
    router.post("/inbox", async (req, res) => {
        try {
            const me = req.session.currentUser;
            const created = await dao.createMessage(me, {
                subject: req.body?.subject,
                body: req.body?.body,
                course: req.body?.course,
                toText: req.body?.to,
            });
            res.json(toMsg(created, me._id));
        } catch (e) {
            console.error("Inbox create error:", e);
            res.status(500).json({ message: "Unable to send message" });
        }
    });

    // PUT /api/inbox/readAll
    router.put("/inbox/readAll", async (req, res) => {
        const me = req.session.currentUser;
        const status = await dao.markAllRead(me._id);
        res.json(status);
    });

    // PUT /api/inbox/:mid/read
    router.put("/inbox/:mid/read", async (req, res) => {
        const me = req.session.currentUser;
        const status = await dao.markRead(me._id, req.params.mid);
        res.json(status);
    });

    // DELETE /api/inbox/:mid  (sender or ADMIN)
    router.delete("/inbox/:mid", async (req, res) => {
        const me = req.session.currentUser;
        const row = await dao.findById(req.params.mid);
        if (!row) return res.sendStatus(404);
        const isOwner = row.from === me._id;
        const isAdmin = (me.role || "").toUpperCase() === "ADMIN";
        if (!isOwner && !isAdmin) return res.sendStatus(403);
        const status = await dao.deleteMessage(req.params.mid);
        res.json(status);
    });

    app.use("/api", router);
}
