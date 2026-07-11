import mongoose from "mongoose";

// A quiz. Questions are stored inside the quiz as plain objects, each with its
// own _id. strict:false lets old data still load.
const schema = new mongoose.Schema(
    {
        _id: String,
        title: { type: String, default: "New Quiz" },
        course: String,
        description: { type: String, default: "" },
        quizType: { type: String, default: "Graded Quiz" },        // Graded Quiz | Practice Quiz | Graded Survey | Ungraded Survey
        assignmentGroup: { type: String, default: "Quizzes" },      // Quizzes | Exams | Assignments | Project
        points: { type: Number, default: 0 },                       // sum of question points
        shuffleAnswers: { type: Boolean, default: true },
        timeLimit: { type: Number, default: 20 },                   // minutes
        multipleAttempts: { type: Boolean, default: false },
        howManyAttempts: { type: Number, default: 1 },
        showCorrectAnswers: { type: String, default: "" },
        accessCode: { type: String, default: "" },
        oneQuestionAtATime: { type: Boolean, default: true },
        webcamRequired: { type: Boolean, default: false },
        lockQuestionsAfterAnswering: { type: Boolean, default: false },
        dueDate: String,
        availableDate: String,
        untilDate: String,
        published: { type: Boolean, default: false },
        questions: { type: Array, default: [] },                    // [{ _id, type, title, points, question, choices|correctAnswer|answers }]
    },
    { collection: "quizzes", strict: false }
);
export default schema;
