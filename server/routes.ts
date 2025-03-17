import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, insertUserSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";

// Use MemoryStore to avoid session store warnings
const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "eduventure-secret",
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (user.password !== password) {
          // In production, use proper password hashing
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // Serialize user to session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Middleware to check authentication
  const isAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // PREFIX ALL ROUTES WITH /api

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      
      // Auto-login after registration
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging in after registration" });
        }
        return res.status(201).json({ 
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          level: user.level,
          xpPoints: user.xpPoints
        });
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error during registration" });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    try {
      // Validate login data
      loginSchema.parse(req.body);
      
      passport.authenticate("local", (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({ message: info.message || "Authentication failed" });
        }
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
          return res.json({ 
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            level: user.level,
            xpPoints: user.xpPoints
          });
        });
      })(req, res, next);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Server error during login" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error during logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", isAuthenticated, (req, res) => {
    const user = req.user as any;
    res.json({ 
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      bio: user.bio,
      level: user.level,
      xpPoints: user.xpPoints
    });
  });

  // Courses routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching courses" });
    }
  });

  app.get("/api/courses/featured", async (req, res) => {
    try {
      const featuredCourses = await storage.getFeaturedCourses();
      res.json(featuredCourses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Error fetching course" });
    }
  });

  // Challenges routes
  app.get("/api/courses/:courseId/challenges", isAuthenticated, async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const challenges = await storage.getChallengesByCourse(courseId);
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Error fetching challenges" });
    }
  });

  app.get("/api/challenges/:id", isAuthenticated, async (req, res) => {
    try {
      const challengeId = parseInt(req.params.id);
      const challenge = await storage.getChallenge(challengeId);
      
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Error fetching challenge" });
    }
  });

  // Complete a challenge
  app.post("/api/challenges/:id/complete", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const challengeId = parseInt(req.params.id);
      const { score } = req.body;
      
      const challenge = await storage.getChallenge(challengeId);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      const completion = await storage.completeChallenge({
        userId: user.id,
        challengeId,
        completed: true,
        score: score || challenge.xpReward
      });
      
      // Get updated user to return current XP
      const updatedUser = await storage.getUser(user.id);
      
      res.json({
        completion,
        user: {
          xpPoints: updatedUser?.xpPoints || user.xpPoints,
          level: updatedUser?.level || user.level
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error completing challenge" });
    }
  });

  // User progress routes
  app.get("/api/progress", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const progress = await storage.getUserProgress(user.id);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Error fetching progress" });
    }
  });

  app.post("/api/progress", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const { courseId, progress } = req.body;
      
      const updatedProgress = await storage.createOrUpdateProgress({
        userId: user.id,
        courseId,
        progress,
        completed: progress === 100
      });
      
      res.json(updatedProgress);
    } catch (error) {
      res.status(500).json({ message: "Error updating progress" });
    }
  });

  // Achievements routes
  app.get("/api/achievements", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const achievements = await storage.getUserAchievements(user.id);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Error fetching achievements" });
    }
  });

  // Leaderboard route
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const leaders = await storage.getLeaderboard(limit);
      
      res.json(leaders.map(user => ({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        level: user.level,
        xpPoints: user.xpPoints,
        avatar: user.avatar
      })));
    } catch (error) {
      res.status(500).json({ message: "Error fetching leaderboard" });
    }
  });

  // Profile routes
  app.put("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const { displayName, bio, avatar } = req.body;
      
      const updatedUser = await storage.updateUser(user.id, {
        displayName,
        bio,
        avatar
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        id: updatedUser.id,
        username: updatedUser.username,
        displayName: updatedUser.displayName,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        level: updatedUser.level,
        xpPoints: updatedUser.xpPoints
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
