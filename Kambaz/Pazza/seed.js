import { v4 as uuidv4 } from "uuid";
import postModel from "./Posts/model.js";
import commentModel from "./Comments/model.js";
import * as foldersDao from "./Folders/dao.js";
import courses from "../Database/courses.js";

// The people who write the sample posts.
// Every one of them is a real user in my users seed.
const SS = { author: "678", authorName: "Stephen Strange", authorRole: "FACULTY" };
const IM = { author: "1000", authorName: "Tony Stark", authorRole: "FACULTY" };
const BW = { author: "345", authorName: "Bruce Wayne", authorRole: "TA" };
const CO = { author: "123", authorName: "Coco Choi", authorRole: "STUDENT" };
const NR = { author: "456", authorName: "Natasha Romanoff", authorRole: "STUDENT" };
const PP = { author: "567", authorName: "Peter Parker", authorRole: "STUDENT" };
const WM = { author: "789", authorName: "Wanda Maximoff", authorRole: "STUDENT" };
const TH = { author: "901", authorName: "Thor Odinson", authorRole: "STUDENT" };
const CK = { author: "902", authorName: "Clark Kent", authorRole: "STUDENT" };
const BA = { author: "904", authorName: "Barry Allen", authorRole: "STUDENT" };

// The dates are counted back from today.
// So the sidebar always shows a Today group and a Yesterday group.
function daysAgo(days, hour = 10) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(hour, (days * 7) % 60, 0, 0);
    return date.toISOString();
}

// Small builders bound to one course. They push into shared arrays.
function factory(courseId, posts, comments) {
    const post = (days, who, type, folders, summary, details, options = {}) => {
        const _id = uuidv4();
        const createdAt = daysAgo(days, options.hour || 10);
        posts.push({
            _id,
            course: courseId,
            type,
            ...who,
            postTo: options.postTo || "all",
            recipients: options.recipients || [],
            folders,
            summary,
            details,
            pinned: options.pinned === true,
            // An old post already has readers. A new one is still unread.
            viewers: days >= 14 ? ["123", "678", "1000"] : [],
            createdAt,
            updatedAt: createdAt,
        });
        return _id;
    };

    const answer = (postId, who, text, days) => {
        const createdAt = daysAgo(days, 12);
        comments.push({
            _id: uuidv4(), course: courseId, post: postId, kind: "answer",
            ...who, text, resolved: false, createdAt, updatedAt: createdAt,
        });
    };

    const discussion = (postId, who, text, days, resolved = false) => {
        const _id = uuidv4();
        const createdAt = daysAgo(days, 13);
        comments.push({
            _id, course: courseId, post: postId, kind: "discussion",
            ...who, text, resolved, createdAt, updatedAt: createdAt,
        });
        return _id;
    };

    const reply = (postId, parent, who, text, days) => {
        const createdAt = daysAgo(days, 14);
        comments.push({
            _id: uuidv4(), course: courseId, post: postId, kind: "reply", parent,
            ...who, text, resolved: false, createdAt, updatedAt: createdAt,
        });
    };

    return { post, answer, discussion, reply };
}

// The web development course gets posts about this course.
function buildWebDev(f) {
    let id;

    // Today
    id = f.post(0, CO, "question", ["hw2"],
        "Netlify build fails on npm ci after I added a rich text editor",
        "<p>My local build works. Netlify stops on <strong>npm ci</strong> with a lock file mismatch. How do I fix the deploy?</p>");
    f.answer(id, SS, "<p>Run <strong>npm install</strong> at home to sync <code>package-lock.json</code>. Commit it and push. Then use <strong>Clear cache and deploy</strong> on Netlify.</p>", 0);
    f.discussion(id, NR, "<p>Same here. It worked after I committed the new lock file.</p>", 0, true);

    id = f.post(0, NR, "question", ["project"],
        "Where does the Mongo Atlas address go on Render?",
        "<p>Should the connection string go in Environment Variables or in Secret Files?</p>");
    f.answer(id, CO, "<p>Environment Variables worked for me.</p>", 0);
    f.answer(id, IM, "<p>Yes, Environment Variables. No quotes and no slash at the end. Secret Files are for other things.</p>", 0);
    const atlasThread = f.discussion(id, PP, "<p>Do we also open Network Access in Atlas?</p>", 0, false);
    f.reply(id, atlasThread, IM, "<p>Allow 0.0.0.0/0 for this course project.</p>", 0);

    f.post(0, SS, "note", ["office_hours"],
        "Extra office hours today from 3 to 4 before the deadline",
        "<p>I hold extra office hours <strong>today 3 to 4pm</strong> on Zoom. Bring your deploy errors.</p>");

    f.post(0, PP, "question", ["hw2"],
        "When do I call findCoursesForUser and when fetchAllCourses?",
        "<p>I think one is for faculty and one is for a student. I am not sure.</p>");

    // Yesterday
    id = f.post(1, WM, "question", ["hw1"],
        "The session cookie is not set on the deployed site",
        "<p>Login works at home. On Netlify the session is gone. Is this a cookie setting?</p>");
    f.answer(id, SS, "<p>Set <strong>SERVER_ENV=production</strong>. Then the cookie is Secure with SameSite none. Also point <strong>CLIENT_URL</strong> at your Netlify address.</p>", 1);
    f.discussion(id, CO, "<p>That fixed it for me too.</p>", 1, true);

    id = f.post(1, TH, "question", ["project"], "Can a project team have three people?",
        "<p>Is a team of three allowed for the final project?</p>");
    f.answer(id, IM, "<p>Two or three is fine. Use one repo and list every member in the README.</p>", 1);

    f.post(1, SS, "note", ["logistics"],
        "The assignment is due Friday. Deploy both the client and the server",
        "<p>Please deploy the Netlify client and the Render server. Then check that they talk to each other.</p>");

    // Last week
    id = f.post(7, CK, "question", ["hw3"], "My Redux state resets on refresh. Is that normal?",
        "<p>The store clears when I reload the page. Bug or expected?</p>");
    f.answer(id, NR, "<p>Redux lives in memory, so a reload clears it. We do not save it in these assignments.</p>", 7);

    id = f.post(8, BA, "question", ["hw2"], "How do I protect a faculty only screen?",
        "<p>What stops a student from opening an instructor page?</p>");
    f.answer(id, SS, "<p>Read the role of the current user from the session. Send a student away. Check on the client and on the server.</p>", 8);

    id = f.post(9, CO, "question", ["project"], "Netlify shows 404 when I refresh a nested route",
        "<p>A direct link to a nested route gives 404. At home it is fine.</p>");
    f.answer(id, IM, "<p>Add a redirect rule so every path serves the index page.</p>", 9);

    f.post(10, NR, "note", ["other"], "A clean list of the environment variables we need",
        "<p>Here are the names so nobody forgets one. <code>DATABASE_CONNECTION_STRING</code>, <code>SESSION_SECRET</code>, <code>CLIENT_URL</code>, <code>NEXT_PUBLIC_REMOTE_SERVER</code>.</p>");

    id = f.post(11, PP, "question", ["exam"], "Is the exam open book?",
        "<p>Are we allowed to use notes during the exam?</p>");
    f.answer(id, SS, "<p>Open notes and no group work. The pinned exam post has the details.</p>", 11);

    id = f.post(11, WM, "question", ["hw1"], "I get a CORS error from my own server",
        "<p>The browser says there is no Access Control Allow Origin header. What did I miss?</p>");
    f.answer(id, BW, "<p>The server sets CORS origin to your client address with credentials true. Localhost is blocked when only the Netlify address is listed.</p>", 11);

    // Two weeks back
    f.post(12, IM, "note", ["exam"], "Exam logistics and sample questions are posted",
        "<p>The exam covers HTML, CSS, JavaScript, React, Node and MongoDB.</p><ul><li>Open notes and on your own</li><li>Fifty minutes in class</li><li>Sample questions are on Canvas</li></ul>",
        { pinned: true });

    id = f.post(14, TH, "question", ["hw3"], "Why does useEffect run twice while I develop?",
        "<p>My effect logs twice on mount. Is something wrong?</p>");
    f.answer(id, CO, "<p>Strict Mode runs an effect twice in development only. Production runs it once.</p>", 14);

    id = f.post(15, CK, "question", ["project"], "How do I seed data only when a collection is empty?",
        "<p>I want to load sample rows once and not again on every restart.</p>");
    f.answer(id, IM, "<p>Count the rows first. Insert only when the count is zero. Run it after the connection opens.</p>", 15);

    id = f.post(16, BA, "question", ["hw2"], "What is the difference between server and client variables?",
        "<p>Some variables show up in the browser and some do not. Why?</p>");
    f.answer(id, SS, "<p>Only a name that starts with <strong>NEXT_PUBLIC_</strong> reaches the browser. The rest stay on the server.</p>", 16);

    f.post(17, BW, "note", ["office_hours"], "TA office hours move to Thursday 2 to 4",
        "<p>My office hours are now <strong>Thursday 2 to 4pm</strong> this week.</p>");

    id = f.post(18, NR, "question", ["logistics"], "What is the late policy?",
        "<p>How many late days do we get?</p>");
    f.answer(id, SS, "<p>The syllabus says ten percent per day for up to three days.</p>", 18);

    // Three weeks back
    id = f.post(21, PP, "question", ["hw1"], "How should I lay out an App Router project?",
        "<p>I am new to the App Router. How do you organize routes and components?</p>");
    f.answer(id, IM, "<p>Use the app folder. Group routes with round brackets. Keep a component near the route that uses it.</p>", 21);

    id = f.post(22, WM, "question", ["hw1"], "npm install fails with peer dependency errors",
        "<p>A fresh clone throws peer dependency errors on install.</p>");
    f.answer(id, BW, "<p>Match your Node version to the project first. If it stays, delete node_modules and the lock file and install again.</p>", 22);

    f.post(23, TH, "note", ["other"], "Some MDN pages that helped me with flexbox",
        "<p>The MDN pages on flexbox and the box model helped me a lot. I share them here.</p>");

    id = f.post(24, CO, "question", ["logistics"], "Asking for a short extension, instructors only",
        "<p>Hello. I was sick this week and may need a short extension on the milestone. Thank you.</p>",
        { postTo: "individual", recipients: ["INSTRUCTORS"] });
    f.answer(id, SS, "<p>Thank you for telling us. Send us your paperwork and we will work it out.</p>", 24);

    f.post(25, CK, "question", ["hw3"], "What is the best way to share state between components?",
        "<p>Two sibling components need the same data. Do I lift state up or use Redux?</p>");

    f.post(26, SS, "note", ["logistics"], "Welcome to the course. Please read this first",
        "<p>Welcome. A few notes to get you started.</p><ul><li>Weekly homework, one project and one exam</li><li>Office hours are in the pinned schedule</li><li>Search before you post, pick a folder, and mark a followup resolved when it is done</li></ul>",
        { pinned: true });

    f.post(26, BA, "question", ["office_hours"], "Can I get Git help during office hours?",
        "<p>I keep hitting merge conflicts. Can I bring this to office hours?</p>");
}

// Every other course gets the same short set of posts.
function buildGeneric(f, course) {
    let id;
    const title = course.name || course.number || "this course";

    f.post(26, SS, "note", ["logistics"], "Welcome. Course logistics and how we use Pazza",
        `<p>Welcome to <strong>${title}</strong>. Please post here instead of email so everyone can read the answer.</p><ul><li>Weekly assignments, one project and one exam</li><li>Office hours are posted below</li><li>Search first, pick a folder, and mark a followup resolved</li></ul>`,
        { pinned: true });

    f.post(20, IM, "note", ["exam"], "Exam date and format",
        "<p>The exam is in about two weeks and it is in class. Open notes, on your own, fifty minutes.</p>");

    id = f.post(0, CO, "question", ["logistics"], "When are office hours this week?",
        "<p>Could someone confirm the office hour times this week?</p>");
    f.answer(id, BW, "<p>TA hours are Tuesday and Thursday 2 to 4pm. Instructor hours are Wednesday 1 to 2pm.</p>", 0);

    id = f.post(1, PP, "question", ["project"], "Looking for a project teammate",
        "<p>Is anyone still looking for a partner? I am happy to share ideas.</p>");
    f.answer(id, NR, "<p>I am looking too. I will message you.</p>", 1);

    id = f.post(7, NR, "question", ["hw2"], "Is there an extension for the second assignment?",
        "<p>The exam is close. Is a short extension possible?</p>");
    f.answer(id, SS, "<p>We can add two days. The new date is on Canvas.</p>", 7);
    f.discussion(id, CO, "<p>Thank you. The extra time helps a lot.</p>", 7, true);

    id = f.post(10, CO, "question", ["hw1"], "Where do we hand in the first assignment?",
        "<p>Do we submit on Canvas or somewhere else?</p>");
    f.answer(id, PP, "<p>The link is on the Assignments screen of the course.</p>", 10);

    f.post(15, PP, "question", ["exam"], "Is the exam cumulative?",
        "<p>Does the exam cover everything so far or only the recent weeks?</p>");
}

// I fill Pazza for a course only when that course has no posts yet.
// So my own posts survive every restart.
export default async function seedPazza() {
    const posts = [];
    const comments = [];

    for (const course of courses) {
        await foldersDao.seedDefaultFolders(course._id);

        const count = await postModel.countDocuments({ course: course._id });
        if (count > 0) {
            continue;
        }
        const f = factory(course._id, posts, comments);
        if (course._id === "5610") {
            buildWebDev(f);
        } else {
            buildGeneric(f, course);
        }
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
