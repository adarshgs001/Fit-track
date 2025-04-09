import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Exercise, ExerciseCategory } from '@shared/schema';

interface ExerciseFilters {
  query: string;
  categoryId?: number;
  difficulty?: string;
  muscleGroup?: string;
}

interface ExerciseContextType {
  exercises: Exercise[];
  categories: ExerciseCategory[];
  filters: ExerciseFilters;
  filteredExercises: Exercise[];
  isLoading: boolean;
  error: unknown;
  setFilters: (filters: Partial<ExerciseFilters>) => void;
  resetFilters: () => void;
  getExerciseById: (id: number) => Exercise | undefined;
  getExercisesByCategory: (categoryId: number) => Exercise[];
  getExercisesByMuscleGroup: (muscleGroup: string) => Exercise[];
  getExercisesByDifficulty: (difficulty: string) => Exercise[];
  getRecommendedExercises: (count?: number) => Exercise[];
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

interface ExerciseProviderProps {
  children: ReactNode;
}

export function ExerciseProvider({ children }: ExerciseProviderProps) {
  const [filters, setFiltersState] = useState<ExerciseFilters>({
    query: '',
    categoryId: undefined,
    difficulty: undefined,
    muscleGroup: undefined,
  });
  
  // Fetch all exercises
  const { 
    data: exercises = [], 
    isLoading: isExercisesLoading, 
    error: exercisesError 
  } = useQuery<Exercise[]>({
    queryKey: ['/api/exercises'],
    staleTime: 3600000, // 1 hour
  });
  
  // Fetch exercise categories
  const { 
    data: categories = [], 
    isLoading: isCategoriesLoading, 
    error: categoriesError 
  } = useQuery<ExerciseCategory[]>({
    queryKey: ['/api/exercise-categories'],
    staleTime: 3600000, // 1 hour
  });
  
  // Set filters
  const setFilters = (newFilters: Partial<ExerciseFilters>) => {
    setFiltersState(prevFilters => ({
      ...prevFilters,
      ...newFilters,
    }));
  };
  
  // Reset filters
  const resetFilters = () => {
    setFiltersState({
      query: '',
      categoryId: undefined,
      difficulty: undefined,
      muscleGroup: undefined,
    });
  };
  
  // Apply filters to exercises
  const filteredExercises = exercises.filter(exercise => {
    // Filter by search query
    if (filters.query && !exercise.name.toLowerCase().includes(filters.query.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (filters.categoryId !== undefined && exercise.categoryId !== filters.categoryId) {
      return false;
    }
    
    // Filter by difficulty
    if (filters.difficulty && exercise.difficulty !== filters.difficulty) {
      return false;
    }
    
    // Filter by muscle group
    if (filters.muscleGroup && exercise.muscleGroups) {
      if (!exercise.muscleGroups.some(group => 
        group.toLowerCase() === filters.muscleGroup?.toLowerCase()
      )) {
        return false;
      }
    }
    
    return true;
  });
  
  // Get exercise by ID
  const getExerciseById = (id: number): Exercise | undefined => {
    return exercises.find(exercise => exercise.id === id);
  };
  
  // Get exercises by category
  const getExercisesByCategory = (categoryId: number): Exercise[] => {
    return exercises.filter(exercise => exercise.categoryId === categoryId);
  };
  
  // Get exercises by muscle group
  const getExercisesByMuscleGroup = (muscleGroup: string): Exercise[] => {
    return exercises.filter(exercise => 
      exercise.muscleGroups && 
      exercise.muscleGroups.some(group => 
        group.toLowerCase() === muscleGroup.toLowerCase()
      )
    );
  };
  
  // Get exercises by difficulty
  const getExercisesByDifficulty = (difficulty: string): Exercise[] => {
    return exercises.filter(exercise => exercise.difficulty === difficulty);
  };
  
  // Get recommended exercises based on a simple algorithm
  const getRecommendedExercises = (count: number = 5): Exercise[] => {
    // This is a simple recommendation algorithm
    // In a real app, you might want to consider user preferences, history, etc.
    
    // Clone and shuffle exercises array
    const shuffled = [...exercises].sort(() => 0.5 - Math.random());
    
    // Take the first 'count' exercises
    return shuffled.slice(0, count);
  };
  
  // Combine loading and error states
  const isLoading = isExercisesLoading || isCategoriesLoading;
  const error = exercisesError || categoriesError;
  
  // Context value
  const value: ExerciseContextType = {
    exercises,
    categories,
    filters,
    filteredExercises,
    isLoading,
    error,
    setFilters,
    resetFilters,
    getExerciseById,
    getExercisesByCategory,
    getExercisesByMuscleGroup,
    getExercisesByDifficulty,
    getRecommendedExercises,
  };
  
  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
}

// Custom hook to use the exercise context
export function useExercise() {
  const context = useContext(ExerciseContext);
  if (context === undefined) {
    throw new Error('useExercise must be used within an ExerciseProvider');
  }
  return context;
}