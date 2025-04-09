import React, { ReactNode } from 'react';
import { UserProvider } from './UserContext';
import { WorkoutProvider } from './WorkoutContext';
import { DietProvider } from './DietContext';
import { ExerciseProvider } from './ExerciseContext';
import { ProgressProvider } from './ProgressContext';

interface AppProviderProps {
  children: ReactNode;
  userId?: number;
}

export function AppProvider({ children, userId = 1 }: AppProviderProps) {
  // Wrap all the contexts in a single provider
  // The order is important as some contexts depend on others
  
  return (
    <UserProvider>
      <ExerciseProvider>
        <WorkoutProvider userId={userId}>
          <DietProvider userId={userId}>
            <ProgressProvider userId={userId}>
              {children}
            </ProgressProvider>
          </DietProvider>
        </WorkoutProvider>
      </ExerciseProvider>
    </UserProvider>
  );
}

// Re-export all the hooks for easier imports
export { useUser } from './UserContext';
export { useWorkout } from './WorkoutContext';
export { useDiet } from './DietContext';
export { useExercise } from './ExerciseContext';
export { useProgress } from './ProgressContext';