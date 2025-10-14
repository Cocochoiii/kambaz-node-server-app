// Kambaz/Quizzes/routes.js
import { v4 as uuidv4 } from "uuid";
import { QuizModel, QuestionModel, AttemptModel } from "./models.js";
import { quizzesSeed } from "../Database/quizzes.js";
import { questionsSeed } from "../Database/questions.js";

// Initialize data function
async function initializeQuizData() {
  try {
    const existingQuizzes = await QuizModel.countDocuments().catch(() => 0);

    if (existingQuizzes === 0 && quizzesSeed && quizzesSeed.length > 0) {
      console.log('Initializing quiz data...');

      // Insert quizzes
      await QuizModel.insertMany(quizzesSeed);
      console.log(`✅ Initialized ${quizzesSeed.length} quizzes`);

      // Insert questions
      if (questionsSeed && questionsSeed.length > 0) {
        await QuestionModel.insertMany(questionsSeed);
        console.log(`✅ Initialized ${questionsSeed.length} questions`);

        // Update quiz points
        const quizIds = [...new Set(questionsSeed.map(q => q.quiz))];
        for (const quizId of quizIds) {
          const questions = questionsSeed.filter(q => q.quiz === quizId);
          const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
          await QuizModel.updateOne(
              { _id: quizId },
              { $set: { points: totalPoints } }
          );
        }
        console.log("✅ Updated quiz points");
      }
    }
  } catch (error) {
    console.error('Error initializing quiz data:', error);
  }
}

export default function QuizRoutes(app) {
  console.log("✅ Quiz routes loaded");

  // Initialize on each request if needed (serverless friendly)
  const ensureInit = async (req, res, next) => {
    try {
      await initializeQuizData();
    } catch (error) {
      console.error("Init error:", error);
    }
    next();
  };

  app.get("/api/courses/:courseId/quizzes", ensureInit, async (req, res) => {
    try {
      const { courseId } = req.params;
      const currentUser = req.session?.currentUser;

      const baseQuery = { course: courseId };
      if (!currentUser || currentUser.role !== "FACULTY") {
        baseQuery.published = true;
      }

      const quizzes = await QuizModel.find(baseQuery).sort({ createdAt: -1 });
      const quizIds = quizzes.map((q) => q._id);

      const counts = await QuestionModel.aggregate([
                                                     { $match: { quiz: { $in: quizIds } } },
                                                     { $group: { _id: "$quiz", count: { $sum: 1 } } },
                                                   ]);

      const countMap = new Map(counts.map((c) => [c._id, c.count]));
      const withCounts = quizzes.map((q) => ({
        ...q.toObject(),
        questionCount: countMap.get(q._id) || 0,
      }));

      res.json(withCounts);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/courses/:courseId/quizzes", ensureInit, async (req, res) => {
    try {
      const { courseId } = req.params;
      const quiz = {
        ...req.body,
        _id: uuidv4(),
        course: courseId,
        published: false,
        createdAt: new Date(),
      };
      const created = await QuizModel.create(quiz);
      res.json(created.toObject());
    } catch (err) {
      console.error("Error creating quiz:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/quizzes/:qid", ensureInit, async (req, res) => {
    try {
      const { qid } = req.params;
      const currentUser = req.session?.currentUser;

      const quiz = await QuizModel.findById(qid);
      if (!quiz) return res.status(404).json({ error: "Quiz not found" });

      const questions = await QuestionModel.find({ quiz: qid });
      let questionsObj = questions.map(q => q.toObject());

      if (!currentUser || currentUser.role !== "FACULTY") {
        questionsObj = questionsObj.map((q) => {
          const copy = { ...q };
          if (copy.choices) {
            copy.choices = copy.choices.map(({ _id, text }) => ({ _id, text }));
          }
          delete copy.correctAnswer;
          delete copy.correctAnswers;
          return copy;
        });
      }

      res.json({ quiz: quiz.toObject(), questions: questionsObj });
    } catch (err) {
      console.error("Error fetching quiz:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/quizzes/:qid", ensureInit, async (req, res) => {
    try {
      const { _id, course, ...updates } = req.body;
      await QuizModel.updateOne({ _id: req.params.qid }, { $set: updates });
      const updated = await QuizModel.findById(req.params.qid);
      res.json(updated ? updated.toObject() : null);
    } catch (err) {
      console.error("Error updating quiz:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/quizzes/:qid", ensureInit, async (req, res) => {
    try {
      await QuestionModel.deleteMany({ quiz: req.params.qid });
      await AttemptModel.deleteMany({ quiz: req.params.qid });
      await QuizModel.deleteOne({ _id: req.params.qid });
      res.json({ status: "deleted" });
    } catch (err) {
      console.error("Error deleting quiz:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/quizzes/:qid/publish", ensureInit, async (req, res) => {
    try {
      await QuizModel.updateOne(
          { _id: req.params.qid },
          { $set: { published: req.body.published } }
      );
      const updated = await QuizModel.findById(req.params.qid);
      res.json(updated ? updated.toObject() : null);
    } catch (err) {
      console.error("Error publishing quiz:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/quizzes/:qid/questions", ensureInit, async (req, res) => {
    try {
      const question = {
        ...req.body,
        _id: uuidv4(),
        quiz: req.params.qid,
      };

      if (question.type === "MULTIPLE_CHOICE" && question.choices) {
        question.choices = question.choices.map((c) => ({
          ...c,
          _id: c._id || uuidv4(),
        }));
      }

      const created = await QuestionModel.create(question);

      const quiz = await QuizModel.findById(req.params.qid);
      if (quiz) {
        const newPoints = (quiz.points || 0) + (question.points || 0);
        await QuizModel.updateOne(
            { _id: req.params.qid },
            { $set: { points: newPoints } }
        );
      }

      res.json(created.toObject());
    } catch (err) {
      console.error("Error adding question:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/quizzes/:qid/questions/:questionId", ensureInit, async (req, res) => {
    try {
      const { questionId, qid } = req.params;
      const { _id, quiz, ...updates } = req.body;

      const question = await QuestionModel.findById(questionId);
      if (!question) return res.status(404).json({ error: "Question not found" });

      if (updates.type === "MULTIPLE_CHOICE" && updates.choices) {
        updates.choices = updates.choices.map((c) => ({
          ...c,
          _id: c._id || uuidv4(),
        }));
      }

      if (updates.points !== undefined && updates.points !== question.points) {
        const diff = updates.points - question.points;
        await QuizModel.updateOne({ _id: qid }, { $inc: { points: diff } });
      }

      await QuestionModel.updateOne({ _id: questionId }, { $set: updates });
      const updated = await QuestionModel.findById(questionId);
      res.json(updated ? updated.toObject() : null);
    } catch (err) {
      console.error("Error updating question:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/quizzes/:qid/questions/:questionId", ensureInit, async (req, res) => {
    try {
      const { questionId, qid } = req.params;

      const question = await QuestionModel.findById(questionId);
      if (question) {
        await QuizModel.updateOne(
            { _id: qid },
            { $inc: { points: -(question.points || 0) } }
        );
      }

      await QuestionModel.deleteOne({ _id: questionId });
      res.json({ status: "deleted" });
    } catch (err) {
      console.error("Error deleting question:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/quizzes/:qid/attempts", ensureInit, async (req, res) => {
    try {
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: "Login required" });
      }

      const quiz = await QuizModel.findById(req.params.qid);
      if (!quiz) return res.status(404).json({ error: "Quiz not found" });

      const existing = await AttemptModel.find({
                                                 quiz: req.params.qid,
                                                 user: currentUser._id,
                                               }).sort({ attemptNumber: -1 });

      const lastAttemptNumber = existing[0]?.attemptNumber || 0;

      if (!quiz.multipleAttempts && lastAttemptNumber >= 1) {
        return res.status(400).json({ error: "No more attempts allowed" });
      }

      if (quiz.multipleAttempts && lastAttemptNumber >= (quiz.allowedAttempts || 1)) {
        return res.status(400).json({ error: "No more attempts allowed" });
      }

      // Calculate score
      const answers = req.body.answers || [];
      let score = 0;
      const questions = await QuestionModel.find({ quiz: req.params.qid });

      for (const ans of answers) {
        const questionId = ans.question || ans.questionId;
        const question = questions.find(q => q._id === questionId);
        if (!question) continue;

        let answerValue = ans.answer;
        if (answerValue === undefined) {
          if ("choiceId" in ans) answerValue = ans.choiceId;
          else if ("boolean" in ans) answerValue = ans.boolean ? "true" : "false";
          else if ("text" in ans) answerValue = ans.text;
        }

        if (question.type === "MULTIPLE_CHOICE") {
          const correct = (question.choices || []).find((c) => c.correct);
          if (correct && answerValue === correct._id) {
            score += question.points || 0;
          }
        } else if (question.type === "TRUE_FALSE") {
          const boolAns = answerValue === true || answerValue === "true";
          if (question.correctAnswer === boolAns) {
            score += question.points || 0;
          }
        } else if (question.type === "FILL_BLANK") {
          const studentAns = (answerValue || "").toString().trim().toLowerCase();
          const isCorrect = (question.correctAnswers || []).some(
              (corr) => corr.trim().toLowerCase() === studentAns
          );
          if (isCorrect) {
            score += question.points || 0;
          }
        }
      }

      const attempt = await AttemptModel.create({
                                                  _id: uuidv4(),
                                                  quiz: req.params.qid,
                                                  user: currentUser._id,
                                                  answers: answers.map(a => ({
                                                    question: a.question || a.questionId,
                                                    answer: a.answer !== undefined ? a.answer :
                                                            (a.choiceId || (a.boolean !== undefined ? String(a.boolean) : (a.text || "")))
                                                  })),
                                                  score,
                                                  attemptNumber: lastAttemptNumber + 1,
                                                  createdAt: new Date(),
                                                });

      const questionMap = new Map(questions.map((q) => [q._id, q.toObject()]));
      res.json({
                 ...attempt.toObject(),
                 answers: attempt.answers.map((ans) => ({
                   question: questionMap.get(ans.question) || {},
                   answer: ans.answer,
                 })),
               });
    } catch (err) {
      console.error("Error in submit attempt:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/quizzes/:qid/attempts/last", ensureInit, async (req, res) => {
    try {
      const currentUser = req.session?.currentUser;
      if (!currentUser) return res.status(401).json({ error: "Login required" });

      const attempt = await AttemptModel.findOne({
                                                   quiz: req.params.qid,
                                                   user: currentUser._id,
                                                 }).sort({ attemptNumber: -1 });

      if (!attempt) return res.json(null);

      const questions = await QuestionModel.find({ quiz: req.params.qid });
      const questionMap = new Map(questions.map((q) => [q._id, q.toObject()]));

      res.json({
                 ...attempt.toObject(),
                 answers: attempt.answers.map((ans) => ({
                   question: questionMap.get(ans.question) || {},
                   answer: ans.answer,
                 })),
               });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}