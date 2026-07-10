import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
    // CRUD (People screen)
    app.post("/api/users", async (req, res) => res.json(await dao.createUser(req.body)));
    app.get("/api/users", async (req, res) => {
        const { role, name } = req.query;
        if (role) return res.json(await dao.findUsersByRole(role));
        if (name) return res.json(await dao.findUsersByPartialName(name));
        res.json(await dao.findAllUsers());
    });
    app.get("/api/users/:userId", async (req, res) =>
        res.json(await dao.findUserById(req.params.userId))
    );
    app.put("/api/users/:userId", async (req, res) => {
        const { userId } = req.params;
        await dao.updateUser(userId, req.body);
        const updated = await dao.findUserById(userId);
        if (req.session?.currentUser && req.session.currentUser._id === userId) {
            req.session.currentUser = updated;
        }
        res.json(updated);
    });
    app.delete("/api/users/:userId", async (req, res) => {
        await dao.deleteUser(req.params.userId);
        res.sendStatus(200);
    });

    // auth
    app.post("/api/users/signup", async (req, res) => {
        const exists = await dao.findUserByUsername(req.body.username);
        if (exists) return res.status(400).json({ message: "Username already in use" });
        const currentUser = await dao.createUser(req.body);
        req.session.currentUser = currentUser;
        res.json(currentUser);
    });
    app.post("/api/users/signin", async (req, res) => {
        const { username, password } = req.body;
        const currentUser = await dao.findUserByCredentials(username, password);
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
    app.get("/api/users/:userId/courses", async (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session.currentUser;
            if (!currentUser) return res.sendStatus(401);
            userId = currentUser._id;
        }
        const courses = await courseDao.findCoursesForEnrolledUser(userId);
        res.json(courses);
    });

    // create course owned by current user and auto-enroll
    app.post("/api/users/current/courses", async (req, res) => {
        const currentUser = req.session.currentUser;
        if (!currentUser) return res.sendStatus(401);
        const newCourse = await courseDao.createCourse(req.body);
        await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
        res.json(newCourse);
    });
}
