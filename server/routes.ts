import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertOtpSchema, verifyOtpSchema, insertQuizAttemptSchema, insertProgressSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { mobileNumber } = insertOtpSchema.parse(req.body);
      
      const otpRecord = await storage.createOtp({ mobileNumber });
      
      // In a real app, you would send SMS here
      console.log(`OTP for ${mobileNumber}: ${otpRecord.otp}`);
      
      res.json({ 
        success: true, 
        message: "OTP sent successfully",
        // For demo purposes, return OTP (remove in production)
        otp: otpRecord.otp 
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { mobileNumber, otp } = verifyOtpSchema.parse(req.body);
      
      const isValid = await storage.verifyOtp(mobileNumber, otp);
      
      if (!isValid) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }

      // Check if user exists
      const existingUser = await storage.getUserByMobileNumber(mobileNumber);
      
      res.json({ 
        success: true, 
        userExists: !!existingUser,
        user: existingUser 
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.post("/api/auth/complete-profile", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      const user = await storage.createUser(userData);
      
      res.json({ success: true, user });
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  // User routes
  app.get("/api/user/:id", async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  });

  app.put("/api/user/:id", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.params.id, updates);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  // Subject routes
  app.get("/api/subjects", async (req, res) => {
    const subjects = await storage.getSubjects();
    res.json(subjects);
  });

  app.get("/api/subjects/:id", async (req, res) => {
    const subject = await storage.getSubject(req.params.id);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    res.json(subject);
  });

  // Lesson routes
  app.get("/api/subjects/:subjectId/lessons", async (req, res) => {
    const lessons = await storage.getLessonsBySubject(req.params.subjectId);
    res.json(lessons);
  });

  app.get("/api/lessons/:id", async (req, res) => {
    const lesson = await storage.getLesson(req.params.id);
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    res.json(lesson);
  });

  // Quiz routes
  app.get("/api/subjects/:subjectId/quizzes", async (req, res) => {
    const quizzes = await storage.getQuizzesBySubject(req.params.subjectId);
    res.json(quizzes);
  });

  app.get("/api/quizzes/:id", async (req, res) => {
    const quiz = await storage.getQuiz(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.json(quiz);
  });

  // Progress routes
  app.get("/api/user/:userId/progress", async (req, res) => {
    const progress = await storage.getUserProgress(req.params.userId);
    res.json(progress);
  });

  app.get("/api/user/:userId/progress/:subjectId", async (req, res) => {
    const progress = await storage.getUserProgressBySubject(req.params.userId, req.params.subjectId);
    res.json(progress);
  });

  app.post("/api/user/:userId/progress", async (req, res) => {
    try {
      const progressData = insertProgressSchema.parse(req.body);
      const progress = await storage.createProgress(req.params.userId, progressData);
      
      res.json(progress);
    } catch (error) {
      res.status(400).json({ error: "Invalid progress data" });
    }
  });

  // Quiz attempt routes
  app.post("/api/user/:userId/quiz-attempts", async (req, res) => {
    try {
      const attemptData = insertQuizAttemptSchema.parse(req.body);
      const attempt = await storage.createQuizAttempt(req.params.userId, attemptData);
      
      // Award points to user
      const user = await storage.getUser(req.params.userId);
      if (user) {
        const newPoints = user.points + attempt.score;
        const newLevel = Math.floor(newPoints / 100) + 1;
        await storage.updateUser(req.params.userId, { 
          points: newPoints, 
          level: newLevel 
        });
      }
      
      res.json(attempt);
    } catch (error) {
      res.status(400).json({ error: "Invalid attempt data" });
    }
  });

  app.get("/api/user/:userId/quiz-attempts", async (req, res) => {
    const attempts = await storage.getUserQuizAttempts(req.params.userId);
    res.json(attempts);
  });

  // Dashboard data
  app.get("/api/user/:userId/dashboard", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const subjects = await storage.getSubjects();
      const userProgress = await storage.getUserProgress(req.params.userId);
      const quizAttempts = await storage.getUserQuizAttempts(req.params.userId);

      // Calculate progress for each subject
      const subjectsWithProgress = await Promise.all(
        subjects.map(async (subject) => {
          const subjectLessons = await storage.getLessonsBySubject(subject.id);
          const subjectProgress = userProgress.filter(p => p.subjectId === subject.id && p.completed);
          const progressPercentage = subjectLessons.length > 0 
            ? Math.round((subjectProgress.length / subjectLessons.length) * 100) 
            : 0;

          return {
            ...subject,
            progressPercentage,
            completedLessons: subjectProgress.length,
            totalLessons: subjectLessons.length,
          };
        })
      );

      // Calculate achievements
      const achievements = [];
      if (quizAttempts.length > 0) {
        achievements.push({ id: "first-quiz", name: "First Quiz", icon: "fas fa-star", color: "secondary" });
      }
      if (userProgress.filter(p => p.completed).length >= 5) {
        achievements.push({ id: "quick-learner", name: "Quick Learner", icon: "fas fa-medal", color: "primary" });
      }

      res.json({
        user,
        subjects: subjectsWithProgress,
        achievements,
        totalLessonsCompleted: userProgress.filter(p => p.completed).length,
        totalQuizzesTaken: quizAttempts.length,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to load dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
