import * as dao from "./dao.js";

export default function QuizRoutes(app) {
  console.log("✅ Quiz routes loaded");

  app.get("/api/courses/:courseId/quizzes", async (req, res) => {
    try {
      const { courseId } = req.params;
      const currentUser = req.session?.currentUser;
      const quizzes = await dao.findQuizzesForCourse(courseId, currentUser);
      const quizIds = quizzes.map((q) => q._id);
      const getCount = await dao.countQuestionsForQuizzes(quizIds);
      const withCounts = quizzes.map((q) => ({
        ...q,
        questionCount: getCount(q._id),
      }));
      res.json(withCounts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/courses/:courseId/quizzes", async (req, res) => {
    try {
      const { courseId } = req.params;
      const quiz = await dao.createQuiz(courseId, req.body);
      res.json(quiz);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/quizzes/:qid", async (req, res) => {
    try {
      const { qid } = req.params;
      const currentUser = req.session?.currentUser;
      const quiz = await dao.findQuizById(qid);
      if (!quiz) return res.status(404).json({ error: "Not found" });

      const questions = await dao.findQuestionsForQuiz(qid);
      let questionsObj = questions;

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

      res.json({ quiz, questions: questionsObj });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/quizzes/:qid", async (req, res) => {
    try {
      const updated = await dao.updateQuiz(req.params.qid, req.body);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/quizzes/:qid", async (req, res) => {
    try {
      await dao.deleteQuiz(req.params.qid);
      res.json({ status: "deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/quizzes/:qid/publish", async (req, res) => {
    try {
      const updated = await dao.publishQuiz(req.params.qid, req.body.published);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/quizzes/:qid/questions", async (req, res) => {
    try {
      const question = await dao.addQuestion(req.params.qid, req.body);
      res.json(question);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/quizzes/:qid/questions/:questionId", async (req, res) => {
    try {
      const updated = await dao.updateQuestion(req.params.qid, req.params.questionId, req.body);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/quizzes/:qid/questions/:questionId", async (req, res) => {
    try {
      await dao.deleteQuestion(req.params.qid, req.params.questionId);
      res.json({ status: "deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/quizzes/:qid/attempts", async (req, res) => {
    try {
      const currentUser = req.session?.currentUser;

      console.log("=== SUBMIT ATTEMPT ===");
      console.log("Session:", req.session);
      console.log("Current User:", currentUser);

      if (!currentUser) {
        console.log("No user in session - returning 401");
        return res.status(401).json({ error: "Login required" });
      }

      const attempt = await dao.recordAttempt(req.params.qid, currentUser._id, req.body.answers);
      if (!attempt) return res.status(400).json({ error: "Cannot take quiz" });

      const questions = await dao.findQuestionsForQuiz(req.params.qid);
      const questionMap = new Map(questions.map((q) => [q._id, q]));
      res.json({
                 ...attempt,
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

  app.get("/api/quizzes/:qid/attempts/last", async (req, res) => {
    try {
      const currentUser = req.session?.currentUser;
      if (!currentUser) return res.status(401).json({ error: "Login required" });

      const attempt = await dao.lastAttempt(req.params.qid, currentUser._id);
      if (!attempt) return res.json(null);

      const questions = await dao.findQuestionsForQuiz(req.params.qid);
      const questionMap = new Map(questions.map((q) => [q._id, q]));
      res.json({
                 ...attempt,
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