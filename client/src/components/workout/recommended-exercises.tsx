import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusIcon } from "@/components/ui/icons";
import type { Exercise, ExerciseCategory, InsertWorkoutExercise } from "@shared/schema";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RecommendedExercisesProps {
  planId: number;
  workoutId: number; // ID of the workout we're adding exercises to
  onExercisesAdded?: () => void; // Callback for when exercises are added
}

interface ExercisesByCategoryGroup {
  category: ExerciseCategory;
  exercises: Exercise[];
}

export default function RecommendedExercises({ planId, workoutId, onExercisesAdded }: RecommendedExercisesProps) {
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

  // Fetch recommended exercises based on the workout plan's focus
  const { data: exerciseGroups, isLoading, error } = useQuery({
    queryKey: [`/api/workout-plans/${planId}/recommended-exercises`],
    staleTime: 60000, // 1 minute
  });

  // Mutation for adding exercises to workout
  const addExerciseMutation = useMutation({
    mutationFn: async (exerciseId: number) => {
      const workoutExercise: InsertWorkoutExercise = {
        workoutId,
        exerciseId,
        sets: 3, // Default values
        reps: 10,
        order: selectedExercises.length + 1,
        weight: null,
        duration: null,
        notes: null,
      };
      await apiRequest("POST", "/api/workout-exercises", workoutExercise);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/workouts/${workoutId}/exercises`] });
      if (onExercisesAdded) {
        onExercisesAdded();
      }
    }
  });

  // Mutation for adding multiple exercises at once
  const addSelectedExercisesMutation = useMutation({
    mutationFn: async () => {
      const promises = selectedExercises.map((exerciseId, index) => {
        const workoutExercise: InsertWorkoutExercise = {
          workoutId,
          exerciseId,
          sets: 3, // Default values
          reps: 10,
          order: index + 1,
          weight: null,
          duration: null,
          notes: null,
        };
        return apiRequest("POST", "/api/workout-exercises", workoutExercise);
      });
      
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/workouts/${workoutId}/exercises`] });
      setSelectedExercises([]);
      if (onExercisesAdded) {
        onExercisesAdded();
      }
    }
  });

  const handleSelectExercise = (exerciseId: number) => {
    if (selectedExercises.includes(exerciseId)) {
      setSelectedExercises(selectedExercises.filter(id => id !== exerciseId));
    } else {
      setSelectedExercises([...selectedExercises, exerciseId]);
    }
  };

  const handleAddExercise = (exerciseId: number) => {
    addExerciseMutation.mutate(exerciseId);
  };

  const handleAddSelectedExercises = () => {
    if (selectedExercises.length > 0) {
      addSelectedExercisesMutation.mutate();
    }
  };

  const getFilteredExercises = (exercises: Exercise[]) => {
    if (!difficultyFilter) return exercises;
    return exercises.filter(exercise => 
      exercise.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Recommended Exercises...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Failed to load recommended exercises. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  if (!exerciseGroups || exerciseGroups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Exercises Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500">No recommended exercises were found for this workout plan.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Recommended Exercises</CardTitle>
          <div className="flex space-x-2">
            <Badge className="bg-slate-100 text-slate-800">
              {selectedExercises.length} selected
            </Badge>
            <Button 
              size="sm" 
              onClick={handleAddSelectedExercises}
              disabled={selectedExercises.length === 0 || addSelectedExercisesMutation.isPending}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Selected
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Difficulty Filter */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger 
              value="all" 
              onClick={() => setDifficultyFilter(null)}
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="beginner" 
              onClick={() => setDifficultyFilter("beginner")}
            >
              Beginner
            </TabsTrigger>
            <TabsTrigger 
              value="intermediate" 
              onClick={() => setDifficultyFilter("intermediate")}
            >
              Intermediate
            </TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              onClick={() => setDifficultyFilter("advanced")}
            >
              Advanced
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Accordion type="multiple" className="w-full">
          {exerciseGroups.map((group: ExercisesByCategoryGroup) => {
            const filteredExercises = getFilteredExercises(group.exercises);
            
            if (filteredExercises.length === 0) {
              return null;
            }
            
            return (
              <AccordionItem key={group.category.id} value={`category-${group.category.id}`}>
                <AccordionTrigger className="hover:bg-slate-50 px-4">
                  <div className="flex items-center">
                    <span className="font-medium">{group.category.name}</span>
                    <Badge className="ml-2 bg-slate-100 text-slate-700">
                      {filteredExercises.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 p-4">
                    {filteredExercises.map(exercise => (
                      <div 
                        key={exercise.id} 
                        className={`p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors ${
                          selectedExercises.includes(exercise.id) ? "border-primary bg-indigo-50" : "border-slate-200"
                        }`}
                      >
                        <div className="flex items-start mb-4 sm:mb-0">
                          <div 
                            className="w-6 h-6 rounded border border-slate-300 mr-3 flex-shrink-0 cursor-pointer flex items-center justify-center"
                            onClick={() => handleSelectExercise(exercise.id)}
                          >
                            {selectedExercises.includes(exercise.id) && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900">{exercise.name}</h4>
                            <div className="mt-1 flex flex-wrap gap-2">
                              <Badge variant="outline" className="bg-slate-100 text-slate-800">
                                {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                              </Badge>
                              {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
                                <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
                                  {exercise.muscleGroups[0]}
                                </Badge>
                              )}
                            </div>
                            <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                              {exercise.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2 sm:flex-col sm:space-y-2 sm:space-x-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs flex-1 sm:flex-none"
                            onClick={() => handleAddExercise(exercise.id)}
                            disabled={addExerciseMutation.isPending}
                          >
                            <PlusIcon className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-xs flex-1 sm:flex-none"
                            asChild
                          >
                            <a href={`/exercises/${exercise.id}`} target="_blank" rel="noopener noreferrer">
                              View Details
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}