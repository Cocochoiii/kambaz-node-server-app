# Kambaz Quizzes and Pazza - Node server

Coco Choi. CS5610 Web Development, Fall 2025, Section 04.

This is the Node server of my final project. It is an Express app.
It answers the Lab 5 exercises and the Kambaz API.

I built it on top of my A6 server. Two parts are new.

**Quizzes.** A quiz holds its own questions. The server grades every
answer, so the browser never decides a score.

**Pazza.** Pazza is my clone of a class question board. Each course
has its own board. A student asks a question and the class answers it.

In A5 the data lived in memory. A restart lost every change. Now every
collection lives in a MongoDB database. I reach the database with
Mongoose. The sessions live there too.

The React client is a second repository:
https://github.com/Cocochoiii/kambaz-next-js

This server:
https://github.com/Cocochoiii/kambaz-node-server-app

## How to run it

```bash
npm install
npm run dev
```

MongoDB must run first. At home I start it with `brew services start
mongodb-community`. Or I put my Atlas address in `.env`.

The server listens on port 4000. Open http://localhost:4000. It should
say `Welcome to Full Stack Development!`.

## Environment variables

At home the defaults work, so I do not need a `.env` file. Copy
`.env.example` to `.env` if you want to change them.

| Key | What it is for |
| --- | --- |
| `SERVER_ENV` | `production` on Render, nothing at home |
| `CLIENT_URL` | the address of the React app, for CORS |
| `SERVER_URL` | the domain of this server |
| `SESSION_SECRET` | any string. It signs the session cookie |
| `DATABASE_CONNECTION_STRING` | the MongoDB address |
| `PORT` | the port. Render sets this by itself |

On Render I set `DATABASE_CONNECTION_STRING` to my Atlas address. I
also set `SERVER_ENV` to `production`. If I forget it, the cookie has
no `secure` flag, and login does not stay.

## The session

The server keeps the user in a session cookie. A cookie can go between
two different sites only when it is `sameSite: "none"` and `secure`.
Those two need https. So I turn them on in production only.

## Lab 5 routes

| Route | What it does |
| --- | --- |
| `/lab5/welcome` | a hello message |
| `/lab5/add/:a/:b` | add, and also subtract, multiply, divide |
| `/lab5/calculator?operation=&a=&b=` | the same four, with a query string |
| `/lab5/assignment` | read the assignment |
| `/lab5/assignment/title` | read one property |
| `/lab5/assignment/title/:newTitle` | change one property |
| `/lab5/module` | read the module |
| `/lab5/todos` | the list. `?completed=true` filters it |
| `/lab5/todos/:id` | one todo |
| `/lab5/todos/create` | create, the old GET way |
| `/lab5/todos/:id/delete` | delete, the old GET way |
| `/lab5/todos/:id/title/:title` | update, the old GET way |
| `POST /lab5/todos` | create, the real way |
| `PUT /lab5/todos/:id` | update, the real way |
| `DELETE /lab5/todos/:id` | delete, the real way |

The PUT and the DELETE answer 404 when the id is not there.

I must write `/lab5/todos/create` before `/lab5/todos/:id`. If not,
express reads `create` as an id.

## Kambaz API

| Route | What it does |
| --- | --- |
| `GET /api/users` | all the users. `?role=` and `?name=` filter them |
| `POST /api/users` | a new user |
| `GET /api/users/:userId` | one user |
| `DELETE /api/users/:userId` | remove a user |
| `POST /api/users/signup` | make an account and start a session |
| `POST /api/users/signin` | check the password and start a session |
| `POST /api/users/profile` | the user in the session |
| `POST /api/users/signout` | end the session |
| `PUT /api/users/:userId` | change a user |
| `GET /api/users/:userId/courses` | the courses of a user |
| `POST /api/users/current/courses` | a new course, owned by this user |
| `POST /api/users/:userId/courses/:courseId` | enroll |
| `DELETE /api/users/:userId/courses/:courseId` | unenroll |
| `GET /api/courses` | all the courses |
| `POST /api/courses` | a new course. The author is enrolled too |
| `PUT /api/courses/:courseId` | change a course |
| `DELETE /api/courses/:courseId` | remove a course |
| `GET /api/courses/:courseId/modules` | the modules of a course |
| `POST /api/courses/:courseId/modules` | a new module |
| `PUT /api/modules/:moduleId` | change a module |
| `DELETE /api/modules/:moduleId` | remove a module |
| `GET /api/courses/:courseId/assignments` | the assignments of a course |
| `POST /api/courses/:courseId/assignments` | a new assignment |
| `PUT /api/assignments/:assignmentId` | change an assignment |
| `DELETE /api/assignments/:assignmentId` | remove an assignment |

## The Quizzes API

This is the final project part. A quiz belongs to one course. The
questions live inside the quiz, so one row holds the whole quiz.

| Route | What it does |
| --- | --- |
| `GET /api/courses/:courseId/quizzes` | the quizzes of a course |
| `POST /api/courses/:courseId/quizzes` | a new quiz. It starts not published |
| `GET /api/quizzes/:quizId` | one quiz, with its questions |
| `PUT /api/quizzes/:quizId` | change a quiz |
| `DELETE /api/quizzes/:quizId` | remove a quiz, and its attempts |
| `GET /api/quizzes/:quizId/attempts` | my tries. Count, last, best, all |
| `POST /api/quizzes/:quizId/attempts` | send my answers. The server grades them |

### The shape of a question

A question is a plain object inside the `questions` array.

```js
const question = {
  _id: "1731000000000-3",
  type: "MULTIPLE_CHOICE", // or TRUE_FALSE, or FILL_BLANK
  title: "Hyperlink tag",
  points: 1,
  question: "<p>Which tag makes a link?</p>",
  choices: [{ _id: "...", text: "a", correct: true }],
  correctAnswer: true, // True/False uses this one
  answers: ["color"], // Fill in the Blank uses this one
};
```

The `questions` field is `Mixed`. My old sample rows keep a count there,
not a list. `Mixed` lets both shapes live in the same collection.

### The grading

`Kambaz/QuizAttempts/routes.js` grades a try. There is no half point.

| Type | The rule |
| --- | --- |
| True/False | the answer must match `correctAnswer` |
| Fill in the Blank | one of `answers` must match. Case does not count |
| Multiple Choice | the picked set must equal the correct set |

The grading has to live here. A student could send me any score.
So I never take a score from the browser. I only take the answers.

The quiz payload does still carry the right answers. The review screen
needs them, to paint each question green or red. A real Canvas would
strip them out first. I left that out to keep the code small.

The server also counts the tries. A quiz with Multiple Attempts off
allows one try. When the tries run out, the server answers 403.
The client hides the button too. That is only the second lock.

## The Pazza API

Pazza is the question board. Each course has its own board, so every
route starts from a course or from a post.

Three things live in the database. A **folder** sorts the posts. A
**post** is one question or one note. A **comment** is an answer, a
followup discussion, or a reply under one of them.

### Folders

| Route | What it does |
| --- | --- |
| `GET /api/courses/:courseId/pazza/folders` | the folders of a course |
| `POST /api/courses/:courseId/pazza/folders` | a new folder |
| `PUT /api/pazza/folders/:folderId` | rename a folder |
| `DELETE /api/pazza/folders/:folderId` | remove a folder |

The read route never seeds. If it did, a folder I just deleted would
come back on the next refresh. The seed makes the folders instead, and
so does the route that creates a course.

### Posts

| Route | What it does |
| --- | --- |
| `GET /api/courses/:courseId/pazza/posts` | the posts of a course, newest first |
| `POST /api/courses/:courseId/pazza/posts` | a new question or note |
| `PUT /api/pazza/posts/:postId` | change a post |
| `POST /api/pazza/posts/:postId/view` | count me as a reader |
| `DELETE /api/pazza/posts/:postId` | remove a post, and its comments |

The view route uses `$addToSet`, so one reader counts once. Opening
the same post again does not raise the number.

The update route drops `viewers` before it saves. So an edit can never
wipe the list of readers by mistake.

A post with `postTo` set to `individual` is private. It carries a list
of `recipients`. The client shows it to the author, to the readers on
that list, and to every instructor.

### Comments

| Route | What it does |
| --- | --- |
| `GET /api/posts/:postId/pazza/comments` | the comments of one post, oldest first |
| `GET /api/courses/:courseId/pazza/comments` | every comment of a course |
| `POST /api/posts/:postId/pazza/comments` | a new answer, discussion or reply |
| `PUT /api/pazza/comments/:commentId` | change a comment |
| `DELETE /api/pazza/comments/:commentId` | remove a comment, and its replies |

A comment has a `kind`. An `answer` sits under the post. A `discussion`
starts a followup. A `reply` answers a discussion or another reply, so
it keeps a `parent`.

A reply can hold its own replies. So delete walks down the tree first.
Otherwise the children would stay behind with no parent.

The course route feeds the Class at a Glance screen. That screen counts
every answer of the course. One call is cheaper than one call per post.

## The Pazza sample data

`Kambaz/Pazza/seed.js` fills the board. Three files work together.

| File | What it holds |
| --- | --- |
| `slots.js` | the shape of the sample data, thirteen slots |
| `content.js` | the words of the posts, one list per course |
| `seed.js` | the builder that puts the two together |

Every one of the eleven courses gets the same thirteen slots.

| Item | Count |
| --- | --- |
| Posts | 13 |
| Questions and notes | 9 and 4 |
| Questions with an answer | 6 |
| Questions still open | 3 |
| Followup discussions | 3, and two of them carry a reply |
| Private to the instructors | 1 |
| Pinned notes | 2 |
| Folders used | all 8 |

The dates count back from today. Day 0 fills the Today group and day 1
fills Yesterday. Day 7 is the only count that always lands in the Last
Week group, whatever weekday I demo on. So those three groups are never
empty. The older posts fall into week range groups.

Every author is really enrolled in that course. The seed reads
`enrollments.js` and `users.js` and picks the writers from there. It
also names the real assignments and learning activities of the course,
so the board reads like a real class.

The seed skips a course that already holds a post. So anything I write
during a demo survives a restart. To load the sample data again I drop
`pazza_posts` and `pazza_comments`, then restart.

## The extra Canvas screens

Canvas has these screens. The book does not. They all work the same
way. The list belongs to a course, and one id changes one item.

| Route | What it does |
| --- | --- |
| `GET /api/courses/:courseId/announcements` | the announcements of a course |
| `POST /api/courses/:courseId/announcements` | a new announcement |
| `DELETE /api/announcements/:announcementId` | remove an announcement |
| `GET /api/courses/:courseId/meetings` | the Zoom meetings of a course |
| `POST /api/courses/:courseId/meetings` | a new meeting |
| `DELETE /api/meetings/:meetingId` | remove a meeting |
| `GET /api/courses/:courseId/users` | the people of a course |
| `GET /api/courses/:courseId/grades` | the grades of a course |
| `POST /api/courses/:courseId/grades` | save one score |
| `PUT /api/announcements/:announcementId` | change an announcement |
| `PUT /api/courses/:courseId/grades/release` | show the grades to the students |
| `GET /api/courses/:courseId/gradeCategories` | the weights of the categories |
| `GET /api/users/:userId/messages` | my inbox |
| `POST /api/messages` | send one. The sender is the session user |
| `PUT /api/messages/:messageId` | mark one as read |
| `DELETE /api/messages/:messageId` | remove one |
| `GET /api/users/:userId/calendar` | every date of my courses, in one list |

The Calendar has no data of its own. It reads the assignments, the
meetings and the announcements of my courses. Then it returns one
sorted list.

## The database

Each thing has four files.

| File | What it holds |
| --- | --- |
| `schema.js` | the shape of one document and the collection name |
| `model.js` | the Mongoose model. It gives find, create, update, delete |
| `dao.js` | my own names, like `findUsersByRole`, made with the model |
| `routes.js` | the HTTP part. Every handler is `async` now |

One course has many modules. So a module keeps the key of its course.
Many users take many courses. So an enrollment keeps a user key and a
course key. `populate` changes a key into the real document.

Deleting a course cleans up after itself. The route removes the
modules, the assignments, the quizzes, the grades and the Pazza rows
of that course. Otherwise the database would fill with orphans.

`Kambaz/Database/seed.js` runs once after the connection. It fills a
collection only when that collection has no rows. So my own edits stay.
It covers all eleven collections. The quiz attempts get no sample data.
A try belongs to one real student, so I let students make them.

`Kambaz/Pazza/seed.js` runs right after it and fills the three Pazza
collections the same way.

If I want the sample data again, I drop the database and restart. Then
the log shows five `Seeded` lines.

The book only asks for the first five. I moved the other screens into
the database as well: announcements, meetings, messages, quizzes,
grades and gradeCategories. They use the same four files, so there is
nothing new to learn there.

A free Render server goes to sleep after about fifteen minutes. It
wakes up with an empty memory. So anything kept in memory would go
back to the sample data, and every user would be logged out. That is
why the sessions use `connect-mongo` and live in the database too.

## Folders

- `index.js` the app, the CORS setup and the session
- `Lab5` the Chapter 5 exercises
- `Kambaz` one folder per thing, with `schema.js`, `model.js`,
  `dao.js` and `routes.js`
- `Kambaz/Quizzes` the quizzes, with the four files
- `Kambaz/QuizAttempts` one row for one try of one student
- `Kambaz/Pazza/Folders` the folders of the question board
- `Kambaz/Pazza/Posts` one question or one note
- `Kambaz/Pazza/Comments` the answers, the followups and the replies
- `Kambaz/Pazza/slots.js` and `content.js` the sample board data
- `Kambaz/Database` the sample data, and `seed.js` that loads it once
- the sessions live in a `sessions` collection, next to the rest
