// The words of the sample posts, one list per course.
// Each list has thirteen entries and they line up with SLOTS.
//
// q is the summary, d is the body, a holds the answers,
// and f holds the followup discussions.
//
// The text names the real assignments and the real learning
// activities of that course, so the board reads like a real class.

const CONTENT = {
    // ---------------- CS5610 Web Development ----------------
    "5610": [
        {
            q: "Netlify fails on npm ci after I added a rich text editor",
            d: "<p>My build for <strong>A2: HTML &amp; Semantic Markup</strong> works at home. Netlify stops on <code>npm ci</code> with a lock file mismatch, right after I installed a new package.</p>",
            a: ["<p>Run <strong>npm install</strong> at home so the lock file catches up, commit it, then push. On Netlify use <strong>Clear cache and deploy</strong> once.</p>"],
            f: [{ t: "Committing the new lock file fixed it for me too. Thank you." }],
        },
        {
            q: "Where does the Mongo Atlas address go on Render?",
            d: "<p>For <strong>A10: MongoDB &amp; Deployment</strong>, should the connection string go in Environment Variables or in Secret Files?</p>",
        },
        {
            q: "Extra office hours today 3 to 4 before the deadline",
            d: "<p>I will hold extra office hours <strong>today 3 to 4pm</strong> on Zoom for deploy problems. Bring the exact error text from Render or Netlify.</p>",
        },
        {
            q: "The session cookie is not set on the deployed site",
            d: "<p>Login works on localhost. On the deployed site the session is gone after a refresh. Is this a cookie setting?</p>",
            a: ["<p>Set <strong>SERVER_ENV=production</strong> so the cookie is Secure with SameSite none. Then point <strong>CLIENT_URL</strong> at your deployed address so CORS allows credentials.</p>"],
            f: [{ t: "Do I need both, or is one of them enough?", r: "<p>Both. The cookie settings let the browser store it and the CORS origin lets the browser send it.</p>" }],
        },
        {
            q: "A7: React Hooks and State opens today",
            d: "<p><strong>A7: React Hooks &amp; State</strong> is open. Get one piece of state working before you reach for a store. The quiz <em>Learning Activity: State Management &amp; Hooks</em> covers the same ground.</p>",
        },
        {
            q: "Does the midterm include the Node and Express week?",
            d: "<p>The Midterm Exam is soon. Does it reach the server side, or does it stop after React?</p>",
        },
        {
            q: "My Redux state resets every time I refresh",
            d: "<p>In <strong>A5: Modern JavaScript</strong> my store clears on reload. Is that a bug in my setup or is it expected?</p>",
            a: [
                "<p>Mine does the same. The store lives in memory, so a reload always starts it over.</p>",
                "<p>That is expected. If you need it to survive a reload, keep the data on the server and load it on start. We do not persist the store in this course.</p>",
            ],
            f: [{ t: "So how does the sign in survive a refresh?", r: "<p>The session lives on the server, not in the store. The app asks who I am on start and fills the store again.</p>" }],
        },
        {
            q: "Asking for a short extension, instructors only",
            d: "<p>Hello. I was ill this week and I am behind on <strong>A8: Next.js &amp; Routing</strong>. Could I have two extra days? I can send documentation.</p>",
            a: ["<p>Thank you for telling us early. Two days is fine. Send the paperwork when you can.</p>"],
        },
        {
            q: "Why does my nested route 404 when I refresh?",
            d: "<p>A direct link to a nested route gives 404 on the deployed site. On localhost the same link is fine.</p>",
            a: ["<p>The host looks for a real file at that path and finds none. Add a redirect rule so every path serves the index page instead.</p>"],
        },
        {
            q: "Midterm Exam logistics and what to review",
            d: "<p>The Midterm Exam is in class and takes fifty minutes.</p><ul><li>Open notes and on your own</li><li>Covers HTML, CSS, JavaScript, React and the App Router</li><li>Sample questions are on Canvas</li></ul>",
        },
        {
            q: "npm install fails with peer dependency errors",
            d: "<p>A fresh clone for <strong>A1: Web Foundations &amp; Tooling</strong> throws peer dependency errors on install.</p>",
            a: ["<p>Match your Node version to the one in the course notes first. If it persists, delete node_modules and the lock file, then install again.</p>"],
        },
        {
            q: "Can our project team have three people?",
            d: "<p>Is a team of three allowed for the final project, or is two the limit?</p>",
        },
        {
            q: "Welcome to the course and how we use Pazza",
            d: "<p>Welcome. Please post here instead of email, so one answer reaches the whole class.</p><ul><li>Pick a folder before you post</li><li>Search first, your question may already be here</li><li>Mark a followup resolved when it is done</li></ul>",
        },
    ],

    // ---------------- CS5520 Mobile Application Development ----------------
    "5520": [
        {
            q: "My flex layout looks different on Android and on iOS",
            d: "<p>I finished the layout for <strong>A2: UI Components &amp; Layout</strong>. On Android the cards line up, on iOS they overflow the screen. Am I missing a safe area?</p>",
            a: ["<p>Yes. Wrap the screen in a safe area view and give the row <code>flexWrap</code>. iOS reserves space for the notch, Android does not.</p>"],
            f: [{ t: "The safe area view fixed it for me too. Thank you." }],
        },
        {
            q: "Can our final project target only one platform?",
            d: "<p>Our team only owns Android devices. May we submit the final project as Android only, or do we need both?</p>",
        },
        {
            q: "Extra lab hours today from 3 to 5 before A2 is due",
            d: "<p>I will be in the lab <strong>today 3 to 5pm</strong> for anyone stuck on A2. Bring your device or your emulator and we will debug together.</p>",
        },
        {
            q: "The emulator will not start after I updated the SDK",
            d: "<p>I updated the SDK for <strong>A1: Mobile Foundations</strong> and now the emulator hangs on the boot logo. Cold boot does not help.</p>",
            a: ["<p>Wipe the emulator data, then cold boot once. If it still hangs, make sure the system image matches the SDK level you just installed.</p>"],
            f: [{ t: "Wiping the data worked. Is there a way to avoid this next time?", r: "<p>Pin one system image for the whole term and only update the tools, not the image.</p>" }],
        },
        {
            q: "A3: Navigation and Routing opens today",
            d: "<p><strong>A3: Navigation &amp; Routing</strong> is open now. Start with the stack navigator, then add the tabs. The matching quiz is <em>Learning Activity: Navigation &amp; Routing</em>.</p>",
        },
        {
            q: "What does the midterm cover?",
            d: "<p>Does the midterm stop at state management, or does it also include networking and the API integration week?</p>",
        },
        {
            q: "The back button pops the wrong screen",
            d: "<p>In <strong>A3: Navigation &amp; Routing</strong> my back button jumps two screens instead of one. I think I am pushing the same route twice.</p>",
            a: [
                "<p>I had this. I was calling navigate inside a render, so it pushed twice before I ever tapped anything.</p>",
                "<p>That is the usual cause. Move the call into an event handler, and give each route a unique name in the stack.</p>",
            ],
            f: [{ t: "Is there a way to see the current stack while I debug?", r: "<p>Log the navigation state on every change. You will see the duplicate right away.</p>" }],
        },
        {
            q: "Asking for a short extension on A3, instructors only",
            d: "<p>Hello. I had a family emergency this week and I am behind on <strong>A3</strong>. Could I have two extra days? I can send documentation.</p>",
            a: ["<p>Thank you for telling us early. Two days is fine. Send the paperwork when you can and we will note it.</p>"],
        },
        {
            q: "Any tips for testing on a real device?",
            d: "<p>The emulator is slow on my laptop. What is the least painful way to run the app on my own phone?</p>",
            a: ["<p>Turn on developer mode and USB debugging, then run over cable once. After that the wireless option is much faster.</p>"],
        },
        {
            q: "Midterm format and what to review",
            d: "<p>The midterm is in class and takes fifty minutes.</p><ul><li>Open notes and on your own</li><li>Covers A1 through A5</li><li>Review the UI Basics, Navigation and State Management activities</li></ul>",
        },
        {
            q: "Where do I set the app icon and the app name?",
            d: "<p><strong>A1: Mobile Foundations</strong> asks for a custom icon. I changed the file but the old icon still shows.</p>",
            a: ["<p>The old icon is cached on the device. Uninstall the app, then build again. The name lives in the app config, not in the code.</p>"],
        },
        {
            q: "Looking for a teammate for the final project",
            d: "<p>Is anyone still looking for a partner? I would like to build a small habit tracker. I am happy to share the plan.</p>",
        },
        {
            q: "Welcome to the course and how we use Pazza",
            d: "<p>Welcome. Please post here instead of email, so the whole class reads the answer once.</p><ul><li>Pick a folder before you post</li><li>Search first, your question may already be here</li><li>Mark a followup resolved when it is done</li></ul>",
        },
    ],

    // ---------------- CS5004 Object-Oriented Design ----------------
    "5004": [
        {
            q: "When do I use an abstract class and when an interface?",
            d: "<p>In <strong>A2: Inheritance &amp; Polymorphism</strong> I have shared code and a shared contract. Do I need both, or does one cover it?</p>",
            a: ["<p>An interface is the contract. An abstract class is the contract plus shared code. If you have no shared code, use the interface.</p>"],
            f: [{ t: "That is the clearest answer I have read. Thank you." }],
        },
        {
            q: "How large should the design case study be?",
            d: "<p>For the case study, how many classes do you expect? I do not want to build something huge for no reason.</p>",
        },
        {
            q: "Office hours today 1 to 2 for UML questions",
            d: "<p>I will be in office hours <strong>today 1 to 2pm</strong>. Bring your class diagram from the UML activity and I will look at it with you.</p>",
        },
        {
            q: "My equals and hashCode do not agree",
            d: "<p>In <strong>A1: OOP Foundations</strong> two objects say they are equal, but my set still keeps both. What did I break?</p>",
            a: ["<p>Your hashCode uses fields that equals ignores, or the other way round. Both must read the same fields.</p>"],
            f: [{ t: "Do we have to write these by hand for the assignment?", r: "<p>Yes for A1. After that you may let the IDE generate them.</p>" }],
        },
        {
            q: "A4: SOLID Principles opens today",
            d: "<p><strong>A4: SOLID Principles</strong> is open. Take one principle at a time and refactor. The quiz <em>Learning Activity: SOLID Principles</em> covers the same ground.</p>",
        },
        {
            q: "Does the midterm include the behavioral patterns?",
            d: "<p>The Midterm Exam is next week. Does it stop at the structural patterns or does it also cover the behavioral ones?</p>",
        },
        {
            q: "Factory or builder for an object with many options?",
            d: "<p>For <strong>A5: Creational Patterns</strong> my object takes nine constructor arguments. Which pattern is the right fit?</p>",
            a: [
                "<p>I used a builder. Nine arguments in a row is very easy to get wrong.</p>",
                "<p>Builder is right here. A factory picks which class to make. A builder assembles one object step by step.</p>",
            ],
            f: [{ t: "Should the builder validate before it builds?", r: "<p>Yes. Check inside build and throw early, so a half built object never escapes.</p>" }],
        },
        {
            q: "Asking about a missed submission, instructors only",
            d: "<p>Hello. I was ill and I missed the deadline for <strong>A3: Interfaces &amp; Abstraction</strong>. May I still hand it in?</p>",
            a: ["<p>Yes. Send it within the week and add a short note about the delay. We will grade it in full.</p>"],
        },
        {
            q: "A good book or site for design patterns?",
            d: "<p>The slides move fast. Does anyone have a resource that walks through the patterns slowly with real code?</p>",
            a: ["<p>The refactoring guru site has one page per pattern with diagrams and code in several languages. It matches our lectures well.</p>"],
        },
        {
            q: "Midterm Exam logistics",
            d: "<p>The Midterm Exam is in class and takes fifty minutes.</p><ul><li>Open notes and on your own</li><li>Covers A1 through A5 and the first five activities</li><li>Bring a pencil, you will draw a class diagram</li></ul>",
        },
        {
            q: "Why does my subclass constructor not compile?",
            d: "<p>In <strong>A1: OOP Foundations</strong> the compiler says there is no default constructor in the parent. I never wrote one.</p>",
            a: ["<p>Once you write any constructor, the free default one is gone. Call the parent constructor as the first line of the child constructor.</p>"],
        },
        {
            q: "May we use a language other than Java for the case study?",
            d: "<p>Our team is stronger in Python. Would the design case study still be acceptable in another language?</p>",
        },
        {
            q: "Welcome to the course and how we use Pazza",
            d: "<p>Welcome. Post your questions here rather than by email, so everyone can read the answer.</p><ul><li>Pick a folder before you post</li><li>Search first, your question may already be here</li><li>Mark a followup resolved when it is done</li></ul>",
        },
    ],

    // ---------------- CS5200 Database Management Systems ----------------
    "5200": [
        {
            q: "My GROUP BY returns more rows than I expect",
            d: "<p>In <strong>A3: SQL Basics</strong> I group by customer, but I get one row per order. I think I selected a column I did not group on.</p>",
            a: ["<p>That is it. Every column in the select list must be grouped or wrapped in an aggregate. Drop the extra column or aggregate it.</p>"],
            f: [{ t: "Dropping the order date fixed it. Thank you." }],
        },
        {
            q: "How big should the schema for the design project be?",
            d: "<p>For the Database Design Project, how many tables do you expect? Ours is at seven and still growing.</p>",
        },
        {
            q: "Office hours today 2 to 3 for query help",
            d: "<p>I will be in office hours <strong>today 2 to 3pm</strong>. Bring the query that is not working and the table it runs on.</p>",
        },
        {
            q: "Left join gives me nulls I did not expect",
            d: "<p>In <strong>A2: Relational Model</strong> my left join fills half the rows with null. Is that normal or is my key wrong?</p>",
            a: ["<p>Null on the right side means no match was found. Check the join column types, and check that the filter is in the ON clause, not in WHERE.</p>"],
            f: [{ t: "Why does moving the filter to WHERE change the result?", r: "<p>WHERE runs after the join, so it throws away the null rows and the left join becomes an inner join.</p>" }],
        },
        {
            q: "A4: Advanced SQL opens today",
            d: "<p><strong>A4: Advanced SQL</strong> is open. Start with the subqueries, then the window functions. The quiz <em>Learning Activity: Joins &amp; Subqueries</em> is good practice first.</p>",
        },
        {
            q: "Is normalization on the exam?",
            d: "<p>Do we need to normalize a schema by hand on the exam, or only explain the normal forms?</p>",
        },
        {
            q: "My query is slow and I do not know why",
            d: "<p>In <strong>A6: Indexing &amp; Storage</strong> my join over two large tables takes almost a minute. Where do I start looking?</p>",
            a: [
                "<p>Run EXPLAIN first. Mine showed a full scan because my index was on the wrong column order.</p>",
                "<p>Good advice. Read the plan, find the scan, then index the column you filter or join on. Column order in a composite index matters.</p>",
            ],
            f: [{ t: "Does an index ever make things slower?", r: "<p>Yes, on writes. Every insert has to update the index too, so do not index every column.</p>" }],
        },
        {
            q: "Asking for a short extension, instructors only",
            d: "<p>Hello. I am travelling for a family event and I will miss the <strong>A4</strong> deadline by a day. May I hand it in late?</p>",
            a: ["<p>One day is fine. Please note the reason in your submission comment.</p>"],
        },
        {
            q: "A good tool for drawing ER diagrams?",
            d: "<p>What do people use to draw the ER diagram? I would rather not do it by hand in a slide.</p>",
            a: ["<p>I use dbdiagram. You type the tables and it draws the diagram, so changing a key takes a second.</p>"],
        },
        {
            q: "Exam logistics and what to review",
            d: "<p>The exam is in class and takes fifty minutes.</p><ul><li>Open notes and on your own</li><li>Covers the relational model, SQL, normalization and indexes</li><li>You will write two queries by hand</li></ul>",
        },
        {
            q: "What is the difference between a primary key and a unique key?",
            d: "<p>In <strong>A1: Data &amp; Databases</strong> both seem to stop duplicates. Why do we need two ideas?</p>",
            a: ["<p>A table has one primary key and it cannot be null. It may have many unique keys and those may hold one null. The primary key is also the default target for foreign keys.</p>"],
        },
        {
            q: "May our project use MongoDB instead of a relational database?",
            d: "<p>Our data is nested and it fits documents well. Would that be acceptable for the design project?</p>",
        },
        {
            q: "Welcome to the course and how we use Pazza",
            d: "<p>Welcome. Please ask here instead of by email, so the answer reaches everyone.</p><ul><li>Pick a folder before you post</li><li>Search first, your question may already be here</li><li>Mark a followup resolved when it is done</li></ul>",
        },
    ],

    // ---------------- CS5800 Algorithms ----------------
    "5800": [
        {
            q: "How do I prove my greedy choice is safe?",
            d: "<p>In <strong>A4: Greedy Algorithms</strong> my algorithm gives the right answer on every test I try. How do I actually prove it?</p>",
            a: ["<p>Use an exchange argument. Take any optimal solution, swap in your greedy choice, and show the result is no worse. Then repeat.</p>"],
            f: [{ t: "The exchange argument finally made it click. Thank you." }],
        },
        {
            q: "How long should the final write up be?",
            d: "<p>For the project write up, do you want a full proof for every algorithm, or a sketch plus the running time?</p>",
        },
        {
            q: "Office hours today 3 to 4 for proof questions",
            d: "<p>I will be in office hours <strong>today 3 to 4pm</strong>. Bring the proof you are stuck on and we will work through it on the board.</p>",
        },
        {
            q: "Is my recurrence master theorem case two or case three?",
            d: "<p>In <strong>A1: Algorithm Analysis</strong> I have T(n) = 2T(n/2) + n log n. The cases look close and I cannot tell them apart.</p>",
            a: ["<p>Compare n log n with n raised to log base 2 of 2, which is n. The extra log factor puts you outside the plain cases, so use the extended form.</p>"],
            f: [{ t: "Do we ever need the extended form on the exam?", r: "<p>Not on the exam. Knowing that the plain cases can fail is enough.</p>" }],
        },
        {
            q: "A5: Dynamic Programming opens today",
            d: "<p><strong>A5: Dynamic Programming</strong> is open. Write the recurrence first, then the table. The quiz <em>Learning Activity: Dynamic Programming</em> has smaller warm ups.</p>",
        },
        {
            q: "Does the midterm include network flow?",
            d: "<p>The Midterm Exam is soon. Does it reach network flow, or does it stop at shortest paths?</p>",
        },
        {
            q: "Memo table or bottom up table for the knapsack?",
            d: "<p>In <strong>A5: Dynamic Programming</strong> both give the same answer. Is one preferred for the write up?</p>",
            a: [
                "<p>I wrote it top down first because the recurrence is easier to see, then turned it into a table.</p>",
                "<p>That is a good order. For the write up, state the recurrence, then say which order you fill the table in and why.</p>",
            ],
            f: [{ t: "Does the bottom up version save memory?", r: "<p>Often yes. If each row only needs the row above, you can keep two rows instead of the whole table.</p>" }],
        },
        {
            q: "Asking about a missed deadline, instructors only",
            d: "<p>Hello. I was in hospital last week and I missed <strong>A3: Divide and Conquer</strong>. May I still submit it?</p>",
            a: ["<p>Yes, please send it this week. Take care of yourself first.</p>"],
        },
        {
            q: "Any site with good practice problems?",
            d: "<p>The textbook exercises run out quickly. Where do people find extra practice that matches our topics?</p>",
            a: ["<p>The problem sets on the open courseware pages match our chapters closely, and they publish the solutions.</p>"],
        },
        {
            q: "Midterm Exam logistics",
            d: "<p>The Midterm Exam is in class and takes fifty minutes.</p><ul><li>Open notes and on your own</li><li>Covers analysis, sorting, divide and conquer, greedy and dynamic programming</li><li>One proof and two running time questions</li></ul>",
        },
        {
            q: "Why is my merge sort slower than the built in sort?",
            d: "<p>In <strong>A2: Sorting</strong> my merge sort is correct but it is much slower than the library sort on the same input.</p>",
            a: ["<p>You are probably allocating a new array on every merge. Allocate one buffer up front and reuse it.</p>"],
        },
        {
            q: "May we work in pairs on the project?",
            d: "<p>Is the final project individual, or may two people work on it together and hand in one write up?</p>",
        },
        {
            q: "Welcome to the course and how we use Pazza",
            d: "<p>Welcome. Please post here instead of email, so one answer reaches the whole class.</p><ul><li>Pick a folder before you post</li><li>Search first, your question may already be here</li><li>Mark a followup resolved when it is done</li></ul>",
        },
    ],

    // ---------------- CS6620 Fundamentals of Cloud Computing ----------------
    "6620": [
        {
            q: "My container runs at home but crashes in the cluster",
            d: "<p>In <strong>A3: Containers</strong> the image runs fine locally. In the cluster it restarts again and again. The log stops after the first line.</p>",
            a: ["<p>A restart loop usually means the process exits. Check that your app listens on the port the manifest declares, and that it binds to all interfaces, not just localhost.</p>"],
            f: [{ t: "Binding to all interfaces fixed it. Thank you." }],
        },
        {
            q: "How much cloud spend is acceptable for the project?",
            d: "<p>For the Cloud Architecture Project, is there a budget we should stay under? I do not want a surprise bill.</p>",
        },
        {
            q: "Office hours today 2 to 3 for cluster problems",
            d: "<p>I will be in office hours <strong>today 2 to 3pm</strong>. Bring your manifest and the output of the describe command.</p>",
        },
        {
            q: "My virtual machine has no internet access",
            d: "<p>In <strong>A1: Cloud Foundations</strong> I created the instance and I can reach it by address, but from inside it nothing resolves.</p>",
            a: ["<p>The subnet has no route out. Attach a gateway to the route table, or place the instance in a subnet that already has one.</p>"],
            f: [{ t: "Should a private subnet ever have a gateway?", r: "<p>Not a public one. Use a managed translation gateway so it can reach out without being reachable from outside.</p>" }],
        },
        {
            q: "A4: Orchestration opens today",
            d: "<p><strong>A4: Orchestration</strong> is open. Get one deployment healthy before you touch scaling. The quiz <em>Learning Activity: Docker &amp; Kubernetes</em> is a good warm up.</p>",
        },
        {
            q: "Is serverless on the exam?",
            d: "<p>Does the exam include the serverless week, or does it stop after storage and networking?</p>",
        },
        {
            q: "Rolling update or blue green for the assignment?",
            d: "<p>In <strong>A3: Containers</strong> we must deploy a new version with no downtime. Which strategy do you want to see?</p>",
            a: [
                "<p>I did a rolling update. It is fewer moving parts and the platform handles it for you.</p>",
                "<p>Either is fine. Rolling is simpler. Blue green is easier to roll back. Say in your write up which you picked and why.</p>",
            ],
            f: [{ t: "How do I prove there was no downtime?", r: "<p>Run a request loop during the deploy and paste the result. A clean run is the proof.</p>" }],
        },
        {
            q: "Asking for help with my account credit, instructors only",
            d: "<p>Hello. My student credit has not arrived and I cannot start <strong>A2: Virtualization</strong>. Could you check my account?</p>",
            a: ["<p>I found your request. The credit is applied now. Let us know if it still does not show.</p>"],
        },
        {
            q: "A cheap way to keep the lab cluster running?",
            d: "<p>Leaving the cluster up all week burns credit fast. What do people do between assignments?</p>",
            a: ["<p>Scale the node group to zero when you finish for the day. The control plane stays and the nodes cost nothing.</p>"],
        },
        {
            q: "Exam logistics and what to review",
            d: "<p>The exam is in class and takes fifty minutes.</p><ul><li>Open notes and on your own</li><li>Covers virtualization, containers, orchestration, storage and networking</li><li>One diagram question</li></ul>",
        },
        {
            q: "What is the difference between an image and a container?",
            d: "<p>In <strong>A1: Cloud Foundations</strong> the two words seem to be used for the same thing. What is the real difference?</p>",
            a: ["<p>The image is the recipe on disk and it never changes. The container is one running copy of it. One image can run as many containers.</p>"],
        },
        {
            q: "May our project use a provider other than the one in class?",
            d: "<p>Our team already has credit with another provider. Would that be acceptable for the project?</p>",
        },
        {
            q: "Welcome to the course and how we use Pazza",
            d: "<p>Welcome. Please ask here rather than by email, so everyone reads the answer.</p><ul><li>Pick a folder before you post</li><li>Search first, your question may already be here</li><li>Mark a followup resolved when it is done</li></ul>",
        },
    ],

    // ---------------- CS6510 Advanced Software Development ----------------
    "6510": [
        {
            q: "My pipeline passes locally but fails on the runner",
            d: "<p>In <strong>A6: Continuous Integration</strong> the tests are green on my laptop and red on the runner. The failure is a missing file.</p>",
            a: ["<p>The runner checks out a clean tree, so anything you did not commit is gone. Check your ignore file, the missing file is probably in it.</p>"],
            f: [{ t: "It was in the ignore file. Thank you." }],
        },
        {
            q: "How large should the capstone team be?",
            d: "<p>For <strong>A10: Capstone Delivery</strong>, is four people too many? We are worried about splitting the work fairly.</p>",
        },
        {
            q: "Office hours today 1 to 2 for pipeline questions",
            d: "<p>I will be in office hours <strong>today 1 to 2pm</strong>. Bring the failing job log and we will read it together.</p>",
        },
        {
            q: "How do I undo a commit that is already pushed?",
            d: "<p>In <strong>A4: Version Control &amp; Collaboration</strong> I pushed a secret by mistake. What is the safe way to undo it?</p>",
            a: ["<p>Revert the commit so history stays intact, then rotate the secret. Rewriting shared history breaks everyone else's clone.</p>"],
            f: [{ t: "Is the secret really gone after a revert?", r: "<p>No. It stays in the history, which is why rotating it matters more than the revert.</p>" }],
        },
        {
            q: "A5: Testing Strategy opens today",
            d: "<p><strong>A5: Testing Strategy</strong> is open. Write the test plan before the tests. The quiz <em>Learning Activity: Testing Strategies</em> covers the same vocabulary.</p>",
        },
        {
            q: "Does the exam include the DevOps week?",
            d: "<p>Does the exam reach continuous delivery and DevOps, or does it stop after testing?</p>",
        },
        {
            q: "How much coverage is enough for the assignment?",
            d: "<p>In <strong>A5: Testing Strategy</strong> we must justify our coverage. Is there a number you want to see?</p>",
            a: [
                "<p>I stopped chasing the number and wrote tests for the branches that actually break. The write up was easier that way.</p>",
                "<p>That is the right instinct. There is no target number. Explain what you chose to test and what risk each test removes.</p>",
            ],
            f: [{ t: "Do we need tests for the generated code too?", r: "<p>No. Test what you wrote and what you rely on, not what a tool produced.</p>" }],
        },
        {
            q: "Asking about a team problem, instructors only",
            d: "<p>Hello. One member of our team has not answered messages for two weeks. We have meeting notes. How should we handle it?</p>",
            a: ["<p>Thank you for the notes, they are exactly what we need. Send them over and we will speak with the student this week.</p>"],
        },
        {
            q: "A good template for a design document?",
            d: "<p>Our team keeps arguing about the format. Does anyone have a design document template that is short but complete?</p>",
            a: ["<p>We use context, decision, alternatives, consequences. Four headings, one page, and every argument has a place to go.</p>"],
        },
        {
            q: "Exam logistics and what to review",
            d: "<p>The exam is in class and takes fifty minutes.</p><ul><li>Open notes and on your own</li><li>Covers process, architecture, version control, testing and integration</li><li>One architecture diagram question</li></ul>",
        },
        {
            q: "Trunk based or feature branches for our team?",
            d: "<p>In <strong>A4: Version Control &amp; Collaboration</strong> we must pick a branching model. Which one do you recommend for a team of four?</p>",
            a: ["<p>For four people over one term, short lived branches merged daily work best. Long branches turn into painful merges near the deadline.</p>"],
        },
        {
            q: "May we change our capstone idea after the proposal?",
            d: "<p>We proposed one idea and after the architecture week it looks too large. May we scope it down?</p>",
        },
        {
            q: "Welcome to the course and how we use Pazza",
            d: "<p>Welcome. Please post here rather than email, so the whole class benefits.</p><ul><li>Pick a folder before you post</li><li>Search first, your question may already be here</li><li>Mark a followup resolved when it is done</li></ul>",
        },
    ],

    // ---------------- CS5700 Computer Networks ----------------
    "5700": [
        {
            q: "My socket blocks forever on receive",
            d: "<p>In <strong>A3: Socket Programming</strong> the client sends and the server never returns from receive. Both run on my laptop.</p>",
            a: ["<p>Receive waits until data arrives, and your sender probably never flushed. Send an explicit length first, then read exactly that many bytes.</p>"],
            f: [{ t: "Sending the length first fixed it. Thank you." }],
        },
        {
            q: "How many hosts should the project topology have?",
            d: "<p>For the final project, is a three host topology enough, or do you want something larger?</p>",
        },
        {
            q: "Office hours today 3 to 4 for capture questions",
            d: "<p>I will be in office hours <strong>today 3 to 4pm</strong>. Bring your packet capture and we will read the handshake together.</p>",
        },
        {
            q: "Why does my capture show a retransmission with no loss?",
            d: "<p>In <strong>A1: Internet Architecture</strong> I capture on a clean link and still see a retransmission. Nothing was dropped.</p>",
            a: ["<p>The acknowledgement was late, not the data. The sender's timer fired before it arrived, so it sent again. That is normal on a slow path.</p>"],
            f: [{ t: "Does that hurt throughput?", r: "<p>A little. The sender also shrinks its window, so a few late acknowledgements cost more than the extra packet.</p>" }],
        },
        {
            q: "A4: Transport Layer opens today",
            d: "<p><strong>A4: Transport Layer</strong> is open. Get reliable delivery working before you touch congestion control. The quiz <em>Learning Activity: Reliable Data Transfer</em> comes first.</p>",
        },
        {
            q: "Does the midterm include routing?",
            d: "<p>Does the Midterm Exam reach the routing week, or does it stop at the transport layer?</p>",
        },
        {
            q: "Why does my window never grow past a few packets?",
            d: "<p>In <strong>A5: TCP in Depth</strong> my congestion window stays small even though the link is idle.</p>",
            a: [
                "<p>Mine did that because the receiver advertised a tiny window. The sender can never pass that, no matter how idle the link is.</p>",
                "<p>Correct. The sender uses the smaller of the congestion window and the advertised window. Raise the receive buffer and try again.</p>",
            ],
            f: [{ t: "How do I see the advertised window in a capture?", r: "<p>It is a field in every segment header. Add it as a column and watch it change.</p>" }],
        },
        {
            q: "Asking for an extension, instructors only",
            d: "<p>Hello. My laptop died and I lost my work on <strong>A3: Socket Programming</strong>. May I have two extra days?</p>",
            a: ["<p>Two days is fine. Push to your repository early from now on, so a dead laptop costs you less.</p>"],
        },
        {
            q: "A good way to practise reading captures?",
            d: "<p>The lecture captures make sense, but my own are a wall of noise. How do people learn to read them?</p>",
            a: ["<p>Filter down to one connection first, then follow the stream. Once you can read one conversation, the rest stops looking like noise.</p>"],
        },
        {
            q: "Midterm Exam logistics",
            d: "<p>The Midterm Exam is in class and takes fifty minutes.</p><ul><li>Open notes and on your own</li><li>Covers layering, the application layer, sockets and the transport layer</li><li>You will read one short capture</li></ul>",
        },
        {
            q: "What is the real difference between a hub and a switch?",
            d: "<p>In <strong>A1: Internet Architecture</strong> both join machines on one link. Why does the difference matter?</p>",
            a: ["<p>A hub repeats every frame to every port, so everyone shares the link. A switch learns which address sits on which port and sends the frame only there.</p>"],
        },
        {
            q: "May the project use a simulator instead of real machines?",
            d: "<p>We do not have enough machines for the topology. Is a simulator acceptable for the project?</p>",
        },
        {
            q: "Welcome to the course and how we use Pazza",
            d: "<p>Welcome. Please ask here instead of by email, so one answer serves everyone.</p><ul><li>Pick a folder before you post</li><li>Search first, your question may already be here</li><li>Mark a followup resolved when it is done</li></ul>",
        },
    ],

    // ---------------- CS6140 Machine Learning ----------------
    "6140": [
        {
            q: "My training accuracy is high and my test accuracy is low",
            d: "<p>In <strong>A2: Linear Regression</strong> I fit the training data almost perfectly and the test error is terrible. Am I overfitting?</p>",
            a: ["<p>Yes. Add regularisation and check your feature count against your sample count. A model with more features than samples can memorise anything.</p>"],
            f: [{ t: "Regularisation closed most of the gap. Thank you." }],
        },
        {
            q: "How large should the dataset for the project be?",
            d: "<p>For the applied project, is a few thousand rows enough, or do you want something larger?</p>",
        },
        {
            q: "Office hours today 2 to 3 for model questions",
            d: "<p>I will be in office hours <strong>today 2 to 3pm</strong>. Bring your learning curve and we will read it together.</p>",
        },
        {
            q: "Should I scale features before I fit?",
            d: "<p>In <strong>A1: ML Foundations</strong> one feature is in the thousands and another is between zero and one. Does that matter?</p>",
            a: ["<p>It matters a lot for anything that uses distance or gradient descent. Scale on the training set only, then apply the same scaler to the test set.</p>"],
            f: [{ t: "Why not scale the whole dataset at once?", r: "<p>That leaks test information into training. Your score would look better than it really is.</p>" }],
        },
        {
            q: "A4: Model Evaluation opens today",
            d: "<p><strong>A4: Model Evaluation</strong> is open. Split before you touch the data. The quiz <em>Learning Activity: Model Evaluation</em> covers the same ideas.</p>",
        },
        {
            q: "Does the midterm include neural networks?",
            d: "<p>Does the Midterm Exam reach the neural network week, or does it stop at kernels?</p>",
        },
        {
            q: "Accuracy or F1 for an unbalanced dataset?",
            d: "<p>In <strong>A4: Model Evaluation</strong> my classes are ninety five to five. Accuracy says my model is great and it clearly is not.</p>",
            a: [
                "<p>Predicting the majority class every time gives you ninety five percent accuracy. That is why the number looks good.</p>",
                "<p>Exactly. Report precision, recall and F1, and show the confusion matrix. Accuracy alone hides this case.</p>",
            ],
            f: [{ t: "Should I resample the training data too?", r: "<p>You may, but resample inside the cross validation folds, never before the split.</p>" }],
        },
        {
            q: "Asking for an extension, instructors only",
            d: "<p>Hello. I was ill this week and my <strong>A3: Logistic Regression</strong> is not finished. Could I have two more days?</p>",
            a: ["<p>Two days is fine. Rest first and send it when you are able.</p>"],
        },
        {
            q: "A good source for clean practice datasets?",
            d: "<p>Half the datasets I find need hours of cleaning before I can fit anything. Where do people get clean ones?</p>",
            a: ["<p>The built in datasets in the standard library are clean and small, which is perfect while you are still debugging the model.</p>"],
        },
        {
            q: "Midterm Exam logistics",
            d: "<p>The Midterm Exam is in class and takes fifty minutes.</p><ul><li>Open notes and on your own</li><li>Covers regression, classification, evaluation and trees</li><li>You will read one confusion matrix</li></ul>",
        },
        {
            q: "Why does my gradient descent never converge?",
            d: "<p>In <strong>A2: Linear Regression</strong> my loss goes up instead of down, and after a while it turns into a very large number.</p>",
            a: ["<p>Your learning rate is too large, so every step jumps past the minimum. Divide it by ten and watch the loss again.</p>"],
        },
        {
            q: "May our project use a pretrained model?",
            d: "<p>Our idea works much better with a pretrained model. Is that acceptable, or must we train from scratch?</p>",
        },
        {
            q: "Welcome to the course and how we use Pazza",
            d: "<p>Welcome. Please post here instead of email, so everyone reads the answer once.</p><ul><li>Pick a folder before you post</li><li>Search first, your question may already be here</li><li>Mark a followup resolved when it is done</li></ul>",
        },
    ],

    // ---------------- CS5100 Foundations of Artificial Intelligence ----------------
    "5100": [
        {
            q: "My A star returns a path that is not the shortest",
            d: "<p>In <strong>A3: Informed Search</strong> my search finds a path but it is longer than the one breadth first finds. I think my heuristic is wrong.</p>",
            a: ["<p>Your heuristic overestimates, so it is not admissible. A star only guarantees the shortest path when the heuristic never overestimates the true cost.</p>"],
            f: [{ t: "Straight line distance fixed it. Thank you." }],
        },
        {
            q: "How complex should the project domain be?",
            d: "<p>For the final project, is a small puzzle domain enough, or do you want something with a larger state space?</p>",
        },
        {
            q: "Office hours today 1 to 2 for search questions",
            d: "<p>I will be in office hours <strong>today 1 to 2pm</strong>. Bring your search tree and we will trace it by hand.</p>",
        },
        {
            q: "Why does my breadth first search run out of memory?",
            d: "<p>In <strong>A2: Uninformed Search</strong> the search works on small boards and dies on the larger ones.</p>",
            a: ["<p>Breadth first keeps the whole frontier in memory and it grows very fast. Keep a visited set so you never expand the same state twice.</p>"],
            f: [{ t: "Would depth first use less memory?", r: "<p>Much less, but it may not find the shortest path. Iterative deepening gives you both.</p>" }],
        },
        {
            q: "A5: Adversarial Search opens today",
            d: "<p><strong>A5: Adversarial Search</strong> is open. Get minimax correct before you add pruning. The quiz <em>Learning Activity: Adversarial Search</em> is a good first step.</p>",
        },
        {
            q: "Does the midterm include constraint satisfaction?",
            d: "<p>Does the Midterm Exam reach constraint satisfaction, or does it stop after adversarial search?</p>",
        },
        {
            q: "Does alpha beta pruning change the answer?",
            d: "<p>In <strong>A5: Adversarial Search</strong> my pruned search returns a different move than plain minimax. Should it?</p>",
            a: [
                "<p>It should return the same value. When I had this, my bounds were being passed down the wrong way round.</p>",
                "<p>That is the usual bug. Pruning only skips branches that cannot change the result, so the value must match. Check the order of your two bounds.</p>",
            ],
            f: [{ t: "Does move ordering matter then?", r: "<p>Only for speed. A good order prunes far more, but the answer stays the same.</p>" }],
        },
        {
            q: "Asking for an extension, instructors only",
            d: "<p>Hello. I have a visa appointment on the due date for <strong>A4: Local Search</strong>. May I hand it in a day late?</p>",
            a: ["<p>One day is fine. Good luck at the appointment.</p>"],
        },
        {
            q: "A good way to visualise a search tree?",
            d: "<p>Reading my own trace is painful. Does anyone draw the search tree, and with what?</p>",
            a: ["<p>I print the frontier at each step with indentation for depth. It is crude but it made my bug obvious in a minute.</p>"],
        },
        {
            q: "Midterm Exam logistics",
            d: "<p>The Midterm Exam is in class and takes fifty minutes.</p><ul><li>Open notes and on your own</li><li>Covers search, local search and adversarial search</li><li>You will trace one search by hand</li></ul>",
        },
        {
            q: "What makes a heuristic admissible?",
            d: "<p>In <strong>A1: Intro to AI</strong> the definition is short but I cannot tell whether mine passes.</p>",
            a: ["<p>It must never overestimate the true remaining cost. If you can find one state where your estimate is too high, it is not admissible.</p>"],
        },
        {
            q: "May we use an existing library for the project?",
            d: "<p>Our project would be much faster with an existing solver. Is that allowed, or must the search be ours?</p>",
        },
        {
            q: "Welcome to the course and how we use Pazza",
            d: "<p>Welcome. Please post here rather than email, so the answer reaches everyone.</p><ul><li>Pick a folder before you post</li><li>Search first, your question may already be here</li><li>Mark a followup resolved when it is done</li></ul>",
        },
    ],

    // ---------------- CS6650 Building Scalable Distributed Systems ----------------
    "6650": [
        {
            q: "My threads finish but the total is wrong",
            d: "<p>In <strong>A2: Concurrency</strong> every thread reports success and the final count is short by a few hundred. It changes on every run.</p>",
            a: ["<p>That is a lost update. Two threads read the same value and both write back. Guard the counter with a lock, or use an atomic type.</p>"],
            f: [{ t: "The atomic type fixed it. Thank you." }],
        },
        {
            q: "How many nodes should the project run on?",
            d: "<p>For the final project, is three nodes enough to show the ideas, or do you want more?</p>",
        },
        {
            q: "Office hours today 4 to 5 for concurrency questions",
            d: "<p>I will be in office hours <strong>today 4 to 5pm</strong>. Bring your thread dump and we will look at it together.</p>",
        },
        {
            q: "My client hangs when the server is slow",
            d: "<p>In <strong>A4: Remote Communication</strong> everything works until the server slows down. Then my client freezes and never recovers.</p>",
            a: ["<p>You have no timeout, so the call waits forever. Set a timeout, then decide what to do on failure, retry or fail fast.</p>"],
            f: [{ t: "Is retrying always safe?", r: "<p>Only when the call is idempotent. Otherwise a retry can charge the same order twice.</p>" }],
        },
        {
            q: "A5: Consistency opens today",
            d: "<p><strong>A5: Consistency</strong> is open. Write down the guarantee you want before you write code. The quiz <em>Learning Activity: Consistency Models</em> covers the vocabulary.</p>",
        },
        {
            q: "Does the midterm include consensus?",
            d: "<p>Does the Midterm Exam reach consensus, or does it stop after the consistency models?</p>",
        },
        {
            q: "Do we really need consensus for the assignment?",
            d: "<p>In <strong>A6: Consensus</strong> our replicas agree most of the time already. Is a full protocol necessary?</p>",
            a: [
                "<p>Ours agreed too, until we killed a node mid write. Then two replicas disagreed and neither knew it.</p>",
                "<p>That is the whole point. Agreement without failure is easy. The protocol earns its cost only when a node dies at the wrong moment.</p>",
            ],
            f: [{ t: "How do we test that in the assignment?", r: "<p>Kill a node during a write and check that every surviving replica still reports the same value.</p>" }],
        },
        {
            q: "Asking about a group problem, instructors only",
            d: "<p>Hello. Our group is down to two active members and the load is heavy. We have meeting notes from the last three weeks.</p>",
            a: ["<p>Send the notes over. We will talk to the group this week and adjust the scope if we need to.</p>"],
        },
        {
            q: "A good way to see message order across nodes?",
            d: "<p>Reading three log files side by side is hopeless. How do people follow one request across nodes?</p>",
            a: ["<p>Give every request an id at the edge and log it on every node. Then grep for the id and the whole path lines up.</p>"],
        },
        {
            q: "Midterm Exam logistics",
            d: "<p>The Midterm Exam is in class and takes fifty minutes.</p><ul><li>Open notes and on your own</li><li>Covers concurrency, networking, remote calls and consistency</li><li>One failure scenario question</li></ul>",
        },
        {
            q: "What is the difference between concurrency and parallelism?",
            d: "<p>In <strong>A1: Distributed Foundations</strong> the two words appear together often. Are they the same thing?</p>",
            a: ["<p>Concurrency is structuring work so parts can run out of order. Parallelism is actually running them at the same time. One core can be concurrent without being parallel.</p>"],
        },
        {
            q: "May our project use a managed queue service?",
            d: "<p>Building our own message queue would eat the whole term. May we use a managed one and focus on the system around it?</p>",
        },
        {
            q: "Welcome to the course and how we use Pazza",
            d: "<p>Welcome. Please post here instead of email, so one answer serves the class.</p><ul><li>Pick a folder before you post</li><li>Search first, your question may already be here</li><li>Mark a followup resolved when it is done</li></ul>",
        },
    ],
};

export default CONTENT;
