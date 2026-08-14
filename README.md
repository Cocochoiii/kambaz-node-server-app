# Kambaz - Node Server (A5)

Coco Choi. CS5610 Web Development, Fall 2025, Section 04.

This is the Node server for A5. It is an Express app. It answers the Lab 5
exercises and the Kambaz API.

The React client is a second repository:
https://github.com/Cocochoiii/kambaz-next-js

## How to run it

```bash
npm install
npm run dev
```

The server listens on port 4000. Open http://localhost:4000 and you should
see `Welcome to Full Stack Development!`.

## Environment variables

At home the defaults work, so I do not need a `.env` file. Copy
`.env.example` to `.env` if you want to change them.

| Key | What it is for |
| --- | --- |
| `SERVER_ENV` | `production` on Render, nothing at home |
| `CLIENT_URL` | the address of the React app, for CORS |
| `SERVER_URL` | the domain of this server |
| `SESSION_SECRET` | any string. It signs the session cookie |
| `PORT` | the port. Render sets this by itself |

## The session

The server keeps the user in a session cookie. A cookie can only travel
between two different sites when it is `sameSite: "none"` and `secure`.
Those two need https, so I only turn them on in production.

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

I must register `/lab5/todos/create` before `/lab5/todos/:id`. If not,
express reads `create` as an id.

## Kambaz API

| Route | What it does |
| --- | --- |
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

Canvas has these screens, the book does not. They work the same way: the
list hangs off the course, and the id is enough to change one item.

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
| `PUT /api/courses/:courseId/grades/release` | show the grades to the students |
| `GET /api/courses/:courseId/gradeCategories` | the weights of the categories |
| `GET /api/users/:userId/messages` | my inbox |
| `POST /api/messages` | send one. The sender is the session user |
| `PUT /api/messages/:messageId` | mark one as read |
| `DELETE /api/messages/:messageId` | remove one |
| `GET /api/users/:userId/calendar` | every date of my courses, in one list |

The Calendar has no data of its own. It reads the assignments, the meetings
and the announcements of my courses and returns one sorted list.

The data lives in memory, in `Kambaz/Database`. A change stays as long as
the server runs. A restart brings the first data back.

## Folders

- `index.js` the app, the CORS setup and the session
- `Lab5` the Chapter 5 exercises
- `Kambaz` one folder per thing, each with `routes.js` and `dao.js`
- `Kambaz/Database` the data as plain JavaScript files
