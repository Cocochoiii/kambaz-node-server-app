// Kambaz/People/routes.js
import * as peopleDao from "./dao.js";
import * as usersDao from "../Users/dao.js";

/** Guard: must be signed in & faculty to mutate */
const requireFaculty = (req, res, next) => {
    const currentUser = req.session?.currentUser;
    if (!currentUser) return res.sendStatus(401);
    if ((currentUser.role || "").toUpperCase() !== "FACULTY") return res.sendStatus(403);
    next();
};

export default function PeopleRoutes(app) {
    // List roster for a course
    const listPeople = (req, res) => {
        const { courseId } = req.params;
        const people = peopleDao.findPeopleForCourse(courseId);
        res.json(people);
    };

    // Enroll an existing user by userId, or create+enroll if body.user is provided
    const enroll = (req, res) => {
        const { courseId } = req.params;
        const { userId, user } = req.body || {};

        let targetUser = null;

        if (userId) {
            targetUser = usersDao.findUserById(userId);
            if (!targetUser) return res.status(404).json({ message: "User not found" });
        } else if (user && user.username) {
            // create the user (simple path, mirrors a5 users DAO)
            const existing = usersDao.findUserByUsername(user.username);
            if (existing) return res.status(400).json({ message: "Username already in use" });
            targetUser = usersDao.createUser(user);
        } else {
            return res.status(400).json({ message: "Provide userId or user payload" });
        }

        peopleDao.enrollUserInCourse(targetUser._id, courseId);
        // Return refreshed roster (handy for client state)
        const roster = peopleDao.findPeopleForCourse(courseId);
        res.json(roster);
    };

    // Unenroll a user from the course
    const unenroll = (req, res) => {
        const { courseId, userId } = req.params;
        const result = peopleDao.unenrollUserFromCourse(userId, courseId);
        if (!result.removed) return res.status(404).json({ message: "Enrollment not found" });
        res.sendStatus(200);
    };

    // Optional: quick user updates (role/section/loginId/first/last)
    const updateUserLight = (req, res) => {
        const { userId } = req.params;
        const allowed = {};
        const fields = ["firstName", "lastName", "loginId", "section", "role"];
        for (const k of fields) if (k in req.body) allowed[k] = req.body[k];

        const user = usersDao.findUserById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        usersDao.updateUser(userId, { ...user, ...allowed });
        const updated = usersDao.findUserById(userId);
        res.json(updated);
    };

    // Routes
    app.get("/api/courses/:courseId/people", listPeople);
    app.post("/api/courses/:courseId/people", requireFaculty, enroll);
    app.delete("/api/courses/:courseId/people/:userId", requireFaculty, unenroll);
    app.patch("/api/courses/:courseId/people/:userId", requireFaculty, updateUserLight);
}
