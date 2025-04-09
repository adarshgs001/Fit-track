import {
  User, InsertUser, users,
  Exercise, InsertExercise, exercises,
  ExerciseCategory, InsertExerciseCategory, exerciseCategories,
  WorkoutPlan, InsertWorkoutPlan, workoutPlans,
  Workout, InsertWorkout, workouts,
  WorkoutExercise, InsertWorkoutExercise, workoutExercises,
  DietPlan, InsertDietPlan, dietPlans,
  Meal, InsertMeal, meals,
  ProgressEntry, InsertProgressEntry, progressEntries,
  WaterIntake, InsertWaterIntake, waterIntakes
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, desc, and, gte, lte, like, not } from "drizzle-orm";

import session from "express-session";
import connectPg from "connect-pg-simple";
import createMemoryStore from "memorystore";

export interface IStorage {
  // Session store
  sessionStore: session.Store;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;

  // Exercise category methods
  getExerciseCategories(): Promise<ExerciseCategory[]>;
  getExerciseCategory(id: number): Promise<ExerciseCategory | undefined>;
  createExerciseCategory(category: InsertExerciseCategory): Promise<ExerciseCategory>;

  // Exercise methods
  getExercises(query?: string, categoryId?: number): Promise<Exercise[]>;
  getExercise(id: number): Promise<Exercise | undefined>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;

  // Workout plan methods
  getWorkoutPlans(userId: number): Promise<WorkoutPlan[]>;
  getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined>;
  createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan>;
  updateWorkoutPlan(id: number, plan: Partial<InsertWorkoutPlan>): Promise<WorkoutPlan | undefined>;
  deleteWorkoutPlan(id: number): Promise<boolean>;

  // Workout methods
  getWorkouts(userId: number, planId?: number): Promise<Workout[]>;
  getWorkout(id: number): Promise<Workout | undefined>;
  getRecentWorkouts(userId: number, limit: number): Promise<Workout[]>;
  getUpcomingWorkouts(userId: number, limit: number): Promise<Workout[]>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  updateWorkout(id: number, workout: Partial<InsertWorkout>): Promise<Workout | undefined>;
  deleteWorkout(id: number): Promise<boolean>;

  // Workout exercise methods
  getWorkoutExercises(workoutId: number): Promise<WorkoutExercise[]>;
  createWorkoutExercise(workoutExercise: InsertWorkoutExercise): Promise<WorkoutExercise>;
  updateWorkoutExercise(id: number, workoutExercise: Partial<InsertWorkoutExercise>): Promise<WorkoutExercise | undefined>;
  deleteWorkoutExercise(id: number): Promise<boolean>;

  // Diet plan methods
  getDietPlans(userId: number): Promise<DietPlan[]>;
  getDietPlan(id: number): Promise<DietPlan | undefined>;
  getActiveDietPlan(userId: number): Promise<DietPlan | undefined>;
  createDietPlan(plan: InsertDietPlan): Promise<DietPlan>;
  updateDietPlan(id: number, plan: Partial<InsertDietPlan>): Promise<DietPlan | undefined>;
  deleteDietPlan(id: number): Promise<boolean>;

  // Meal methods
  getMeals(userId: number, date?: Date, dietPlanId?: number): Promise<Meal[]>;
  getMeal(id: number): Promise<Meal | undefined>;
  getMealsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Meal[]>;
  createMeal(meal: InsertMeal): Promise<Meal>;
  updateMeal(id: number, meal: Partial<InsertMeal>): Promise<Meal | undefined>;
  deleteMeal(id: number): Promise<boolean>;

  // Progress methods
  getProgressEntries(userId: number): Promise<ProgressEntry[]>;
  getProgressEntry(id: number): Promise<ProgressEntry | undefined>;
  getLatestProgressEntry(userId: number): Promise<ProgressEntry | undefined>;
  createProgressEntry(entry: InsertProgressEntry): Promise<ProgressEntry>;
  updateProgressEntry(id: number, entry: Partial<InsertProgressEntry>): Promise<ProgressEntry | undefined>;
  deleteProgressEntry(id: number): Promise<boolean>;

  // Water intake methods
  getWaterIntakes(userId: number, date?: Date): Promise<WaterIntake[]>;
  getWaterIntakeForDate(userId: number, date: Date): Promise<WaterIntake | undefined>;
  createWaterIntake(intake: InsertWaterIntake): Promise<WaterIntake>;
  updateWaterIntake(id: number, intake: Partial<InsertWaterIntake>): Promise<WaterIntake | undefined>;
  deleteWaterIntake(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  sessionStore: session.Store;
  
  private users: Map<number, User>;
  private exerciseCategories: Map<number, ExerciseCategory>;
  private exercises: Map<number, Exercise>;
  private workoutPlans: Map<number, WorkoutPlan>;
  private workouts: Map<number, Workout>;
  private workoutExercises: Map<number, WorkoutExercise>;
  private dietPlans: Map<number, DietPlan>;
  private meals: Map<number, Meal>;
  private progressEntries: Map<number, ProgressEntry>;
  private waterIntakes: Map<number, WaterIntake>;

  // Current IDs for auto-increment
  private userId = 1;
  private exerciseCategoryId = 1;
  private exerciseId = 1;
  private workoutPlanId = 1;
  private workoutId = 1;
  private workoutExerciseId = 1;
  private dietPlanId = 1;
  private mealId = 1;
  private progressEntryId = 1;
  private waterIntakeId = 1;

  constructor() {
    this.users = new Map();
    this.exerciseCategories = new Map();
    this.exercises = new Map();
    this.workoutPlans = new Map();
    this.workouts = new Map();
    this.workoutExercises = new Map();
    this.dietPlans = new Map();
    this.meals = new Map();
    this.progressEntries = new Map();
    this.waterIntakes = new Map();

    // Initialize session store
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });

    // Initialize with some sample data
    this.initSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    
    // Initialize optional fields with null values to match User type
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt,
      weight: insertUser.weight ?? null,
      height: insertUser.height ?? null,
      age: insertUser.age ?? null,
      gender: insertUser.gender ?? null,
      fitnessGoal: insertUser.fitnessGoal ?? null,
      bodyFatPercentage: insertUser.bodyFatPercentage ?? null,
      muscleMassPercentage: insertUser.muscleMassPercentage ?? null
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    // Process nullable fields with null coalescing operator
    const processedData: Partial<User> = {
      ...userData,
      weight: userData.weight ?? existingUser.weight,
      height: userData.height ?? existingUser.height,
      age: userData.age ?? existingUser.age,
      gender: userData.gender ?? existingUser.gender,
      fitnessGoal: userData.fitnessGoal ?? existingUser.fitnessGoal,
      bodyFatPercentage: userData.bodyFatPercentage ?? existingUser.bodyFatPercentage,
      muscleMassPercentage: userData.muscleMassPercentage ?? existingUser.muscleMassPercentage
    };
    
    const updatedUser: User = { ...existingUser, ...processedData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Exercise category methods
  async getExerciseCategories(): Promise<ExerciseCategory[]> {
    return Array.from(this.exerciseCategories.values());
  }

  async getExerciseCategory(id: number): Promise<ExerciseCategory | undefined> {
    return this.exerciseCategories.get(id);
  }

  async createExerciseCategory(category: InsertExerciseCategory): Promise<ExerciseCategory> {
    const id = this.exerciseCategoryId++;
    const newCategory: ExerciseCategory = { ...category, id };
    this.exerciseCategories.set(id, newCategory);
    return newCategory;
  }

  // Exercise methods
  async getExercises(query?: string, categoryId?: number): Promise<Exercise[]> {
    let filteredExercises = Array.from(this.exercises.values());
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredExercises = filteredExercises.filter(
        exercise => exercise.name.toLowerCase().includes(lowerQuery) || 
                    exercise.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    if (categoryId) {
      filteredExercises = filteredExercises.filter(
        exercise => exercise.categoryId === categoryId
      );
    }
    
    return filteredExercises;
  }

  async getExercise(id: number): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const id = this.exerciseId++;
    const newExercise: Exercise = { ...exercise, id };
    this.exercises.set(id, newExercise);
    return newExercise;
  }

  // Workout plan methods
  async getWorkoutPlans(userId: number): Promise<WorkoutPlan[]> {
    return Array.from(this.workoutPlans.values()).filter(plan => plan.userId === userId);
  }

  async getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined> {
    return this.workoutPlans.get(id);
  }

  async createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan> {
    const id = this.workoutPlanId++;
    const createdAt = new Date();
    const newPlan: WorkoutPlan = { ...plan, id, createdAt };
    this.workoutPlans.set(id, newPlan);
    return newPlan;
  }

  async updateWorkoutPlan(id: number, plan: Partial<InsertWorkoutPlan>): Promise<WorkoutPlan | undefined> {
    const existingPlan = this.workoutPlans.get(id);
    if (!existingPlan) return undefined;
    
    const updatedPlan: WorkoutPlan = { ...existingPlan, ...plan };
    this.workoutPlans.set(id, updatedPlan);
    return updatedPlan;
  }

  async deleteWorkoutPlan(id: number): Promise<boolean> {
    return this.workoutPlans.delete(id);
  }

  // Workout methods
  async getWorkouts(userId: number, planId?: number): Promise<Workout[]> {
    let userWorkouts = Array.from(this.workouts.values()).filter(workout => workout.userId === userId);
    
    if (planId) {
      userWorkouts = userWorkouts.filter(workout => workout.planId === planId);
    }
    
    return userWorkouts;
  }

  async getWorkout(id: number): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }

  async getRecentWorkouts(userId: number, limit: number): Promise<Workout[]> {
    return Array.from(this.workouts.values())
      .filter(workout => workout.userId === userId && workout.status === 'completed' && workout.completedDate)
      .sort((a, b) => (new Date(b.completedDate!)).getTime() - (new Date(a.completedDate!)).getTime())
      .slice(0, limit);
  }

  async getUpcomingWorkouts(userId: number, limit: number): Promise<Workout[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return Array.from(this.workouts.values())
      .filter(workout => {
        const workoutDate = new Date(workout.scheduledDate);
        workoutDate.setHours(0, 0, 0, 0);
        return workout.userId === userId && workout.status === 'scheduled' && workoutDate >= today;
      })
      .sort((a, b) => (new Date(a.scheduledDate)).getTime() - (new Date(b.scheduledDate)).getTime())
      .slice(0, limit);
  }

  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    const id = this.workoutId++;
    const newWorkout: Workout = { ...workout, id };
    this.workouts.set(id, newWorkout);
    return newWorkout;
  }

  async updateWorkout(id: number, workout: Partial<InsertWorkout>): Promise<Workout | undefined> {
    const existingWorkout = this.workouts.get(id);
    if (!existingWorkout) return undefined;
    
    const updatedWorkout: Workout = { ...existingWorkout, ...workout };
    this.workouts.set(id, updatedWorkout);
    return updatedWorkout;
  }

  async deleteWorkout(id: number): Promise<boolean> {
    return this.workouts.delete(id);
  }

  // Workout exercise methods
  async getWorkoutExercises(workoutId: number): Promise<WorkoutExercise[]> {
    return Array.from(this.workoutExercises.values())
      .filter(workoutExercise => workoutExercise.workoutId === workoutId)
      .sort((a, b) => a.order - b.order);
  }

  async createWorkoutExercise(workoutExercise: InsertWorkoutExercise): Promise<WorkoutExercise> {
    const id = this.workoutExerciseId++;
    const newWorkoutExercise: WorkoutExercise = { ...workoutExercise, id };
    this.workoutExercises.set(id, newWorkoutExercise);
    return newWorkoutExercise;
  }

  async updateWorkoutExercise(id: number, workoutExercise: Partial<InsertWorkoutExercise>): Promise<WorkoutExercise | undefined> {
    const existingWorkoutExercise = this.workoutExercises.get(id);
    if (!existingWorkoutExercise) return undefined;
    
    const updatedWorkoutExercise: WorkoutExercise = { ...existingWorkoutExercise, ...workoutExercise };
    this.workoutExercises.set(id, updatedWorkoutExercise);
    return updatedWorkoutExercise;
  }

  async deleteWorkoutExercise(id: number): Promise<boolean> {
    return this.workoutExercises.delete(id);
  }

  // Diet plan methods
  async getDietPlans(userId: number): Promise<DietPlan[]> {
    return Array.from(this.dietPlans.values()).filter(plan => plan.userId === userId);
  }

  async getDietPlan(id: number): Promise<DietPlan | undefined> {
    return this.dietPlans.get(id);
  }

  async getActiveDietPlan(userId: number): Promise<DietPlan | undefined> {
    return Array.from(this.dietPlans.values()).find(
      plan => plan.userId === userId && plan.status === 'active'
    );
  }

  async createDietPlan(plan: InsertDietPlan): Promise<DietPlan> {
    const id = this.dietPlanId++;
    const createdAt = new Date();
    const newPlan: DietPlan = { ...plan, id, createdAt };
    this.dietPlans.set(id, newPlan);

    // If this is an active plan, set other plans to inactive
    if (plan.status === 'active') {
      for (const [existingId, existingPlan] of this.dietPlans.entries()) {
        if (existingId !== id && existingPlan.userId === plan.userId && existingPlan.status === 'active') {
          existingPlan.status = 'inactive';
        }
      }
    }

    return newPlan;
  }

  async updateDietPlan(id: number, plan: Partial<InsertDietPlan>): Promise<DietPlan | undefined> {
    const existingPlan = this.dietPlans.get(id);
    if (!existingPlan) return undefined;
    
    const updatedPlan: DietPlan = { ...existingPlan, ...plan };
    this.dietPlans.set(id, updatedPlan);

    // If this plan was set to active, set other plans to inactive
    if (plan.status === 'active') {
      for (const [existingId, existingPlan] of this.dietPlans.entries()) {
        if (existingId !== id && existingPlan.userId === updatedPlan.userId && existingPlan.status === 'active') {
          existingPlan.status = 'inactive';
        }
      }
    }

    return updatedPlan;
  }

  async deleteDietPlan(id: number): Promise<boolean> {
    return this.dietPlans.delete(id);
  }

  // Meal methods
  async getMeals(userId: number, date?: Date, dietPlanId?: number): Promise<Meal[]> {
    let userMeals = Array.from(this.meals.values()).filter(meal => meal.userId === userId);
    
    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      
      userMeals = userMeals.filter(meal => {
        const mealDate = new Date(meal.date);
        mealDate.setHours(0, 0, 0, 0);
        return mealDate.getTime() === targetDate.getTime();
      });
    }
    
    if (dietPlanId) {
      userMeals = userMeals.filter(meal => meal.dietPlanId === dietPlanId);
    }
    
    return userMeals;
  }

  async getMeal(id: number): Promise<Meal | undefined> {
    return this.meals.get(id);
  }

  async getMealsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Meal[]> {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    return Array.from(this.meals.values()).filter(meal => {
      const mealDate = new Date(meal.date);
      return meal.userId === userId && mealDate >= start && mealDate <= end;
    });
  }

  async createMeal(meal: InsertMeal): Promise<Meal> {
    const id = this.mealId++;
    const newMeal: Meal = { ...meal, id };
    this.meals.set(id, newMeal);
    return newMeal;
  }

  async updateMeal(id: number, meal: Partial<InsertMeal>): Promise<Meal | undefined> {
    const existingMeal = this.meals.get(id);
    if (!existingMeal) return undefined;
    
    const updatedMeal: Meal = { ...existingMeal, ...meal };
    this.meals.set(id, updatedMeal);
    return updatedMeal;
  }

  async deleteMeal(id: number): Promise<boolean> {
    return this.meals.delete(id);
  }

  // Progress methods
  async getProgressEntries(userId: number): Promise<ProgressEntry[]> {
    return Array.from(this.progressEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime());
  }

  async getProgressEntry(id: number): Promise<ProgressEntry | undefined> {
    return this.progressEntries.get(id);
  }

  async getLatestProgressEntry(userId: number): Promise<ProgressEntry | undefined> {
    return Array.from(this.progressEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime())[0];
  }

  async createProgressEntry(entry: InsertProgressEntry): Promise<ProgressEntry> {
    const id = this.progressEntryId++;
    const newEntry: ProgressEntry = { ...entry, id };
    this.progressEntries.set(id, newEntry);
    return newEntry;
  }

  async updateProgressEntry(id: number, entry: Partial<InsertProgressEntry>): Promise<ProgressEntry | undefined> {
    const existingEntry = this.progressEntries.get(id);
    if (!existingEntry) return undefined;
    
    const updatedEntry: ProgressEntry = { ...existingEntry, ...entry };
    this.progressEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteProgressEntry(id: number): Promise<boolean> {
    return this.progressEntries.delete(id);
  }

  // Water intake methods
  async getWaterIntakes(userId: number, date?: Date): Promise<WaterIntake[]> {
    let userIntakes = Array.from(this.waterIntakes.values()).filter(intake => intake.userId === userId);
    
    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      
      userIntakes = userIntakes.filter(intake => {
        const intakeDate = new Date(intake.date);
        intakeDate.setHours(0, 0, 0, 0);
        return intakeDate.getTime() === targetDate.getTime();
      });
    }
    
    return userIntakes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getWaterIntakeForDate(userId: number, date: Date): Promise<WaterIntake | undefined> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return Array.from(this.waterIntakes.values()).find(intake => {
      const intakeDate = new Date(intake.date);
      intakeDate.setHours(0, 0, 0, 0);
      return intake.userId === userId && intakeDate.getTime() === targetDate.getTime();
    });
  }

  async createWaterIntake(intake: InsertWaterIntake): Promise<WaterIntake> {
    const id = this.waterIntakeId++;
    const createdAt = new Date();
    const newIntake: WaterIntake = { ...intake, id, createdAt };
    this.waterIntakes.set(id, newIntake);
    return newIntake;
  }

  async updateWaterIntake(id: number, intake: Partial<InsertWaterIntake>): Promise<WaterIntake | undefined> {
    const existingIntake = this.waterIntakes.get(id);
    if (!existingIntake) return undefined;
    
    const updatedIntake: WaterIntake = { ...existingIntake, ...intake };
    this.waterIntakes.set(id, updatedIntake);
    return updatedIntake;
  }

  async deleteWaterIntake(id: number): Promise<boolean> {
    return this.waterIntakes.delete(id);
  }

  // Initialize with sample data
  private async initSampleData() {
    // Create a sample user
    const user = await this.createUser({
      username: "alexfitness",
      password: "password123",
      name: "Alex",
      email: "alex@example.com"
    });

    // Create exercise categories
    const chestCategory = await this.createExerciseCategory({ name: "Chest" });
    const backCategory = await this.createExerciseCategory({ name: "Back" });
    const legsCategory = await this.createExerciseCategory({ name: "Legs" });
    const shouldersCategory = await this.createExerciseCategory({ name: "Shoulders" });
    const armsCategory = await this.createExerciseCategory({ name: "Arms" });
    const coreCategory = await this.createExerciseCategory({ name: "Core" });
    const cardioCategory = await this.createExerciseCategory({ name: "Cardio" });

    // Create sample exercises
    const benchPress = await this.createExercise({
      name: "Bench Press",
      description: "A compound exercise that works your chest, shoulders, and triceps.",
      categoryId: chestCategory.id,
      difficulty: "intermediate",
      muscleGroups: ["chest", "shoulders", "triceps"],
      instructions: "Lie on a flat bench, grip the barbell with hands slightly wider than shoulder-width apart, lower the bar to your chest, then push it back up.",
      imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg"
    });

    const squat = await this.createExercise({
      name: "Barbell Squat",
      description: "A fundamental compound exercise that targets your quadriceps, hamstrings, and glutes.",
      categoryId: legsCategory.id,
      difficulty: "intermediate",
      muscleGroups: ["quadriceps", "hamstrings", "glutes"],
      instructions: "Stand with feet shoulder-width apart, barbell across upper back, squat down until thighs are parallel to ground, then stand back up.",
      imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      videoUrl: "https://www.youtube.com/embed/bEv6CCg2BC8"
    });

    const pullUp = await this.createExercise({
      name: "Pull-ups",
      description: "An upper body compound exercise that targets your back, biceps, and shoulders.",
      categoryId: backCategory.id,
      difficulty: "intermediate",
      muscleGroups: ["back", "biceps", "shoulders"],
      instructions: "Hang from a pull-up bar with palms facing away from you, pull your body up until your chin is above the bar, then lower back down.",
      imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
      videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g"
    });
    
    // Add more exercises
    
    // Shoulders exercise
    await this.createExercise({
      name: "Overhead Press",
      description: "A compound movement that targets the shoulders, triceps, and upper chest.",
      categoryId: shouldersCategory.id,
      difficulty: "intermediate",
      muscleGroups: ["shoulders", "triceps", "upper chest"],
      instructions: "Stand with feet shoulder-width apart, hold barbell at shoulder height, press the weight overhead until arms are fully extended, then lower back to starting position.",
      imageUrl: "https://images.unsplash.com/photo-1576678927484-cc907957088c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1169&q=80",
      videoUrl: "https://www.youtube.com/embed/2yjwXTZQDDI"
    });
    
    // Arms exercise - Biceps
    await this.createExercise({
      name: "Dumbbell Bicep Curl",
      description: "An isolation exercise targeting the biceps.",
      categoryId: armsCategory.id,
      difficulty: "beginner",
      muscleGroups: ["biceps", "forearms"],
      instructions: "Stand with dumbbells in each hand, palms facing forward, curl the weights toward your shoulders, then lower back down with control.",
      imageUrl: "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?ixlib=rb-1.2.1&auto=format&fit=crop&w=1172&q=80",
      videoUrl: "https://www.youtube.com/embed/ykJmrZ5v0Oo"
    });
    
    // Arms exercise - Triceps
    await this.createExercise({
      name: "Tricep Dips",
      description: "An effective exercise for targeting the triceps.",
      categoryId: armsCategory.id,
      difficulty: "beginner",
      muscleGroups: ["triceps", "shoulders"],
      instructions: "Sit on a bench or chair, place hands next to hips, slide forward off the bench, lower body by bending elbows, then push back up.",
      imageUrl: "https://images.unsplash.com/photo-1619159884726-afb468b28c6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1169&q=80",
      videoUrl: "https://www.youtube.com/embed/0326dy_-CzM"
    });
    
    // Core exercise
    await this.createExercise({
      name: "Plank",
      description: "A static exercise that strengthens the core, shoulders, arms, and glutes.",
      categoryId: coreCategory.id,
      difficulty: "beginner",
      muscleGroups: ["abs", "lower back", "shoulders"],
      instructions: "Start in a push-up position with arms straight or on forearms, keep your body in a straight line from head to heels, engage your core, and hold the position.",
      imageUrl: "https://images.unsplash.com/photo-1566241142559-40891854c3b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
      videoUrl: "https://www.youtube.com/embed/pSHjTRCQxIw"
    });
    
    // Another core exercise
    await this.createExercise({
      name: "Russian Twist",
      description: "A dynamic exercise that works the abdominals with rotation.",
      categoryId: coreCategory.id,
      difficulty: "intermediate",
      muscleGroups: ["abs", "obliques"],
      instructions: "Sit on the floor with knees bent, lean back slightly, lift feet off floor if possible, clasp hands together and twist from side to side.",
      imageUrl: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      videoUrl: "https://www.youtube.com/embed/wkD8rjkodUI"
    });
    
    // Cardio exercise
    await this.createExercise({
      name: "Burpees",
      description: "A full-body exercise that combines a squat, push-up, and jump.",
      categoryId: cardioCategory.id,
      difficulty: "advanced",
      muscleGroups: ["full body"],
      instructions: "Start standing, drop into a squat position and place hands on ground, kick feet back into a plank, perform a push-up, jump feet back to squat position, and explosively jump up with arms extended overhead.",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    });
    
    // Another cardio exercise
    await this.createExercise({
      name: "Mountain Climbers",
      description: "A dynamic exercise that increases heart rate and works the core, shoulders, and legs.",
      categoryId: cardioCategory.id,
      difficulty: "intermediate",
      muscleGroups: ["core", "shoulders", "legs"],
      instructions: "Start in a plank position, bring one knee toward chest, then quickly switch legs in a running motion.",
      imageUrl: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1025&q=80",
      videoUrl: "https://www.youtube.com/embed/nmwgirgXLYM"
    });
    
    // Another legs exercise
    await this.createExercise({
      name: "Lunges",
      description: "A unilateral exercise that works the quadriceps, hamstrings, and glutes.",
      categoryId: legsCategory.id,
      difficulty: "beginner",
      muscleGroups: ["quadriceps", "hamstrings", "glutes"],
      instructions: "Stand with feet hip-width apart, step forward with one leg, lower body until both knees are bent at 90 degrees, push back to starting position, and repeat with the other leg.",
      imageUrl: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
      videoUrl: "https://www.youtube.com/embed/QOVaHwm-Q6U"
    });
    
    // Another chest exercise
    await this.createExercise({
      name: "Push-ups",
      description: "A bodyweight exercise that works the chest, shoulders, and triceps.",
      categoryId: chestCategory.id,
      difficulty: "beginner",
      muscleGroups: ["chest", "shoulders", "triceps"],
      instructions: "Start in a plank position with hands slightly wider than shoulder-width apart, lower your body by bending your elbows, then push back up.",
      imageUrl: "https://images.unsplash.com/photo-1598971457999-ca4ef48a42e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1176&q=80",
      videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4"
    });
    
    // Another back exercise
    await this.createExercise({
      name: "Bent Over Row",
      description: "A compound exercise that targets the back, biceps, and shoulders.",
      categoryId: backCategory.id,
      difficulty: "intermediate",
      muscleGroups: ["back", "biceps", "shoulders"],
      instructions: "Stand with feet shoulder-width apart, bend at hips until torso is nearly parallel to floor, hold a barbell or dumbbells with arms extended, then pull the weight toward your lower ribcage before lowering it back down.",
      imageUrl: "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
      videoUrl: "https://www.youtube.com/embed/FWJR5ve8vO8"
    });

    // Create a workout plan
    const strengthPlan = await this.createWorkoutPlan({
      userId: user.id,
      name: "Strength Building",
      description: "4-week plan focusing on building strength through compound movements.",
      status: "active",
      durationWeeks: 4,
      workoutsPerWeek: 5,
      focus: "Strength"
    });

    const hiitPlan = await this.createWorkoutPlan({
      userId: user.id,
      name: "HIIT Fat Loss",
      description: "6-week high intensity interval training plan for maximum fat loss.",
      status: "scheduled",
      durationWeeks: 6,
      workoutsPerWeek: 4,
      focus: "Cardio, Fat Loss"
    });

    // Create a few workouts
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const friday = new Date(today);
    const dayOfWeek = friday.getDay();
    const daysToFriday = (dayOfWeek <= 5) ? (5 - dayOfWeek) : (5 + 7 - dayOfWeek);
    friday.setDate(friday.getDate() + daysToFriday);

    // Past workouts (completed)
    const upperBodyWorkout = await this.createWorkout({
      userId: user.id,
      planId: strengthPlan.id,
      name: "Upper Body Focus",
      description: "Focus on chest, back, and arms",
      status: "completed",
      scheduledDate: yesterday,
      completedDate: yesterday,
      duration: 45,
      notes: "Felt strong today!"
    });

    const hiitWorkout = await this.createWorkout({
      userId: user.id,
      planId: strengthPlan.id,
      name: "HIIT Cardio",
      description: "High intensity cardio session",
      status: "completed",
      scheduledDate: threeDaysAgo,
      completedDate: threeDaysAgo,
      duration: 30,
      notes: "Really pushed myself!"
    });

    const legWorkout = await this.createWorkout({
      userId: user.id,
      planId: strengthPlan.id,
      name: "Leg Day",
      description: "Focus on squats and deadlifts",
      status: "completed",
      scheduledDate: fiveDaysAgo,
      completedDate: fiveDaysAgo,
      duration: 50,
      notes: "Legs are sore but it was worth it"
    });

    // Future workouts (scheduled)
    const fullBodyWorkout = await this.createWorkout({
      userId: user.id,
      planId: strengthPlan.id,
      name: "Full Body Strength",
      description: "Full body workout focusing on compound movements",
      status: "scheduled",
      scheduledDate: tomorrow,
      completedDate: undefined,
      duration: undefined,
      notes: ""
    });

    const cardioWorkout = await this.createWorkout({
      userId: user.id,
      planId: strengthPlan.id,
      name: "Cardio Session",
      description: "Running and bodyweight exercises",
      status: "scheduled",
      scheduledDate: friday,
      completedDate: undefined,
      duration: undefined,
      notes: ""
    });

    // Add exercises to workouts
    await this.createWorkoutExercise({
      workoutId: upperBodyWorkout.id,
      exerciseId: benchPress.id,
      sets: 4,
      reps: 10,
      weight: 135,
      duration: undefined,
      notes: "Increase weight next time",
      order: 1
    });

    await this.createWorkoutExercise({
      workoutId: upperBodyWorkout.id,
      exerciseId: pullUp.id,
      sets: 3,
      reps: 8,
      weight: undefined,
      duration: undefined,
      notes: "Used assisted pull-up machine",
      order: 2
    });

    await this.createWorkoutExercise({
      workoutId: legWorkout.id,
      exerciseId: squat.id,
      sets: 5,
      reps: 8,
      weight: 185,
      duration: undefined,
      notes: "Focused on form",
      order: 1
    });

    // Create a diet plan
    const dietPlan = await this.createDietPlan({
      userId: user.id,
      name: "Strength Building Diet",
      description: "High protein, moderate carbs, tailored for strength building.",
      status: "active",
      dailyCalories: 2200,
      proteinPercentage: 33,
      carbsPercentage: 40,
      fatPercentage: 27
    });

    // Create some meals
    const today2 = new Date();
    
    const breakfast = await this.createMeal({
      userId: user.id,
      dietPlanId: dietPlan.id,
      name: "Oatmeal with Protein and Mixed Berries",
      mealType: "breakfast",
      calories: 380,
      protein: 25,
      carbs: 45,
      fat: 8,
      imageUrl: "https://images.unsplash.com/photo-1607245004983-16468f9a3231?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
      recipe: "1/2 cup rolled oats, 1 scoop protein powder, 1/2 cup mixed berries, 1 tbsp honey, 1 cup almond milk",
      ingredients: "Rolled oats, protein powder, mixed berries, honey, almond milk",
      date: today2,
      time: "07:30",
      notes: "Quick and easy breakfast with a good balance of protein and carbs for energy",
      completed: true
    });

    const lunch = await this.createMeal({
      userId: user.id,
      dietPlanId: dietPlan.id,
      name: "Grilled Chicken Salad with Avocado",
      mealType: "lunch",
      calories: 520,
      protein: 35,
      carbs: 20,
      fat: 22,
      imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      recipe: "6oz grilled chicken breast, mixed greens, 1/2 avocado, cherry tomatoes, cucumber, red onion, 2 tbsp olive oil dressing",
      ingredients: "Chicken breast, mixed greens, avocado, cherry tomatoes, cucumber, red onion, olive oil",
      date: today2,
      time: "13:00",
      notes: "High protein lunch with healthy fats from avocado. Good for muscle recovery.",
      completed: false
    });
    
    // Add a dinner meal
    const dinner = await this.createMeal({
      userId: user.id,
      dietPlanId: dietPlan.id,
      name: "Baked Salmon with Roasted Vegetables",
      mealType: "dinner",
      calories: 650,
      protein: 40,
      carbs: 35,
      fat: 28,
      imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      recipe: "6oz salmon fillet, 1 cup brussels sprouts, 1 cup sweet potato, 2 tbsp olive oil, herbs and spices",
      ingredients: "Salmon, brussels sprouts, sweet potato, olive oil, garlic, lemon, thyme",
      date: today2,
      time: "19:00",
      notes: "Rich in omega-3 fatty acids and micronutrients. Good balance of protein and healthy carbs.",
      completed: false
    });

    // Create some progress entries
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    await this.createProgressEntry({
      userId: user.id,
      date: oneMonthAgo,
      weight: 180,
      bodyFat: 16.5,
      measurements: {
        chest: 41.5,
        waist: 34,
        arms: 15.25,
        thighs: 22.5
      },
      notes: "Starting measurements"
    });

    await this.createProgressEntry({
      userId: user.id,
      date: twoWeeksAgo,
      weight: 178,
      bodyFat: 16.0,
      measurements: {
        chest: 41.75,
        waist: 33.5,
        arms: 15.25,
        thighs: 22.75
      },
      notes: "Making progress!"
    });

    await this.createProgressEntry({
      userId: user.id,
      date: oneWeekAgo,
      weight: 176.5,
      bodyFat: 15.5,
      measurements: {
        chest: 42,
        waist: 33.5,
        arms: 15.5,
        thighs: 23
      },
      notes: "Feeling stronger!"
    });

    await this.createProgressEntry({
      userId: user.id,
      date: today,
      weight: 175,
      bodyFat: 15.2,
      measurements: {
        chest: 42,
        waist: 33,
        arms: 15.5,
        thighs: 23
      },
      notes: "Continuing to make progress"
    });

    // Add water intake data
    const previousWaterToday = new Date(today);
    previousWaterToday.setDate(today.getDate() - 1);
    
    const previousWaterYesterday = new Date(today);
    previousWaterYesterday.setDate(today.getDate() - 2);
    
    const previousWaterThreeDaysAgo = new Date(today);
    previousWaterThreeDaysAgo.setDate(today.getDate() - 3);

    // Today's water intake (sample data)
    await this.createWaterIntake({
      userId: user.id,
      date: today,
      amount: 2400 // in milliliters (2.4 liters)
    });

    // Yesterday's water intake
    await this.createWaterIntake({
      userId: user.id,
      date: previousWaterToday,
      amount: 2200 // in milliliters (2.2 liters)
    });

    // Day before yesterday
    await this.createWaterIntake({
      userId: user.id,
      date: previousWaterYesterday,
      amount: 1800 // in milliliters (1.8 liters)
    });

    // Three days ago
    await this.createWaterIntake({
      userId: user.id,
      date: previousWaterThreeDaysAgo,
      amount: 2000 // in milliliters (2.0 liters)
    });
  }
}

// DatabaseStorage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    console.log('Initializing DatabaseStorage...');
    
    // Initialize PostgreSQL session store
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({ 
      pool: pool,
      createTableIfMissing: true
    });
    
    this.initDatabase();
  }

  private async initDatabase() {
    try {
      // Create tables if they don't exist
      console.log('Initializing database...');
      
      // Check if we need to seed the database
      const existingUsers = await db.select().from(users);
      
      // Let's also check water intakes specifically
      const existingWaterIntakes = await db.select().from(waterIntakes);
      console.log(`Found ${existingUsers.length} users and ${existingWaterIntakes.length} water intakes`);
      
      // Force reseeding if water intakes are empty
      const forceReseed = existingWaterIntakes.length === 0;
      
      if (existingUsers.length === 0 || forceReseed) {
        // If we're reseeding and have data, let's clean it up first to avoid duplicates
        if (forceReseed && existingUsers.length > 0) {
          console.log('Cleaning up existing data for reseeding...');
          // Delete existing data from all tables except users
          await db.delete(waterIntakes);
          await db.delete(workoutExercises);
          await db.delete(workouts);
          await db.delete(workoutPlans);
          await db.delete(progressEntries);
          await db.delete(meals);
          await db.delete(dietPlans);
          await db.delete(exercises);
          await db.delete(exerciseCategories);
        }
        
        console.log('Seeding database with initial data...');
        await this.seedSampleData();
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }
  
  private async seedSampleData() {
    try {
      // Check if the user already exists
      let user = await this.getUserByUsername("alexfitness");
      
      // If not, create a new user
      if (!user) {
        user = await this.createUser({
          username: "alexfitness",
          password: "password123",
          name: "Alex",
          email: "alex@example.com"
        });
        console.log('Created new user with ID:', user.id);
      } else {
        console.log('Using existing user with ID:', user.id);
      }

      // Create exercise categories
      const chestCategory = await this.createExerciseCategory({ name: "Chest" });
      const backCategory = await this.createExerciseCategory({ name: "Back" });
      const legsCategory = await this.createExerciseCategory({ name: "Legs" });
      const shouldersCategory = await this.createExerciseCategory({ name: "Shoulders" });
      const armsCategory = await this.createExerciseCategory({ name: "Arms" });
      const coreCategory = await this.createExerciseCategory({ name: "Core" });
      const cardioCategory = await this.createExerciseCategory({ name: "Cardio" });

      // Create sample exercises
      const benchPress = await this.createExercise({
        name: "Bench Press",
        description: "A compound exercise that works your chest, shoulders, and triceps.",
        categoryId: chestCategory.id,
        difficulty: "intermediate",
        muscleGroups: ["chest", "shoulders", "triceps"],
        instructions: "Lie on a flat bench, grip the barbell with hands slightly wider than shoulder-width apart, lower the bar to your chest, then push it back up.",
        imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg",
        caloriesBurnedPerMinute: 8,
        equipment: "Barbell, Bench",
        recommendedWeightRanges: null
      });

      const squat = await this.createExercise({
        name: "Barbell Squat",
        description: "A fundamental compound exercise that targets your quadriceps, hamstrings, and glutes.",
        categoryId: legsCategory.id,
        difficulty: "intermediate",
        muscleGroups: ["quadriceps", "hamstrings", "glutes"],
        instructions: "Stand with feet shoulder-width apart, barbell across upper back, squat down until thighs are parallel to ground, then stand back up.",
        imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        videoUrl: "https://www.youtube.com/embed/bEv6CCg2BC8",
        caloriesBurnedPerMinute: 10,
        equipment: "Barbell, Squat Rack",
        recommendedWeightRanges: null
      });

      const pullUp = await this.createExercise({
        name: "Pull-ups",
        description: "An upper body compound exercise that targets your back, biceps, and shoulders.",
        categoryId: backCategory.id,
        difficulty: "intermediate",
        muscleGroups: ["back", "biceps", "shoulders"],
        instructions: "Hang from a pull-up bar with palms facing away from you, pull your body up until your chin is above the bar, then lower back down.",
        imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
        videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g",
        caloriesBurnedPerMinute: 9,
        equipment: "Pull-up Bar",
        recommendedWeightRanges: null
      });

      // Create a workout plan
      const today = new Date();
      const strengthPlan = await this.createWorkoutPlan({
        userId: user.id,
        name: "Strength Building",
        description: "4-week plan focusing on building strength through compound movements.",
        status: "active",
        durationWeeks: 4,
        workoutsPerWeek: 5,
        focus: "Strength"
      });

      // Create a few workouts
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Past workout (completed)
      const upperBodyWorkout = await this.createWorkout({
        userId: user.id,
        planId: strengthPlan.id,
        name: "Upper Body Focus",
        description: "Focus on chest, back, and arms",
        status: "completed",
        scheduledDate: yesterday.toISOString().split('T')[0],
        completedDate: yesterday.toISOString().split('T')[0],
        duration: 45,
        notes: "Felt strong today!"
      });

      // Future workout (scheduled)
      const fullBodyWorkout = await this.createWorkout({
        userId: user.id,
        planId: strengthPlan.id,
        name: "Full Body Strength",
        description: "Full body workout focusing on compound movements",
        status: "scheduled",
        scheduledDate: tomorrow.toISOString().split('T')[0],
        completedDate: null,
        duration: null,
        notes: null
      });

      // Add exercises to workouts
      await this.createWorkoutExercise({
        workoutId: upperBodyWorkout.id,
        exerciseId: benchPress.id,
        sets: 4,
        reps: 10,
        weight: 135,
        duration: null,
        notes: "Increase weight next time",
        order: 1
      });

      await this.createWorkoutExercise({
        workoutId: upperBodyWorkout.id,
        exerciseId: pullUp.id,
        sets: 3,
        reps: 8,
        weight: null,
        duration: null,
        notes: "Used assisted pull-up machine",
        order: 2
      });

      // Create progress entries
      const oneMonthAgo = new Date(today);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      await this.createProgressEntry({
        userId: user.id,
        date: oneMonthAgo.toISOString().split('T')[0],
        weight: 180,
        bodyFat: 16.5,
        measurements: {
          chest: 41.5,
          waist: 34,
          arms: 15.25,
          thighs: 22.5
        },
        notes: "Starting measurements"
      });

      await this.createProgressEntry({
        userId: user.id,
        date: today.toISOString().split('T')[0],
        weight: 175,
        bodyFat: 15.2,
        measurements: {
          chest: 42,
          waist: 33,
          arms: 15.5,
          thighs: 23
        },
        notes: "Continuing to make progress"
      });

      // Add water intake data
      const previousWaterToday = new Date(today);
      previousWaterToday.setDate(today.getDate() - 1);
      
      const previousWaterYesterday = new Date(today);
      previousWaterYesterday.setDate(today.getDate() - 2);
      
      const previousWaterThreeDaysAgo = new Date(today);
      previousWaterThreeDaysAgo.setDate(today.getDate() - 3);
      
      // Today's water intake
      await this.createWaterIntake({
        userId: user.id,
        date: today.toISOString().split('T')[0],
        amount: 2400 // in milliliters (2.4 liters)
      });

      // Yesterday's water intake
      await this.createWaterIntake({
        userId: user.id,
        date: previousWaterToday.toISOString().split('T')[0],
        amount: 2200 // in milliliters (2.2 liters)
      });
      
      // Day before yesterday
      await this.createWaterIntake({
        userId: user.id,
        date: previousWaterYesterday.toISOString().split('T')[0],
        amount: 1800 // in milliliters (1.8 liters)
      });

      // Three days ago
      await this.createWaterIntake({
        userId: user.id,
        date: previousWaterThreeDaysAgo.toISOString().split('T')[0],
        amount: 2000 // in milliliters (2.0 liters)
      });

      console.log('Database seeded successfully');
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Exercise category methods
  async getExerciseCategories(): Promise<ExerciseCategory[]> {
    return db.select().from(exerciseCategories);
  }

  async getExerciseCategory(id: number): Promise<ExerciseCategory | undefined> {
    const [category] = await db
      .select()
      .from(exerciseCategories)
      .where(eq(exerciseCategories.id, id));
    return category;
  }

  async createExerciseCategory(category: InsertExerciseCategory): Promise<ExerciseCategory> {
    const [newCategory] = await db
      .insert(exerciseCategories)
      .values(category)
      .returning();
    return newCategory;
  }

  // Exercise methods
  async getExercises(query?: string, categoryId?: number): Promise<Exercise[]> {
    let baseQuery = db.select().from(exercises);
    
    if (query) {
      baseQuery = baseQuery.where(
        like(exercises.name, `%${query}%`)
      );
    }
    
    if (categoryId) {
      baseQuery = baseQuery.where(eq(exercises.categoryId, categoryId));
    }
    
    return baseQuery;
  }

  async getExercise(id: number): Promise<Exercise | undefined> {
    const [exercise] = await db
      .select()
      .from(exercises)
      .where(eq(exercises.id, id));
    return exercise;
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const [newExercise] = await db
      .insert(exercises)
      .values(exercise)
      .returning();
    return newExercise;
  }

  // Workout plan methods
  async getWorkoutPlans(userId: number): Promise<WorkoutPlan[]> {
    return db
      .select()
      .from(workoutPlans)
      .where(eq(workoutPlans.userId, userId));
  }

  async getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined> {
    const [plan] = await db
      .select()
      .from(workoutPlans)
      .where(eq(workoutPlans.id, id));
    return plan;
  }

  async createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan> {
    const [newPlan] = await db
      .insert(workoutPlans)
      .values(plan)
      .returning();
    
    // If this is an active plan, set other plans to inactive
    if (plan.status === 'active') {
      await db
        .update(workoutPlans)
        .set({ status: 'inactive' })
        .where(
          and(
            eq(workoutPlans.userId, plan.userId),
            eq(workoutPlans.status, 'active'),
            not(eq(workoutPlans.id, newPlan.id))
          )
        );
    }
    
    return newPlan;
  }

  async updateWorkoutPlan(id: number, plan: Partial<InsertWorkoutPlan>): Promise<WorkoutPlan | undefined> {
    const [updatedPlan] = await db
      .update(workoutPlans)
      .set(plan)
      .where(eq(workoutPlans.id, id))
      .returning();
    
    // If this plan was set to active, set other plans to inactive
    if (plan.status === 'active' && updatedPlan) {
      await db
        .update(workoutPlans)
        .set({ status: 'inactive' })
        .where(
          and(
            eq(workoutPlans.userId, updatedPlan.userId),
            eq(workoutPlans.status, 'active'),
            not(eq(workoutPlans.id, id))
          )
        );
    }
    
    return updatedPlan;
  }

  async deleteWorkoutPlan(id: number): Promise<boolean> {
    const result = await db
      .delete(workoutPlans)
      .where(eq(workoutPlans.id, id));
    return result.rowCount > 0;
  }

  // Workout methods
  async getWorkouts(userId: number, planId?: number): Promise<Workout[]> {
    let query = db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, userId));
    
    if (planId) {
      query = query.where(eq(workouts.planId, planId));
    }
    
    return query;
  }

  async getWorkout(id: number): Promise<Workout | undefined> {
    const [workout] = await db
      .select()
      .from(workouts)
      .where(eq(workouts.id, id));
    return workout;
  }

  async getRecentWorkouts(userId: number, limit: number): Promise<Workout[]> {
    return db
      .select()
      .from(workouts)
      .where(
        and(
          eq(workouts.userId, userId),
          eq(workouts.status, 'completed')
        )
      )
      .orderBy(desc(workouts.completedDate))
      .limit(limit);
  }

  async getUpcomingWorkouts(userId: number, limit: number): Promise<Workout[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return db
      .select()
      .from(workouts)
      .where(
        and(
          eq(workouts.userId, userId),
          eq(workouts.status, 'scheduled'),
          gte(workouts.scheduledDate, today.toISOString().split('T')[0])
        )
      )
      .orderBy(workouts.scheduledDate)
      .limit(limit);
  }

  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    const [newWorkout] = await db
      .insert(workouts)
      .values(workout)
      .returning();
    return newWorkout;
  }

  async updateWorkout(id: number, workout: Partial<InsertWorkout>): Promise<Workout | undefined> {
    const [updatedWorkout] = await db
      .update(workouts)
      .set(workout)
      .where(eq(workouts.id, id))
      .returning();
    return updatedWorkout;
  }

  async deleteWorkout(id: number): Promise<boolean> {
    const result = await db
      .delete(workouts)
      .where(eq(workouts.id, id));
    return result.rowCount > 0;
  }

  // Workout exercise methods
  async getWorkoutExercises(workoutId: number): Promise<WorkoutExercise[]> {
    return db
      .select()
      .from(workoutExercises)
      .where(eq(workoutExercises.workoutId, workoutId))
      .orderBy(workoutExercises.order);
  }

  async createWorkoutExercise(workoutExercise: InsertWorkoutExercise): Promise<WorkoutExercise> {
    const [newWorkoutExercise] = await db
      .insert(workoutExercises)
      .values(workoutExercise)
      .returning();
    return newWorkoutExercise;
  }

  async updateWorkoutExercise(id: number, workoutExercise: Partial<InsertWorkoutExercise>): Promise<WorkoutExercise | undefined> {
    const [updatedWorkoutExercise] = await db
      .update(workoutExercises)
      .set(workoutExercise)
      .where(eq(workoutExercises.id, id))
      .returning();
    return updatedWorkoutExercise;
  }

  async deleteWorkoutExercise(id: number): Promise<boolean> {
    const result = await db
      .delete(workoutExercises)
      .where(eq(workoutExercises.id, id));
    return result.rowCount > 0;
  }

  // Diet plan methods
  async getDietPlans(userId: number): Promise<DietPlan[]> {
    return db
      .select()
      .from(dietPlans)
      .where(eq(dietPlans.userId, userId));
  }

  async getDietPlan(id: number): Promise<DietPlan | undefined> {
    const [plan] = await db
      .select()
      .from(dietPlans)
      .where(eq(dietPlans.id, id));
    return plan;
  }

  async getActiveDietPlan(userId: number): Promise<DietPlan | undefined> {
    const [plan] = await db
      .select()
      .from(dietPlans)
      .where(
        and(
          eq(dietPlans.userId, userId),
          eq(dietPlans.status, 'active')
        )
      );
    return plan;
  }

  async createDietPlan(plan: InsertDietPlan): Promise<DietPlan> {
    const [newPlan] = await db
      .insert(dietPlans)
      .values(plan)
      .returning();
    
    // If this is an active plan, set other plans to inactive
    if (plan.status === 'active') {
      await db
        .update(dietPlans)
        .set({ status: 'inactive' })
        .where(
          and(
            eq(dietPlans.userId, plan.userId),
            eq(dietPlans.status, 'active'),
            not(eq(dietPlans.id, newPlan.id))
          )
        );
    }
    
    return newPlan;
  }

  async updateDietPlan(id: number, plan: Partial<InsertDietPlan>): Promise<DietPlan | undefined> {
    const [updatedPlan] = await db
      .update(dietPlans)
      .set(plan)
      .where(eq(dietPlans.id, id))
      .returning();
    
    // If this plan was set to active, set other plans to inactive
    if (plan.status === 'active' && updatedPlan) {
      await db
        .update(dietPlans)
        .set({ status: 'inactive' })
        .where(
          and(
            eq(dietPlans.userId, updatedPlan.userId),
            eq(dietPlans.status, 'active'),
            not(eq(dietPlans.id, id))
          )
        );
    }
    
    return updatedPlan;
  }

  async deleteDietPlan(id: number): Promise<boolean> {
    const result = await db
      .delete(dietPlans)
      .where(eq(dietPlans.id, id));
    return result.rowCount > 0;
  }

  // Meal methods
  async getMeals(userId: number, date?: Date, dietPlanId?: number): Promise<Meal[]> {
    let query = db
      .select()
      .from(meals)
      .where(eq(meals.userId, userId));
    
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      query = query.where(eq(meals.date, dateStr));
    }
    
    if (dietPlanId) {
      query = query.where(eq(meals.dietPlanId, dietPlanId));
    }
    
    return query;
  }

  async getMeal(id: number): Promise<Meal | undefined> {
    const [meal] = await db
      .select()
      .from(meals)
      .where(eq(meals.id, id));
    return meal;
  }

  async getMealsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Meal[]> {
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    return db
      .select()
      .from(meals)
      .where(
        and(
          eq(meals.userId, userId),
          gte(meals.date, startDateStr),
          lte(meals.date, endDateStr)
        )
      );
  }

  async createMeal(meal: InsertMeal): Promise<Meal> {
    const [newMeal] = await db
      .insert(meals)
      .values(meal)
      .returning();
    return newMeal;
  }

  async updateMeal(id: number, meal: Partial<InsertMeal>): Promise<Meal | undefined> {
    const [updatedMeal] = await db
      .update(meals)
      .set(meal)
      .where(eq(meals.id, id))
      .returning();
    return updatedMeal;
  }

  async deleteMeal(id: number): Promise<boolean> {
    const result = await db
      .delete(meals)
      .where(eq(meals.id, id));
    return result.rowCount > 0;
  }

  // Progress methods
  async getProgressEntries(userId: number): Promise<ProgressEntry[]> {
    return db
      .select()
      .from(progressEntries)
      .where(eq(progressEntries.userId, userId))
      .orderBy(desc(progressEntries.date));
  }

  async getProgressEntry(id: number): Promise<ProgressEntry | undefined> {
    const [entry] = await db
      .select()
      .from(progressEntries)
      .where(eq(progressEntries.id, id));
    return entry;
  }

  async getLatestProgressEntry(userId: number): Promise<ProgressEntry | undefined> {
    const [entry] = await db
      .select()
      .from(progressEntries)
      .where(eq(progressEntries.userId, userId))
      .orderBy(desc(progressEntries.date))
      .limit(1);
    return entry;
  }

  async createProgressEntry(entry: InsertProgressEntry): Promise<ProgressEntry> {
    const [newEntry] = await db
      .insert(progressEntries)
      .values(entry)
      .returning();
    return newEntry;
  }

  async updateProgressEntry(id: number, entry: Partial<InsertProgressEntry>): Promise<ProgressEntry | undefined> {
    const [updatedEntry] = await db
      .update(progressEntries)
      .set(entry)
      .where(eq(progressEntries.id, id))
      .returning();
    return updatedEntry;
  }

  async deleteProgressEntry(id: number): Promise<boolean> {
    const result = await db
      .delete(progressEntries)
      .where(eq(progressEntries.id, id));
    return result.rowCount > 0;
  }

  // Water intake methods
  async getWaterIntakes(userId: number, date?: Date): Promise<WaterIntake[]> {
    let query = db
      .select()
      .from(waterIntakes)
      .where(eq(waterIntakes.userId, userId));
    
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      query = query.where(eq(waterIntakes.date, dateStr));
    }
    
    return query.orderBy(desc(waterIntakes.createdAt));
  }

  async getWaterIntakeForDate(userId: number, date: Date): Promise<WaterIntake | undefined> {
    const dateStr = date.toISOString().split('T')[0];
    
    const [intake] = await db
      .select()
      .from(waterIntakes)
      .where(
        and(
          eq(waterIntakes.userId, userId),
          eq(waterIntakes.date, dateStr)
        )
      );
    
    return intake;
  }

  async createWaterIntake(intake: InsertWaterIntake): Promise<WaterIntake> {
    console.log('Creating water intake with data:', intake);
    const [newIntake] = await db
      .insert(waterIntakes)
      .values(intake)
      .returning();
    console.log('Created water intake:', newIntake);
    return newIntake;
  }

  async updateWaterIntake(id: number, intake: Partial<InsertWaterIntake>): Promise<WaterIntake | undefined> {
    const [updatedIntake] = await db
      .update(waterIntakes)
      .set(intake)
      .where(eq(waterIntakes.id, id))
      .returning();
    return updatedIntake;
  }

  async deleteWaterIntake(id: number): Promise<boolean> {
    const result = await db
      .delete(waterIntakes)
      .where(eq(waterIntakes.id, id));
    return result.rowCount > 0;
  }
}

// Export an instance of the storage implementation
// To use in-memory storage, use: export const storage = new MemStorage();
// To use database storage, use: export const storage = new DatabaseStorage();
export const storage = new DatabaseStorage();
