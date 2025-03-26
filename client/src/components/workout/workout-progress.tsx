import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { WorkoutPlan } from "@shared/schema";

interface WorkoutProgressProps {
  plan: WorkoutPlan;
  totalWorkouts?: number;
  completedWorkouts?: number;
}

export default function WorkoutProgress({ 
  plan, 
  totalWorkouts = 24, 
  completedWorkouts = 12 
}: WorkoutProgressProps) {
  // Calculate progress percentage
  const progressPercentage = Math.floor((completedWorkouts / totalWorkouts) * 100);
  
  // Calculate streaks (mock data)
  const currentStreak = 5;
  const longestStreak = 7;
  
  // Calculate calories data (mock data)
  const caloriesBurned = 2450;
  const lastWeekCalories = 2100;
  const caloriesChange = Math.round(((caloriesBurned - lastWeekCalories) / lastWeekCalories) * 100);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center justify-between">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-indigo-500 mr-2"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Workout Progress
          </div>
          <Badge className={
            progressPercentage >= 75 ? "bg-emerald-100 text-emerald-800" : 
            progressPercentage >= 50 ? "bg-amber-100 text-amber-800" : 
            "bg-blue-100 text-blue-800"
          }>
            {progressPercentage}% Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>{completedWorkouts} of {totalWorkouts} workouts completed</span>
              <span>{Math.floor(plan.durationWeeks * (progressPercentage / 100))} of {plan.durationWeeks} weeks</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-slate-100" 
            />
          </div>
          
          {/* Streak and burned calories */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-indigo-50 p-2 rounded">
              <div className="text-sm font-medium text-indigo-600">{currentStreak} days</div>
              <div className="text-xs text-slate-500">Current Streak</div>
            </div>
            <div className="bg-indigo-50 p-2 rounded">
              <div className="text-sm font-medium text-indigo-600">{longestStreak} days</div>
              <div className="text-xs text-slate-500">Longest Streak</div>
            </div>
            <div className="bg-indigo-50 p-2 rounded">
              <div className="text-sm font-medium text-indigo-600">{caloriesBurned}</div>
              <div className="text-xs text-slate-500">Calories Burned</div>
            </div>
          </div>
          
          {/* Achievement badges */}
          <div>
            <h3 className="text-sm font-medium mb-2">Achievements</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-purple-100 text-purple-800">
                3-Week Streak
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-800">
                10 Workouts
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                Consistency
              </Badge>
              <Badge className="bg-amber-100 text-amber-800">
                Early Bird
              </Badge>
            </div>
          </div>
          
          {/* Calories trend */}
          <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500">Weekly Calories</span>
              <span className="font-medium">{caloriesBurned}</span>
            </div>
            <div className={`flex items-center ${caloriesChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={`h-4 w-4 mr-1 ${caloriesChange >= 0 ? '' : 'transform rotate-180'}`}
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
              <span className="text-sm font-medium">
                {caloriesChange >= 0 ? '+' : ''}{caloriesChange}% vs last week
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}