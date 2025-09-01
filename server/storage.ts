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
  getSubjectsByClass(classLevel: string): Promise<Subject[]>;
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
    this.seedSubjectsByClass();
    this.seedLessons();
    this.seedQuizzes();
  }

  private seedSubjectsByClass() {
    // Class 1-2 Subjects
    const earlyClassSubjects = [
      {
        id: "math-class-1-2",
        name: "Mathematics",
        icon: "fas fa-calculator",
        color: "blue-600",
        description: "Numbers, counting, and basic addition/subtraction",
        classLevel: "class-1,class-2",
        totalLessons: 8,
      },
      {
        id: "english-class-1-2",
        name: "English",
        icon: "fas fa-book",
        color: "purple-600",
        description: "Alphabet, basic words, and simple sentences",
        classLevel: "class-1,class-2",
        totalLessons: 10,
      },
      {
        id: "evs-class-1-2",
        name: "Environmental Studies",
        icon: "fas fa-leaf",
        color: "green-600",
        description: "Family, animals, plants, and our surroundings",
        classLevel: "class-1,class-2",
        totalLessons: 6,
      }
    ];

    // Class 3-5 Subjects
    const middleClassSubjects = [
      {
        id: "math-class-3-5",
        name: "Mathematics",
        icon: "fas fa-calculator",
        color: "blue-600",
        description: "Multiplication, division, fractions, and geometry",
        classLevel: "class-3,class-4,class-5",
        totalLessons: 12,
      },
      {
        id: "english-class-3-5",
        name: "English",
        icon: "fas fa-book",
        color: "purple-600",
        description: "Grammar, comprehension, and creative writing",
        classLevel: "class-3,class-4,class-5",
        totalLessons: 15,
      },
      {
        id: "science-class-3-5",
        name: "Science",
        icon: "fas fa-flask",
        color: "green-600",
        description: "Basic physics, chemistry, and biology concepts",
        classLevel: "class-3,class-4,class-5",
        totalLessons: 10,
      },
      {
        id: "social-class-3-5",
        name: "Social Studies",
        icon: "fas fa-globe-asia",
        color: "orange-600",
        description: "History, geography, and civics",
        classLevel: "class-3,class-4,class-5",
        totalLessons: 8,
      }
    ];

    // Class 6-8 Subjects
    const upperMiddleSubjects = [
      {
        id: "math-class-6-8",
        name: "Mathematics",
        icon: "fas fa-calculator",
        color: "blue-600",
        description: "Algebra, geometry, and advanced arithmetic",
        classLevel: "class-6,class-7,class-8",
        totalLessons: 16,
      },
      {
        id: "english-class-6-8",
        name: "English",
        icon: "fas fa-book",
        color: "purple-600",
        description: "Literature, advanced grammar, and essay writing",
        classLevel: "class-6,class-7,class-8",
        totalLessons: 18,
      },
      {
        id: "science-class-6-8",
        name: "Science",
        icon: "fas fa-flask",
        color: "green-600",
        description: "Physics, chemistry, and biology fundamentals",
        classLevel: "class-6,class-7,class-8",
        totalLessons: 20,
      },
      {
        id: "social-class-6-8",
        name: "Social Studies",
        icon: "fas fa-globe-asia",
        color: "orange-600",
        description: "Indian history, world geography, and political science",
        classLevel: "class-6,class-7,class-8",
        totalLessons: 14,
      },
      {
        id: "hindi-class-6-8",
        name: "Hindi",
        icon: "fas fa-language",
        color: "red-600",
        description: "Hindi literature, grammar, and composition",
        classLevel: "class-6,class-7,class-8",
        totalLessons: 12,
      }
    ];

    // Class 9-10 Subjects
    const highSchoolSubjects = [
      {
        id: "math-class-9-10",
        name: "Mathematics",
        icon: "fas fa-calculator",
        color: "blue-600",
        description: "Advanced algebra, geometry, and trigonometry",
        classLevel: "class-9,class-10",
        totalLessons: 20,
      },
      {
        id: "english-class-9-10",
        name: "English",
        icon: "fas fa-book",
        color: "purple-600",
        description: "Advanced literature and language skills",
        classLevel: "class-9,class-10",
        totalLessons: 18,
      },
      {
        id: "physics-class-9-10",
        name: "Physics",
        icon: "fas fa-atom",
        color: "blue-500",
        description: "Mechanics, light, sound, and electricity",
        classLevel: "class-9,class-10",
        totalLessons: 16,
      },
      {
        id: "chemistry-class-9-10",
        name: "Chemistry",
        icon: "fas fa-vial",
        color: "green-500",
        description: "Atoms, molecules, acids, bases, and reactions",
        classLevel: "class-9,class-10",
        totalLessons: 16,
      },
      {
        id: "biology-class-9-10",
        name: "Biology",
        icon: "fas fa-dna",
        color: "green-700",
        description: "Life processes, heredity, and natural resources",
        classLevel: "class-9,class-10",
        totalLessons: 14,
      },
      {
        id: "social-class-9-10",
        name: "Social Science",
        icon: "fas fa-globe-asia",
        color: "orange-600",
        description: "History, geography, political science, and economics",
        classLevel: "class-9,class-10",
        totalLessons: 18,
      },
      {
        id: "hindi-class-9-10",
        name: "Hindi",
        icon: "fas fa-language",
        color: "red-600",
        description: "Advanced Hindi literature and grammar",
        classLevel: "class-9,class-10",
        totalLessons: 14,
      }
    ];

    // Store all subjects
    [...earlyClassSubjects, ...middleClassSubjects, ...upperMiddleSubjects, ...highSchoolSubjects].forEach(subject => {
      this.subjects.set(subject.id, subject);
    });
  }

  private seedLessons() {
    // Sample lessons for different subjects and classes
    const lessons: Lesson[] = [
      // Class 1-2 Math Lessons
      {
        id: "lesson-math-class-1-2-1",
        subjectId: "math-class-1-2",
        title: "Counting Numbers 1-10",
        description: "Learn to count from 1 to 10",
        content: {
          type: "interactive",
          sections: [
            {
              type: "explanation",
              title: "What is Counting?",
              content: "Counting helps us know how many things we have."
            }
          ]
        },
        order: 1,
        points: 5,
      },
      // Class 3-5 Math Lessons
      {
        id: "lesson-math-class-3-5-1",
        subjectId: "math-class-3-5",
        title: "Introduction to Multiplication",
        description: "Learn the basics of multiplication",
        content: {
          type: "interactive",
          sections: [
            {
              type: "explanation",
              title: "What is Multiplication?",
              content: "Multiplication is repeated addition. 3 × 4 means adding 3 four times."
            }
          ]
        },
        order: 1,
        points: 10,
      },
      // Class 6-8 Science Lessons
      {
        id: "lesson-science-class-6-8-1",
        subjectId: "science-class-6-8",
        title: "Introduction to Light",
        description: "Understanding light and its properties",
        content: {
          type: "interactive",
          sections: [
            {
              type: "explanation",
              title: "What is Light?",
              content: "Light is a form of energy that helps us see things around us."
            }
          ]
        },
        order: 1,
        points: 15,
      }
    ];

    lessons.forEach(lesson => this.lessons.set(lesson.id, lesson));

  }

  private seedQuizzes() {
    // Sample quizzes
    const quizzes: Quiz[] = [
      {
        id: "quiz-math-class-3-5-1",
        subjectId: "math-class-3-5",
        lessonId: "lesson-math-class-3-5-1",
        title: "Multiplication Quiz",
        questions: [
          {
            id: 1,
            question: "What is 3 × 4?",
            options: ["10", "12", "14", "16"],
            correctAnswer: 1,
            points: 10
          },
          {
            id: 2,
            question: "What is 5 × 6?",
            options: ["25", "30", "35", "40"],
            correctAnswer: 1,
            points: 10
          }
        ],
        timeLimit: 300,
        points: 50,
      }
    ];

    quizzes.forEach(quiz => this.quizzes.set(quiz.id, quiz));
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

  async getSubjectsByClass(classLevel: string): Promise<Subject[]> {
    return Array.from(this.subjects.values()).filter(subject => 
      subject.classLevel.includes(classLevel)
    );
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
