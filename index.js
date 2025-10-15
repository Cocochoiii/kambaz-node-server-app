// index.js
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
import SeedRoutes from "./Kambaz/Seed/routes.js";

const app = express();

// Environment Configuration
const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "https://kambaz-next-js-final2.vercel.app";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kambaz";
const SESSION_SECRET = process.env.SESSION_SECRET || "super_secret_session_key_change_in_production";
const PORT = process.env.PORT || 4000;

console.log("🔧 Server initialization...");
console.log(`📝 Environment: ${isProd ? "production" : "development"}`);

// Trust proxy MUST come first
app.set("trust proxy", 1);

// CORS Configuration
const corsOptions = {
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (!isProd && (origin.includes("localhost") || origin.includes("127.0.0.1"))) {
            return callback(null, true);
        }
        if (origin.includes(".vercel.app")) {
            return callback(null, true);
        }
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

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const mongooseOptions = {
    serverSelectionTimeoutMS: 15000,
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
        console.log("✅ MongoDB connected");
        return cached.conn;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
}

// Initial connection
connectDB().catch(err => {
    console.error("❌ Initial connection failed:", err.message);
});

// Session Configuration
const sessionConfig = {
    name: "kambaz_sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
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

// Database Connection Middleware
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("DB Connection Error:", error.message);
        next();
    }
});

// Auto-initialization middleware - runs on first API request if DB is empty
app.use(async (req, res, next) => {
    try {
        // Only check on API requests
        if (!req.path.startsWith('/api')) {
            return next();
        }

        // Skip seed-specific endpoints
        if (req.path.includes('/api/seed/') || req.path === '/api/force-reseed') {
            return next();
        }

        // Use a global flag to avoid checking multiple times
        if (!global.dataInitialized) {
            const { Folder, Post } = await import("./Kambaz/Pazza/models.js");
            const QuizModel = (await import("./Kambaz/Quizzes/model.js")).default;
            const QuestionModel = (await import("./Kambaz/Quizzes/questionModel.js")).default;

            // Check if data exists
            const counts = {
                folders: await Folder.countDocuments(),
                posts: await Post.countDocuments(),
                quizzes: await QuizModel.countDocuments(),
                questions: await QuestionModel.countDocuments()
            };

            console.log("📊 Data check:", counts);

            // If any collection is empty, initialize all
            if (counts.folders === 0 || counts.posts === 0 || counts.quizzes === 0 || counts.questions === 0) {
                console.log("🔄 Auto-initializing database with seed data...");

                const { pazzaSeedData } = await import("./Kambaz/Database/pazza.js");
                const { quizzesSeed } = await import("./Kambaz/Database/quizzes.js");
                const { questionsSeed } = await import("./Kambaz/Database/questions.js");

                // Initialize Pazza folders
                if (counts.folders === 0 && pazzaSeedData?.folders) {
                    await Folder.insertMany(pazzaSeedData.folders);
                    console.log(`✅ Inserted ${pazzaSeedData.folders.length} folders`);
                }

                // Initialize Pazza posts
                if (counts.posts === 0 && pazzaSeedData?.posts) {
                    const processedPosts = pazzaSeedData.posts.map(post => {
                        const postCopy = { ...post };

                        // Process answers
                        const postAnswers = pazzaSeedData.answers?.filter(a => a.postId === post._id) || [];
                        postCopy.studentAnswers = postAnswers
                            .filter(a => a.authorRole === 'STUDENT')
                            .map(a => ({
                                _id: a._id,
                                author: a.author,
                                authorRole: a.authorRole,
                                authorName: a.authorName,
                                content: a.content,
                                timestamp: new Date(a.createdAt),
                                isGoodAnswer: a.isGoodAnswer || false
                            }));

                        postCopy.instructorAnswers = postAnswers
                            .filter(a => ['FACULTY', 'TA', 'INSTRUCTOR'].includes(a.authorRole))
                            .map(a => ({
                                _id: a._id,
                                author: a.author,
                                authorRole: a.authorRole,
                                authorName: a.authorName,
                                content: a.content,
                                timestamp: new Date(a.createdAt),
                                isGoodAnswer: a.isGoodAnswer || false
                            }));

                        // Process followups
                        const postFollowups = (pazzaSeedData.followups || [])
                            .filter(f => f.postId === post._id && !f.parentId)
                            .map(f => {
                                const replies = (pazzaSeedData.followups || [])
                                    .filter(r => r.parentId === f._id)
                                    .map(r => ({
                                        _id: r._id,
                                        author: r.author,
                                        authorRole: r.authorRole,
                                        authorName: r.authorName,
                                        content: r.content,
                                        timestamp: new Date(r.createdAt)
                                    }));

                                return {
                                    _id: f._id,
                                    author: f.author,
                                    authorRole: f.authorRole,
                                    authorName: f.authorName,
                                    content: f.content,
                                    isResolved: f.isResolved || false,
                                    timestamp: new Date(f.createdAt),
                                    replies
                                };
                            });

                        postCopy.followups = postFollowups;
                        postCopy.hasInstructorAnswer = postCopy.instructorAnswers.length > 0;
                        postCopy.hasStudentAnswer = postCopy.studentAnswers.length > 0;
                        postCopy.createdAt = new Date(postCopy.createdAt);
                        postCopy.updatedAt = new Date(postCopy.updatedAt);

                        return postCopy;
                    });

                    await Post.insertMany(processedPosts);
                    console.log(`✅ Inserted ${processedPosts.length} posts`);
                }

                // Initialize Quizzes
                if (counts.quizzes === 0 && quizzesSeed) {
                    await QuizModel.insertMany(quizzesSeed);
                    console.log(`✅ Inserted ${quizzesSeed.length} quizzes`);
                }

                // Initialize Questions
                if (counts.questions === 0 && questionsSeed) {
                    await QuestionModel.insertMany(questionsSeed);
                    console.log(`✅ Inserted ${questionsSeed.length} questions`);

                    // Update quiz points
                    const quizIds = [...new Set(questionsSeed.map(q => q.quiz))];
                    for (const quizId of quizIds) {
                        const questions = questionsSeed.filter(q => q.quiz === quizId);
                        const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
                        await QuizModel.updateOne(
                            { _id: quizId },
                            { $set: { points: totalPoints } }
                        );
                    }
                    console.log("✅ Updated quiz points");
                }

                console.log("✅ Auto-initialization complete!");
            }

            global.dataInitialized = true;
        }

        next();
    } catch (error) {
        console.error("❌ Auto-initialization error:", error);
        // Continue anyway - don't block requests
        next();
    }
});

// Force reseed endpoint (useful for testing)
app.post("/api/force-reseed", async (req, res) => {
    try {
        console.log("🔄 Force reseeding database...");

        const { Folder, Post } = await import("./Kambaz/Pazza/models.js");
        const QuizModel = (await import("./Kambaz/Quizzes/model.js")).default;
        const QuestionModel = (await import("./Kambaz/Quizzes/questionModel.js")).default;

        // Clear existing data
        await Folder.deleteMany({});
        await Post.deleteMany({});
        await QuizModel.deleteMany({});
        await QuestionModel.deleteMany({});

        // Reset the global flag
        global.dataInitialized = false;

        res.json({
                     success: true,
                     message: "Database cleared. Will reseed on next request."
                 });
    } catch (error) {
        console.error("Error in force reseed:", error);
        res.status(500).json({ error: error.message });
    }
});

// Health Check Endpoints
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

// Test Endpoints
app.post("/api/test-cors", (req, res) => {
    res.json({
                 success: true,
                 origin: req.headers.origin || "no-origin",
                 cookies: req.headers.cookie ? "present" : "none",
                 session: Boolean(req.session),
                 timestamp: new Date().toISOString()
             });
});

// API Routes
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
SeedRoutes(app);  // Your manual seed routes

// Router-based routes
app.use("/api", PazzaRoutes);
app.use("/api", ZoomRoutes);

// Error Handler
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(err.status || 500).json({
                                           message: err.message || "Internal server error"
                                       });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
                             message: `Route not found: ${req.method} ${req.path}`
                         });
});

// Server Startup
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

export default app;