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
  // Village Quest Mode
  villageLevel: integer("village_level").notNull().default(1),
  villageProgress: jsonb("village_progress").notNull().default({}),
  unlockedBuildings: jsonb("unlocked_buildings").notNull().default([]),
  // Skill Tree System
  skills: jsonb("skills").notNull().default({}),
  skillPoints: integer("skill_points").notNull().default(0),
  // Daily Farming
  farmLevel: integer("farm_level").notNull().default(1),
  farmProgress: jsonb("farm_progress").notNull().default({}),
  dailyStreak: integer("daily_streak").notNull().default(0),
  lastActiveDate: timestamp("last_active_date").notNull().default(sql`now()`),
  // Avatar & Customization
  avatar: jsonb("avatar").notNull().default({}),
  unlockedAvatars: jsonb("unlocked_avatars").notNull().default([]),
  backgrounds: jsonb("backgrounds").notNull().default([]),
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

// Village Quest Mode Tables
export const villageBuildings = pgTable("village_buildings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'house', 'shop', 'lab', 'library'
  subjectId: varchar("subject_id").references(() => subjects.id),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  unlockLevel: integer("unlock_level").notNull().default(1),
  unlockRequirements: jsonb("unlock_requirements").notNull().default({}),
  position: jsonb("position").notNull().default({}),
  isUnlocked: boolean("is_unlocked").notNull().default(false),
});

export const villageQuests = pgTable("village_quests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buildingId: varchar("building_id").notNull().references(() => villageBuildings.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'lesson', 'quiz', 'mini_game'
  requirements: jsonb("requirements").notNull().default({}),
  rewards: jsonb("rewards").notNull().default({}),
  order: integer("order").notNull(),
  isCompleted: boolean("is_completed").notNull().default(false),
});

// Skill Tree System
export const skillTrees = pgTable("skill_trees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  category: text("category").notNull(), // 'math', 'science', 'language', 'general'
  prerequisites: jsonb("prerequisites").notNull().default([]),
  cost: integer("cost").notNull().default(1),
  benefits: jsonb("benefits").notNull().default({}),
  maxLevel: integer("max_level").notNull().default(5),
});

export const userSkills = pgTable("user_skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  skillId: varchar("skill_id").notNull().references(() => skillTrees.id),
  level: integer("level").notNull().default(0),
  unlockedAt: timestamp("unlocked_at").notNull().default(sql`now()`),
});

// Daily Farming System
export const farmCrops = pgTable("farm_crops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  subjectId: varchar("subject_id").notNull().references(() => subjects.id),
  cropType: text("crop_type").notNull(),
  plantedAt: timestamp("planted_at").notNull().default(sql`now()`),
  growthStage: integer("growth_stage").notNull().default(0),
  health: integer("health").notNull().default(100),
  isWithered: boolean("is_withered").notNull().default(false),
  harvestValue: integer("harvest_value").notNull().default(0),
});

// Community Challenges
export const communityChallenges = pgTable("community_challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'weekly', 'monthly', 'special'
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  target: integer("target").notNull(),
  currentProgress: integer("current_progress").notNull().default(0),
  rewards: jsonb("rewards").notNull().default({}),
  isActive: boolean("is_active").notNull().default(true),
});

export const userChallengeProgress = pgTable("user_challenge_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  challengeId: varchar("challenge_id").notNull().references(() => communityChallenges.id),
  progress: integer("progress").notNull().default(0),
  lastContribution: timestamp("last_contribution").notNull().default(sql`now()`),
});

// Mini Games
export const miniGames = pgTable("mini_games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'math_runner', 'word_builder', 'science_puzzle', 'history_hunt'
  subjectId: varchar("subject_id").references(() => subjects.id),
  description: text("description").notNull(),
  gameData: jsonb("game_data").notNull().default({}),
  difficulty: text("difficulty").notNull().default("easy"),
  points: integer("points").notNull().default(10),
  timeLimit: integer("time_limit").notNull().default(60),
});

export const miniGameScores = pgTable("mini_game_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  gameId: varchar("game_id").notNull().references(() => miniGames.id),
  score: integer("score").notNull(),
  timeSpent: integer("time_spent").notNull(),
  completedAt: timestamp("completed_at").notNull().default(sql`now()`),
});

// Festival/Cultural Games
export const festivalEvents = pgTable("festival_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'diwali', 'pongal', 'independence_day'
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  description: text("description").notNull(),
  gameData: jsonb("game_data").notNull().default({}),
  rewards: jsonb("rewards").notNull().default({}),
  isActive: boolean("is_active").notNull().default(false),
});

// AR Models
export const arModels = pgTable("ar_models", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  subjectId: varchar("subject_id").references(() => subjects.id),
  modelUrl: text("model_url").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  description: text("description").notNull(),
  unlockRequirements: jsonb("unlock_requirements").notNull().default({}),
  category: text("category").notNull(), // 'science', 'biology', 'astronomy'
});

export const userArModels = pgTable("user_ar_models", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  modelId: varchar("model_id").notNull().references(() => arModels.id),
  unlockedAt: timestamp("unlocked_at").notNull().default(sql`now()`),
});

// Real World Rewards
export const rewards = pgTable("rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'certificate', 'badge', 'physical'
  description: text("description").notNull(),
  pointsCost: integer("points_cost").notNull(),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").notNull().default(true),
});

export const userRewards = pgTable("user_rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  rewardId: varchar("reward_id").notNull().references(() => rewards.id),
  redeemedAt: timestamp("redeemed_at").notNull().default(sql`now()`),
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'shipped'
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

// Game Feature Types
export type VillageBuilding = typeof villageBuildings.$inferSelect;
export type VillageQuest = typeof villageQuests.$inferSelect;
export type SkillTree = typeof skillTrees.$inferSelect;
export type UserSkill = typeof userSkills.$inferSelect;
export type FarmCrop = typeof farmCrops.$inferSelect;
export type CommunityChallenge = typeof communityChallenges.$inferSelect;
export type UserChallengeProgress = typeof userChallengeProgress.$inferSelect;
export type MiniGame = typeof miniGames.$inferSelect;
export type MiniGameScore = typeof miniGameScores.$inferSelect;
export type FestivalEvent = typeof festivalEvents.$inferSelect;
export type ArModel = typeof arModels.$inferSelect;
export type UserArModel = typeof userArModels.$inferSelect;
export type Reward = typeof rewards.$inferSelect;
export type UserReward = typeof userRewards.$inferSelect;
