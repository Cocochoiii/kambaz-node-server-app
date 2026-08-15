import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import seedDatabase from "./Kambaz/Database/seed.js";

import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
import AnnouncementRoutes from "./Kambaz/Announcements/routes.js";
import QuizRoutes from "./Kambaz/Quizzes/routes.js";
import MeetingRoutes from "./Kambaz/Meetings/routes.js";
import MessageRoutes from "./Kambaz/Messages/routes.js";
import CalendarRoutes from "./Kambaz/Calendar/routes.js";
import GradeRoutes from "./Kambaz/Grades/routes.js";

// The database. At home it is the Mongo on my laptop.
// On Render the same name holds the Atlas address.
const CONNECTION_STRING =
    process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
mongoose
    .connect(CONNECTION_STRING)
    .then(async () => {
        console.log("Connected to MongoDB");
        await seedDatabase();
    })
    .catch((error) => console.error("MongoDB connection error:", error.message));

const app = express();

// CORS goes before the session and the routes.
// It lets the client send cookies.
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
    })
);

app.use(express.json());

// The session. Secure cookies only in production. They need https.
// At home plain cookies work over http://localhost.
// I do not set the cookie domain. The browser uses this host.
// The sessions live in MongoDB, not in memory. A free Render server
// goes to sleep, and a memory session would die with it.
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: CONNECTION_STRING,
        collectionName: "sessions",
    }),
};
const isProduction =
    process.env.SERVER_ENV === "production" || process.env.NODE_ENV === "production";
if (isProduction) {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
    };
}
app.use(session(sessionOptions));

// A hello at the root. I open the URL to test the deployment.
app.get("/", (req, res) => res.send("Welcome to Full Stack Development!"));

Lab5(app);
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);
AnnouncementRoutes(app);
QuizRoutes(app);
MeetingRoutes(app);
MessageRoutes(app);
CalendarRoutes(app);
GradeRoutes(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
