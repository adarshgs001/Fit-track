import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkoutPlanCard from "@/components/workout/workout-plan-card";
import WorkoutList from "@/components/workout/workout-list";
import WorkoutProgress from "@/components/workout/workout-progress";
import WorkoutProgressGraph from "@/components/workout/workout-progress-graph";
import WorkoutRecommendations from "@/components/workout/workout-recommendations";
import WorkoutMilestones from "@/components/workout/workout-milestones";
import WorkoutHistoryCalendar from "@/components/workout/workout-history-calendar";
import WorkoutQuickActions from "@/components/workout/workout-quick-actions";
import NutritionWorkoutSynergy from "@/components/workout/nutrition-workout-synergy";
import { PlusIcon } from "@/components/ui/icons";
import { useQuery } from "@tanstack/react-query";
import type { WorkoutPlan } from "@shared/schema";

interface WorkoutsProps {
  setActiveTab: (tab: string) => void;
}

export default function Workouts({ setActiveTab }: WorkoutsProps) {
  // Hard-coded user ID for demo purposes
  const userId = 1;
  // Track active tab for workouts section
  const [activeWorkoutTab, setActiveWorkoutTab] = useState("plans");

  useEffect(() => {
    setActiveTab("workouts");
  }, [setActiveTab]);

  const { data: workoutPlans, isLoading: isLoadingPlans } = useQuery({
    queryKey: [`/api/users/${userId}/workout-plans`],
    staleTime: 60000, // 1 minute
  });

  // Get the active plan for progress display
  const activePlan = workoutPlans?.find((plan: WorkoutPlan) => plan.status === 'active');

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold">Your Workout Hub</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 mr-1"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            Find Workouts
          </Button>
          <Button>
            <PlusIcon className="h-4 w-4 mr-1" />
            Create Plan
          </Button>
        </div>
      </div>

      {/* Tabs for different workout sections */}
      <Tabs defaultValue="plans" value={activeWorkoutTab} onValueChange={setActiveWorkoutTab}>
        <TabsList className="grid grid-cols-4 w-full sm:w-auto">
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="recommendations">Smart Recs</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        </TabsList>
        
        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          {/* Workout Plans */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Workout Plans</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 sm:grid-cols-2">
              {isLoadingPlans ? (
                <div className="col-span-full text-center py-4">Loading workout plans...</div>
              ) : workoutPlans && workoutPlans.length > 0 ? (
                <>
                  {workoutPlans.map((plan: WorkoutPlan) => (
                    <WorkoutPlanCard 
                      key={plan.id} 
                      plan={plan} 
                      currentWeek={plan.status === 'active' ? 2 : undefined}
                    />
                  ))}
                  <div className="bg-white shadow rounded-lg overflow-hidden border-2 border-dashed border-slate-200 flex flex-col justify-center items-center p-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8 text-slate-400 mb-2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v8" />
                      <path d="M8 12h8" />
                    </svg>
                    <h3 className="text-base font-medium text-slate-900">Create New Plan</h3>
                    <p className="mt-1 text-sm text-slate-500 text-center">Start from scratch or use a template</p>
                    <Button variant="outline" className="mt-4">
                      Create Plan
                    </Button>
                  </div>
                </>
              ) : (
                <div className="col-span-full text-center py-4 text-slate-500">
                  No workout plans found. Create your first plan to get started!
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Workouts */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Recent Workouts</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5 mr-1"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5 mr-1"
                  >
                    <path d="M3 6h18" />
                    <path d="M7 12h10" />
                    <path d="M10 18h4" />
                  </svg>
                  Sort
                </Button>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <WorkoutList userId={userId} limit={5} />
            </div>
          </div>
        </TabsContent>
        
        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Workout Progress */}
            <div className="md:col-span-2">
              {activePlan ? (
                <WorkoutProgress plan={activePlan} />
              ) : (
                <div className="bg-white shadow rounded-lg p-6 text-center text-slate-500">
                  No active workout plan found. Start a plan to track your progress!
                </div>
              )}
            </div>
            
            {/* Achievement Badges */}
            <div className="md:col-span-1">
              <WorkoutMilestones />
            </div>
          </div>
          
          {/* Progress Graph */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <WorkoutProgressGraph />
            </div>
            <div className="md:col-span-1">
              <WorkoutQuickActions />
            </div>
          </div>
          
          {/* Workout History Calendar */}
          <WorkoutHistoryCalendar />
        </TabsContent>
        
        {/* Smart Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <WorkoutRecommendations />
        </TabsContent>
        
        {/* Nutrition Tab */}
        <TabsContent value="nutrition" className="space-y-6">
          <NutritionWorkoutSynergy />
        </TabsContent>
      </Tabs>
    </div>
  );
}
