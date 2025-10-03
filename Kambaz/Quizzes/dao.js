import { v4 as uuidv4 } from "uuid";
import QuizModel from "./model.js";
import QuestionModel from "./questionModel.js";
import AttemptModel from "./attemptModel.js";

export async function findQuizzesForCourse(courseId, currentUser) {
  const now = new Date();
  const baseQuery = { course: courseId };

  if (!currentUser || currentUser.role !== "FACULTY") {
    baseQuery.published = true;
    baseQuery.$and = [
      {
        $or: [
          { availableDate: { $lte: now } },
          { availableDate: { $exists: false } },
          { availableDate: null },
        ],
      },
      {
        $or: [
          { untilDate: { $gte: now } },
          { untilDate: { $exists: false } },
          { untilDate: null },
        ],
      },
    ];
  }

  const quizzes = await QuizModel.find(baseQuery).sort({ createdAt: -1 });
  return quizzes.map((q) => q.toObject());
}

export async function countQuestionsForQuizzes(quizIds) {
  const counts = await QuestionModel.aggregate([
                                                 { $match: { quiz: { $in: quizIds } } },
                                                 { $group: { _id: "$quiz", count: { $sum: 1 } } },
                                               ]);
  const map = new Map(counts.map((c) => [c._id, c.count]));
  return (qid) => map.get(qid) || 0;
}

export async function createQuiz(courseId, quiz) {
  const _id = uuidv4();
  const newQuiz = {
    ...quiz,
    _id,
    course: courseId,
    published: false,
    createdAt: new Date(),
  };
  const created = await QuizModel.create(newQuiz);
  return created.toObject();
}

export async function findQuizById(qid) {
  const quiz = await QuizModel.findById(qid);
  return quiz ? quiz.toObject() : null;
}

export async function updateQuiz(qid, updates) {
  const { _id, course, ...rest } = updates;
  await QuizModel.updateOne({ _id: qid }, { $set: rest });
  const updated = await QuizModel.findById(qid);
  return updated ? updated.toObject() : null;
}

export async function deleteQuiz(qid) {
  await QuestionModel.deleteMany({ quiz: qid });
  await AttemptModel.deleteMany({ quiz: qid });
  await QuizModel.deleteOne({ _id: qid });
  return { status: "deleted" };
}

export async function publishQuiz(qid, published) {
  await QuizModel.updateOne({ _id: qid }, { $set: { published } });
  const updated = await QuizModel.findById(qid);
  return updated ? updated.toObject() : null;
}

export async function addQuestion(qid, question) {
  const _id = uuidv4();
  const newQuestion = { ...question, _id, quiz: qid };

  if (newQuestion.type === "MULTIPLE_CHOICE" && newQuestion.choices) {
    newQuestion.choices = newQuestion.choices.map((c) => ({
      ...c,
      _id: c._id || uuidv4(),
    }));
  }

  const created = await QuestionModel.create(newQuestion);
  const quiz = await QuizModel.findById(qid);
  if (quiz) {
    const newPoints = (quiz.points || 0) + (question.points || 0);
    await QuizModel.updateOne({ _id: qid }, { $set: { points: newPoints } });
  }
  return created.toObject();
}

export async function updateQuestion(qid, questionId, updates) {
  const question = await QuestionModel.findById(questionId);
  if (!question) return null;

  const { _id, quiz, ...rest } = updates;

  if (rest.type === "MULTIPLE_CHOICE" && rest.choices) {
    rest.choices = rest.choices.map((c) => ({
      ...c,
      _id: c._id || uuidv4(),
    }));
  }

  if (rest.points !== undefined && rest.points !== question.points) {
    const diff = rest.points - question.points;
    await QuizModel.updateOne({ _id: qid }, { $inc: { points: diff } });
  }

  await QuestionModel.updateOne({ _id: questionId }, { $set: rest });
  const updated = await QuestionModel.findById(questionId);
  return updated ? updated.toObject() : null;
}

export async function deleteQuestion(qid, questionId) {
  const question = await QuestionModel.findById(questionId);
  if (question) {
    await QuizModel.updateOne(
        { _id: qid },
        { $inc: { points: -(question.points || 0) } }
    );
  }
  await QuestionModel.deleteOne({ _id: questionId });
  return { status: "deleted" };
}

export async function findQuestionsForQuiz(qid) {
  const questions = await QuestionModel.find({ quiz: qid });
  return questions.map((q) => q.toObject());
}

async function computeScore(qid, answers) {
  let score = 0;
  const questions = await QuestionModel.find({ quiz: qid });
  const qMap = new Map(questions.map((q) => [q._id, q]));

  for (const ans of answers) {
    const q = qMap.get(ans.question);
    if (!q) continue;

    if (q.type === "MULTIPLE_CHOICE") {
      const correct = (q.choices || []).find((c) => c.correct);
      if (correct && ans.answer === correct._id) {
        score += q.points;
      }
    } else if (q.type === "TRUE_FALSE") {
      const boolAns = ans.answer === true || ans.answer === "true";
      if (q.correctAnswer === boolAns) {
        score += q.points;
      }
    } else if (q.type === "FILL_BLANK") {
      const studentAns = (ans.answer || "").toString().trim().toLowerCase();
      const isCorrect = (q.correctAnswers || []).some(
          (corr) => corr.trim().toLowerCase() === studentAns
      );
      if (isCorrect) {
        score += q.points;
      }
    }
  }
  return score;
}

export async function recordAttempt(qid, userId, answers) {
  const quiz = await QuizModel.findById(qid);
  if (!quiz) return null;

  const existing = await AttemptModel.find({ quiz: qid, user: userId }).sort({
                                                                               attemptNumber: -1,
                                                                             });
  const lastAttemptNumber = existing[0]?.attemptNumber || 0;

  if (!quiz.multipleAttempts && lastAttemptNumber >= 1) return null;
  if (quiz.multipleAttempts && lastAttemptNumber >= (quiz.allowedAttempts || 1))
    return null;

  const normalized = (answers || []).map((a) => {
    const questionId = a.question || a.questionId;
    let answer = a.answer;
    if (answer === undefined) {
      if ("choiceId" in a) answer = a.choiceId;
      else if ("boolean" in a) answer = a.boolean ? "true" : "false";
      else if ("text" in a) answer = a.text;
    }
    return { question: questionId, answer };
  });

  const score = await computeScore(qid, normalized);
  const created = await AttemptModel.create({
                                              _id: uuidv4(),
                                              quiz: qid,
                                              user: userId,
                                              answers: normalized,
                                              score,
                                              attemptNumber: lastAttemptNumber + 1,
                                              createdAt: new Date(),
                                            });
  return created.toObject();
}

export async function lastAttempt(qid, userId) {
  const attempt = await AttemptModel.findOne({ quiz: qid, user: userId }).sort({
                                                                                 attemptNumber: -1,
                                                                               });
  return attempt ? attempt.toObject() : null;
}