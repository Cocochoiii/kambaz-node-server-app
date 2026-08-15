import mongoose from "mongoose";

// One course has many quizzes. A quiz keeps its questions inside it,
// so one row holds the whole quiz. questions is Mixed, because my old
// seed rows only store a count there, and I want to keep them.
const schema = new mongoose.Schema(
    {
        _id: String,
        course: { type: String, ref: "CourseModel" },
        title: { type: String, default: "New Quiz" },
        description: { type: String, default: "" },
        quizType: { type: String, default: "Graded Quiz" },
        assignmentGroup: { type: String, default: "Quizzes" },
        points: { type: Number, default: 0 },
        shuffleAnswers: { type: Boolean, default: true },
        hasTimeLimit: { type: Boolean, default: true },
        timeLimit: { type: Number, default: 20 },
        multipleAttempts: { type: Boolean, default: false },
        howManyAttempts: { type: Number, default: 1 },
        showCorrectAnswers: { type: Boolean, default: false },
        accessCode: { type: String, default: "" },
        oneQuestionAtATime: { type: Boolean, default: true },
        webcamRequired: { type: Boolean, default: false },
        lockQuestionsAfterAnswering: { type: Boolean, default: false },
        dueDate: String,
        availableDate: String,
        untilDate: String,
        published: { type: Boolean, default: false },
        questions: { type: mongoose.Schema.Types.Mixed, default: [] },
        // The old seed rows also carry these three fields.
        category: String,
        score: Number,
        status: String,
    },
    { collection: "quizzes" }
);
export default schema;
