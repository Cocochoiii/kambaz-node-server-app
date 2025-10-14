// Kambaz/Database/index.js
import courses from "./courses.js";
import modules from "./modules.js";
import assignments from "./assignments.js";
import users from "./users.js";
import grades from "./grades.js";
import enrollments from "./enrollments.js";
import { quizzesSeed as quizzes } from "./quizzes.js";  // Fix this line
import { pazzaSeedData as pazza } from "./pazza.js";    // Add if needed

const db = {
    courses,
    modules,
    assignments,
    users,
    grades,
    enrollments,
    quizzes,
    pazza  // Add if needed
};

export default db;