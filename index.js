import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import "dotenv/config";

// Routes
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

// ---------- Environment ----------
const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
const FRONTEND_ORIGIN =
    process.env.FRONTEND_ORIGIN || "https://kambaz-next-js-final2.vercel.app";
const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kambaz";
const SESSION_SECRET =
    process.env.SESSION_SECRET || "super_secret_session_key_change_in_production";
const PORT = process.env.PORT || 4000;

console.log("🔧 Starting server configuration...");
console.log(`📝 Environment: ${isProd ? "production" : "development"}`);
console.log(`🔗 Frontend origin: ${FRONTEND_ORIGIN}`);
console.log(
    `🗄️ MongoDB URI: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@")}`
);

// Required for secure cookies behind Vercel/Proxies
app.set("trust proxy", 1);

// ---------- CORS (must be before parsers & routes) ----------
const corsOptions = {
    origin(origin, callback) {
        const allowedOrigins = isProd
                               ? [FRONTEND_ORIGIN, "https://kambaz-next-js-final2.vercel.app"]
                               : ["http://localhost:3000", "http://127.0.0.1:3000"];

        // Allow tools like curl/Postman (no origin header)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) return callback(null, true);

        console.warn(`⚠️ CORS blocked origin: ${origin}`);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cookie",
        "X-Requested-With",
    ],
    exposedHeaders: ["set-cookie"],
    maxAge: 86400, // cache preflight
    optionsSuccessStatus: 204, // some browsers expect 204
};

// Ensure the creds header is always present for all responses
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(cors(corsOptions));
// Handle preflight explicitly under /api (tighter than "*")
app.options("/api/*", cors(corsOptions));

// ---------- Parsers ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Mongo ----------
mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });

// ---------- Session (Mongo store) ----------
const sessionConfig = {
    name: "kambaz_sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
                                 mongoUrl: MONGODB_URI,
                                 ttl: 24 * 60 * 60, // 1 day
                                 touchAfter: 3600, // reduce write frequency
                                 crypto: { secret: SESSION_SECRET },
                             }),
    cookie: {
        httpOnly: true,
        secure: isProd, // HTTPS only in prod
        sameSite: isProd ? "none" : "lax", // cross-site cookies in prod
        maxAge: 24 * 60 * 60 * 1000, // 24h
        // no domain => let browser infer
    },
};

app.use(session(sessionConfig));

// ---------- Request log ----------
app.use((req, res, next) => {
    const ts = new Date().toISOString();
    const origin = req.headers.origin || "no-origin";
    const user = req.session?.currentUser?.username || "anonymous";
    console.log(`[${ts}] ${req.method} ${req.path}`);
    console.log(
        `  Origin: ${origin} | User: ${user} | Session: ${String(
            req.sessionID || ""
        ).slice(0, 8)}...`
    );
    next();
});

// ---------- Health ----------
app.get("/", (req, res) => {
    res.json({
                 status: "ok",
                 environment: isProd ? "production" : "development",
                 timestamp: new Date().toISOString(),
                 sessionConfigured: true,
                 mongoConnected: mongoose.connection.readyState === 1,
             });
});

app.get("/api", (req, res) => {
    res.json({
                 status: "ok",
                 message: "Kambaz API is running",
                 version: "1.0.0",
             });
});

// ---------- Routes ----------
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

// Router-based
app.use("/api", PazzaRoutes);
app.use("/api", ZoomRoutes);

// ---------- Errors ----------
app.use((err, req, res, next) => {
    console.error("❌ Error:", err.message || err);
    if (err.message === "Not allowed by CORS") {
        return res.status(403).json({
                                        message: "CORS policy violation",
                                        origin: req.headers.origin,
                                    });
    }
    res.status(err.status || 500).json({
                                           message: err.message || "Internal server error",
                                           ...(isProd ? {} : { error: String(err), stack: err.stack }),
                                       });
});

// ---------- 404 ----------
app.use((req, res) => {
    console.warn(`⚠️ 404: ${req.method} ${req.path}`);
    res.status(404).json({
                             message: `Route not found: ${req.method} ${req.path}`,
                             availableRoutes: [
                                 "/api/users/*",
                                 "/api/courses/*",
                                 "/api/enrollments/*",
                                 "/api/quizzes/*",
                                 "/api/pazza/*",
                                 "/api/announcements/*",
                                 "/api/assignments/*",
                                 "/api/grades/*",
                                 "/api/zoom/*",
                             ],
                         });
});

// ---------- Local start ----------
if (!process.env.VERCEL) {
    const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📝 Environment: ${isProd ? "production" : "development"}`);
        console.log(`🔗 Frontend origin: ${FRONTEND_ORIGIN}`);
        console.log("🍪 Session store: MongoDB");
    });

    process.on("SIGTERM", () => {
        console.log("SIGTERM: closing HTTP server");
        server.close(() => {
            mongoose.connection.close(false, () => {
                console.log("MongoDB connection closed");
                process.exit(0);
            });
        });
    });
}

export default app;
