import express from "express";
import * as dao from "./dao.js";

const router = express.Router();

/** Require a signed-in user */
function requireUser(req, res, next) {
    const u = req.session?.currentUser;
    if (!u) return res.status(401).json({ error: "Not signed in" });
    next();
}

/** ---------- Meetings ---------- */
// List meetings for a course
router.get("/courses/:cid/zoom/meetings", requireUser, async (req, res) => {
    try {
        await dao.sweepStatusesNow();
        const rows = await dao.listMeetingsForCourse(req.params.cid);
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// List meetings visible to me (faculty -> my hosted; student -> my enrolled courses)
router.get("/zoom/meetings", requireUser, async (req, res) => {
    try {
        await dao.sweepStatusesNow();
        const rows = await dao.listMeetingsForUser(req.session.currentUser, true);
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Create/schedule a meeting for a course
router.post("/courses/:cid/zoom/meetings", requireUser, async (req, res) => {
    try {
        const hostId = req.session.currentUser._id;
        const payload = { ...req.body, courseId: req.params.cid };
        const m = await dao.createMeeting(hostId, payload);
        res.json(m);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Update just the status (upcoming/past/recurring)
router.put("/zoom/meetings/:mid/status", requireUser, async (req, res) => {
    try {
        const { status } = req.body;
        await dao.updateMeetingStatus(req.params.mid, status);
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Delete meeting (only host or faculty should do this; quick check)
router.delete("/zoom/meetings/:mid", requireUser, async (req, res) => {
    try {
        // (Optional) You could check hostId here with a findOne if you want.
        await dao.deleteMeeting(req.params.mid);
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/** ---------- Personal Room ---------- */
router.get("/zoom/personal-room", requireUser, async (req, res) => {
    try {
        const pmr = await dao.getOrCreatePersonalRoom(req.session.currentUser._id);
        res.json(pmr);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/** ---------- Recordings ---------- */
router.get("/zoom/recordings", requireUser, async (req, res) => {
    try {
        const rows = await dao.listRecordings(req.query.courseId);
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post("/zoom/recordings", requireUser, async (req, res) => {
    try {
        const r = await dao.addRecording(req.session.currentUser._id, req.body);
        res.json(r);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
