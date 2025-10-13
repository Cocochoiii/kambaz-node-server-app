import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import bcrypt from "bcryptjs";

/** Remove sensitive fields before sending to client */
const sanitize = (u) => {
  if (!u) return u;
  const { password, ...rest } = u;
  return rest;
};

/** Detect if a stored password looks like a bcrypt hash */
const isBcryptHash = (val) =>
    typeof val === "string" && /^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/.test(val);

/** Normalize role from UI labels to schema enum */
const normalizeRole = (role) => {
  const allowed = ["STUDENT", "TA", "FACULTY", "ADMIN", "USER"];
  const upper = (role || "STUDENT").toString().toUpperCase();
  return allowed.includes(upper) ? upper : "STUDENT";
};

export default function UserRoutes(app) {
  // Create user (admin endpoint)
  app.post("/api/users", async (req, res) => {
    try {
      const data = { ...req.body };
      if (data.role) data.role = normalizeRole(data.role);
      const user = await dao.createUser(data);
      res.json(sanitize(user));
    } catch (error) {
      console.error("Create user error:", error);
      if (error?.code === 11000) {
        return res.status(400).json({ message: "Username or email already exists" });
      }
      if (error?.name === "ValidationError") {
        return res.status(400).json({ message: "Invalid user data", details: error.message });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Read users (with filters)
  app.get("/api/users", async (req, res) => {
    try {
      const { role, name } = req.query;
      if (role) return res.json((await dao.findUsersByRole(normalizeRole(role))).map(sanitize));
      if (name) return res.json((await dao.findUsersByPartialName(name)).map(sanitize));
      res.json((await dao.findAllUsers()).map(sanitize));
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Get single user
  app.get("/api/users/:userId", async (req, res) => {
    try {
      const user = await dao.findUserById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(sanitize(user));
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user (with session refresh if same user)
  app.put("/api/users/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      // Security check: users can only update their own profile unless admin
      const currentUser = req.session?.currentUser;
      if (!currentUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      if (currentUser._id !== userId && currentUser.role !== "ADMIN") {
        return res.status(403).json({ message: "Not authorized to update this user" });
      }

      const updates = { ...req.body };

      // Normalize role if provided
      if (typeof updates.role !== "undefined") {
        updates.role = normalizeRole(updates.role);
      }

      // If password is being changed, hash it (backwards-compatible)
      if (typeof updates.password === "string" && updates.password.length > 0) {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);
      } else {
        delete updates.password; // avoid accidentally nulling it out
      }

      await dao.updateUser(userId, updates);
      const updated = await dao.findUserById(userId);

      // Update session if user updated their own profile
      if (currentUser._id === userId) {
        req.session.currentUser = sanitize(updated);
        await new Promise((resolve, reject) => {
          req.session.save((err) => (err ? reject(err) : resolve()));
        });
        console.log("✅ Session updated for user:", updated?.username);
      }

      res.json(sanitize(updated));
    } catch (error) {
      console.error("Update user error:", error);
      if (error?.name === "ValidationError") {
        return res.status(400).json({ message: "Invalid user data", details: error.message });
      }
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Delete user (admin only)
  app.delete("/api/users/:userId", async (req, res) => {
    try {
      const currentUser = req.session?.currentUser;
      if (!currentUser || currentUser.role !== "ADMIN") {
        return res.status(403).json({ message: "Admin access required" });
      }
      await dao.deleteUser(req.params.userId);
      res.sendStatus(200);
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // SIGNUP - Create account and establish session
  app.post("/api/users/signup", async (req, res) => {
    try {
      const { username, password, email, firstName, lastName, role } = req.body || {};

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const existing = await dao.findUserByUsername(username);
      if (existing) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Hash password and create user
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const userData = {
        username,
        password: hash,
        email: email || "",
        firstName: firstName || "",
        lastName: lastName || "",
        role: normalizeRole(role),
      };

      const created = await dao.createUser(userData);
      const safe = sanitize(created);

      req.session.currentUser = safe;
      await new Promise((resolve, reject) => {
        req.session.save((err) => (err ? reject(err) : resolve()));
      });

      console.log("✅ User signed up and session saved:", safe.username);
      res.json(safe);
    } catch (err) {
      if (err?.code === 11000) {
        return res.status(400).json({ message: "Username or email already exists" });
      }
      if (err?.name === "ValidationError") {
        return res.status(400).json({ message: "Invalid signup data", details: err.message });
      }
      console.error("Signup error:", err);
      res.status(500).json({ message: "Signup failed. Please try again." });
    }
  });

  // SIGNIN - Authenticate and establish session
  app.post("/api/users/signin", async (req, res) => {
    try {
      const { username, password } = req.body || {};
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const found = await dao.findUserByUsername(username);
      if (!found) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const stored = found.password || "";
      let ok = false;
      if (isBcryptHash(stored)) {
        ok = await bcrypt.compare(password, stored);
      } else {
        ok = stored === password; // legacy users
      }
      if (!ok) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const safe = sanitize(found);
      req.session.currentUser = safe;
      await new Promise((resolve, reject) => {
        req.session.save((err) => (err ? reject(err) : resolve()));
      });

      console.log("✅ User signed in and session saved:", safe.username, "| Role:", safe.role);
      res.json(safe);
    } catch (err) {
      console.error("Signin error:", err);
      res.status(500).json({ message: "Signin failed. Please try again." });
    }
  });

  // PROFILE - Get current user from session (POST for compatibility)
  app.post("/api/users/profile", async (req, res) => {
    try {
      const currentUser = req.session?.currentUser;
      if (!currentUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const freshUser = await dao.findUserById(currentUser._id);
      if (!freshUser) {
        req.session.destroy(() => {});
        return res.status(401).json({ message: "User no longer exists" });
      }

      const safe = sanitize(freshUser);
      if (JSON.stringify(currentUser) !== JSON.stringify(safe)) {
        req.session.currentUser = safe;
        await new Promise((resolve) => req.session.save(resolve));
      }

      res.json(safe);
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // PROFILE - GET endpoint for convenience
  app.get("/api/users/profile", (req, res) => {
    const currentUser = req.session?.currentUser;
    if (!currentUser) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(currentUser);
  });

  // Alternative profile endpoint
  app.get("/api/users/me", (req, res) => {
    const me = req.session?.currentUser;
    if (!me) {
      return res.status(401).json({ message: "Not signed in" });
    }
    res.json(me);
  });

  // DEBUG endpoint - Check session status (dev only)
  app.get("/api/debug/session", (req, res) => {
    if (process.env.NODE_ENV === "production") {
      return res.status(404).json({ message: "Not found" });
    }
    res.json({
               hasCookieHeader: Boolean(req.headers.cookie),
               cookies: req.headers.cookie || "none",
               sessionID: req.sessionID || "none",
               sessionExists: Boolean(req.session),
               currentUser: req.session?.currentUser || null,
               origin: req.headers.origin || null,
               userAgent: req.headers["user-agent"] || null,
             });
  });

  // SIGNOUT - Destroy session
  app.post("/api/users/signout", (req, res) => {
    const username = req.session?.currentUser?.username;
    req.session.destroy((err) => {
      if (err) {
        console.error("Signout error:", err);
        return res.status(500).json({ message: "Failed to sign out" });
      }
      console.log("✅ User signed out:", username || "unknown");
      res.clearCookie("kambaz_sid");
      res.json({ message: "Signed out successfully" });
    });
  });

  // Get courses for a user
  app.get("/api/users/:uid/courses", async (req, res) => {
    try {
      let { uid } = req.params;
      const currentUser = req.session?.currentUser;

      if (uid === "current") {
        if (!currentUser) {
          return res.status(401).json({ message: "Not authenticated" });
        }
        uid = currentUser._id;
      }

      if (currentUser && currentUser.role === "ADMIN") {
        return res.json(await courseDao.findAllCourses());
      }

      res.json(await enrollmentsDao.findCoursesForUser(uid));
    } catch (error) {
      console.error("Get user courses error:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  // Enroll user in course
  app.post("/api/users/:uid/courses/:cid", async (req, res) => {
    try {
      let { uid, cid } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      if (uid === "current") uid = currentUser._id;
      if (cid === "current") cid = req.body.courseId || "";

      res.json(await enrollmentsDao.enrollUserInCourse(uid, cid));
    } catch (error) {
      console.error("Enroll error:", error);
      res.status(500).json({ message: "Failed to enroll in course" });
    }
  });

  // Unenroll user from course
  app.delete("/api/users/:uid/courses/:cid", async (req, res) => {
    try {
      let { uid, cid } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      if (uid === "current") uid = currentUser._id;
      if (cid === "current") cid = req.body.courseId || "";

      res.json(await enrollmentsDao.unenrollUserFromCourse(uid, cid));
    } catch (error) {
      console.error("Unenroll error:", error);
      res.status(500).json({ message: "Failed to unenroll from course" });
    }
  });
}
