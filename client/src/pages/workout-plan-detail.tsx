import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, WorkoutIcon, TimerIcon, ChevronLeftIcon } from "@/components/ui/icons";
import type { WorkoutPlan, Workout, InsertWorkout } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkoutList from "@/components/workout/workout-list";
import RecommendedExercises from "@/components/workout/recommended-exercises";
import { format } from "date-fns";

interface WorkoutPlanDetailProps {
  setActiveTab: (tab: string) => void;
}

export default function WorkoutPlanDetail({ setActiveTab }: WorkoutPlanDetailProps) {
  // Hard-coded user ID for demo purposes
  const userId = 1;
  const [location, setLocation] = useLocation();
  const { planId } = useParams();
  const [currentTab, setCurrentTab] = useState("plan-details");
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [activeWorkoutId, setActiveWorkoutId] = useState<number | null>(null);

  useEffect(() => {
    setActiveTab("workouts");
  }, [setActiveTab]);

  const { data: workoutPlan, isLoading: isLoadingPlan } = useQuery({
    queryKey: [`/api/workout-plans/${planId}`],
    staleTime: 60000, // 1 minute
  });

  const { data: workouts, isLoading: isLoadingWorkouts } = useQuery({
    queryKey: [`/api/users/${userId}/workouts`, { planId: parseInt(planId || "0") }],
    staleTime: 60000, // 1 minute
  });

  const createWorkoutMutation = useMutation({
    mutationFn: async (workoutData: InsertWorkout) => {
      return await apiRequest("POST", "/api/workouts", workoutData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [`/api/users/${userId}/workouts`]
      });
      // Set the newly created workout as active
      setActiveWorkoutId(data.id);
      // Switch to the workout tab
      setCurrentTab("start-workout");
      setWorkoutStarted(true);
    }
  });

  const handleStartWorkout = () => {
    if (!workoutPlan) return;
    
    // Check if there's already an "in progress" workout
    const inProgressWorkout = workouts?.find(w => w.status === "in_progress");
    
    if (inProgressWorkout) {
      // Use existing workout
      setActiveWorkoutId(inProgressWorkout.id);
      setCurrentTab("start-workout");
      setWorkoutStarted(true);
    } else {
      // Create a new workout
      const today = new Date();
      const workoutName = `${workoutPlan.focus} Workout`;
      
      createWorkoutMutation.mutate({
        userId,
        planId: parseInt(planId || "0"),
        name: workoutName,
        description: `Workout from ${workoutPlan.name}`,
        status: "in_progress",
        scheduledDate: format(today, "yyyy-MM-dd"),
        completedDate: null,
        duration: null,
        notes: null
      });
    }
  };

  const handleFinishWorkout = () => {
    // Here we'd update the workout status to completed
    // For now we'll just navigate back to workout plans
    setWorkoutStarted(false);
    setCurrentTab("plan-details");
  };

  const handleExercisesAdded = () => {
    // Reload workout exercises
    queryClient.invalidateQueries({
      queryKey: [`/api/workouts/${activeWorkoutId}/exercises`]
    });
  };

  if (isLoadingPlan) {
    return (
      <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-8">Loading workout plan...</div>
      </div>
    );
  }

  if (!workoutPlan) {
    return (
      <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-8 text-red-500">Workout plan not found.</div>
        <div className="flex justify-center mt-4">
          <Button onClick={() => setLocation("/workouts")}>
            <ChevronLeftIcon className="h-4 w-4 mr-2" />
            Back to Workout Plans
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => setLocation("/workouts")}
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold">{workoutPlan.name}</h1>
        <Badge className={`ml-3 ${
          workoutPlan.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-slate-100 text-slate-800'
        }`}>
          {workoutPlan.status.charAt(0).toUpperCase() + workoutPlan.status.slice(1)}
        </Badge>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-6 grid w-full grid-cols-3">
          <TabsTrigger value="plan-details">Plan Details</TabsTrigger>
          <TabsTrigger value="workouts" disabled={workoutStarted}>Workouts</TabsTrigger>
          <TabsTrigger value="start-workout" disabled={!workoutStarted}>Start Workout</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plan-details">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Plan Overview</CardTitle>
              <p className="text-sm text-slate-500 mt-1">{workoutPlan.description}</p>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-900">Plan Details</h3>
                  
                  <div className="flex items-center text-sm text-slate-500">
                    <WorkoutIcon className="text-primary h-4 w-4 mr-2" />
                    Focus: {workoutPlan.focus}
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-500">
                    <CalendarIcon className="text-primary h-4 w-4 mr-2" />
                    Duration: {workoutPlan.durationWeeks} weeks
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-500">
                    <TimerIcon className="text-primary h-4 w-4 mr-2" />
                    {workoutPlan.workoutsPerWeek} workouts per week
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-slate-900 mb-3">Schedule</h3>
                  
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-sm text-slate-500">
                      <p className="mb-2"><strong>Created:</strong> {format(new Date(workoutPlan.createdAt), "MMMM d, yyyy")}</p>
                      <p><strong>Weekly Schedule:</strong> {getWeeklySchedule(workoutPlan.workoutsPerWeek)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center border-t pt-6">
              <Button
                onClick={handleStartWorkout}
                disabled={workoutPlan.status !== 'active' || createWorkoutMutation.isPending}
              >
                Start Workout
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="workouts">
          <Card>
            <CardHeader>
              <CardTitle>Your Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingWorkouts ? (
                <div className="text-center py-4">Loading workouts...</div>
              ) : (
                <WorkoutList userId={userId} planId={parseInt(planId || "0")} />
              )}
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6">
              <Button
                onClick={handleStartWorkout}
                disabled={workoutPlan.status !== 'active' || createWorkoutMutation.isPending}
              >
                Start New Workout
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="start-workout">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Workout</CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  Select exercises from the recommended list to add to your workout.
                </p>
              </CardHeader>
              
              <CardContent>
                {activeWorkoutId ? (
                  <CurrentWorkout workoutId={activeWorkoutId} />
                ) : (
                  <div className="py-4 text-center text-slate-500">
                    No active workout. Start a workout to continue.
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="border-t pt-6">
                <Button 
                  className="w-full" 
                  onClick={handleFinishWorkout}
                >
                  Complete Workout
                </Button>
              </CardFooter>
            </Card>
            
            {activeWorkoutId && (
              <RecommendedExercises 
                planId={parseInt(planId || "0")} 
                workoutId={activeWorkoutId}
                onExercisesAdded={handleExercisesAdded} 
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getWeeklySchedule(workoutsPerWeek: number): string {
  switch (workoutsPerWeek) {
    case 1:
      return "Once a week (e.g., Monday)";
    case 2:
      return "Twice a week (e.g., Monday and Thursday)";
    case 3:
      return "Three times a week (e.g., Monday, Wednesday, Friday)";
    case 4:
      return "Four times a week (e.g., Monday, Tuesday, Thursday, Friday)";
    case 5:
      return "Five times a week (e.g., Monday through Friday)";
    case 6:
      return "Six times a week (e.g., Monday through Saturday)";
    case 7:
      return "Every day";
    default:
      return `${workoutsPerWeek} workouts per week`;
  }
}

interface CurrentWorkoutProps {
  workoutId: number;
}

function CurrentWorkout({ workoutId }: CurrentWorkoutProps) {
  const { data: workout, isLoading: isLoadingWorkout } = useQuery({
    queryKey: [`/api/workouts/${workoutId}`],
    staleTime: 30000, // 30 seconds
  });
  
  const { data: workoutExercises, isLoading: isLoadingExercises } = useQuery({
    queryKey: [`/api/workouts/${workoutId}/exercises`],
    staleTime: 30000, // 30 seconds
  });

  if (isLoadingWorkout || isLoadingExercises) {
    return (
      <div className="py-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-slate-500">Loading workout details...</p>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="py-4 text-center text-red-500">
        Error loading workout details.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-medium">{workout.name}</h3>
        <p className="text-sm text-slate-500 mt-1">{workout.description}</p>
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Selected Exercises</h4>
        
        {workoutExercises && workoutExercises.length > 0 ? (
          <div className="space-y-3">
            {workoutExercises.map((exercise: any, index: number) => (
              <div key={exercise.id} className="p-3 border rounded-md bg-slate-50">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{index + 1}. {exercise.name || `Exercise ${index + 1}`}</span>
                  <Badge className="bg-indigo-100 text-indigo-800">
                    {exercise.sets} × {exercise.reps}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-slate-500 border border-dashed rounded-md">
            No exercises added yet. Select exercises from the recommended list.
          </div>
        )}
      </div>
    </div>
  );
}