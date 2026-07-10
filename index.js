import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import mongoose from "mongoose";
import seedDatabase from "./Kambaz/Database/seed.js";

import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
import AnnouncementRoutes from "./Kambaz/Announcements/routes.js";
import QuizRoutes from "./Kambaz/Quizzes/routes.js";
import SubmissionRoutes from "./Kambaz/Submissions/routes.js";

// Connect to MongoDB (Atlas in production, local by default) then seed if empty.
const CONNECTION_STRING =
    process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
mongoose
    .connect(CONNECTION_STRING)
    .then(async () => {
        console.log("Connected to MongoDB");
        await seedDatabase();
    })
    .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

// CORS must run before sessions and routes. Allow the client origin and cookies.
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
    })
);

app.use(express.json());

// Session. Use secure cross-site cookies only in production (https).
// In local dev keep plain cookies so login works over http://localhost.
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
};
const isProduction =
    process.env.SERVER_ENV === "production" || process.env.NODE_ENV === "production";
if (isProduction) {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
        domain: process.env.SERVER_URL?.replace(/^https?:\/\//, ""),
    };
}
app.use(session(sessionOptions));

Lab5(app);
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);
AnnouncementRoutes(app);
QuizRoutes(app);
SubmissionRoutes(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
