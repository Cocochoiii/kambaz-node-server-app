// index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";

import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";

const app = express();

/**
 * CORS – must be before sessions and routes.
 * In dev, allow Next.js on 3000.
 */
app.use(
    cors({
             origin: process.env.CLIENT_URL || "http://localhost:3000",
             credentials: true, // ok to keep true; client can still send requests with credentials off
         })
);

/**
 * Parse JSON bodies before routes.
 */
app.use(express.json());

/**
 * Sessions – harmless for Lab 5, required later for multi-user auth.
 * Leave as-is, with production cookie tweak gated by SERVER_ENV.
 */
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
};

if (process.env.SERVER_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
        // strip protocol from SERVER_URL if present
        domain: process.env.SERVER_URL?.replace(/^https?:\/\//, ""),
    };
}

app.use(session(sessionOptions));

/**
 * Routes
 */
Lab5(app);
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
