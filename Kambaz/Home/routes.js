// Kambaz/Home/routes.js
import * as announcementsDao from "../Announcements/dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as coursesDao from "../Courses/dao.js";

// Assignments DAO is optional; we’ll gracefully handle both name variants
let assignmentsDao = null;
try {
    assignmentsDao = await import("../Assignments/dao.js");
    assignmentsDao = assignmentsDao?.default ?? assignmentsDao;
} catch (_) {
    // ok if assignments not implemented yet
}

/**
 * Helper to clone Modules from one course to another
 */
async function cloneModules(fromCourseId, toCourseId) {
    const mods = await modulesDao.findModulesForCourse(fromCourseId);
    if (!mods?.length) return { created: 0 };

    const results = await Promise.all(
        mods.map((m) =>
                     modulesDao.createModule({
                                                 ...(m.toObject?.() ?? m),
                                                 _id: undefined,   // let DAO generate a fresh id
                                                 course: toCourseId,
                                                 editing: false,
                                             })
        )
    );
    return { created: results.length };
}

/**
 * Helper to clone Assignments (works with your DAO names)
 */
async function cloneAssignments(fromCourseId, toCourseId) {
    if (!assignmentsDao) return { created: 0 };

    // read
    const listFn =
        assignmentsDao.findAssignmentsForCourse || assignmentsDao.listForCourse;
    const src = await listFn(fromCourseId);
    if (!src?.length) return { created: 0 };

    // create
    const createFn =
        assignmentsDao.createAssignment || assignmentsDao.createForCourse;

    const results = await Promise.all(
        src.map((a) =>
                    createFn(
                        // some DAOs use (courseId, payload)
                        createFn.length === 2 ? toCourseId : undefined,
                        {
                            ...(a.toObject?.() ?? a),
                            _id: undefined, // let DAO generate a fresh id
                            course: toCourseId,
                        }
                    )
        )
    );

    // when the DAO signature is (courseId, payload), results are shifted
    const created = Array.isArray(results) ? results.length : 0;
    return { created };
}

export default function HomeRoutes(app) {
    /**
     * GET /api/courses/:cid/home
     * Quick summary payload for the right-side "Course Status" / Home widgets.
     */
    app.get("/api/courses/:cid/home", async (req, res) => {
        const { cid } = req.params;
        const course = await coursesDao.findCourseById(cid);
        if (!course) return res.sendStatus(404);

        const mods = await modulesDao.findModulesForCourse(cid);

        let asgCount = 0;
        if (assignmentsDao) {
            const listFn =
                assignmentsDao.findAssignmentsForCourse ||
                assignmentsDao.listForCourse;
            const asg = await listFn(cid);
            asgCount = asg.length;
        }

        /**
         * GET /api/courses/:cid/progress
         * ?studentId=abc (optional)
         *
         * Returns: { overallPercent, modules: [{ _id, title, completed, total, percent, status, remainingCount }] }
         */
        app.get("/api/courses/:cid/progress", async (req, res) => {
            const { cid } = req.params;
            const studentId = req.query?.studentId || null;

            const mods = await modulesDao.findModulesForCourse(cid);

            // Helper: derive counts (replace with your real signals later)
            const calcCounts = (m, idx, prevPct) => {
                const lessons = Array.isArray(m.lessons) ? m.lessons : [];
                const total = lessons.length || 6; // default if module has no lessons array yet

                // Fake per-student variation: hash by ids for demo realism
                const seed = (studentId ? String(studentId) : "x") + (m._id ?? idx);
                const hash = Array.from(seed).reduce((a, c) => (a + c.charCodeAt(0)) % 97, 0);
                const fraction = (hash % 10) / 10; // 0.0..0.9

                // completion model: earlier modules more complete than later ones
                const bias = Math.max(0, 0.8 - idx * 0.1);
                const pct = Math.min(1, bias + fraction * 0.2);

                let completed = Math.round(total * pct);
                if (completed > total) completed = total;
                const percent = total ? (completed / total) * 100 : 0;

                // Canvas-like status based on prerequisite (previous module)
                let status = "Unlocked";
                if (percent >= 100) status = "Complete";
                else if (percent > 0) status = "In Progress";
                else if (idx > 0 && prevPct < 80) status = "Locked";

                const remainingCount = Math.max(0, total - completed);

                return { total, completed, percent: Number(percent.toFixed(1)), status, remainingCount };
            };

            const out = [];
            let prevPct = 100;
            (mods || []).forEach((m, idx) => {
                const counts = calcCounts(m, idx, prevPct);
                out.push({
                             _id: m._id?.toString?.() ?? String(m._id ?? idx),
                             title: m.name || `Module ${idx + 1}`,
                             ...counts,
                             updatedAt: m.updatedAt || m.createdAt || new Date().toISOString(),
                         });
                prevPct = counts.percent;
            });

            const overall = out.length ? out.reduce((a, x) => a + x.percent, 0) / out.length : 0;

            res.json({
                         overallPercent: Number(overall.toFixed(1)),
                         modules: out,
                     });
        });



        const announcements = await announcementsDao.listForCourse(cid);

        res.json({
                     course: {
                         _id: course._id,
                         name: course.name,
                         number: course.number,
                         description: course.description,
                         isPublished: !!course.isPublished,
                         homePage: course.homePage || "modules",
                     },
                     counts: {
                         modules: mods.length,
                         assignments: asgCount,
                         announcements: announcements.length,
                     },
                     latestAnnouncements: announcements.slice(0, 5),
                 });
    });

    /**
     * PATCH /api/courses/:cid/publish
     * body: { isPublished: boolean }
     */
    app.patch("/api/courses/:cid/publish", async (req, res) => {
        const { cid } = req.params;
        const { isPublished } = req.body ?? {};
        const status = await coursesDao.updateCourse(cid, {
            isPublished: !!isPublished,
        });
        res.json(status);
    });

    /**
     * PATCH /api/courses/:cid/homepage
     * body: { homePage: 'modules'|'stream'|'assignments'|'syllabus' }
     */
    app.patch("/api/courses/:cid/homepage", async (req, res) => {
        const { cid } = req.params;
        const { homePage } = req.body ?? {};
        const allowed = ["modules", "stream", "assignments", "syllabus"];
        if (!allowed.includes(homePage)) {
            return res.status(400).json({ message: "Invalid homePage" });
        }
        const status = await coursesDao.updateCourse(cid, { homePage });
        res.json(status);
    });

    /**
     * Announcements — create/list/update/delete
     */

    // POST /api/courses/:cid/announcements
    // body: { title, content, section?, pinned? }
    app.post("/api/courses/:cid/announcements", async (req, res) => {
        const { cid } = req.params;
        const currentUser = req.session?.currentUser;
        if (!currentUser) return res.sendStatus(401);

        const { title, content, section, pinned } = req.body || {};
        if (!title || !content) {
            return res.status(400).json({ message: "title and content are required" });
        }

        const ann = await announcementsDao.createForCourse(
            cid,
            { title, content, section, pinned },
            currentUser
        );
        res.json(ann);
    });

    // GET /api/courses/:cid/announcements
    app.get("/api/courses/:cid/announcements", async (req, res) => {
        const { cid } = req.params;
        const list = await announcementsDao.listForCourse(cid);
        res.json(list);
    });

    // PUT /api/announcements/:id
    app.put("/api/announcements/:id", async (req, res) => {
        const { id } = req.params;
        const updated = await announcementsDao.updateAnnouncement(id, req.body || {});
        res.json(updated);
    });

    // DELETE /api/announcements/:id
    app.delete("/api/announcements/:id", async (req, res) => {
        const { id } = req.params;
        const status = await announcementsDao.deleteAnnouncement(id);
        res.json(status);
    });

    /**
     * POST /api/courses/:cid/import
     * body: { fromCourseId: string, include?: { modules?: boolean, assignments?: boolean } }
     */
    app.post("/api/courses/:cid/import", async (req, res) => {
        const { cid } = req.params;
        const { fromCourseId, include = {} } = req.body || {};
        if (!fromCourseId) {
            return res.status(400).json({ message: "fromCourseId is required" });
        }

        const out = { modules: { created: 0 }, assignments: { created: 0 } };

        // Modules default to true (import)
        if (include.modules !== false) {
            out.modules = await cloneModules(fromCourseId, cid);
        }

        // Assignments only if requested or DAO is present
        if (include.assignments && assignmentsDao) {
            out.assignments = await cloneAssignments(fromCourseId, cid);
        }

        res.json({ ok: true, ...out });
    });
}
