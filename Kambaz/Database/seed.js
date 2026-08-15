import UserModel from "../Users/model.js";
import CourseModel from "../Courses/model.js";
import ModuleModel from "../Modules/model.js";
import EnrollmentModel from "../Enrollments/model.js";
import AssignmentModel from "../Assignments/model.js";
import AnnouncementModel from "../Announcements/model.js";
import MeetingModel from "../Meetings/model.js";
import MessageModel from "../Messages/model.js";
import QuizModel from "../Quizzes/model.js";
import { gradeModel, categoryModel } from "../Grades/model.js";

import users from "./users.js";
import courses from "./courses.js";
import modules from "./modules.js";
import enrollments from "./enrollments.js";
import assignments from "./assignments.js";
import announcements from "./announcements.js";
import meetings from "./meetings.js";
import messages from "./messages.js";
import quizzes from "./quizzes.js";
import grades from "./grades.js";
import gradeCategories from "./gradeCategories.js";

// A new database is empty, so the app would look broken.
// I load my sample data into a collection that has no rows.
// I never touch a collection with rows, so my edits stay.
export default async function seedDatabase() {
    const collections = [
        [UserModel, users, "users"],
        [CourseModel, courses, "courses"],
        [ModuleModel, modules, "modules"],
        [EnrollmentModel, enrollments, "enrollments"],
        [AssignmentModel, assignments, "assignments"],
        [AnnouncementModel, announcements, "announcements"],
        [MeetingModel, meetings, "meetings"],
        [MessageModel, messages, "messages"],
        [QuizModel, quizzes, "quizzes"],
        [gradeModel, grades, "grades"],
        [categoryModel, gradeCategories, "gradeCategories"],
    ];
    for (const [model, data, label] of collections) {
        try {
            const count = await model.estimatedDocumentCount();
            if (count === 0) {
                await model.insertMany(data);
                console.log(`Seeded ${label}: ${data.length}`);
            }
        } catch (error) {
            console.error(`Unable to seed ${label}:`, error.message);
        }
    }
}
