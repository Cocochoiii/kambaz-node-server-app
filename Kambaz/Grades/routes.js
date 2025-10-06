// Kambaz/Grades/routes.js
import * as dao from "./dao.js";

export default function GradeRoutes(app) {
    /** UTIL: require a logged-in user for mutations */
    const requireAuth = (req, res) => {
        const currentUser = req.session?.currentUser;
        if (!currentUser) {
            res.sendStatus(401);
            return null;
        }
        return currentUser;
    };

    /** GET: course-wide grades */
    const findGradesForCourse = async (req, res) => {
        const { cid } = req.params;
        const grades = await dao.findGradesForCourse(cid);
        res.json(grades);
    };

    /** GET: assignment grades */
    const findGradesForAssignment = async (req, res) => {
        const { aid } = req.params;
        const grades = await dao.findGradesForAssignment(aid);
        res.json(grades);
    };

    /** GET: a student's grades within a course */
    const findStudentGradesInCourse = async (req, res) => {
        let { uid, cid } = req.params;
        const me = req.session?.currentUser;
        if (uid === "current" && me) uid = me._id;
        const grades = await dao.findGradesForStudentInCourse(uid, cid);
        res.json(grades);
    };

    /** GET: one grade by id */
    const findGradeById = async (req, res) => {
        const grade = await dao.findGradeById(req.params.gid);
        if (!grade) return res.sendStatus(404);
        res.json(grade);
    };

    /** POST: create grade in a course */
    const createGrade = async (req, res) => {
        const user = requireAuth(req, res);
        if (!user) return;
        if (!["FACULTY", "ADMIN"].includes(user.role)) return res.sendStatus(403);

        const { cid } = req.params;
        const payload = { ...req.body, course: cid };
        const doc = await dao.createGrade(payload);
        res.json(doc);
    };

    /** PUT: upsert by (student, assignment, course) — ideal for your GradeEditor save */
    const upsertGrade = async (req, res) => {
        const user = requireAuth(req, res);
        if (!user) return;
        if (!["FACULTY", "ADMIN"].includes(user.role)) return res.sendStatus(403);

        const { cid } = req.params;
        const { student, assignment, score, submitted, released, type, comment } = req.body;
        if (!student || !assignment) return res.status(400).json({ message: "student and assignment are required" });

        const updated = await dao.upsertGradeBySAC({
                                                       student,
                                                       assignment,
                                                       course: cid,
                                                       score,
                                                       submitted,
                                                       released,
                                                       type,
                                                       comment,
                                                   });
        res.json(updated);
    };

    /** PUT: update by id */
    const updateGrade = async (req, res) => {
        const user = requireAuth(req, res);
        if (!user) return;
        if (!["FACULTY", "ADMIN"].includes(user.role)) return res.sendStatus(403);

        await dao.updateGrade(req.params.gid, req.body);
        const fresh = await dao.findGradeById(req.params.gid);
        res.json(fresh);
    };

    /** DELETE: by id */
    const deleteGrade = async (req, res) => {
        const user = requireAuth(req, res);
        if (!user) return;
        if (!["FACULTY", "ADMIN"].includes(user.role)) return res.sendStatus(403);

        const status = await dao.deleteGrade(req.params.gid);
        res.json(status);
    };

    /** PATCH: bulk release all grades in a course */
    const releaseCourseGrades = async (req, res) => {
        const user = requireAuth(req, res);
        if (!user) return;
        if (!["FACULTY", "ADMIN"].includes(user.role)) return res.sendStatus(403);

        const { cid } = req.params;
        const status = await dao.releaseGradesForCourse(cid);
        res.json(status);
    };

    // --------- routes ----------
    app.get("/api/courses/:cid/grades", findGradesForCourse);
    app.get("/api/assignments/:aid/grades", findGradesForAssignment);
    app.get("/api/users/:uid/courses/:cid/grades", findStudentGradesInCourse);

    app.get("/api/grades/:gid", findGradeById);

    app.post("/api/courses/:cid/grades", createGrade);
    app.put("/api/courses/:cid/grades/upsert", upsertGrade); // preferred from editor
    app.put("/api/grades/:gid", updateGrade);
    app.delete("/api/grades/:gid", deleteGrade);

    app.patch("/api/courses/:cid/grades/release", releaseCourseGrades);
}
