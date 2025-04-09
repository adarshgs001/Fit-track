import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Workout, WorkoutPlan, WorkoutExercise, InsertWorkout, InsertWorkoutExercise } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface WorkoutContextType {
  workouts: Workout[];
  recentWorkouts: Workout[];
  upcomingWorkouts: Workout[];
  workoutPlans: WorkoutPlan[];
  activeWorkout?: Workout | null; // Add activeWorkout property
  isLoading: boolean;
  error: unknown;
  createWorkout: (workout: InsertWorkout) => Promise<Workout>;
  updateWorkout: (id: number, workout: Partial<InsertWorkout>) => Promise<void>;
  deleteWorkout: (id: number) => Promise<void>;
  completeWorkout: (id: number) => Promise<void>;
  addExerciseToWorkout: (workoutId: number, exerciseId: number) => Promise<WorkoutExercise>; // Updated signature
  removeExerciseFromWorkout: (id: number) => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

interface WorkoutProviderProps {
  children: ReactNode;
  userId?: number;
}

export function WorkoutProvider({ children, userId = 1 }: WorkoutProviderProps) {
  const queryClient = useQueryClient();
  
  // Fetch all workouts
  const { 
    data: workouts = [], 
    isLoading: isWorkoutsLoading, 
    error: workoutsError 
  } = useQuery<Workout[]>({
    queryKey: [`/api/users/${userId}/workouts`],
    staleTime: 60000, // 1 minute
  });
  
  // Fetch recent workouts
  const { 
    data: recentWorkouts = [], 
    isLoading: isRecentLoading, 
  } = useQuery<Workout[]>({
    queryKey: [`/api/users/${userId}/recent-workouts`],
    staleTime: 60000,
  });
  
  // Fetch upcoming workouts
  const { 
    data: upcomingWorkouts = [], 
    isLoading: isUpcomingLoading, 
  } = useQuery<Workout[]>({
    queryKey: [`/api/users/${userId}/upcoming-workouts`],
    staleTime: 60000,
  });
  
  // Fetch workout plans
  const { 
    data: workoutPlans = [], 
    isLoading: isPlansLoading, 
    error: plansError 
  } = useQuery<WorkoutPlan[]>({
    queryKey: [`/api/users/${userId}/workout-plans`],
    staleTime: 60000,
  });
  
  // Create a new workout
  const createWorkoutMutation = useMutation({
    mutationFn: (newWorkout: InsertWorkout) => {
      return apiRequest<Workout>('/api/workouts', {
        method: 'POST',
        body: JSON.stringify(newWorkout),
      });
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/workouts`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/recent-workouts`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/upcoming-workouts`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/stats`] });
    },
  });
  
  // Update a workout
  const updateWorkoutMutation = useMutation({
    mutationFn: ({ id, workout }: { id: number; workout: Partial<InsertWorkout> }) => {
      return apiRequest<void>(`/api/workouts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(workout),
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [`/api/workouts/${variables.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/workouts`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/recent-workouts`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/upcoming-workouts`] });
    },
  });
  
  // Delete a workout
  const deleteWorkoutMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest<void>(`/api/workouts/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: (_, id) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/workouts`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/recent-workouts`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/upcoming-workouts`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/stats`] });
    },
  });
  
  // Add exercise to workout
  const addExerciseMutation = useMutation({
    mutationFn: (workoutExercise: InsertWorkoutExercise) => {
      return apiRequest<WorkoutExercise>('/api/workout-exercises', {
        method: 'POST',
        body: JSON.stringify(workoutExercise),
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [`/api/workouts/${variables.workoutId}/exercises`] });
    },
  });
  
  // Remove exercise from workout
  const removeExerciseMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest<void>(`/api/workout-exercises/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      // We don't know the workout ID here, so we'll just invalidate all workout exercises
      queryClient.invalidateQueries({ queryKey: ['/api/workout-exercises'] });
    },
  });
  
  // Mark workout as completed
  const completeWorkoutMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest<void>(`/api/workouts/${id}/complete`, {
        method: 'POST',
      });
    },
    onSuccess: (_, id) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [`/api/workouts/${id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/workouts`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/recent-workouts`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/upcoming-workouts`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/stats`] });
    },
  });
  
  // Helper functions that invoke the mutations
  const createWorkout = async (workout: InsertWorkout): Promise<Workout> => {
    return createWorkoutMutation.mutateAsync(workout);
  };
  
  const updateWorkout = async (id: number, workout: Partial<InsertWorkout>): Promise<void> => {
    await updateWorkoutMutation.mutateAsync({ id, workout });
  };
  
  const deleteWorkout = async (id: number): Promise<void> => {
    await deleteWorkoutMutation.mutateAsync(id);
  };
  
  const completeWorkout = async (id: number): Promise<void> => {
    await completeWorkoutMutation.mutateAsync(id);
  };
  
  const addExerciseToWorkout = async (workoutId: number, exerciseId: number): Promise<WorkoutExercise> => {
    const workoutExercise: InsertWorkoutExercise = {
      workoutId,
      exerciseId,
      sets: 3,
      reps: 10,
      order: 1, // Adding the required 'order' property
      weight: null,
      duration: null,
      notes: null
    };
    return addExerciseMutation.mutateAsync(workoutExercise);
  };
  
  const removeExerciseFromWorkout = async (id: number): Promise<void> => {
    await removeExerciseMutation.mutateAsync(id);
  };
  
  // Combine loading and error states
  const isLoading = 
    isWorkoutsLoading || 
    isRecentLoading || 
    isUpcomingLoading || 
    isPlansLoading;
  
  const error = workoutsError || plansError;
  
  // Get active workout (use the first upcoming workout for demo purposes)
  const activeWorkout = upcomingWorkouts.length > 0 ? upcomingWorkouts[0] : null;

  // Context value
  const value: WorkoutContextType = {
    workouts,
    recentWorkouts,
    upcomingWorkouts,
    workoutPlans,
    activeWorkout,
    isLoading,
    error,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    completeWorkout,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
  };
  
  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
}

// Custom hook to use the workout context
export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}