// index.js
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import "dotenv/config";

// Import models directly
import { Folder, Post } from "./Kambaz/Pazza/models.js";
import { QuizModel, QuestionModel } from "./Kambaz/Quizzes/models.js";

// Import seed data
import { pazzaSeedData } from "./Kambaz/Database/pazza.js";
import { quizzesSeed } from "./Kambaz/Database/quizzes.js";
import { questionsSeed } from "./Kambaz/Database/questions.js";

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

// Data initialization function
let dataInitialized = false;
async function initializeData() {
    if (dataInitialized) return;

    try {
        console.log("🔄 Checking data initialization...");

        // Initialize Pazza data
        const existingFolders = await Folder.countDocuments().catch(() => 0);
        const existingPosts = await Post.countDocuments().catch(() => 0);

        console.log(`📊 Pazza: ${existingFolders} folders, ${existingPosts} posts`);

        if (existingFolders === 0 && pazzaSeedData?.folders) {
            await Folder.insertMany(pazzaSeedData.folders);
            console.log(`✅ Inserted ${pazzaSeedData.folders.length} Pazza folders`);
        }

        if (existingPosts === 0 && pazzaSeedData?.posts) {
            const processedPosts = pazzaSeedData.posts.map(post => {
                const postCopy = { ...post };

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
            console.log(`✅ Inserted ${processedPosts.length} Pazza posts`);
        }

        // Initialize Quiz data
        const existingQuizzes = await QuizModel.countDocuments().catch(() => 0);
        const existingQuestions = await QuestionModel.countDocuments().catch(() => 0);

        console.log(`📊 Quizzes: ${existingQuizzes} quizzes, ${existingQuestions} questions`);

        if (existingQuizzes === 0 && quizzesSeed?.length > 0) {
            await QuizModel.insertMany(quizzesSeed);
            console.log(`✅ Inserted ${quizzesSeed.length} quizzes`);
        }

        if (existingQuestions === 0 && questionsSeed?.length > 0) {
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

        dataInitialized = true;
        console.log("✅ Data initialization complete");
    } catch (error) {
        console.error("❌ Error during data initialization:", error);
        // Don't throw - let the server continue
    }
}

// Initial connection and data initialization
connectDB()
    .then(() => initializeData())
    .catch(err => {
        console.error("❌ Initial setup failed:", err.message);
    });

// Session Configuration
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

// Database Connection Middleware
app.use(async (req, res, next) => {
    try {
        await connectDB();
        // Ensure data is initialized on first request
        if (!dataInitialized) {
            await initializeData();
        }
        next();
    } catch (error) {
        console.error("DB Connection Error:", error.message);
        next();
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

// Manual initialization endpoint (for debugging/forcing re-initialization)
app.post("/api/init-data", async (req, res) => {
    try {
        console.log("🔄 Manual data initialization requested...");

        // Force re-initialization
        dataInitialized = false;
        await initializeData();

        // Get counts to verify
        const counts = {
            pazzaFolders: await Folder.countDocuments(),
            pazzaPosts: await Post.countDocuments(),
            quizzes: await QuizModel.countDocuments(),
            questions: await QuestionModel.countDocuments()
        };

        res.json({
                     success: true,
                     message: "Data initialization completed",
                     counts,
                     timestamp: new Date().toISOString()
                 });
    } catch (error) {
        console.error("Manual initialization error:", error);
        res.status(500).json({
                                 success: false,
                                 error: error.message
                             });
    }
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