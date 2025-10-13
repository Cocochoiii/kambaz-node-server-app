import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import "dotenv/config";

// Import all routes
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

// Environment Configuration
const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "https://kambaz-next-js-final.vercel.app";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kambaz";
const SESSION_SECRET = process.env.SESSION_SECRET || "super_secret_session_key_change_in_production";
const PORT = process.env.PORT || 4000;

console.log("🔧 Starting server configuration...");
console.log(`📝 Environment: ${isProd ? "production" : "development"}`);
console.log(`🔗 Frontend origin: ${FRONTEND_ORIGIN}`);
console.log(`🗄️ MongoDB URI: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);

// Trust proxy for Vercel/Heroku/etc
app.set("trust proxy", 1);

// CORS Configuration - CRITICAL for cross-origin cookies
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = isProd
                               ? [FRONTEND_ORIGIN, "https://kambaz-next-js-final.vercel.app"]
                               : ["http://localhost:3000", "http://127.0.0.1:3000"];

        // Allow requests with no origin (Postman, server-to-server, etc)
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`⚠️ CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // CRITICAL: Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["set-cookie"],
    maxAge: 86400, // Cache preflight for 24 hours
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB BEFORE setting up sessions
mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });

// Session Configuration with MongoDB store
const sessionConfig = {
    name: "kambaz_sid", // Cookie name
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
                                 mongoUrl: MONGODB_URI,
                                 ttl: 24 * 60 * 60, // 1 day TTL
                                 touchAfter: 3600, // Only update session once per hour
                                 crypto: {
                                     secret: SESSION_SECRET
                                 }
                             }),
    cookie: {
        httpOnly: true,
        secure: isProd, // HTTPS only in production
        sameSite: isProd ? "none" : "lax", // Cross-site cookies in production
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        // Do NOT set domain - let browser handle it
    },
};

app.use(session(sessionConfig));

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const origin = req.headers.origin || "no-origin";
    const user = req.session?.currentUser?.username || "anonymous";

    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    console.log(`  Origin: ${origin} | User: ${user} | Session: ${req.sessionID?.substring(0, 8)}...`);

    // Log cookies in dev mode for debugging
    if (!isProd && req.headers.cookie) {
        console.log(`  Cookies: ${req.headers.cookie.substring(0, 50)}...`);
    }

    next();
});

// Health check endpoint
app.get("/", (req, res) => {
    res.json({
                 status: "ok",
                 environment: isProd ? "production" : "development",
                 timestamp: new Date().toISOString(),
                 sessionConfigured: true,
                 mongoConnected: mongoose.connection.readyState === 1
             });
});

// API health check
app.get("/api", (req, res) => {
    res.json({
                 status: "ok",
                 message: "Kambaz API is running",
                 version: "1.0.0"
             });
});

// Mount all routes
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

// Mount router-based routes
app.use("/api", PazzaRoutes);
app.use("/api", ZoomRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("❌ Error:", err.message || err);
    console.error(err.stack);

    // CORS errors
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
                                        message: "CORS policy violation",
                                        origin: req.headers.origin
                                    });
    }

    res.status(err.status || 500).json({
                                           message: err.message || "Internal server error",
                                           ...(isProd ? {} : { error: err.toString(), stack: err.stack })
                                       });
});

// 404 handler
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

// Start server only if not on Vercel
if (!process.env.VERCEL) {
    const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📝 Environment: ${isProd ? "production" : "development"}`);
        console.log(`🔗 Frontend origin: ${FRONTEND_ORIGIN}`);
        console.log(`🍪 Session store: MongoDB`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('SIGTERM signal received: closing HTTP server');
        server.close(() => {
            console.log('HTTP server closed');
            mongoose.connection.close(false, () => {
                console.log('MongoDB connection closed');
                process.exit(0);
            });
        });
    });
}

export default app;