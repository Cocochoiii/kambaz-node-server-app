import model from "./model.js";

// Sample quizzes for CS5610 so the list is populated and taking/scoring is
// demoable. Idempotent: only inserts when the first sample is missing.
const daysFromNow = (n) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString();
};

export default async function seedQuizzes() {
    const exists = await model.findById("QZ5610-SAMPLE-1");
    if (exists) return;

    const base = {
        course: "5610", published: true, shuffleAnswers: true, timeLimit: 20,
        oneQuestionAtATime: true, assignmentGroup: "Quizzes", quizType: "Graded Quiz",
        availableDate: daysFromNow(-10), dueDate: daysFromNow(20), untilDate: daysFromNow(30),
    };

    const q1 = {
        ...base, _id: "QZ5610-SAMPLE-1", title: "HTML & CSS Basics",
        description: "<p>A short warm-up quiz on HTML and CSS.</p>",
        multipleAttempts: true, howManyAttempts: 3, points: 3,
        questions: [
            { _id: "QZ1-Q1", type: "TRUE_FALSE", title: "CSS abbreviation", points: 1,
              question: "<p>CSS stands for Cascading Style Sheets.</p>", correctAnswer: true },
            { _id: "QZ1-Q2", type: "MULTIPLE_CHOICE", title: "Hyperlink tag", points: 1,
              question: "<p>Which HTML tag name creates a hyperlink?</p>",
              choices: [
                  { _id: "QZ1-Q2-a", text: "a", correct: true },
                  { _id: "QZ1-Q2-b", text: "link", correct: false },
                  { _id: "QZ1-Q2-c", text: "href", correct: false },
                  { _id: "QZ1-Q2-d", text: "nav", correct: false },
              ] },
            { _id: "QZ1-Q3", type: "FILL_BLANK", title: "Text color property", points: 1,
              question: "<p>The CSS property used to set text color is ____.</p>", answers: ["color"] },
        ],
    };

    const q2 = {
        ...base, _id: "QZ5610-SAMPLE-2", title: "JavaScript Fundamentals",
        description: "<p>Core JavaScript concepts.</p>",
        multipleAttempts: false, howManyAttempts: 1, points: 3,
        questions: [
            { _id: "QZ2-Q1", type: "MULTIPLE_CHOICE", title: "Block-scoped variable", points: 1,
              question: "<p>Which keyword declares a block-scoped variable?</p>",
              choices: [
                  { _id: "QZ2-Q1-a", text: "let", correct: true },
                  { _id: "QZ2-Q1-b", text: "var", correct: false },
                  { _id: "QZ2-Q1-c", text: "function", correct: false },
                  { _id: "QZ2-Q1-d", text: "def", correct: false },
              ] },
            { _id: "QZ2-Q2", type: "TRUE_FALSE", title: "Strict equality", points: 1,
              question: "<p>The === operator compares both value and type.</p>", correctAnswer: true },
            { _id: "QZ2-Q3", type: "FILL_BLANK", title: "Parse JSON", points: 1,
              question: "<p>To convert a JSON string into an object you call JSON.____().</p>", answers: ["parse"] },
        ],
    };

    await model.insertMany([q1, q2]);
    console.log("Seeded sample quizzes for 5610");
}
