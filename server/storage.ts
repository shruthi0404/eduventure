import { 
  users, type User, type InsertUser,
  courses, type Course, type InsertCourse,
  challenges, type Challenge, type InsertChallenge,
  userProgress, type UserProgress, type InsertUserProgress,
  challengeCompletions, type ChallengeCompletion, type InsertChallengeCompletion,
  achievements, type Achievement, type InsertAchievement,
  userAchievements, type UserAchievement, type InsertUserAchievement
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  
  // Course methods
  getCourse(id: number): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  getFeaturedCourses(): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Challenge methods
  getChallenge(id: number): Promise<Challenge | undefined>;
  getChallengesByCourse(courseId: number): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  
  // Progress methods
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getUserCourseProgress(userId: number, courseId: number): Promise<UserProgress | undefined>;
  createOrUpdateProgress(progress: InsertUserProgress): Promise<UserProgress>;
  
  // Challenge completion methods
  getChallengeCompletion(userId: number, challengeId: number): Promise<ChallengeCompletion | undefined>;
  completeChallenge(completion: InsertChallengeCompletion): Promise<ChallengeCompletion>;
  
  // Achievement methods
  getAllAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: number): Promise<Achievement[]>;
  awardAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>;
  
  // Leaderboard method
  getLeaderboard(limit?: number): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private challenges: Map<number, Challenge>;
  private userProgress: Map<string, UserProgress>; // key: `${userId}-${courseId}`
  private challengeCompletions: Map<string, ChallengeCompletion>; // key: `${userId}-${challengeId}`
  private achievements: Map<number, Achievement>;
  private userAchievements: Map<string, UserAchievement>; // key: `${userId}-${achievementId}`
  
  private userId: number = 1;
  private courseId: number = 1;
  private challengeId: number = 1;
  private progressId: number = 1;
  private completionId: number = 1;
  private achievementId: number = 1;
  private userAchievementId: number = 1;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.challenges = new Map();
    this.userProgress = new Map();
    this.challengeCompletions = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    
    // Initialize with sample data
    this.initSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = {
      ...user,
      id,
      displayName: user.username,
      avatar: null,
      bio: null,
      level: 1,
      xpPoints: 0,
      createdAt: new Date()
    };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Course methods
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }
  
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }
  
  async getFeaturedCourses(): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(course => course.featured);
  }
  
  async createCourse(course: InsertCourse): Promise<Course> {
    const id = this.courseId++;
    const newCourse: Course = { ...course, id };
    this.courses.set(id, newCourse);
    return newCourse;
  }

  // Challenge methods
  async getChallenge(id: number): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }
  
  async getChallengesByCourse(courseId: number): Promise<Challenge[]> {
    return Array.from(this.challenges.values())
      .filter(challenge => challenge.courseId === courseId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }
  
  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const id = this.challengeId++;
    const newChallenge: Challenge = { ...challenge, id };
    this.challenges.set(id, newChallenge);
    return newChallenge;
  }

  // Progress methods
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values())
      .filter(progress => progress.userId === userId);
  }
  
  async getUserCourseProgress(userId: number, courseId: number): Promise<UserProgress | undefined> {
    return this.userProgress.get(`${userId}-${courseId}`);
  }
  
  async createOrUpdateProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const key = `${progress.userId}-${progress.courseId}`;
    let existingProgress = this.userProgress.get(key);
    
    if (existingProgress) {
      existingProgress = { 
        ...existingProgress, 
        ...progress, 
        lastUpdated: new Date() 
      };
      this.userProgress.set(key, existingProgress);
      return existingProgress;
    }
    
    const id = this.progressId++;
    const newProgress: UserProgress = { 
      ...progress, 
      id, 
      lastUpdated: new Date() 
    };
    this.userProgress.set(key, newProgress);
    return newProgress;
  }

  // Challenge completion methods
  async getChallengeCompletion(userId: number, challengeId: number): Promise<ChallengeCompletion | undefined> {
    return this.challengeCompletions.get(`${userId}-${challengeId}`);
  }
  
  async completeChallenge(completion: InsertChallengeCompletion): Promise<ChallengeCompletion> {
    const key = `${completion.userId}-${completion.challengeId}`;
    const id = this.completionId++;
    const newCompletion: ChallengeCompletion = { 
      ...completion, 
      id, 
      completedAt: new Date() 
    };
    this.challengeCompletions.set(key, newCompletion);
    
    // Update user XP
    const user = await this.getUser(completion.userId);
    if (user) {
      const challenge = await this.getChallenge(completion.challengeId);
      if (challenge) {
        await this.updateUser(user.id, { 
          xpPoints: user.xpPoints + (completion.score || challenge.xpReward)
        });
        
        // Check if user level should be increased (every 1000 XP)
        const newXP = user.xpPoints + (completion.score || challenge.xpReward);
        const newLevel = Math.floor(newXP / 1000) + 1;
        if (newLevel > user.level) {
          await this.updateUser(user.id, { level: newLevel });
        }
      }
    }
    
    return newCompletion;
  }

  // Achievement methods
  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }
  
  async getUserAchievements(userId: number): Promise<Achievement[]> {
    const userAchievementIds = Array.from(this.userAchievements.values())
      .filter(ua => ua.userId === userId)
      .map(ua => ua.achievementId);
    
    return Array.from(this.achievements.values())
      .filter(a => userAchievementIds.includes(a.id));
  }
  
  async awardAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const key = `${userAchievement.userId}-${userAchievement.achievementId}`;
    
    // Check if already awarded
    if (this.userAchievements.has(key)) {
      return this.userAchievements.get(key)!;
    }
    
    const id = this.userAchievementId++;
    const newUserAchievement: UserAchievement = { 
      ...userAchievement, 
      id, 
      earnedAt: new Date() 
    };
    this.userAchievements.set(key, newUserAchievement);
    return newUserAchievement;
  }
  
  // Leaderboard method
  async getLeaderboard(limit: number = 10): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => b.xpPoints - a.xpPoints)
      .slice(0, limit);
  }
  
  // Initialize sample data
  private initSampleData() {
    // Create sample users
    const users: InsertUser[] = [
      { username: 'MasterCoder99', password: 'password123', displayName: 'MasterCoder99', level: 42, xpPoints: 9542, avatar: null, bio: 'Coding enthusiast' },
      { username: 'PythonWizard', password: 'password123', displayName: 'PythonWizard', level: 39, xpPoints: 8715, avatar: null, bio: 'Python lover' },
      { username: 'CodeNinja21', password: 'password123', displayName: 'CodeNinja21', level: 36, xpPoints: 7982, avatar: null, bio: 'Silent but deadly coder' },
      { username: 'demo', password: 'demo', displayName: 'CodeWarrior', level: 24, xpPoints: 3200, avatar: null, bio: 'Passionate programmer on a quest to master all coding languages. Currently focusing on Python and Javascript. Love solving algorithmic challenges!' }
    ];
    
    users.forEach(user => this.createUser(user));
    
    // Create sample courses
    const courses: InsertCourse[] = [
      { 
        title: 'Python Basics', 
        description: 'Master the fundamentals of Python programming. Perfect for beginners!',
        imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        difficulty: 'Beginner',
        rating: 48,
        totalChallenges: 5, 
        category: 'Programming',
        featured: true,
        isNew: false
      },
      { 
        title: 'Data Structures', 
        description: 'Learn essential data structures to level up your coding skills.',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        difficulty: 'Advanced',
        rating: 46,
        totalChallenges: 8, 
        category: 'Computer Science',
        featured: true,
        isNew: false
      },
      { 
        title: 'Web Development', 
        description: 'Build interactive websites and applications from scratch.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        difficulty: 'Intermediate',
        rating: 49,
        totalChallenges: 10, 
        category: 'Web Development',
        featured: true,
        isNew: true
      },
      { 
        title: 'Data Analysis', 
        description: 'Learn to analyze and visualize data with Python.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        difficulty: 'Intermediate',
        rating: 45,
        totalChallenges: 7, 
        category: 'Data Science',
        featured: false,
        isNew: false
      }
    ];
    
    const courseIds = courses.map(course => this.createCourse(course).then(c => c.id));
    
    // Create sample challenges for Python Basics course
    Promise.resolve(courseIds[0]).then(courseId => {
      if (!courseId) return;
      
      const pythonChallenges: InsertChallenge[] = [
        {
          courseId,
          title: 'Python Basics',
          description: 'Introduction to Python programming',
          type: 'video',
          content: JSON.stringify({
            videoUrl: 'https://example.com/python-intro',
            questions: [
              {
                time: 10,
                question: 'What does x = 5 do?',
                options: ['Stores 5 in x', 'Compares x to 5', 'Prints 5', 'Creates a function named x'],
                correctAnswer: 0
              },
              {
                time: 20,
                question: 'Which of the following is a valid Python comment?',
                options: ['// Comment', '/* Comment */', '# Comment', '-- Comment'],
                correctAnswer: 2
              }
            ]
          }),
          xpReward: 100,
          orderIndex: 0
        },
        {
          courseId,
          title: 'MCQ Challenge',
          description: 'Test your knowledge with multiple choice questions',
          type: 'mcq',
          content: JSON.stringify({
            questions: [
              {
                question: 'Which of the following is NOT a valid Python data type?',
                options: ['Integer', 'Float', 'Character', 'Boolean'],
                correctAnswer: 2,
                points: 5
              },
              {
                question: 'What will be the output of print(2**3)?',
                options: ['6', '8', '5', 'Error'],
                correctAnswer: 1,
                points: 5
              }
            ]
          }),
          xpReward: 150,
          orderIndex: 1
        },
        {
          courseId,
          title: 'Coding Challenge',
          description: 'Write and submit code to solve Python problems',
          type: 'coding',
          content: JSON.stringify({
            task: 'Write a Python function that prints "Hello, World!" to the console.',
            starterCode: `# Your task:
# 1. Create a function named 'hello_world'
# 2. Make it print "Hello, World!"
# 3. Call the function

def hello_world():
    # Your code here
    
# Call your function here`,
            expectedOutput: 'Hello, World!',
            points: 10
          }),
          xpReward: 200,
          orderIndex: 2
        },
        {
          courseId,
          title: 'Memory Maze',
          description: 'Complete the puzzle maze challenge',
          type: 'maze',
          content: JSON.stringify({
            gridSize: 5,
            pairs: [
              {text: 'Python', match: 'Programming Language'},
              {text: 'List', match: 'Collection'},
              {text: 'Dictionary', match: 'Key-Value Pairs'},
              {text: 'Tuple', match: 'Immutable'},
              {text: 'Function', match: 'Reusable Code'},
              {text: 'Class', match: 'Blueprint'},
              {text: 'Variable', match: 'Store Data'},
              {text: 'Loop', match: 'Iteration'},
              {text: 'Condition', match: 'If-Else'},
              {text: 'Module', match: 'Import'},
              {text: 'Exception', match: 'Try-Except'},
              {text: 'Comment', match: '# Symbol'}
            ],
            points: 10
          }),
          xpReward: 250,
          orderIndex: 3
        },
        {
          courseId,
          title: 'Career Quest',
          description: 'Interview preparation and career resources',
          type: 'career',
          content: JSON.stringify({
            interviewQuestions: [
              {question: 'What is a variable in Python?', answer: 'A named location in memory used to store data that can be modified during program execution.'},
              {question: 'Explain the difference between a list and tuple.', answer: 'Lists are mutable (can be changed) while tuples are immutable (cannot be changed after creation).'}
            ],
            resources: [
              {title: 'Python Developer Resume Template', url: 'https://example.com/python-resume'},
              {title: 'Common Python Interview Questions', url: 'https://example.com/python-interview'}
            ],
            points: 15
          }),
          xpReward: 300,
          orderIndex: 4
        }
      ];
      
      pythonChallenges.forEach(challenge => this.createChallenge(challenge));
    });
    
    // Create sample progress for demo user
    this.createOrUpdateProgress({
      userId: 4, // demo user
      courseId: 1, // Python Basics
      progress: 65,
      completed: false
    });
    
    this.createOrUpdateProgress({
      userId: 4, // demo user
      courseId: 4, // Data Analysis
      progress: 30,
      completed: false
    });
    
    this.createOrUpdateProgress({
      userId: 4, // demo user
      courseId: 3, // Web Development
      progress: 10,
      completed: false
    });
    
    // Create sample achievements
    const achievements: InsertAchievement[] = [
      {
        title: 'First Quest',
        description: 'Complete your first course',
        iconName: 'trophy',
        condition: 'complete_first_course'
      },
      {
        title: 'Code Master',
        description: 'Complete 5 coding challenges',
        iconName: 'code',
        condition: 'complete_5_coding_challenges'
      },
      {
        title: 'Python Expert',
        description: 'Complete the Python Mastery Path',
        iconName: 'certificate',
        condition: 'complete_python_course'
      }
    ];
    
    achievements.forEach(achievement => {
      const id = this.achievementId++;
      const newAchievement: Achievement = { ...achievement, id };
      this.achievements.set(id, newAchievement);
    });
    
    // Award some achievements to demo user
    this.awardAchievement({
      userId: 4,
      achievementId: 1
    });
    
    this.awardAchievement({
      userId: 4,
      achievementId: 2
    });
  }
}

export const storage = new MemStorage();
