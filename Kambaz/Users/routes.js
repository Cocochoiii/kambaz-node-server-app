import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
  // Create user
  app.post("/api/users", async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  });

  // Read users (filters)
  app.get("/api/users", async (req, res) => {
    const { role, name } = req.query;
    if (role) return res.json(await dao.findUsersByRole(role));
    if (name) return res.json(await dao.findUsersByPartialName(name));
    res.json(await dao.findAllUsers());
  });

  // Single user
  app.get("/api/users/:userId", async (req, res) => {
    res.json(await dao.findUserById(req.params.userId));
  });

  // Update user (+ refresh session user if same)
  app.put("/api/users/:userId", async (req, res) => {
    const { userId } = req.params;
    await dao.updateUser(userId, req.body);
    const updated = await dao.findUserById(userId);

    if (req.session.currentUser && req.session.currentUser._id === userId) {
      req.session.currentUser = updated;
      await new Promise((resolve) => req.session.save(resolve));
    }

    res.json(updated);
  });

  // Delete user
  app.delete("/api/users/:userId", async (req, res) => {
    await dao.deleteUser(req.params.userId);
    res.sendStatus(200);
  });

  // Signup -> set session
  app.post("/api/users/signup", async (req, res) => {
    try {
      const existing = await dao.findUserByUsername(req.body.username);
      if (existing) return res.status(400).json({ message: "Username already taken" });

      const currentUser = await dao.createUser(req.body);
      req.session.currentUser = currentUser;
      await new Promise((resolve, reject) =>
                            req.session.save((err) => (err ? reject(err) : resolve()))
      );

      console.log("✅ User signed up and session saved:", currentUser.username);
      res.json(currentUser);
    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ message: "Signup failed" });
    }
  });

  // Signin -> set session
  app.post("/api/users/signin", async (req, res) => {
    try {
      const { username, password } = req.body;
      const currentUser = await dao.findUserByCredentials(username, password);
      if (!currentUser) return res.status(401).json({ message: "Invalid credentials" });

      req.session.currentUser = currentUser;
      await new Promise((resolve, reject) =>
                            req.session.save((err) => (err ? reject(err) : resolve()))
      );

      console.log("✅ User signed in and session saved:", currentUser.username, "Role:", currentUser.role);
      res.json(currentUser);
    } catch (err) {
      console.error("Signin error:", err);
      res.status(500).json({ message: "Signin failed" });
    }
  });

  /** Session helpers */
  // POST profile (already used by your frontend)
  app.post("/api/users/profile", (req, res) => {
    const currentUser = req.session.currentUser;
    if (!currentUser) return res.sendStatus(401);
    res.json(currentUser);
  });

  // GET profile (optional convenience)
  app.get("/api/users/me", (req, res) => {
    const me = req.session?.currentUser || null;
    if (!me) return res.status(401).json({ error: "Not signed in" });
    res.json(me);
  });

  // Debug: inspect session quickly from browser
  app.get("/api/debug/session", (req, res) => {
    res.json({
               hasCookieHeader: Boolean(req.headers.cookie),
               sessionID: req.sessionID,
               currentUser: req.session?.currentUser || null,
               origin: req.headers.origin || null,
             });
  });

  // Signout -> destroy session
  app.post("/api/users/signout", (req, res) => {
    req.session.destroy((err) => {
      if (err) console.error("Signout error:", err);
      res.sendStatus(200);
    });
  });

  /** Courses for user (uses session when :uid = current) */
  app.get("/api/users/:uid/courses", async (req, res) => {
    let { uid } = req.params;
    const currentUser = req.session.currentUser;

    if (uid === "current") {
      if (!currentUser) return res.sendStatus(401);
      uid = currentUser._id;
    }

    if (currentUser && currentUser.role === "ADMIN") {
      return res.json(await courseDao.findAllCourses());
    }

    res.json(await enrollmentsDao.findCoursesForUser(uid));
  });

  app.post("/api/users/:uid/courses/:cid", async (req, res) => {
    let { uid, cid } = req.params;
    const currentUser = req.session.currentUser;
    if (!currentUser) return res.sendStatus(401);

    if (uid === "current") uid = currentUser._id;
    if (cid === "current") cid = req.body.courseId || "";
    res.json(await enrollmentsDao.enrollUserInCourse(uid, cid));
  });

  app.delete("/api/users/:uid/courses/:cid", async (req, res) => {
    let { uid, cid } = req.params;
    const currentUser = req.session.currentUser;
    if (!currentUser) return res.sendStatus(401);

    if (uid === "current") uid = currentUser._id;
    if (cid === "current") cid = req.body.courseId || "";
    res.json(await enrollmentsDao.unenrollUserFromCourse(uid, cid));
  });
}
