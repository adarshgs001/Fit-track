import {
  User, InsertUser, users,
  Exercise, InsertExercise, exercises,
  ExerciseCategory, InsertExerciseCategory, exerciseCategories,
  WorkoutPlan, InsertWorkoutPlan, workoutPlans,
  Workout, InsertWorkout, workouts,
  WorkoutExercise, InsertWorkoutExercise, workoutExercises,
  DietPlan, InsertDietPlan, dietPlans,
  Meal, InsertMeal, meals,
  ProgressEntry, InsertProgressEntry, progressEntries
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private exerciseCategories: Map<number, ExerciseCategory>;
  private exercises: Map<number, Exercise>;
  private workoutPlans: Map<number, WorkoutPlan>;
  private workouts: Map<number, Workout>;
  private workoutExercises: Map<number, WorkoutExercise>;
  private dietPlans: Map<number, DietPlan>;
  private meals: Map<number, Meal>;
  private progressEntries: Map<number, ProgressEntry>;

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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
  }
}

export const storage = new MemStorage();
