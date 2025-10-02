// Kambaz/Database/index.js
import courses from "./courses.js";
import modules from "./modules.js";
import assignments from "./assignments.js";
import users from "./users.js";
import grades from "./grades.js";
import enrollments from "./enrollments.js";

/**
 * Export a SINGLE default object so callers can do:
 *   import db from "../Database/index.js"
 */
const db = {
    courses,
    modules,
    assignments,
    users,
    grades,
    enrollments,
};

export default db;
