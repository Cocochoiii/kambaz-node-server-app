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

// ---------- Environment Configuration ----------
const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "https://kambaz-next-js-final2.vercel.app";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kambaz";
const SESSION_SECRET = process.env.SESSION_SECRET || "super_secret_session_key_change_in_production";
const PORT = process.env.PORT || 4000;

console.log("🔧 Server initialization...");
console.log(`📝 Environment: ${isProd ? "production" : "development"}`);

// Trust proxy MUST come first
app.set("trust proxy", 1);

// ---------- CORS Configuration ----------
const corsOptions = {
    origin: function(origin, callback) {
        // Allow requests with no origin (server-to-server, Postman)
        if (!origin) return callback(null, true);

        // Allow localhost in development
        if (!isProd && (origin.includes("localhost") || origin.includes("127.0.0.1"))) {
            return callback(null, true);
        }

        // Allow any Vercel deployment
        if (origin.includes(".vercel.app")) {
            return callback(null, true);
        }

        // Allow configured frontend
        if (origin === FRONTEND_ORIGIN) {
            return callback(null, true);
        }

        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With", "Accept"],
    exposedHeaders: ["set-cookie"],
    maxAge: 86400,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ---------- Body Parsers ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- MongoDB Connection with Serverless Optimization ----------
const mongooseOptions = {
    serverSelectionTimeoutMS: 15000, // Increased for Vercel cold starts
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 1,
    retryWrites: true,
    w: "majority"
};

// Global promise to prevent multiple connections
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            ...mongooseOptions
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
}

// Initial connection attempt
connectDB().catch(err => {
    console.error("❌ Initial MongoDB connection failed:", err.message);
});

// ---------- Session Configuration ----------
const sessionConfig = {
    name: "kambaz_sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
                                 mongoUrl: MONGODB_URI,
                                 ttl: 24 * 60 * 60,
                                 touchAfter: 3600,
                                 mongoOptions: mongooseOptions
                             }),
    cookie: {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/"
    },
    proxy: isProd
};

app.use(session(sessionConfig));

// ---------- Database Connection Middleware ----------
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("DB Connection Error:", error.message);
        next(); // Continue anyway for health checks
    }
});

// ---------- Health Check Endpoints ----------
app.get("/", (req, res) => {
    res.json({
                 status: "healthy",
                 environment: isProd ? "production" : "development",
                 timestamp: new Date().toISOString()
             });
});

app.get("/api/health", async (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus = ["disconnected", "connected", "connecting", "disconnecting"][dbState];

    res.json({
                 status: dbState === 1 ? "healthy" : "degraded",
                 database: dbStatus,
                 environment: isProd ? "production" : "development",
                 timestamp: new Date().toISOString()
             });
});

// ---------- Test Endpoints ----------
app.post("/api/test-cors", (req, res) => {
    res.json({
                 success: true,
                 origin: req.headers.origin || "no-origin",
                 cookies: req.headers.cookie ? "present" : "none",
                 session: Boolean(req.session),
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

// ---------- Error Handler ----------
app.use((err, req, res, next) => {
    console.error("Error:", err.message);

    res.status(err.status || 500).json({
                                           message: err.message || "Internal server error"
                                       });
});

// ---------- 404 Handler ----------
app.use((req, res) => {
    res.status(404).json({
                             message: `Route not found: ${req.method} ${req.path}`
                         });
});

// ---------- Server Startup ----------
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

export default app;