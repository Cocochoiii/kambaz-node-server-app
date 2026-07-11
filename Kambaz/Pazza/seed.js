import { v4 as uuidv4 } from "uuid";
import postModel from "./Posts/model.js";
import commentModel from "./Comments/model.js";
import courses from "../Database/courses.js";

// Authors (real users; used across courses for author names).
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

// createdAt relative to "now" so posts fall into Today / Yesterday / Last Week /
// weekly groups. Re-seed (drop pazza_posts + pazza_comments) near a demo.
const daysAgo = (n, hour = 10) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(hour, (n * 7) % 60, 0, 0);
    return d.toISOString();
};

// Build push-helpers bound to one course and the shared arrays.
const factory = (COURSE, posts, comments) => {
    const post = (offset, who, type, folders, summary, details, opts = {}) => {
        const _id = uuidv4();
        posts.push({
            _id, course: COURSE, type, ...who,
            postTo: opts.postTo || "all", recipients: opts.recipients || [],
            folders, summary, details, pinned: opts.pinned || false,
            viewers: offset >= 14 ? ["123", "678", "1000"] : [],
            createdAt: daysAgo(offset, opts.hour || 10),
        });
        return _id;
    };
    const answer = (postId, who, text, offset, endorsed = false) =>
        comments.push({ _id: uuidv4(), course: COURSE, post: postId, kind: "answer", endorsed, ...who, text, createdAt: daysAgo(offset, 12) });
    const discussion = (postId, who, text, offset, resolved = false) => {
        const _id = uuidv4();
        comments.push({ _id, course: COURSE, post: postId, kind: "discussion", resolved, ...who, text, createdAt: daysAgo(offset, 13) });
        return _id;
    };
    const reply = (postId, parent, who, text, offset) =>
        comments.push({ _id: uuidv4(), course: COURSE, post: postId, kind: "reply", parent, ...who, text, createdAt: daysAgo(offset, 14) });
    return { post, answer, discussion, reply };
};

// Detailed, web-development themed content for CS5610.
const buildRich = (f) => {
    let id;
    // Today
    id = f.post(0, CO, "question", ["hw2"], "Netlify build fails with 'npm ci' after adding react-quill",
        `<p>My local build works but Netlify fails on <strong>npm ci</strong> with a lockfile mismatch right after I ran <code>npm i react-quill</code>. How do I fix the deploy?</p>`);
    f.answer(id, SS, `<p>Run <strong>npm install</strong> locally to sync <code>package-lock.json</code>, commit it, then push. On Netlify use <strong>Clear cache and deploy</strong>.</p>`, 0, true);
    f.discussion(id, NR, `<p>Same here — worked after I committed the updated lock file.</p>`, 0, true);

    id = f.post(0, NR, "question", ["project"], "Where do I put the Mongo Atlas connection string on Render?",
        `<p>Should <code>MONGO_CONNECTION_STRING</code> go in Environment Variables or Secret Files on Render?</p>`);
    f.answer(id, CO, `<p>Environment Variables tab worked for me.</p>`, 0);
    f.answer(id, IM, `<p>Yes — Environment Variables, no quotes and no trailing slash. Don't use Secret Files for this.</p>`, 0);
    { const d = f.discussion(id, PP, `<p>Do we also need to whitelist Render's IP in Atlas Network Access?</p>`, 0, false);
      f.reply(id, d, IM, `<p>Allow 0.0.0.0/0 for the course project, or add Render's static egress IPs.</p>`, 0); }

    f.post(0, SS, "note", ["office_hours"], "Extra office hours today 3–4pm before the A6 deadline",
        `<p>I'll hold extra office hours <strong>today 3–4pm</strong> on Zoom for A6 deploy issues (Render / Netlify / Atlas). Drop in with your error message.</p>`);
    f.post(0, PP, "question", ["hw2"], "Difference between findCoursesForUser and fetchAllCourses?",
        `<p>When do we call each one? I think it's faculty vs student dashboard but not sure.</p>`);

    // Yesterday
    id = f.post(1, WM, "question", ["hw1"], "Session cookie not set after login on the deployed site",
        `<p>Login works locally but on Netlify the session doesn't persist. Is it a cookie setting?</p>`);
    f.answer(id, SS, `<p>Set <strong>SERVER_ENV=production</strong> so cookies are Secure + SameSite=None, and make sure <strong>CLIENT_URL</strong> matches your Netlify URL for CORS credentials.</p>`, 1, true);
    f.discussion(id, CO, `<p>Setting SERVER_ENV=production fixed it for me too.</p>`, 1, true);

    id = f.post(1, TH, "question", ["project"], "Can our project team have 3 people?",
        `<p>Is a team of 3 allowed for the final project?</p>`);
    f.answer(id, IM, `<p>Teams of 2–3 are fine. Use one repo and list all members in the README.</p>`, 1);
    f.post(1, SS, "note", ["logistics"], "A6 due Friday 11:59pm — deploy BOTH client and server",
        `<p>Reminder: A6 is due <strong>Friday</strong>. Make sure both the Netlify client and the Render server are deployed and talking to each other.</p>`);

    // ~ Last week
    id = f.post(7, CK, "question", ["hw3"], "Redux state resets on refresh — is that expected?",
        `<p>My Redux store clears when I refresh. Bug or expected?</p>`);
    f.answer(id, NR, `<p>Redux is in-memory, so it resets on refresh unless you persist it. For the A-series we don't persist.</p>`, 7);
    id = f.post(8, BA, "question", ["hw2"], "How do I protect a faculty-only route?",
        `<p>What's the right way to stop students from opening an instructor-only page?</p>`);
    f.answer(id, SS, `<p>Read the current user's role from the session; redirect students. Guard on the client <em>and</em> check on the server.</p>`, 8);
    id = f.post(9, CO, "question", ["project"], "Netlify shows 404 when I refresh a nested route",
        `<p>Direct links / refresh on nested routes 404 on Netlify. Local dev is fine.</p>`);
    f.answer(id, IM, `<p>Add a redirect rule so all paths serve index (SPA fallback).</p>`, 9);
    f.post(10, NR, "note", ["other"], "Sharing a clean .env.example for the project",
        `<p>Posting the env var names we need so nobody forgets one: <code>MONGO_CONNECTION_STRING</code>, <code>SESSION_SECRET</code>, <code>CLIENT_URL</code>, <code>SERVER_URL</code>, <code>NEXT_PUBLIC_HTTP_SERVER</code>.</p>`);
    id = f.post(11, PP, "question", ["exam"], "Is the exam open-book?", `<p>Are we allowed notes during Exam 1?</p>`);
    f.answer(id, SS, `<p>Open-notes, no collaboration. Full details are in the pinned exam post.</p>`, 11);
    id = f.post(11, WM, "question", ["hw1"], "CORS error: 'No Access-Control-Allow-Origin'",
        `<p>Getting a CORS error calling my server from the client. What am I missing?</p>`);
    f.answer(id, BW, `<p>The server must set CORS <code>origin</code> to your client URL with <code>credentials: true</code>. Localhost gets blocked if origin is only the Netlify URL.</p>`, 11);

    // ~ 2 weeks ago
    f.post(12, IM, "note", ["exam"], "Exam 1 logistics & sample questions posted",
        `<p><strong>Exam 1</strong> is in two weeks. Scope: HTML/CSS/JS, React/Next.js, Node/Express, MongoDB.</p><ul><li>Open-notes, individual</li><li>50 minutes in class</li><li>Sample questions linked on Canvas</li></ul>`, { pinned: true });
    id = f.post(14, TH, "question", ["hw3"], "Why does useEffect run twice in dev?",
        `<p>My effect logs twice on mount in development. Is something wrong?</p>`);
    f.answer(id, CO, `<p>React 18 StrictMode double-invokes effects in <em>development only</em>; production runs it once.</p>`, 14);
    id = f.post(15, CK, "question", ["project"], "How do I seed data only when the collection is empty?",
        `<p>Want to load starter data once without duplicating on every restart.</p>`);
    f.answer(id, IM, `<p>Check <code>count === 0</code> before <code>insertMany</code>, and run it on startup after connecting.</p>`, 15);
    id = f.post(16, BA, "question", ["hw2"], "Difference between server and client environment variables?",
        `<p>Some env vars seem visible in the browser and some don't. Why?</p>`);
    f.answer(id, SS, `<p>In Next.js, only variables prefixed with <strong>NEXT_PUBLIC_</strong> are exposed to the browser. Everything else stays server-side.</p>`, 16);
    f.post(17, BW, "note", ["office_hours"], "TA office hours moved to Thursday 2–4pm",
        `<p>Heads up: my office hours are now <strong>Thursday 2–4pm</strong> this week.</p>`);
    id = f.post(18, NR, "question", ["logistics"], "What's the late policy for assignments?", `<p>How many late days do we get?</p>`);
    f.answer(id, SS, `<p>See the syllabus — 10% per day, up to 3 days late.</p>`, 18);

    // ~ 3 weeks ago
    id = f.post(21, PP, "question", ["hw1"], "How should I structure a Next.js App Router project?",
        `<p>New to the App Router — how do you organize routes and components?</p>`);
    f.answer(id, IM, `<p>Use the <code>app/</code> directory, group routes with <code>(folders)</code>, and colocate components near the routes that use them.</p>`, 21);
    id = f.post(22, WM, "question", ["hw1"], "npm install fails with peer dependency errors",
        `<p>Fresh clone, <code>npm install</code> throws peer dependency warnings/errors.</p>`);
    f.answer(id, BW, `<p>Make sure your Node version matches the project; then retry. If it persists, delete node_modules and the lock and reinstall.</p>`, 22);
    f.post(23, TH, "note", ["other"], "Helpful MDN links for CSS flexbox",
        `<p>These MDN pages on flexbox and the box model helped me a lot for A2 — sharing in case they help others.</p>`);
    id = f.post(24, CO, "question", ["logistics"], "Requesting a short extension (private to instructors)",
        `<p>Hi instructors — I was sick this week and may need a short extension on the project milestone. Thank you for understanding.</p>`,
        { postTo: "individual", recipients: ["INSTRUCTORS"] });
    f.answer(id, SS, `<p>Thanks for letting us know. Email us your documentation and we'll arrange something.</p>`, 24);
    f.post(25, CK, "question", ["hw3"], "Best way to share state between components?",
        `<p>Two sibling components need the same data. Lift state up or use Redux?</p>`);
    f.post(26, SS, "note", ["logistics"], "Welcome to CS5610 — read this first",
        `<p>Welcome! A few notes to get started:</p><ul><li>Weekly homework, one term project, one exam</li><li>Office hours: see the pinned schedule</li><li><strong>Piazza etiquette:</strong> search before posting, pick a folder, and mark follow-ups resolved when done</li></ul>`, { pinned: true });
    f.post(26, BA, "question", ["office_hours"], "Can I get Git help during office hours?",
        `<p>Struggling with merge conflicts — can I bring this to OH?</p>`);
};

// Generic, subject-agnostic content for every other course.
const buildGeneric = (f, course) => {
    let id;
    f.post(26, SS, "note", ["logistics"], "Welcome — course logistics & how to use Piazza",
        `<p>Welcome to <strong>${course.name || course.number || "the course"}</strong>! Please post questions here instead of email so everyone benefits.</p><ul><li>Weekly assignments, one project, one exam</li><li>Office hours are posted below</li><li><strong>Etiquette:</strong> search first, pick a folder, and mark follow-ups resolved</li></ul>`,
        { pinned: true });
    f.post(20, IM, "note", ["exam"], "Exam 1 date & format",
        `<p>Exam 1 is in about two weeks, in class. Open-notes, individual, 50 minutes. A review sheet is on Canvas.</p>`);

    id = f.post(0, CO, "question", ["logistics"], "When are office hours this week?",
        `<p>Could someone confirm the office hour times this week?</p>`);
    f.answer(id, BW, `<p>TA office hours are Tue/Thu 2–4pm; instructor office hours are Wed 1–2pm.</p>`, 0);

    id = f.post(1, PP, "question", ["project"], "Looking for a project teammate",
        `<p>Anyone still looking for a project partner? Happy to share ideas.</p>`);
    f.answer(id, NR, `<p>I'm looking too — I'll message you.</p>`, 1);

    id = f.post(7, NR, "question", ["hw2"], "Is there an extension for Assignment 2?",
        `<p>With the exam coming up, is a short extension possible for Assignment 2?</p>`);
    f.answer(id, SS, `<p>We can extend by 48 hours. The updated due date is on Canvas.</p>`, 7);
    f.discussion(id, CO, `<p>Thanks — the extra time really helps.</p>`, 7, true);

    id = f.post(10, CO, "question", ["hw1"], "Where do we submit Assignment 1?",
        `<p>Do we submit on Canvas or Gradescope?</p>`);
    f.answer(id, PP, `<p>Gradescope — the link is under the Assignments page.</p>`, 10, true);

    f.post(15, PP, "question", ["exam"], "Is the exam cumulative?",
        `<p>Will Exam 1 cover everything so far or just the recent material?</p>`);
};

// Seed each course that has no Pazza posts yet.
export default async function seedPazza() {
    const posts = [];
    const comments = [];

    if ((await postModel.countDocuments({ course: "5610" })) === 0) {
        buildRich(factory("5610", posts, comments));
    }
    for (const c of courses) {
        if (c._id === "5610") continue;
        if ((await postModel.countDocuments({ course: c._id })) === 0) {
            buildGeneric(factory(c._id, posts, comments), c);
        }
    }

    if (posts.length) await postModel.insertMany(posts);
    if (comments.length) await commentModel.insertMany(comments);
    if (posts.length) console.log(`Seeded Pazza: ${posts.length} posts, ${comments.length} comments`);
}
