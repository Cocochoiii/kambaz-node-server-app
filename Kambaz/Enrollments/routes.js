import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
    app.post("/api/users/:userId/courses/:courseId", (req, res) => {
        let { userId, courseId } = req.params;
        if (userId === "current") {
            const currentUser = req.session.currentUser;
            if (!currentUser) return res.sendStatus(401);
            userId = currentUser._id;
        }
        const status = dao.enrollUserInCourse(userId, courseId);
        res.json(status);
    });
    app.delete("/api/users/:userId/courses/:courseId", (req, res) => {
        let { userId, courseId } = req.params;
        if (userId === "current") {
            const currentUser = req.session.currentUser;
            if (!currentUser) return res.sendStatus(401);
            userId = currentUser._id;
        }
        const status = dao.unenrollUserFromCourse(userId, courseId);
        res.json(status);
    });
}
