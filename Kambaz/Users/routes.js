import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
  // Create user (admin endpoint)
  app.post("/api/users", async (req, res) => {
    try {
      const user = await dao.createUser(req.body);
      res.json(user);
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Read users (with filters)
  app.get("/api/users", async (req, res) => {
    try {
      const { role, name } = req.query;
      if (role) return res.json(await dao.findUsersByRole(role));
      if (name) return res.json(await dao.findUsersByPartialName(name));
      res.json(await dao.findAllUsers());
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
      res.json(user);
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

      await dao.updateUser(userId, req.body);
      const updated = await dao.findUserById(userId);

      // Update session if user updated their own profile
      if (currentUser._id === userId) {
        req.session.currentUser = updated;
        await new Promise((resolve, reject) => {
          req.session.save((err) => {
            if (err) {
              console.error("Session save error:", err);
              reject(err);
            } else {
              console.log("✅ Session updated for user:", updated.username);
              resolve();
            }
          });
        });
      }

      res.json(updated);
    } catch (error) {
      console.error("Update user error:", error);
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
      const { username, password, email, firstName, lastName, role } = req.body;

      // Validation
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      // Check if username exists
      const existing = await dao.findUserByUsername(username);
      if (existing) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Create user with defaults
      const userData = {
        username,
        password, // In production, hash this!
        email: email || "",
        firstName: firstName || "",
        lastName: lastName || "",
        role: role || "STUDENT",
      };

      const currentUser = await dao.createUser(userData);

      // Set session
      req.session.currentUser = currentUser;

      // Ensure session is saved before responding
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error("Session save error during signup:", err);
            reject(err);
          } else {
            console.log("✅ User signed up and session saved:", currentUser.username);
            resolve();
          }
        });
      });

      res.json(currentUser);
    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ message: "Signup failed. Please try again." });
    }
  });

  // SIGNIN - Authenticate and establish session
  app.post("/api/users/signin", async (req, res) => {
    try {
      const { username, password } = req.body;

      // Validation
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      // Find and verify user
      const currentUser = await dao.findUserByCredentials(username, password);
      if (!currentUser) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Set session
      req.session.currentUser = currentUser;

      // Ensure session is saved before responding
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error("Session save error during signin:", err);
            reject(err);
          } else {
            console.log("✅ User signed in and session saved:", currentUser.username, "| Role:", currentUser.role);
            resolve();
          }
        });
      });

      res.json(currentUser);
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

      // Optional: Refresh user data from database
      const freshUser = await dao.findUserById(currentUser._id);
      if (!freshUser) {
        // User was deleted
        req.session.destroy();
        return res.status(401).json({ message: "User no longer exists" });
      }

      // Update session with fresh data
      if (JSON.stringify(currentUser) !== JSON.stringify(freshUser)) {
        req.session.currentUser = freshUser;
        await new Promise((resolve) => req.session.save(resolve));
      }

      res.json(freshUser);
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
      res.clearCookie("kambaz_sid"); // Clear the session cookie
      res.json({ message: "Signed out successfully" });
    });
  });

  // Get courses for a user
  app.get("/api/users/:uid/courses", async (req, res) => {
    try {
      let { uid } = req.params;
      const currentUser = req.session?.currentUser;

      // Handle "current" keyword
      if (uid === "current") {
        if (!currentUser) {
          return res.status(401).json({ message: "Not authenticated" });
        }
        uid = currentUser._id;
      }

      // Admins see all courses
      if (currentUser && currentUser.role === "ADMIN") {
        return res.json(await courseDao.findAllCourses());
      }

      // Regular users see their enrolled courses
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

      // Handle "current" keyword
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

      // Handle "current" keyword
      if (uid === "current") uid = currentUser._id;
      if (cid === "current") cid = req.body.courseId || "";

      res.json(await enrollmentsDao.unenrollUserFromCourse(uid, cid));
    } catch (error) {
      console.error("Unenroll error:", error);
      res.status(500).json({ message: "Failed to unenroll from course" });
    }
  });
}