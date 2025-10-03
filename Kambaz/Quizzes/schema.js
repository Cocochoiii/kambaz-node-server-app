import mongoose from "mongoose";

// Schema for quizzes. Quizzes live inside a course and contain
// configuration describing how students should take the quiz. Many of
// the fields below come directly from the assignment description. See
// the corresponding models for related entities such as questions and
// attempts.

const quizSchema = new mongoose.Schema(
  {
    // Primary key. We don't rely on MongoDB's default _id because
    // elsewhere in the code the id is generated with uuidv4().
    _id: { type: String, required: true },

    // The course this quiz belongs to. References the CourseModel.
    course: { type: String, ref: "CourseModel", required: true },

    // Human‑readable title of the quiz.
    title: { type: String, required: true },

    // Longer description or instructions for the quiz. Can be empty.
    description: { type: String, default: "" },

    // Quiz type: Graded Quiz, Practice Quiz, Graded Survey, Ungraded Survey.
    type: {
      type: String,
      enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"],
      default: "Graded Quiz",
    },

    // Total points available. This can be calculated from the sum of
    // question points but is persisted to ease sorting and display.
    points: { type: Number, default: 0 },

    // Assignment grouping. Allows the quiz to be grouped with other
    // assignments for grade book calculation. Not strictly enforced.
    assignmentGroup: {
      type: String,
      enum: ["Quizzes", "Exams", "Assignments", "Project"],
      default: "Quizzes",
    },

    // Shuffle answer choices on each attempt.
    shuffleAnswers: { type: Boolean, default: true },

    // Time limit in minutes. If null then unlimited.
    timeLimit: { type: Number, default: 20 },

    // Allow multiple attempts. When false students only have one chance.
    multipleAttempts: { type: Boolean, default: false },

    // When multipleAttempts is true, how many times the quiz can be
    // attempted by a student.
    allowedAttempts: { type: Number, default: 1 },

    // When and how correct answers are shown to students. Use a simple
    // enumeration of options. More elaborate timing rules could be
    // supported in future iterations.
    showCorrectAnswers: {
      type: String,
      enum: ["Immediately", "After Last Attempt", "Never"],
      default: "Immediately",
    },

    // Optional passcode students must enter before taking the quiz. If
    // blank no passcode is required.
    accessCode: { type: String, default: "" },

    // Present one question at a time. When false show all questions on a
    // single page. Recommended for long quizzes.
    oneQuestionAtATime: { type: Boolean, default: true },

    // Require students to have a webcam on while taking the quiz. This
    // field is persisted for completeness but not enforced by the
    // backend.
    webcamRequired: { type: Boolean, default: false },

    // Prevent students from returning to previous questions once an
    // answer has been selected.
    lockQuestionsAfterAnswering: { type: Boolean, default: false },

    // Availability windows for the quiz. Students can only start an
    // attempt if current date is within [availableDate, untilDate].
    dueDate: { type: Date },
    availableDate: { type: Date },
    untilDate: { type: Date },

    // Flag indicating whether the quiz is published. Unpublished quizzes
    // are invisible to students. Faculty can toggle this.
    published: { type: Boolean, default: false },

    // Track when the quiz was created. Useful for sorting and auditing.
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "quizzes" }
);

export default quizSchema;