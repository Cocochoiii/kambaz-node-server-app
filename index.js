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
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "https://kambaz-next-js-final2.vercel.app";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kambaz";
const SESSION_SECRET = process.env.SESSION_SECRET || "super_secret_session_key_change_in_production";
const PORT = process.env.PORT || 4000;

console.log("🔧 Starting server configuration...");
console.log(`📝 Environment: ${isProd ? "production" : "development"}`);
console.log(`🔗 Frontend origin: ${FRONTEND_ORIGIN}`);

// IMPORTANT: Trust proxy MUST come first before any middleware
app.set("trust proxy", 1);

// ---------- CORS Configuration ----------
const corsOptions = {
    origin: function(origin, callback) {
        // Allowed origins
        const allowedOrigins = isProd
                               ? [
                "https://kambaz-next-js-final2.vercel.app",
                "https://kambaz-next-js-final2-git-final2-cocos-projects-e10dec21.vercel.app",
                "https://kambaz-next-js-final2-ko970vqw5-cocos-projects-e10dec21.vercel.app"
            ]
                               : ["http://localhost:3000", "http://127.0.0.1:3000"];

        // Allow requests with no origin (mobile apps, curl, postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // IMPORTANT: Allow ANY Vercel preview deployment for your project
        if (isProd && origin.includes("vercel.app") &&
            (origin.includes("kambaz-next-js-final2") ||
             origin.includes("cocos-projects"))) {
            console.log(`✅ Allowing Vercel preview: ${origin}`);
            return callback(null, true);
        }

        console.warn(`⚠️ CORS blocked origin: ${origin}`);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
    exposedHeaders: ["set-cookie"],
    maxAge: 86400,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle OPTIONS preflight requests
app.options("*", cors(corsOptions));

// ---------- Body Parsers ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- MongoDB Connection ----------
mongoose
    .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        if (process.env.VERCEL) {
            // Don't exit in Vercel, let it handle the error
            console.error("MongoDB connection failed but continuing for Vercel");
        } else {
            process.exit(1);
        }
    });

// ---------- Session Configuration ----------
const sessionConfig = {
    name: "kambaz_sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
                                 mongoUrl: MONGODB_URI,
                                 ttl: 24 * 60 * 60, // 1 day
                                 touchAfter: 3600, // 1 hour
                                 crypto: { secret: SESSION_SECRET }
                             }),
    cookie: {
        httpOnly: true,
        secure: isProd, // HTTPS only in production
        sameSite: isProd ? "none" : "lax", // 'none' for cross-origin in production
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: "/",
        // No domain restriction - let browser handle it
    },
    proxy: isProd // Trust the proxy in production
};

app.use(session(sessionConfig));

// ---------- Request Logging ----------
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const origin = req.headers.origin || "no-origin";
    const user = req.session?.currentUser?.username || "anonymous";

    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    console.log(`  Origin: ${origin} | User: ${user} | Session: ${req.sessionID?.slice(0, 8)}...`);

    // Debug cookies in production
    if (isProd && req.path.includes("/users/")) {
        console.log("  Cookies:", req.headers.cookie ? "present" : "none");
    }

    next();
});

// ---------- Health Check Endpoints ----------
app.get("/", (req, res) => {
    res.json({
                 status: "ok",
                 environment: isProd ? "production" : "development",
                 timestamp: new Date().toISOString(),
                 mongoConnected: mongoose.connection.readyState === 1,
                 sessionConfigured: true,
                 corsEnabled: true
             });
});

app.get("/api", (req, res) => {
    res.json({
                 status: "ok",
                 message: "Kambaz API is running",
                 version: "1.0.0",
                 environment: isProd ? "production" : "development"
             });
});

// ---------- TEST CORS Endpoint ----------
// Add this debug endpoint to test CORS and sessions
app.post("/api/test-cors", (req, res) => {
    console.log("Test CORS - Origin:", req.headers.origin);
    console.log("Test CORS - Cookie:", req.headers.cookie ? "present" : "none");
    res.json({
                 origin: req.headers.origin,
                 hasCookie: Boolean(req.headers.cookie),
                 sessionExists: Boolean(req.session),
                 sessionID: req.sessionID || "none",
                 timestamp: new Date().toISOString()
             });
});

// ---------- API Routes ----------
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

// Router-based routes
app.use("/api", PazzaRoutes);
app.use("/api", ZoomRoutes);

// ---------- Debug Endpoint ----------
app.get("/api/debug/session", (req, res) => {
    if (process.env.NODE_ENV === "production" && !req.query.secret) {
        return res.status(404).json({ message: "Not found" });
    }

    res.json({
                 environment: isProd ? "production" : "development",
                 origin: req.headers.origin || null,
                 hasCookie: Boolean(req.headers.cookie),
                 cookieHeader: req.headers.cookie || "none",
                 sessionID: req.sessionID || "none",
                 sessionExists: Boolean(req.session),
                 currentUser: req.session?.currentUser || null,
                 trustProxy: app.get("trust proxy"),
                 secure: req.secure,
                 protocol: req.protocol
             });
});

// ---------- Error Handler ----------
app.use((err, req, res, next) => {
    console.error("❌ Error:", err.message || err);

    if (err.message === "Not allowed by CORS") {
        return res.status(403).json({
                                        message: "CORS policy violation",
                                        origin: req.headers.origin
                                    });
    }

    res.status(err.status || 500).json({
                                           message: err.message || "Internal server error",
                                           ...(isProd ? {} : { error: String(err), stack: err.stack })
                                       });
});

// ---------- 404 Handler ----------
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
                                 "/api/zoom/*"
                             ]
                         });
});

// ---------- Server Startup ----------
if (!process.env.VERCEL) {
    const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📝 Environment: ${isProd ? "production" : "development"}`);
        console.log(`🔗 Frontend origin: ${FRONTEND_ORIGIN}`);
        console.log("🍪 Session store: MongoDB");
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
        console.log("SIGTERM: Closing HTTP server");
        server.close(() => {
            mongoose.connection.close(false, () => {
                console.log("MongoDB connection closed");
                process.exit(0);
            });
        });
    });
}

export default app;