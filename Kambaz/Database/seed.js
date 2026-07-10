import UserModel from "../Users/model.js";
import CourseModel from "../Courses/model.js";
import ModuleModel from "../Modules/model.js";
import AssignmentModel from "../Assignments/model.js";
import EnrollmentModel from "../Enrollments/model.js";
import AnnouncementModel from "../Announcements/model.js";
import QuizModel from "../Quizzes/model.js";
import GradeModel from "../Grades/model.js";

import users from "./users.js";
import courses from "./courses.js";
import modules from "./modules.js";
import assignments from "./assignments.js";
import enrollments from "./enrollments.js";
import announcements from "./announcements.js";
import quizzes from "./quizzes.js";
import grades from "./grades.js";

// On a fresh database, load seed data so the app works out of the box.
// Each collection is only filled when it is currently empty.
export default async function seedDatabase() {
    const pairs = [
        [UserModel, users, "users"],
        [CourseModel, courses, "courses"],
        [ModuleModel, modules, "modules"],
        [AssignmentModel, assignments, "assignments"],
        [EnrollmentModel, enrollments, "enrollments"],
        [AnnouncementModel, announcements, "announcements"],
        [QuizModel, quizzes, "quizzes"],
        [GradeModel, grades, "grades"],
    ];
    for (const [model, data, label] of pairs) {
        try {
            const count = await model.estimatedDocumentCount();
            if (count === 0 && Array.isArray(data) && data.length) {
                await model.insertMany(data);
                console.log(`Seeded ${label}: ${data.length}`);
            }
        } catch (e) {
            console.error(`Seed error for ${label}:`, e.message);
        }
    }
}
