import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import { register, login, authenticateToken } from "./auth";
import {
  exerciseFilterSchema,
  insertDietPlanSchema,
  insertExerciseCategorySchema,
  insertExerciseSchema,
  insertMealSchema,
  insertProgressEntrySchema,
  insertUserSchema,
  insertWorkoutExerciseSchema,
  insertWorkoutPlanSchema,
  insertWorkoutSchema,
  mealFilterSchema,
  workoutFilterSchema
} from "@shared/schema";
import { format, startOfDay, endOfDay, parseISO, addDays } from "date-fns";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Base API route prefix
  const apiRouter = express.Router();
  app.use("/api", apiRouter);

  // Auth routes
  apiRouter.post("/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Could not create user" });
    }
  });

  apiRouter.post("/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Don't return the password
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Could not login" });
    }
  });

  // User routes
  apiRouter.get("/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve user" });
    }
  });
  
  // User stats route - for profile page
  apiRouter.get("/users/:userId/stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get workouts to calculate stats
      const allWorkouts = await storage.getWorkouts(userId);
      const completedWorkouts = allWorkouts.filter(workout => workout.status === "completed");
      
      // Get current streak by checking consecutive days with completed workouts
      const today = new Date();
      let currentStreak = 0;
      let checkDate = today;
      
      // Get consecutive days going backward from today
      let hasWorkoutToday = completedWorkouts.some(workout => 
        new Date(workout.completedDate as string).toDateString() === today.toDateString()
      );
      
      if (hasWorkoutToday) {
        currentStreak = 1;
        checkDate = new Date(today);
        checkDate.setDate(today.getDate() - 1);
        
        let streakActive = true;
        while (streakActive) {
          const hasWorkoutOnDate = completedWorkouts.some(workout =>
            new Date(workout.completedDate as string).toDateString() === checkDate.toDateString()
          );
          
          if (hasWorkoutOnDate) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            streakActive = false;
          }
        }
      }
      
      // Calculate total calories burned (approx)
      const totalCaloriesBurned = completedWorkouts.reduce((total, workout) => {
        // Simple calculation: 300 calories per 30 mins of workout
        const duration = workout.duration || 30; // Default to 30 mins if not specified
        return total + Math.floor((duration / 30) * 300);
      }, 0);
      
      // Count workouts this week
      const startOfWeek = new Date();
      startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
      const workoutsThisWeek = completedWorkouts.filter(workout => 
        new Date(workout.completedDate as string) >= startOfWeek
      ).length;
      
      // Calculate weekly goal progress (assuming goal is 4 workouts per week)
      const weeklyGoal = 4;
      const goalProgress = Math.min(Math.round((workoutsThisWeek / weeklyGoal) * 100), 100);
      
      // Get meals to calculate adherence
      const meals = await storage.getMeals(userId);
      const plannedMeals = meals.length;
      const completedMeals = meals.filter(meal => meal.completed).length;
      const mealAdherence = plannedMeals > 0 
        ? Math.round((completedMeals / plannedMeals) * 100) 
        : 100;
      
      // Return stats object
      const stats = {
        workoutsCompleted: completedWorkouts.length,
        currentStreak,
        longestStreak: Math.max(currentStreak, 14), // Mock data for longest streak
        totalCaloriesBurned,
        workoutsThisWeek,
        goalProgress,
        mealAdherence,
        caloriesBurned: totalCaloriesBurned > 10000 ? totalCaloriesBurned : 12500 // Ensure a minimum value for display purposes
      };
      
      res.status(200).json(stats);
    } catch (error) {
      console.error("Error getting user stats:", error);
      res.status(500).json({ message: "Could not retrieve user stats" });
    }
  });

  // Exercise category routes
  apiRouter.get("/exercise-categories", async (req, res) => {
    try {
      const categories = await storage.getExerciseCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve exercise categories" });
    }
  });

  apiRouter.post("/exercise-categories", async (req, res) => {
    try {
      const categoryData = insertExerciseCategorySchema.parse(req.body);
      const category = await storage.createExerciseCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Could not create exercise category" });
    }
  });

  // Exercise routes
  apiRouter.get("/exercises", async (req, res) => {
    try {
      const { query, categoryId } = req.query;
      const parsedCategoryId = categoryId ? parseInt(categoryId as string) : undefined;
      
      const exercises = await storage.getExercises(query as string | undefined, parsedCategoryId);
      res.status(200).json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve exercises" });
    }
  });

  apiRouter.get("/exercises/:id", async (req, res) => {
    try {
      const exerciseId = parseInt(req.params.id);
      const exercise = await storage.getExercise(exerciseId);
      
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      
      res.status(200).json(exercise);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve exercise" });
    }
  });

  apiRouter.post("/exercises", async (req, res) => {
    try {
      const exerciseData = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(exerciseData);
      res.status(201).json(exercise);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Could not create exercise" });
    }
  });

  // Workout plan routes
  apiRouter.get("/users/:userId/workout-plans", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const workoutPlans = await storage.getWorkoutPlans(userId);
      res.status(200).json(workoutPlans);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve workout plans" });
    }
  });

  apiRouter.get("/workout-plans/:id", async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      const plan = await storage.getWorkoutPlan(planId);
      
      if (!plan) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      
      res.status(200).json(plan);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve workout plan" });
    }
  });

  apiRouter.post("/workout-plans", async (req, res) => {
    try {
      const planData = insertWorkoutPlanSchema.parse(req.body);
      const plan = await storage.createWorkoutPlan(planData);
      res.status(201).json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Could not create workout plan" });
    }
  });

  apiRouter.put("/workout-plans/:id", async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      const planData = insertWorkoutPlanSchema.partial().parse(req.body);
      
      const updatedPlan = await storage.updateWorkoutPlan(planId, planData);
      
      if (!updatedPlan) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      
      res.status(200).json(updatedPlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Could not update workout plan" });
    }
  });

  apiRouter.delete("/workout-plans/:id", async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      const success = await storage.deleteWorkoutPlan(planId);
      
      if (!success) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Could not delete workout plan" });
    }
  });

  // Workout routes
  apiRouter.get("/users/:userId/workouts", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { planId } = req.query;
      const parsedPlanId = planId ? parseInt(planId as string) : undefined;
      
      const workouts = await storage.getWorkouts(userId, parsedPlanId);
      res.status(200).json(workouts);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve workouts" });
    }
  });

  apiRouter.get("/users/:userId/recent-workouts", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      
      const workouts = await storage.getRecentWorkouts(userId, limit);
      res.status(200).json(workouts);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve recent workouts" });
    }
  });

  apiRouter.get("/users/:userId/upcoming-workouts", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      
      const workouts = await storage.getUpcomingWorkouts(userId, limit);
      res.status(200).json(workouts);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve upcoming workouts" });
    }
  });

  apiRouter.get("/workouts/:id", async (req, res) => {
    try {
      const workoutId = parseInt(req.params.id);
      const workout = await storage.getWorkout(workoutId);
      
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      
      res.status(200).json(workout);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve workout" });
    }
  });

  apiRouter.post("/workouts", async (req, res) => {
    try {
      const workoutData = insertWorkoutSchema.parse(req.body);
      const workout = await storage.createWorkout(workoutData);
      res.status(201).json(workout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Could not create workout" });
    }
  });

  apiRouter.put("/workouts/:id", async (req, res) => {
    try {
      const workoutId = parseInt(req.params.id);
      const workoutData = insertWorkoutSchema.partial().parse(req.body);
      
      const updatedWorkout = await storage.updateWorkout(workoutId, workoutData);
      
      if (!updatedWorkout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      
      res.status(200).json(updatedWorkout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Could not update workout" });
    }
  });

  apiRouter.delete("/workouts/:id", async (req, res) => {
    try {
      const workoutId = parseInt(req.params.id);
      const success = await storage.deleteWorkout(workoutId);
      
      if (!success) {
        return res.status(404).json({ message: "Workout not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Could not delete workout" });
    }
  });

  // Workout exercise routes
  apiRouter.get("/workouts/:workoutId/exercises", async (req, res) => {
    try {
      const workoutId = parseInt(req.params.workoutId);
      const workoutExercises = await storage.getWorkoutExercises(workoutId);
      res.status(200).json(workoutExercises);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve workout exercises" });
    }
  });

  apiRouter.post("/workout-exercises", async (req, res) => {
    try {
      const workoutExerciseData = insertWorkoutExerciseSchema.parse(req.body);
      const workoutExercise = await storage.createWorkoutExercise(workoutExerciseData);
      res.status(201).json(workoutExercise);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Could not create workout exercise" });
    }
  });

  apiRouter.put("/workout-exercises/:id", async (req, res) => {
    try {
      const workoutExerciseId = parseInt(req.params.id);
      const workoutExerciseData = insertWorkoutExerciseSchema.partial().parse(req.body);
      
      const updatedWorkoutExercise = await storage.updateWorkoutExercise(workoutExerciseId, workoutExerciseData);
      
      if (!updatedWorkoutExercise) {
        return res.status(404).json({ message: "Workout exercise not found" });
      }
      
      res.status(200).json(updatedWorkoutExercise);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Could not update workout exercise" });
    }
  });

  apiRouter.delete("/workout-exercises/:id", async (req, res) => {
    try {
      const workoutExerciseId = parseInt(req.params.id);
      const success = await storage.deleteWorkoutExercise(workoutExerciseId);
      
      if (!success) {
        return res.status(404).json({ message: "Workout exercise not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Could not delete workout exercise" });
    }
  });

  // Diet plan routes
  apiRouter.get("/users/:userId/diet-plans", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const dietPlans = await storage.getDietPlans(userId);
      res.status(200).json(dietPlans);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve diet plans" });
    }
  });

  apiRouter.get("/users/:userId/active-diet-plan", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const activePlan = await storage.getActiveDietPlan(userId);
      
      if (!activePlan) {
        return res.status(404).json({ message: "No active diet plan found" });
      }
      
      res.status(200).json(activePlan);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve active diet plan" });
    }
  });

  apiRouter.get("/diet-plans/:id", async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      const plan = await storage.getDietPlan(planId);
      
      if (!plan) {
        return res.status(404).json({ message: "Diet plan not found" });
      }
      
      res.status(200).json(plan);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve diet plan" });
    }
  });

  apiRouter.post("/diet-plans", async (req, res) => {
    try {
      const planData = insertDietPlanSchema.parse(req.body);
      const plan = await storage.createDietPlan(planData);
      res.status(201).json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Could not create diet plan" });
    }
  });

  apiRouter.put("/diet-plans/:id", async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      const planData = insertDietPlanSchema.partial().parse(req.body);
      
      const updatedPlan = await storage.updateDietPlan(planId, planData);
      
      if (!updatedPlan) {
        return res.status(404).json({ message: "Diet plan not found" });
      }
      
      res.status(200).json(updatedPlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Could not update diet plan" });
    }
  });

  apiRouter.delete("/diet-plans/:id", async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      const success = await storage.deleteDietPlan(planId);
      
      if (!success) {
        return res.status(404).json({ message: "Diet plan not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Could not delete diet plan" });
    }
  });

  // Meal routes
  apiRouter.get("/users/:userId/meals", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { date, dietPlanId } = req.query;
      const parsedDate = date ? new Date(date as string) : undefined;
      const parsedDietPlanId = dietPlanId ? parseInt(dietPlanId as string) : undefined;
      
      const meals = await storage.getMeals(userId, parsedDate, parsedDietPlanId);
      res.status(200).json(meals);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve meals" });
    }
  });

  apiRouter.get("/users/:userId/meals/date-range", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      
      const parsedStartDate = new Date(startDate as string);
      const parsedEndDate = new Date(endDate as string);
      
      const meals = await storage.getMealsByDateRange(userId, parsedStartDate, parsedEndDate);
      res.status(200).json(meals);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve meals" });
    }
  });

  apiRouter.get("/meals/:id", async (req, res) => {
    try {
      const mealId = parseInt(req.params.id);
      const meal = await storage.getMeal(mealId);
      
      if (!meal) {
        return res.status(404).json({ message: "Meal not found" });
      }
      
      res.status(200).json(meal);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve meal" });
    }
  });

  apiRouter.post("/meals", async (req, res) => {
    try {
      const mealData = insertMealSchema.parse(req.body);
      const meal = await storage.createMeal(mealData);
      res.status(201).json(meal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Could not create meal" });
    }
  });

  apiRouter.put("/meals/:id", async (req, res) => {
    try {
      const mealId = parseInt(req.params.id);
      const mealData = insertMealSchema.partial().parse(req.body);
      
      const updatedMeal = await storage.updateMeal(mealId, mealData);
      
      if (!updatedMeal) {
        return res.status(404).json({ message: "Meal not found" });
      }
      
      res.status(200).json(updatedMeal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Could not update meal" });
    }
  });

  apiRouter.delete("/meals/:id", async (req, res) => {
    try {
      const mealId = parseInt(req.params.id);
      const success = await storage.deleteMeal(mealId);
      
      if (!success) {
        return res.status(404).json({ message: "Meal not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Could not delete meal" });
    }
  });

  // Progress tracking routes
  apiRouter.get("/users/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progressEntries = await storage.getProgressEntries(userId);
      res.status(200).json(progressEntries);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve progress entries" });
    }
  });

  apiRouter.get("/users/:userId/latest-progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const latestEntry = await storage.getLatestProgressEntry(userId);
      
      if (!latestEntry) {
        return res.status(404).json({ message: "No progress entries found" });
      }
      
      res.status(200).json(latestEntry);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve latest progress entry" });
    }
  });

  apiRouter.get("/progress/:id", async (req, res) => {
    try {
      const progressId = parseInt(req.params.id);
      const progress = await storage.getProgressEntry(progressId);
      
      if (!progress) {
        return res.status(404).json({ message: "Progress entry not found" });
      }
      
      res.status(200).json(progress);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve progress entry" });
    }
  });

  apiRouter.post("/progress", async (req, res) => {
    try {
      const progressData = insertProgressEntrySchema.parse(req.body);
      const progress = await storage.createProgressEntry(progressData);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Could not create progress entry" });
    }
  });

  apiRouter.put("/progress/:id", async (req, res) => {
    try {
      const progressId = parseInt(req.params.id);
      const progressData = insertProgressEntrySchema.partial().parse(req.body);
      
      const updatedProgress = await storage.updateProgressEntry(progressId, progressData);
      
      if (!updatedProgress) {
        return res.status(404).json({ message: "Progress entry not found" });
      }
      
      res.status(200).json(updatedProgress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Could not update progress entry" });
    }
  });

  apiRouter.delete("/progress/:id", async (req, res) => {
    try {
      const progressId = parseInt(req.params.id);
      const success = await storage.deleteProgressEntry(progressId);
      
      if (!success) {
        return res.status(404).json({ message: "Progress entry not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Could not delete progress entry" });
    }
  });

  // Summary statistics
  apiRouter.get("/users/:userId/stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const today = new Date();
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      // Get completed workouts this week
      const workouts = await storage.getWorkouts(userId);
      const completedWorkoutsThisWeek = workouts.filter(workout => {
        if (workout.status !== "completed" || !workout.completedDate) return false;
        const completedDate = new Date(workout.completedDate);
        return completedDate >= oneWeekAgo && completedDate <= today;
      });
      
      // Calculate total calories burned (estimation)
      const caloriesBurned = completedWorkoutsThisWeek.reduce((total, workout) => {
        // Simple estimation: 10 calories per minute
        return total + (workout.duration || 0) * 10;
      }, 0);
      
      // Calculate meal plan adherence
      const meals = await storage.getMealsByDateRange(userId, oneWeekAgo, today);
      const mealAdherence = meals.length > 0
        ? Math.round((meals.filter(meal => meal.completed).length / meals.length) * 100)
        : 0;
      
      // Calculate goal progress (simplified)
      // In a real app, this would be based on actual user goals
      const goalProgress = 60; // Placeholder value
      
      res.status(200).json({
        workoutsThisWeek: completedWorkoutsThisWeek.length,
        caloriesBurned,
        mealAdherence,
        goalProgress
      });
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve user statistics" });
    }
  });

  // Recommended exercises for workouts based on plan focus
  apiRouter.get("/workout-plans/:planId/recommended-exercises", async (req, res) => {
    try {
      const planId = parseInt(req.params.planId);
      const plan = await storage.getWorkoutPlan(planId);
      
      if (!plan) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      
      // Get exercises based on the plan's focus
      let categoryIds: number[] = [];
      const allExerciseCategories = await storage.getExerciseCategories();
      
      // Map focus to relevant exercise categories
      if (plan.focus.toLowerCase().includes('strength')) {
        categoryIds = allExerciseCategories
          .filter(c => ['chest', 'back', 'legs', 'shoulders', 'arms'].includes(c.name.toLowerCase()))
          .map(c => c.id);
      } else if (plan.focus.toLowerCase().includes('cardio')) {
        categoryIds = allExerciseCategories
          .filter(c => ['cardio', 'hiit'].includes(c.name.toLowerCase()))
          .map(c => c.id);
      } else if (plan.focus.toLowerCase().includes('flexibility')) {
        categoryIds = allExerciseCategories
          .filter(c => ['yoga', 'stretching', 'mobility'].includes(c.name.toLowerCase()))
          .map(c => c.id);
      } else {
        // Default to all categories
        categoryIds = allExerciseCategories.map(c => c.id);
      }
      
      // Get all exercises from these categories
      const exercises = await Promise.all(
        categoryIds.map(categoryId => storage.getExercises(undefined, categoryId))
      );
      
      // Flatten the arrays
      const allExercises = exercises.flat();
      
      // Group exercises by category for better UX
      const exercisesByCategory = allExerciseCategories
        .filter(category => categoryIds.includes(category.id))
        .map(category => {
          return {
            category,
            exercises: allExercises.filter(exercise => exercise.categoryId === category.id)
          };
        })
        .filter(group => group.exercises.length > 0);
      
      res.status(200).json(exercisesByCategory);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve recommended exercises" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
