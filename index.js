import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import cors from "cors";
import "dotenv/config";

import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
import QuizRoutes from "./Kambaz/Quizzes/routes.js";

const app = express();

/** ✅ CORS: allow credentials from localhost (and 127.0.0.1 if you use it) */
app.use(
    cors({
             credentials: true,
             origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
             methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             allowedHeaders: ["Content-Type", "Authorization"],
         })
);

app.use(express.json());

/** ✅ Trust proxy for dev setups */
app.set("trust proxy", 1);

/** ✅ Session cookies for localhost (NO domain!) */
app.use(
    session({
                name: "kambaz.sid",
                secret: process.env.SESSION_SECRET || "super_secret_session_phrase",
                resave: false,
                saveUninitialized: false,
                proxy: true,
                cookie: {
                    secure: false,       // http in dev
                    httpOnly: true,      // not readable by JS
                    sameSite: "lax",
                    maxAge: 24 * 60 * 60 * 1000,
                },
            })
);

/** Debug: see user attached to session */
app.use((req, _res, next) => {
    console.log(
        `${req.method} ${req.path} - Origin: ${req.headers.origin || "n/a"} - User: ${
            req.session?.currentUser?.username || "none"
        }`
    );
    next();
});

/** Mongo */
const CONNECTION_STRING = "mongodb://127.0.0.1:27017/kambaz";
mongoose
    .connect(CONNECTION_STRING)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB error:", err));

/** Routes */
UserRoutes(app);
CourseRoutes(app);
EnrollmentRoutes(app);
QuizRoutes(app);

/** Server */
const PORT = 4000;
app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
);
