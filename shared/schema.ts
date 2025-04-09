import { pgTable, text, serial, integer, boolean, timestamp, date, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  // New profile fields
  weight: real("weight"), // in kg
  height: real("height"), // in cm
  age: integer("age"), 
  gender: text("gender"), // Male, Female, Non-binary, Prefer not to say
  fitnessGoal: text("fitness_goal"), // Weight Loss, Muscle Gain, Maintenance, Endurance, Strength, etc.
  bodyFatPercentage: real("body_fat_percentage"),
  muscleMassPercentage: real("muscle_mass_percentage"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  // Make new fields optional
  weight: true,
  height: true,
  age: true,
  gender: true,
  fitnessGoal: true,
  bodyFatPercentage: true,
  muscleMassPercentage: true,
});

// Exercise categories
export const exerciseCategories = pgTable("exercise_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const insertExerciseCategorySchema = createInsertSchema(exerciseCategories).pick({
  name: true,
});

// Exercises
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").notNull(),
  difficulty: text("difficulty").notNull(),
  muscleGroups: text("muscle_groups").array(),
  instructions: text("instructions").notNull(),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  caloriesBurnedPerMinute: integer("calories_burned_per_minute"),
  equipment: text("equipment"),
  recommendedWeightRanges: jsonb("recommended_weight_ranges"), // beginner, intermediate, advanced weight ranges
});

export const insertExerciseSchema = createInsertSchema(exercises).pick({
  name: true,
  description: true,
  categoryId: true,
  difficulty: true,
  muscleGroups: true,
  instructions: true,
  imageUrl: true,
  videoUrl: true,
  caloriesBurnedPerMinute: true,
  equipment: true,
  recommendedWeightRanges: true,
});

// Workout plans
export const workoutPlans = pgTable("workout_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("active"),
  durationWeeks: integer("duration_weeks").notNull(),
  workoutsPerWeek: integer("workouts_per_week").notNull(),
  focus: text("focus").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans).pick({
  userId: true,
  name: true,
  description: true,
  status: true,
  durationWeeks: true,
  workoutsPerWeek: true,
  focus: true,
});

// Workouts (individual sessions within a plan)
export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planId: integer("plan_id"),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("scheduled"), // scheduled, completed, missed
  scheduledDate: date("scheduled_date").notNull(),
  completedDate: date("completed_date"),
  duration: integer("duration"), // in minutes
  notes: text("notes"),
});

export const insertWorkoutSchema = createInsertSchema(workouts).pick({
  userId: true,
  planId: true,
  name: true,
  description: true,
  status: true,
  scheduledDate: true,
  completedDate: true,
  duration: true,
  notes: true,
});

// Workout exercises (joins workouts with exercises)
export const workoutExercises = pgTable("workout_exercises", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id").notNull(),
  exerciseId: integer("exercise_id").notNull(),
  sets: integer("sets").notNull(),
  reps: integer("reps").notNull(),
  weight: real("weight"), // in kg/lbs
  duration: integer("duration"), // in seconds (for timed exercises)
  notes: text("notes"),
  order: integer("order").notNull(), // sorting order in the workout
});

export const insertWorkoutExerciseSchema = createInsertSchema(workoutExercises).pick({
  workoutId: true,
  exerciseId: true,
  sets: true,
  reps: true,
  weight: true,
  duration: true,
  notes: true,
  order: true,
});

// Diet plans
export const dietPlans = pgTable("diet_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("active"), // active, inactive
  dailyCalories: integer("daily_calories").notNull(),
  proteinPercentage: integer("protein_percentage").notNull(),
  carbsPercentage: integer("carbs_percentage").notNull(),
  fatPercentage: integer("fat_percentage").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDietPlanSchema = createInsertSchema(dietPlans).pick({
  userId: true,
  name: true,
  description: true,
  status: true,
  dailyCalories: true,
  proteinPercentage: true,
  carbsPercentage: true,
  fatPercentage: true,
});

// Meals
export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  dietPlanId: integer("diet_plan_id"),
  name: text("name").notNull(),
  mealType: text("meal_type").notNull(), // breakfast, lunch, dinner, snack
  calories: integer("calories").notNull(),
  protein: real("protein").notNull(), // in grams
  carbs: real("carbs").notNull(), // in grams
  fat: real("fat").notNull(), // in grams
  imageUrl: text("image_url"),
  recipe: text("recipe"),
  ingredients: text("ingredients"),
  date: date("date").notNull(),
  time: text("time").default("12:00"), // time of day in HH:MM format
  notes: text("notes"), // any additional meal notes
  completed: boolean("completed").notNull().default(false),
});

export const insertMealSchema = createInsertSchema(meals).pick({
  userId: true,
  dietPlanId: true,
  name: true,
  mealType: true,
  calories: true,
  protein: true,
  carbs: true,
  fat: true,
  imageUrl: true,
  recipe: true,
  ingredients: true,
  date: true,
  time: true,
  notes: true,
  completed: true,
});

// Progress tracking
export const progressEntries = pgTable("progress_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: date("date").notNull(),
  weight: real("weight"), // in kg/lbs
  bodyFat: real("body_fat"), // percentage
  measurements: jsonb("measurements"), // chest, waist, arms, etc.
  notes: text("notes"),
});

export const insertProgressEntrySchema = createInsertSchema(progressEntries).pick({
  userId: true,
  date: true,
  weight: true,
  bodyFat: true,
  measurements: true,
  notes: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ExerciseCategory = typeof exerciseCategories.$inferSelect;
export type InsertExerciseCategory = z.infer<typeof insertExerciseCategorySchema>;

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;

export type WorkoutPlan = typeof workoutPlans.$inferSelect;
export type InsertWorkoutPlan = z.infer<typeof insertWorkoutPlanSchema>;

export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;

export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type InsertWorkoutExercise = z.infer<typeof insertWorkoutExerciseSchema>;

export type DietPlan = typeof dietPlans.$inferSelect;
export type InsertDietPlan = z.infer<typeof insertDietPlanSchema>;

export type Meal = typeof meals.$inferSelect;
export type InsertMeal = z.infer<typeof insertMealSchema>;

export type ProgressEntry = typeof progressEntries.$inferSelect;
export type InsertProgressEntry = z.infer<typeof insertProgressEntrySchema>;

// Water intake tracking
export const waterIntakes = pgTable("water_intakes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: date("date").notNull(),
  amount: integer("amount").notNull(), // in milliliters
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWaterIntakeSchema = createInsertSchema(waterIntakes).pick({
  userId: true,
  date: true,
  amount: true,
});

export type WaterIntake = typeof waterIntakes.$inferSelect;
export type InsertWaterIntake = z.infer<typeof insertWaterIntakeSchema>;

// Validation schemas
export const exerciseFilterSchema = z.object({
  query: z.string().optional(),
  categoryId: z.number().optional(),
  difficulty: z.string().optional(),
  muscleGroup: z.string().optional(),
});

export const workoutFilterSchema = z.object({
  status: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  planId: z.number().optional(),
});

export const mealFilterSchema = z.object({
  mealType: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  dietPlanId: z.number().optional(),
});
