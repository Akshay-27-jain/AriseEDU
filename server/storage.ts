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
  getQuizzesBySubject(subjectId: string): Promise<Quiz[]>;
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
              content: "Counting helps us know how many things we have. Let's count together: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10!"
            },
            {
              type: "interactive",
              title: "Count the Objects",
              content: "How many apples do you see? 🍎🍎🍎",
              problem: "Count: 🍎🍎🍎",
              answer: "3"
            }
          ]
        },
        order: 1,
        points: 5,
      },
      {
        id: "lesson-math-class-1-2-2",
        subjectId: "math-class-1-2",
        title: "Simple Addition",
        description: "Learn to add small numbers",
        content: {
          type: "interactive",
          sections: [
            {
              type: "explanation",
              title: "Adding Numbers",
              content: "When we add, we put numbers together. 2 + 1 = 3. Let's practice!"
            },
            {
              type: "interactive",
              title: "Try Adding",
              problem: "1 + 2 = ?",
              answer: "3"
            }
          ]
        },
        order: 2,
        points: 5,
      },

      // Class 1-2 English Lessons
      {
        id: "lesson-english-class-1-2-1",
        subjectId: "english-class-1-2",
        title: "Learning the Alphabet",
        description: "Learn letters A to Z",
        content: {
          type: "interactive",
          sections: [
            {
              type: "explanation",
              title: "The Alphabet",
              content: "The alphabet has 26 letters. A, B, C, D, E... Let's learn them all!"
            },
            {
              type: "interactive",
              title: "What comes after B?",
              problem: "A, B, ?",
              answer: "C"
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
              content: "Multiplication is repeated addition. 3 × 4 means adding 3 four times: 3 + 3 + 3 + 3 = 12"
            },
            {
              type: "interactive",
              title: "Solve This",
              problem: "2 × 3 = ?",
              answer: "6"
            }
          ]
        },
        order: 1,
        points: 10,
      },
      {
        id: "lesson-math-class-3-5-2",
        subjectId: "math-class-3-5",
        title: "Division Basics",
        description: "Learn to divide numbers",
        content: {
          type: "interactive",
          sections: [
            {
              type: "explanation",
              title: "What is Division?",
              content: "Division is sharing equally. If we have 8 apples and 4 friends, each friend gets 2 apples."
            },
            {
              type: "interactive",
              title: "Try Division",
              problem: "8 ÷ 2 = ?",
              answer: "4"
            }
          ]
        },
        order: 2,
        points: 10,
      },

      // Class 3-5 Science Lessons
      {
        id: "lesson-science-class-3-5-1",
        subjectId: "science-class-3-5",
        title: "Plants and Animals",
        description: "Learn about living things",
        content: {
          type: "interactive",
          sections: [
            {
              type: "explanation",
              title: "Living Things",
              content: "Plants and animals are living things. They grow, need food, and can move or respond to their environment."
            },
            {
              type: "interactive",
              title: "Which is Living?",
              problem: "Is a tree living?",
              answer: "Yes"
            }
          ]
        },
        order: 1,
        points: 10,
      },

      // Class 6-8 Math Lessons
      {
        id: "lesson-math-class-6-8-1",
        subjectId: "math-class-6-8",
        title: "Introduction to Algebra",
        description: "Learn about variables and equations",
        content: {
          type: "interactive",
          sections: [
            {
              type: "explanation",
              title: "What is Algebra?",
              content: "Algebra uses letters (like x, y) to represent unknown numbers. If x + 3 = 7, then x = 4."
            },
            {
              type: "interactive",
              title: "Solve for x",
              problem: "x + 5 = 8, x = ?",
              answer: "3"
            }
          ]
        },
        order: 1,
        points: 15,
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
              content: "Light is a form of energy that helps us see. It travels in straight lines and can be reflected by mirrors."
            },
            {
              type: "interactive",
              title: "Light Properties",
              problem: "Light travels in which lines?",
              answer: "Straight"
            }
          ]
        },
        order: 1,
        points: 15,
      },

      // Class 9-10 Physics Lessons
      {
        id: "lesson-physics-class-9-10-1",
        subjectId: "physics-class-9-10",
        title: "Motion and Speed",
        description: "Understanding motion, velocity and acceleration",
        content: {
          type: "interactive",
          sections: [
            {
              type: "explanation",
              title: "Motion",
              content: "Motion is the change in position of an object with time. Speed = Distance/Time. Velocity includes direction."
            },
            {
              type: "interactive",
              title: "Calculate Speed",
              problem: "If a car travels 100 km in 2 hours, what is its speed?",
              answer: "50 km/h"
            }
          ]
        },
        order: 1,
        points: 20,
      },

      // Class 9-10 Chemistry Lessons
      {
        id: "lesson-chemistry-class-9-10-1",
        subjectId: "chemistry-class-9-10",
        title: "Atoms and Molecules",
        description: "Learn about the building blocks of matter",
        content: {
          type: "interactive",
          sections: [
            {
              type: "explanation",
              title: "Atoms",
              content: "Atoms are the smallest particles of matter. They combine to form molecules. Water (H2O) has 2 hydrogen and 1 oxygen atom."
            },
            {
              type: "interactive",
              title: "Water Molecule",
              problem: "How many hydrogen atoms are in H2O?",
              answer: "2"
            }
          ]
        },
        order: 1,
        points: 20,
      }
    ];

    lessons.forEach(lesson => this.lessons.set(lesson.id, lesson));

  }

  private seedQuizzes() {
    const quizzes: Quiz[] = [
      // Class 1-2 Math Quiz
      {
        id: "quiz-math-class-1-2-1",
        subjectId: "math-class-1-2",
        lessonId: "lesson-math-class-1-2-1",
        title: "Counting Quiz",
        questions: [
          {
            id: 1,
            question: "How many fingers do you have on one hand?",
            options: ["3", "4", "5", "6"],
            correctAnswer: 2,
            points: 5
          },
          {
            id: 2,
            question: "Count the stars: ⭐⭐⭐⭐",
            options: ["3", "4", "5", "2"],
            correctAnswer: 1,
            points: 5
          },
          {
            id: 3,
            question: "What comes after 7?",
            options: ["6", "8", "9", "10"],
            correctAnswer: 1,
            points: 5
          }
        ],
        timeLimit: 180,
        points: 15,
      },
      {
        id: "quiz-math-class-1-2-2",
        subjectId: "math-class-1-2",
        lessonId: "lesson-math-class-1-2-2",
        title: "Addition Quiz",
        questions: [
          {
            id: 1,
            question: "What is 2 + 3?",
            options: ["4", "5", "6", "7"],
            correctAnswer: 1,
            points: 5
          },
          {
            id: 2,
            question: "What is 1 + 4?",
            options: ["4", "5", "6", "3"],
            correctAnswer: 1,
            points: 5
          }
        ],
        timeLimit: 180,
        points: 10,
      },

      // Class 3-5 Math Quizzes
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
          },
          {
            id: 3,
            question: "What is 7 × 8?",
            options: ["54", "56", "58", "60"],
            correctAnswer: 1,
            points: 10
          }
        ],
        timeLimit: 300,
        points: 30,
      },
      {
        id: "quiz-math-class-3-5-2",
        subjectId: "math-class-3-5",
        lessonId: "lesson-math-class-3-5-2",
        title: "Division Quiz",
        questions: [
          {
            id: 1,
            question: "What is 12 ÷ 3?",
            options: ["3", "4", "5", "6"],
            correctAnswer: 1,
            points: 10
          },
          {
            id: 2,
            question: "What is 20 ÷ 4?",
            options: ["4", "5", "6", "7"],
            correctAnswer: 1,
            points: 10
          }
        ],
        timeLimit: 240,
        points: 20,
      },

      // Class 3-5 Science Quiz
      {
        id: "quiz-science-class-3-5-1",
        subjectId: "science-class-3-5",
        lessonId: "lesson-science-class-3-5-1",
        title: "Living Things Quiz",
        questions: [
          {
            id: 1,
            question: "Which of these is a living thing?",
            options: ["Rock", "Tree", "Chair", "Book"],
            correctAnswer: 1,
            points: 10
          },
          {
            id: 2,
            question: "What do plants need to grow?",
            options: ["Only water", "Only sunlight", "Water and sunlight", "Nothing"],
            correctAnswer: 2,
            points: 10
          }
        ],
        timeLimit: 240,
        points: 20,
      },

      // Class 6-8 Math Quiz
      {
        id: "quiz-math-class-6-8-1",
        subjectId: "math-class-6-8",
        lessonId: "lesson-math-class-6-8-1",
        title: "Algebra Basics Quiz",
        questions: [
          {
            id: 1,
            question: "If x + 3 = 10, what is x?",
            options: ["6", "7", "8", "9"],
            correctAnswer: 1,
            points: 15
          },
          {
            id: 2,
            question: "If 2y = 14, what is y?",
            options: ["6", "7", "8", "12"],
            correctAnswer: 1,
            points: 15
          },
          {
            id: 3,
            question: "Simplify: 3x + 2x",
            options: ["5x", "6x", "x", "5x²"],
            correctAnswer: 0,
            points: 15
          }
        ],
        timeLimit: 360,
        points: 45,
      },

      // Class 6-8 Science Quiz
      {
        id: "quiz-science-class-6-8-1",
        subjectId: "science-class-6-8",
        lessonId: "lesson-science-class-6-8-1",
        title: "Light Quiz",
        questions: [
          {
            id: 1,
            question: "Light travels in which type of lines?",
            options: ["Curved", "Straight", "Zigzag", "Circular"],
            correctAnswer: 1,
            points: 15
          },
          {
            id: 2,
            question: "What happens when light hits a mirror?",
            options: ["It disappears", "It reflects", "It bends", "It stops"],
            correctAnswer: 1,
            points: 15
          }
        ],
        timeLimit: 300,
        points: 30,
      },

      // Class 9-10 Physics Quiz
      {
        id: "quiz-physics-class-9-10-1",
        subjectId: "physics-class-9-10",
        lessonId: "lesson-physics-class-9-10-1",
        title: "Motion and Speed Quiz",
        questions: [
          {
            id: 1,
            question: "A car travels 120 km in 3 hours. What is its speed?",
            options: ["30 km/h", "40 km/h", "50 km/h", "60 km/h"],
            correctAnswer: 1,
            points: 20
          },
          {
            id: 2,
            question: "What is the formula for speed?",
            options: ["Distance × Time", "Distance ÷ Time", "Time ÷ Distance", "Distance + Time"],
            correctAnswer: 1,
            points: 20
          },
          {
            id: 3,
            question: "Which quantity includes direction?",
            options: ["Speed", "Distance", "Velocity", "Time"],
            correctAnswer: 2,
            points: 20
          }
        ],
        timeLimit: 480,
        points: 60,
      },

      // Class 9-10 Chemistry Quiz
      {
        id: "quiz-chemistry-class-9-10-1",
        subjectId: "chemistry-class-9-10",
        lessonId: "lesson-chemistry-class-9-10-1",
        title: "Atoms and Molecules Quiz",
        questions: [
          {
            id: 1,
            question: "How many hydrogen atoms are in H2O?",
            options: ["1", "2", "3", "4"],
            correctAnswer: 1,
            points: 20
          },
          {
            id: 2,
            question: "What is the smallest particle of matter?",
            options: ["Molecule", "Atom", "Compound", "Element"],
            correctAnswer: 1,
            points: 20
          }
        ],
        timeLimit: 360,
        points: 40,
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

  async getQuizzesBySubject(subjectId: string): Promise<Quiz[]> {
    return Array.from(this.quizzes.values()).filter(quiz => quiz.subjectId === subjectId);
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
