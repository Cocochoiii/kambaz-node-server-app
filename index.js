import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import cors from "cors";
import "dotenv/config";

import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
import QuizRoutes from "./Kambaz/Quizzes/routes.js";
import Lab5 from "./Lab5/index.js";
import PazzaRoutes from "./Kambaz/Pazza/routes.js";
import AnnouncementRoutes from "./Kambaz/Announcements/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import GradeRoutes from "./Kambaz/Grades/routes.js";
import HomeRoutes from "./Kambaz/Home/routes.js";
import PeopleRoutes from "./Kambaz/People/routes.js";
import ZoomRoutes from "./Kambaz/Zoom/routes.js";
import InboxRoutes from "./Kambaz/Inbox/routes.js";
import SettingsRoutes from "./Kambaz/Settings/routes.js";

const app = express();

/* ----------------------------- ENV & MODES ----------------------------- */
const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;

// Frontend origins: localhost (dev) + your deployed Next site (prod)
const FRONTEND_ORIGIN =
    process.env.FRONTEND_ORIGIN || "https://kambaz-next-js-final.vercel.app";

// Mongo: use cloud URI in prod, fallback to local in dev
const MONGO_URI =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kambaz";

// Port only used when running locally
const PORT = process.env.PORT || 4000;

/* --------------------------------- CORS -------------------------------- */
app.use(
    cors({
             credentials: true,
             origin: isProd
                     ? FRONTEND_ORIGIN
                     : ["http://localhost:3000", "http://127.0.0.1:3000"],
             methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             allowedHeaders: ["Content-Type", "Authorization"],
         })
);

app.use(express.json());

/* --------------------------- PROXY / COOKIES --------------------------- */
// Required so set-cookie works behind Vercel/HTTPS
app.set("trust proxy", 1);

// Session cookie flags differ between dev and prod (cross-site on Vercel)
app.use(
    session({
                name: "kambaz.sid",
                secret: process.env.SESSION_SECRET || "super_secret_session_phrase",
                resave: false,
                saveUninitialized: false,
                proxy: true,
                cookie: {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000,
                    secure: isProd,            // must be true on Vercel/HTTPS
                    sameSite: isProd ? "none" : "lax", // cross-site cookie on Vercel
                    // DO NOT set domain; let the browser infer it
                },
            })
);

/* ----------------------------- DEBUG LOG ------------------------------- */
app.use((req, _res, next) => {
    console.log(
        `${req.method} ${req.path} | Origin: ${req.headers.origin || "n/a"} | User: ${
            req.session?.currentUser?.username || "none"
        }`
    );
    next();
});

/* ------------------------------ DATABASE ------------------------------- */
mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB error:", err));

/* -------------------------------- ROUTES ------------------------------- */
// (keep your existing paths & implementations)
UserRoutes(app);
CourseRoutes(app);
EnrollmentRoutes(app);
QuizRoutes(app);
Lab5(app);
AnnouncementRoutes(app);
AssignmentRoutes(app);
GradeRoutes(app);
HomeRoutes(app);
PeopleRoutes(app);
InboxRoutes(app);
SettingsRoutes(app);

// Routers already exported as express.Router() — mounted under /api
app.use("/api", PazzaRoutes);
app.use("/api", ZoomRoutes);

/* ---------------------------- SERVER EXPORT ---------------------------- */
// Run a server locally; export the app for Vercel serverless.
if (!process.env.VERCEL) {
    app.listen(PORT, () =>
        console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
}

export default app;
