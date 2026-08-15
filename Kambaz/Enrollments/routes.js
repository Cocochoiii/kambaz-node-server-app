import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
    const enrollUserInCourse = async (req, res) => {
        let { userId, courseId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const status = await dao.enrollUserInCourse(userId, courseId);
        res.json(status);
    };

    const unenrollUserFromCourse = async (req, res) => {
        let { userId, courseId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const status = await dao.unenrollUserFromCourse(userId, courseId);
        res.json(status);
    };

    app.post("/api/users/:userId/courses/:courseId", enrollUserInCourse);
    app.delete("/api/users/:userId/courses/:courseId", unenrollUserFromCourse);
}
