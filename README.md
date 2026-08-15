# Kambaz - Node Server (A6)

Coco Choi. CS5610 Web Development, Fall 2025, Section 04.

This is the Node server for A6. It is an Express app. It answers the
Lab 5 exercises and the Kambaz API.

In A5 the data lived in memory. A restart lost every change. Now every
collection lives in a MongoDB database. I reach the database with
Mongoose. The sessions live there too.

The React client is a second repository:
https://github.com/Cocochoiii/kambaz-next-js

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

## The extra Canvas screens

Canvas has these screens. The book does not. They all work the same
way. The list belongs to a course, and one id changes one item.

| Route | What it does |
| --- | --- |
| `GET /api/courses/:courseId/announcements` | the announcements of a course |
| `POST /api/courses/:courseId/announcements` | a new announcement |
| `DELETE /api/announcements/:announcementId` | remove an announcement |
| `GET /api/courses/:courseId/quizzes` | the quizzes of a course |
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

`Kambaz/Database/seed.js` runs once after the connection. It fills a
collection only when that collection has no rows. So my own edits stay.
It covers all eleven collections.

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
- `Kambaz/Database` the sample data, and `seed.js` that loads it once
- the sessions live in a `sessions` collection, next to the rest
