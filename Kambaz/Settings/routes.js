import express from "express";
import * as dao from "./dao.js";
import * as usersDao from "../Users/dao.js"; // used to sync email/displayName into Users (optional)

/** best-effort parse "First Last" into {first,last} */
function splitName(displayName = "") {
    const name = displayName.trim();
    if (!name) return { firstName: "", lastName: "" };
    const parts = name.split(/\s+/);
    if (parts.length === 1) return { firstName: parts[0], lastName: "" };
    const firstName = parts.shift();
    const lastName = parts.join(" ");
    return { firstName, lastName };
}

export default function SettingsRoutes(app) {
    const router = express.Router();

    // session guard
    router.use((req, res, next) => {
        if (!req.session?.currentUser) return res.sendStatus(401);
        next();
    });

    // GET /api/settings  -> fetch or create defaults for current user
    router.get("/settings", async (req, res) => {
        const me = req.session.currentUser;
        const prefs = await dao.findOrCreateForUser(me);
        res.json(prefs);
    });

    // PUT /api/settings  -> save preferences (and sync minimal user data)
    router.put("/settings", async (req, res) => {
        const me = req.session.currentUser;
        const { displayName, email, darkMode, emailAlerts, pushAlerts } = req.body || {};

        // 1) persist preferences
        const updated = await dao.updateForUser(me._id, {
            ...(displayName !== undefined ? { displayName } : {}),
            ...(email !== undefined ? { email } : {}),
            ...(darkMode !== undefined ? { darkMode } : {}),
            ...(emailAlerts !== undefined ? { emailAlerts } : {}),
            ...(pushAlerts !== undefined ? { pushAlerts } : {}),
        });

        // 2) keep Users collection & session in sync for email/name (optional but nice)
        const userPatch = {};
        if (email !== undefined) userPatch.email = email;
        if (displayName !== undefined) {
            const { firstName, lastName } = splitName(displayName);
            userPatch.firstName = firstName;
            userPatch.lastName = lastName;
        }
        if (Object.keys(userPatch).length) {
            await usersDao.updateUser(me._id, userPatch);
            // refresh session copy
            const refreshed = { ...me, ...userPatch };
            req.session.currentUser = refreshed;
        }

        res.json(updated);
    });

    // POST /api/settings/reset -> reset to defaults from user profile
    router.post("/settings/reset", async (req, res) => {
        const me = req.session.currentUser;
        const reset = await dao.resetForUser(me);
        res.json(reset);
    });

    app.use("/api", router);
}
