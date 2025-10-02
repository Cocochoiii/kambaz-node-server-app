import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";

export default function UserRoutes(app) {
    // CRUD (admin-like)
    app.post("/api/users", (req, res) => res.json(dao.createUser(req.body)));
    app.get("/api/users", (req, res) => res.json(dao.findAllUsers()));
    app.get("/api/users/:userId", (req, res) => res.json(dao.findUserById(req.params.userId)));
    app.put("/api/users/:userId", (req, res) => {
        dao.updateUser(req.params.userId, req.body);
        const updated = dao.findUserById(req.params.userId);
        if (req.session?.currentUser && req.session.currentUser._id === req.params.userId) {
            req.session.currentUser = updated;
        }
        res.json(updated);
    });
    app.delete("/api/users/:userId", (req, res) => {
        dao.deleteUser(req.params.userId);
        res.sendStatus(200);
    });

    // auth
    app.post("/api/users/signup", (req, res) => {
        const exists = dao.findUserByUsername(req.body.username);
        if (exists) return res.status(400).json({ message: "Username already in use" });
        const currentUser = dao.createUser(req.body);
        req.session.currentUser = currentUser;
        res.json(currentUser);
    });

    app.post("/api/users/signin", (req, res) => {
        const { username, password } = req.body;
        const currentUser = dao.findUserByCredentials(username, password);
        if (!currentUser) return res.status(401).json({ message: "Unable to login. Try again later." });
        req.session.currentUser = currentUser;
        res.json(currentUser);
    });

    app.post("/api/users/profile", (req, res) => {
        const currentUser = req.session.currentUser;
        if (!currentUser) return res.sendStatus(401);
        res.json(currentUser);
    });

    app.post("/api/users/signout", (req, res) => {
        req.session.destroy(() => res.sendStatus(200));
    });

    // current user's courses
    app.get("/api/users/:userId/courses", (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session.currentUser;
            if (!currentUser) return res.sendStatus(401);
            userId = currentUser._id;
        }
        const courses = courseDao.findCoursesForEnrolledUser(userId);
        res.json(courses);
    });

    // create course owned by current user and auto-enroll
    app.post("/api/users/current/courses", async (req, res) => {
        const currentUser = req.session.currentUser;
        if (!currentUser) return res.sendStatus(401);
        const {createCourse} = await import("../Courses/dao.js");
        const {enrollUserInCourse} = await import("../Enrollments/dao.js");
        const newCourse = createCourse(req.body);
        enrollUserInCourse(currentUser._id, newCourse._id);
        res.json(newCourse);
    });
}
