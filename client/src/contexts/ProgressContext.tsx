import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProgressEntry, InsertProgressEntry } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useUser } from './UserContext';
import { useDiet } from './DietContext';
import { useWorkout } from './WorkoutContext';

interface ProgressSummary {
  workoutsCompleted: number;
  caloriesBurned: number;
  caloriesConsumed: number;
  caloriesRemaining: number;
  weightChange: number;
  streakDays: number;
}

interface ProgressTrend {
  weightTrend: 'up' | 'down' | 'stable';
  workoutTrend: 'up' | 'down' | 'stable';
  nutritionTrend: 'up' | 'down' | 'stable';
}

// Water tracking data
interface WaterData {
  current: number; // liters
  goal: number; // liters
  percentage: number;
}

// Sleep tracking data
interface SleepData {
  day: string;
  hours: number;
  quality: number;
}

// Steps tracking data
interface StepsData {
  current: number;
  goal: number;
  percentage: number;
  trend: string;
  distance: string;
  calories: number;
  activeMinutes: number;
}

interface ProgressContextType {
  progressEntries: ProgressEntry[];
  latestProgress: ProgressEntry | null;
  isLoading: boolean;
  error: unknown;
  createProgressEntry: (entry: InsertProgressEntry) => Promise<ProgressEntry>;
  updateProgressEntry: (id: number, entry: Partial<InsertProgressEntry>) => Promise<void>;
  deleteProgressEntry: (id: number) => Promise<void>;
  getProgressSummary: () => ProgressSummary;
  getProgressTrends: () => ProgressTrend;
  calculateBMI: (weight: number, heightInCm: number) => number;
  getWeightHistory: () => { date: Date; weight: number | null }[];
  getMeasurementsHistory: (measurement: string) => { date: Date; value: number }[];
  
  // Water tracking methods
  getWaterData: () => WaterData;
  logWaterIntake: (amount: number) => void;
  
  // Sleep tracking methods
  getSleepData: () => SleepData[];
  getSleepSummary: () => { avgQuality: number; avgHours: number };
  logSleep: (hours: number, quality: number) => void;
  
  // Steps tracking methods
  getStepsData: () => StepsData;
  logSteps: (steps: number) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

interface ProgressProviderProps {
  children: ReactNode;
  userId?: number;
}

export function ProgressProvider({ children, userId = 1 }: ProgressProviderProps) {
  const queryClient = useQueryClient();
  const { userData } = useUser();
  const { getCaloriesConsumedToday } = useDiet();
  const { recentWorkouts } = useWorkout();
  
  // Fetch progress entries
  const { 
    data: progressEntries = [], 
    isLoading: isProgressLoading, 
    error: progressError 
  } = useQuery<ProgressEntry[]>({
    queryKey: [`/api/users/${userId}/progress`],
    staleTime: 60000, // 1 minute
  });
  
  // Fetch latest progress entry
  const { 
    data: latestProgress, 
    isLoading: isLatestProgressLoading 
  } = useQuery<ProgressEntry>({
    queryKey: [`/api/users/${userId}/progress/latest`],
    staleTime: 60000,
  });
  
  // Create a progress entry
  const createProgressEntryMutation = useMutation({
    mutationFn: (newEntry: InsertProgressEntry) => {
      return apiRequest<ProgressEntry>('/api/progress', {
        method: 'POST',
        body: JSON.stringify(newEntry),
      });
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/progress`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/progress/latest`] });
    },
  });
  
  // Update a progress entry
  const updateProgressEntryMutation = useMutation({
    mutationFn: ({ id, entry }: { id: number; entry: Partial<InsertProgressEntry> }) => {
      return apiRequest<void>(`/api/progress/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(entry),
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [`/api/progress/${variables.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/progress`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/progress/latest`] });
    },
  });
  
  // Delete a progress entry
  const deleteProgressEntryMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest<void>(`/api/progress/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/progress`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/progress/latest`] });
    },
  });
  
  // Helper functions that invoke the mutations
  const createProgressEntry = async (entry: InsertProgressEntry): Promise<ProgressEntry> => {
    return createProgressEntryMutation.mutateAsync(entry);
  };
  
  const updateProgressEntry = async (id: number, entry: Partial<InsertProgressEntry>): Promise<void> => {
    await updateProgressEntryMutation.mutateAsync({ id, entry });
  };
  
  const deleteProgressEntry = async (id: number): Promise<void> => {
    await deleteProgressEntryMutation.mutateAsync(id);
  };
  
  // Get progress summary
  const getProgressSummary = (): ProgressSummary => {
    // We'll use the number of completed workouts as a proxy for workouts completed
    const workoutsCompleted = recentWorkouts.filter(w => w.status === 'completed').length;
    
    // Calculate calories burned from recent workouts (assuming 300 calories per workout as a fallback)
    const caloriesBurned = workoutsCompleted * 300;
    
    // Calculate calories consumed today
    const caloriesConsumed = getCaloriesConsumedToday();
    
    // Calculate calories remaining based on daily target (assuming 2000 calories as default)
    const dailyCalorieTarget = 2000;
    const caloriesRemaining = dailyCalorieTarget - caloriesConsumed;
    
    // Calculate weight change if we have enough data
    let weightChange = 0;
    if (progressEntries.length >= 2) {
      const sortedEntries = [...progressEntries].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      const latestWeight = sortedEntries[0].weight ?? 0;
      const earliestWeight = sortedEntries[sortedEntries.length - 1].weight ?? 0;
      
      if (latestWeight && earliestWeight) {
        weightChange = latestWeight - earliestWeight;
      }
    }
    
    // Get current streak (using a placeholder value for now)
    const streakDays = workoutsCompleted > 0 ? 1 : 0;
    
    return {
      workoutsCompleted,
      caloriesBurned,
      caloriesConsumed,
      caloriesRemaining,
      weightChange,
      streakDays,
    };
  };
  
  // Calculate BMI
  const calculateBMI = (weight: number, heightInCm: number): number => {
    // BMI = weight (kg) / height (m)^2
    const heightInMeters = heightInCm / 100;
    return weight / (heightInMeters * heightInMeters);
  };
  
  // Get weight history
  const getWeightHistory = () => {
    return progressEntries
      .map(entry => ({
        date: new Date(entry.date),
        weight: entry.weight,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };
  
  // Get measurements history
  const getMeasurementsHistory = (measurement: string) => {
    return progressEntries
      .filter(entry => {
        if (!entry.measurements) return false;
        
        // Make sure measurements is an object and the measurement exists
        const measurementsObj = entry.measurements as Record<string, any>;
        return typeof measurementsObj === 'object' && 
               measurementsObj !== null && 
               measurement in measurementsObj && 
               typeof measurementsObj[measurement] === 'number';
      })
      .map(entry => {
        const measurementsObj = entry.measurements as Record<string, any>;
        return {
          date: new Date(entry.date),
          value: measurementsObj[measurement] as number,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };
  
  // Get progress trends
  const getProgressTrends = (): ProgressTrend => {
    // If we don't have enough entries, return stable
    if (progressEntries.length < 2) {
      return {
        weightTrend: 'stable',
        workoutTrend: 'stable',
        nutritionTrend: 'stable',
      };
    }
    
    // Sort entries by date, most recent first
    const sortedEntries = [...progressEntries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Get the two most recent entries
    const latest = sortedEntries[0];
    const previous = sortedEntries[1];
    
    // Calculate weight trend (handling null values)
    let weightTrend: 'up' | 'down' | 'stable' = 'stable';
    if (latest.weight !== null && previous.weight !== null) {
      if (latest.weight > previous.weight) {
        weightTrend = 'up';
      } else if (latest.weight < previous.weight) {
        weightTrend = 'down';
      }
    }
    
    // Simple workout trend (can be expanded with more logic)
    const workoutTrend = 'up'; // Placeholder
    
    // Simple nutrition trend (can be expanded with more logic)
    const nutritionTrend = 'stable'; // Placeholder
    
    return {
      weightTrend,
      workoutTrend,
      nutritionTrend,
    };
  };
  
  // Water tracking implementation
  const getWaterData = (): WaterData => {
    // Check if there's water data in the latest progress entry
    if (latestProgress?.measurements && typeof latestProgress.measurements === 'object') {
      const measurements = latestProgress.measurements as Record<string, any>;
      if (measurements.waterIntake) {
        const current = measurements.waterIntake as number;
        const goal = measurements.waterGoal as number || 2.5; // Default to 2.5L if no goal is set
        return {
          current,
          goal,
          percentage: Math.round((current / goal) * 100)
        };
      }
    }
    
    // Return default values if no data exists
    return {
      current: 0,
      goal: 2.5,
      percentage: 0
    };
  };
  
  const logWaterIntake = async (amount: number): Promise<void> => {
    if (!latestProgress) return;
    
    // Get existing water data
    const waterData = getWaterData();
    
    // Create updated measurements object with new water intake
    const updatedMeasurements = {
      ...(latestProgress.measurements as Record<string, any> || {}),
      waterIntake: waterData.current + amount,
      waterGoal: waterData.goal // Keep the existing goal
    };
    
    // Update the latest progress entry
    await updateProgressEntry(latestProgress.id, {
      measurements: updatedMeasurements
    });
  };
  
  // Sleep tracking implementation
  const getSleepData = (): SleepData[] => {
    // Get the last 7 days of sleep data from progress entries, sorted by date
    const last7Days = progressEntries
      .filter(entry => {
        if (!entry.measurements) return false;
        const measurements = entry.measurements as Record<string, any>;
        return measurements && measurements.sleepHours !== undefined;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7)
      .map(entry => {
        const measurements = entry.measurements as Record<string, any>;
        const date = new Date(entry.date);
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          hours: measurements.sleepHours as number,
          quality: measurements.sleepQuality as number || 0
        };
      })
      .reverse(); // Display oldest to newest
    
    // If we don't have 7 days of data, fill in the rest with defaults
    if (last7Days.length < 7) {
      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const missingDays = 7 - last7Days.length;
      
      // Create placeholder data for missing days
      for (let i = 0; i < missingDays; i++) {
        const dayIndex = i % 7;
        last7Days.unshift({
          day: dayNames[dayIndex],
          hours: 0,
          quality: 0
        });
      }
    }
    
    return last7Days;
  };
  
  const getSleepSummary = () => {
    const sleepData = getSleepData();
    
    // Filter out entries with zero hours (which might be placeholders)
    const validEntries = sleepData.filter(entry => entry.hours > 0);
    
    if (validEntries.length === 0) {
      return { avgQuality: 0, avgHours: 0 };
    }
    
    // Calculate average sleep quality and hours
    const avgQuality = validEntries.reduce((sum, day) => sum + day.quality, 0) / validEntries.length;
    const avgHours = validEntries.reduce((sum, day) => sum + day.hours, 0) / validEntries.length;
    
    return { 
      avgQuality, 
      avgHours 
    };
  };
  
  const logSleep = async (hours: number, quality: number): Promise<void> => {
    // Create a new progress entry for today with sleep data
    const today = new Date();
    
    // If there's already a progress entry for today, update it
    const todayEntry = progressEntries.find(entry => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getFullYear() === today.getFullYear() &&
        entryDate.getMonth() === today.getMonth() &&
        entryDate.getDate() === today.getDate()
      );
    });
    
    if (todayEntry) {
      // Update the existing entry
      const measurements = {
        ...(todayEntry.measurements as Record<string, any> || {}),
        sleepHours: hours,
        sleepQuality: quality
      };
      
      await updateProgressEntry(todayEntry.id, { measurements });
    } else {
      // Create a new entry
      await createProgressEntry({
        userId,
        date: today.toISOString(),
        measurements: {
          sleepHours: hours,
          sleepQuality: quality
        },
        weight: null,
        bodyFat: null,
        notes: null
      });
    }
  };
  
  // Steps tracking implementation
  const getStepsData = (): StepsData => {
    // Check if there's steps data in the latest progress entry
    if (latestProgress?.measurements && typeof latestProgress.measurements === 'object') {
      const measurements = latestProgress.measurements as Record<string, any>;
      if (measurements.steps) {
        const current = measurements.steps as number;
        const goal = measurements.stepsGoal as number || 10000; // Default to 10,000 steps
        
        // Calculate additional metrics based on steps
        const stepsPerMile = 2000; // Rough estimate
        const caloriesPerStep = 0.04; // Rough estimate
        
        return {
          current,
          goal,
          percentage: Math.round((current / goal) * 100),
          trend: measurements.stepsTrend as string || '+0%',
          distance: `${(current / stepsPerMile).toFixed(1)} mi`,
          calories: Math.round(current * caloriesPerStep),
          activeMinutes: Math.round(current / 100) // Rough estimate: 100 steps per active minute
        };
      }
    }
    
    // Return default values if no data exists
    return {
      current: 0,
      goal: 10000,
      percentage: 0,
      trend: '+0%',
      distance: '0.0 mi',
      calories: 0,
      activeMinutes: 0
    };
  };
  
  const logSteps = async (steps: number): Promise<void> => {
    if (!latestProgress) return;
    
    // Get existing steps data
    const stepsData = getStepsData();
    
    // Calculate trend
    const previousSteps = stepsData.current;
    const stepsDiff = steps - previousSteps;
    const trendPercentage = previousSteps > 0 
      ? Math.round((stepsDiff / previousSteps) * 100) 
      : 0;
    const trend = (trendPercentage >= 0 ? '+' : '') + trendPercentage + '%';
    
    // Create updated measurements object with new steps count
    const updatedMeasurements = {
      ...(latestProgress.measurements as Record<string, any> || {}),
      steps,
      stepsGoal: stepsData.goal, // Keep the existing goal
      stepsTrend: trend
    };
    
    // Update the latest progress entry
    await updateProgressEntry(latestProgress.id, {
      measurements: updatedMeasurements
    });
  };

  // Combine loading and error states
  const isLoading = isProgressLoading || isLatestProgressLoading;
  const error = progressError;
  
  // Context value
  const value: ProgressContextType = {
    progressEntries,
    latestProgress: latestProgress || null,
    isLoading,
    error,
    createProgressEntry,
    updateProgressEntry,
    deleteProgressEntry,
    getProgressSummary,
    getProgressTrends,
    calculateBMI,
    getWeightHistory,
    getMeasurementsHistory,
    
    // Add water tracking methods
    getWaterData,
    logWaterIntake,
    
    // Add sleep tracking methods
    getSleepData,
    getSleepSummary,
    logSleep,
    
    // Add steps tracking methods
    getStepsData,
    logSteps
  };
  
  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

// Custom hook to use the progress context
export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}