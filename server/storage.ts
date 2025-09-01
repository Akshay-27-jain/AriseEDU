import { 
  type User, 
  type InsertUser, 
  type Subject, 
  type Lesson, 
  type Quiz, 
  type UserProgress, 
  type QuizAttempt, 
  type OtpVerification, 
  type InsertOtp, 
  type InsertQuizAttempt, 
  type InsertProgress 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByMobileNumber(mobileNumber: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // OTP management
  createOtp(data: InsertOtp): Promise<OtpVerification>;
  getOtp(mobileNumber: string): Promise<OtpVerification | undefined>;
  verifyOtp(mobileNumber: string, otp: string): Promise<boolean>;

  // Subject management
  getSubjects(): Promise<Subject[]>;
  getSubject(id: string): Promise<Subject | undefined>;

  // Lesson management
  getLessonsBySubject(subjectId: string): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;

  // Quiz management
  getQuizzesBySubject(subjectId: string): Promise<Quiz[]>;
  getQuiz(id: string): Promise<Quiz | undefined>;

  // Progress tracking
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserProgressBySubject(userId: string, subjectId: string): Promise<UserProgress[]>;
  createProgress(userId: string, progress: InsertProgress): Promise<UserProgress>;
  updateProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined>;

  // Quiz attempts
  createQuizAttempt(userId: string, attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  getUserQuizAttempts(userId: string): Promise<QuizAttempt[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private subjects: Map<string, Subject>;
  private lessons: Map<string, Lesson>;
  private quizzes: Map<string, Quiz>;
  private userProgress: Map<string, UserProgress>;
  private quizAttempts: Map<string, QuizAttempt>;
  private otpVerifications: Map<string, OtpVerification>;

  constructor() {
    this.users = new Map();
    this.subjects = new Map();
    this.lessons = new Map();
    this.quizzes = new Map();
    this.userProgress = new Map();
    this.quizAttempts = new Map();
    this.otpVerifications = new Map();

    this.seedData();
  }

  private seedData() {
    // Seed subjects
    const mathSubject: Subject = {
      id: "math-1",
      name: "Mathematics",
      icon: "fas fa-calculator",
      color: "blue-600",
      description: "Learn numbers, calculations, and problem-solving",
      totalLessons: 12,
    };

    const scienceSubject: Subject = {
      id: "science-1",
      name: "Science",
      icon: "fas fa-flask",
      color: "green-600",
      description: "Explore the natural world and scientific concepts",
      totalLessons: 8,
    };

    const languageSubject: Subject = {
      id: "language-1",
      name: "Language Arts",
      icon: "fas fa-book",
      color: "purple-600",
      description: "Develop reading, writing, and communication skills",
      totalLessons: 15,
    };

    const socialSubject: Subject = {
      id: "social-1",
      name: "Social Studies",
      icon: "fas fa-globe-asia",
      color: "orange-600",
      description: "Learn about history, geography, and society",
      totalLessons: 10,
    };

    this.subjects.set(mathSubject.id, mathSubject);
    this.subjects.set(scienceSubject.id, scienceSubject);
    this.subjects.set(languageSubject.id, languageSubject);
    this.subjects.set(socialSubject.id, socialSubject);

    // Seed lessons for Mathematics
    const mathLessons: Lesson[] = [
      {
        id: "lesson-math-1",
        subjectId: "math-1",
        title: "Introduction to Addition",
        description: "Learn the basics of adding numbers together",
        content: {
          type: "interactive",
          sections: [
            {
              type: "explanation",
              title: "What is Addition?",
              content: "Addition is one of the basic operations in mathematics that helps us combine quantities.",
              image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
            },
            {
              type: "interactive",
              title: "Try it yourself:",
              problem: "2 + 3 = ?",
              answer: "5"
            }
          ]
        },
        order: 1,
        points: 10,
      },
      {
        id: "lesson-math-2",
        subjectId: "math-1",
        title: "Basic Subtraction",
        description: "Learn how to subtract numbers",
        content: {
          type: "interactive",
          sections: [
            {
              type: "explanation",
              title: "Understanding Subtraction",
              content: "Subtraction is the opposite of addition. It helps us find the difference between numbers."
            }
          ]
        },
        order: 2,
        points: 10,
      }
    ];

    mathLessons.forEach(lesson => this.lessons.set(lesson.id, lesson));

    // Seed quizzes
    const mathQuiz: Quiz = {
      id: "quiz-math-1",
      subjectId: "math-1",
      lessonId: "lesson-math-1",
      title: "Math Quiz - Addition",
      questions: [
        {
          id: 1,
          question: "What is 15 + 7?",
          options: ["20", "22", "25", "28"],
          correctAnswer: 1,
          points: 10
        },
        {
          id: 2,
          question: "What is 9 + 6?",
          options: ["14", "15", "16", "17"],
          correctAnswer: 1,
          points: 10
        }
      ],
      timeLimit: 300,
      points: 50,
    };

    this.quizzes.set(mathQuiz.id, mathQuiz);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByMobileNumber(mobileNumber: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.mobileNumber === mobileNumber);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      language: insertUser.language || "english",
      points: 0,
      level: 1,
      achievements: [],
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createOtp(data: InsertOtp): Promise<OtpVerification> {
    const id = randomUUID();
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    const otpVerification: OtpVerification = {
      id,
      mobileNumber: data.mobileNumber,
      otp,
      verified: false,
      expiresAt,
      createdAt: new Date(),
    };
    
    this.otpVerifications.set(data.mobileNumber, otpVerification);
    return otpVerification;
  }

  async getOtp(mobileNumber: string): Promise<OtpVerification | undefined> {
    return this.otpVerifications.get(mobileNumber);
  }

  async verifyOtp(mobileNumber: string, otp: string): Promise<boolean> {
    const otpRecord = this.otpVerifications.get(mobileNumber);
    if (!otpRecord || otpRecord.verified || otpRecord.expiresAt < new Date()) {
      return false;
    }
    
    if (otpRecord.otp === otp) {
      otpRecord.verified = true;
      this.otpVerifications.set(mobileNumber, otpRecord);
      return true;
    }
    
    return false;
  }

  async getSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }

  async getSubject(id: string): Promise<Subject | undefined> {
    return this.subjects.get(id);
  }

  async getLessonsBySubject(subjectId: string): Promise<Lesson[]> {
    return Array.from(this.lessons.values())
      .filter(lesson => lesson.subjectId === subjectId)
      .sort((a, b) => a.order - b.order);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async getQuizzesBySubject(subjectId: string): Promise<Quiz[]> {
    return Array.from(this.quizzes.values()).filter(quiz => quiz.subjectId === subjectId);
  }

  async getQuiz(id: string): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async getUserProgressBySubject(userId: string, subjectId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values())
      .filter(progress => progress.userId === userId && progress.subjectId === subjectId);
  }

  async createProgress(userId: string, progress: InsertProgress): Promise<UserProgress> {
    const id = randomUUID();
    const userProgress: UserProgress = {
      ...progress,
      id,
      userId,
      lessonId: progress.lessonId || null,
      score: progress.score || null,
      completed: progress.completed || false,
      completedAt: progress.completed ? new Date() : null,
    };
    this.userProgress.set(id, userProgress);
    return userProgress;
  }

  async updateProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const progress = this.userProgress.get(id);
    if (!progress) return undefined;
    
    const updatedProgress = { ...progress, ...updates };
    if (updates.completed && !progress.completed) {
      updatedProgress.completedAt = new Date();
    }
    this.userProgress.set(id, updatedProgress);
    return updatedProgress;
  }

  async createQuizAttempt(userId: string, attempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const id = randomUUID();
    const quizAttempt: QuizAttempt = {
      ...attempt,
      id,
      userId,
      completedAt: new Date(),
    };
    this.quizAttempts.set(id, quizAttempt);
    return quizAttempt;
  }

  async getUserQuizAttempts(userId: string): Promise<QuizAttempt[]> {
    return Array.from(this.quizAttempts.values()).filter(attempt => attempt.userId === userId);
  }
}

export const storage = new MemStorage();
