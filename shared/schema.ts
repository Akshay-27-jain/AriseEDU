import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mobileNumber: text("mobile_number").notNull().unique(),
  name: text("name").notNull(),
  class: text("class").notNull(),
  language: text("language").notNull().default("english"),
  points: integer("points").notNull().default(0),
  level: integer("level").notNull().default(1),
  achievements: jsonb("achievements").notNull().default([]),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const subjects = pgTable("subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  description: text("description").notNull(),
  classLevel: text("class_level").notNull(),
  totalLessons: integer("total_lessons").notNull().default(0),
});

export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subjectId: varchar("subject_id").notNull().references(() => subjects.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: jsonb("content").notNull(),
  order: integer("order").notNull(),
  points: integer("points").notNull().default(10),
});

export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subjectId: varchar("subject_id").notNull().references(() => subjects.id),
  lessonId: varchar("lesson_id").references(() => lessons.id),
  title: text("title").notNull(),
  questions: jsonb("questions").notNull(),
  timeLimit: integer("time_limit").notNull().default(300), // in seconds
  points: integer("points").notNull().default(50),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  subjectId: varchar("subject_id").notNull().references(() => subjects.id),
  lessonId: varchar("lesson_id").references(() => lessons.id),
  completed: boolean("completed").notNull().default(false),
  score: integer("score"),
  completedAt: timestamp("completed_at"),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  quizId: varchar("quiz_id").notNull().references(() => quizzes.id),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  timeSpent: integer("time_spent").notNull(), // in seconds
  answers: jsonb("answers").notNull(),
  completedAt: timestamp("completed_at").notNull().default(sql`now()`),
});

export const otpVerification = pgTable("otp_verification", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mobileNumber: text("mobile_number").notNull(),
  otp: text("otp").notNull(),
  verified: boolean("verified").notNull().default(false),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  mobileNumber: true,
  name: true,
  class: true,
  language: true,
});

export const insertOtpSchema = createInsertSchema(otpVerification).pick({
  mobileNumber: true,
});

export const verifyOtpSchema = z.object({
  mobileNumber: z.string(),
  otp: z.string().length(4),
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).pick({
  quizId: true,
  score: true,
  totalQuestions: true,
  timeSpent: true,
  answers: true,
});

export const insertProgressSchema = createInsertSchema(userProgress).pick({
  subjectId: true,
  lessonId: true,
  completed: true,
  score: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Subject = typeof subjects.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type OtpVerification = typeof otpVerification.$inferSelect;
export type InsertOtp = z.infer<typeof insertOtpSchema>;
export type VerifyOtp = z.infer<typeof verifyOtpSchema>;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
