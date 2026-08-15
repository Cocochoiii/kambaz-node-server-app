import { v4 as uuidv4 } from "uuid";
import postModel from "./Posts/model.js";
import commentModel from "./Comments/model.js";
import * as foldersDao from "./Folders/dao.js";
import { SLOTS, READ_AFTER_DAYS } from "./slots.js";
import CONTENT from "./content.js";
import courses from "../Database/courses.js";
import users from "../Database/users.js";
import enrollments from "../Database/enrollments.js";

// I count every date back from today.
// So Today, Yesterday and Last Week always hold posts on demo day.
function daysAgo(days, hour) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(hour, (days * 7) % 60, 0, 0);
    return date.toISOString();
}

function fullName(user) {
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
    return name || user.username;
}

// The people of one course, split by what they may do.
// A poster must really be in the class. Otherwise the People
// screen would show a name that is not on the roster.
function rosterFor(courseId) {
    const ids = enrollments
        .filter((row) => row.course === courseId)
        .map((row) => row.user);
    const members = users.filter((user) => ids.includes(user._id));

    const students = members.filter((user) => user.role === "STUDENT");
    // In Pazza anyone who is not a student speaks as an instructor.
    const faculty = members.filter((user) => user.role !== "STUDENT");

    return { students, faculty };
}

// I walk the list and start again at the end.
// So the same two people do not write every post.
function picker(people) {
    let next = 0;
    return () => {
        const person = people[next % people.length];
        next = next + 1;
        return person;
    };
}

function stamp(user) {
    return {
        author: user._id,
        authorName: fullName(user),
        authorRole: user.role,
    };
}

// One course worth of posts, built from the slots and the words.
function buildCourse(courseId, posts, comments) {
    const words = CONTENT[courseId];
    if (!words) {
        return;
    }
    const { students, faculty } = rosterFor(courseId);
    if (students.length === 0 || faculty.length === 0) {
        return;
    }

    const nextStudent = picker(students);
    const nextFaculty = picker(faculty);
    // A few old posts are already read, so the unread count is real.
    const readers = [students[0]._id, faculty[0]._id];

    SLOTS.forEach((slot, index) => {
        const text = words[index];
        if (!text) {
            return;
        }
        const author = slot.by === "faculty" ? nextFaculty() : nextStudent();
        const postId = uuidv4();
        const createdAt = daysAgo(slot.days, slot.hour);

        posts.push({
            _id: postId,
            course: courseId,
            type: slot.type,
            ...stamp(author),
            postTo: slot.private ? "individual" : "all",
            recipients: slot.private ? ["INSTRUCTORS"] : [],
            folders: slot.folders,
            summary: text.q,
            details: text.d,
            pinned: slot.pinned === true,
            viewers: slot.days >= READ_AFTER_DAYS ? readers : [],
            createdAt,
            updatedAt: createdAt,
        });

        // The answers. A student answer and an instructor answer
        // land in their own section of the post screen.
        (slot.answers || []).forEach((who, answerIndex) => {
            const body = (text.a || [])[answerIndex];
            if (!body) {
                return;
            }
            const writer = who === "faculty" ? nextFaculty() : nextStudent();
            const answerAt = daysAgo(slot.days, slot.hour + 1 + answerIndex);
            comments.push({
                _id: uuidv4(),
                course: courseId,
                post: postId,
                kind: "answer",
                ...stamp(writer),
                text: body,
                resolved: false,
                createdAt: answerAt,
                updatedAt: answerAt,
            });
        });

        // The followup discussions, and the replies under them.
        (slot.followups || []).forEach((followup, followupIndex) => {
            const thread = (text.f || [])[followupIndex];
            if (!thread) {
                return;
            }
            const starter = followup.by === "faculty" ? nextFaculty() : nextStudent();
            const threadId = uuidv4();
            const threadAt = daysAgo(slot.days, slot.hour + 3);
            comments.push({
                _id: threadId,
                course: courseId,
                post: postId,
                kind: "discussion",
                ...stamp(starter),
                text: thread.t,
                resolved: followup.resolved === true,
                createdAt: threadAt,
                updatedAt: threadAt,
            });

            if (followup.reply && thread.r) {
                const responder = followup.reply === "faculty" ? nextFaculty() : nextStudent();
                const replyAt = daysAgo(slot.days, slot.hour + 4);
                comments.push({
                    _id: uuidv4(),
                    course: courseId,
                    post: postId,
                    kind: "reply",
                    parent: threadId,
                    ...stamp(responder),
                    text: thread.r,
                    resolved: false,
                    createdAt: replyAt,
                    updatedAt: replyAt,
                });
            }
        });
    });
}

// I fill Pazza for a course only when it has no posts yet.
// So anything I write during the demo survives a restart.
export default async function seedPazza() {
    const posts = [];
    const comments = [];

    for (const course of courses) {
        await foldersDao.seedDefaultFolders(course._id);

        const count = await postModel.countDocuments({ course: course._id });
        if (count > 0) {
            continue;
        }
        buildCourse(course._id, posts, comments);
    }

    if (posts.length > 0) {
        await postModel.insertMany(posts);
    }
    if (comments.length > 0) {
        await commentModel.insertMany(comments);
    }
    if (posts.length > 0) {
        console.log(`Seeded Pazza: ${posts.length} posts, ${comments.length} comments`);
    }
}
