import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkoutIcon, RunIcon, ExerciseIcon } from "@/components/ui/icons";
import type { Workout } from "@shared/schema";
import { Link } from "wouter";
import { format, formatDistanceToNow } from 'date-fns';
import { useWorkout } from "@/contexts/AppContext";

interface RecentWorkoutsProps {
  userId: number;
}

export default function RecentWorkouts({ userId }: RecentWorkoutsProps) {
  // Use our workout context
  const { 
    recentWorkouts, 
    isLoading, 
    error 
  } = useWorkout();

  const getWorkoutIcon = (name: string) => {
    if (name.toLowerCase().includes('cardio') || name.toLowerCase().includes('hiit')) {
      return <RunIcon className="text-secondary" />;
    } else if (name.toLowerCase().includes('leg')) {
      return <ExerciseIcon className="text-primary" />;
    } else {
      return <WorkoutIcon className="text-primary" />;
    }
  };

  const getIconBgColor = (name: string) => {
    if (name.toLowerCase().includes('cardio') || name.toLowerCase().includes('hiit')) {
      return "bg-secondary bg-opacity-10";
    } else {
      return "bg-indigo-100";
    }
  };

  const formatWorkoutDate = (date: string | Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 py-5 sm:px-6 border-b border-slate-200">
        <CardTitle className="text-lg leading-6 font-medium text-slate-900">Recent Workouts</CardTitle>
      </CardHeader>
      <CardContent className="bg-white p-4 divide-y divide-slate-200">
        {isLoading ? (
          <div className="py-4 text-center text-slate-500">Loading recent workouts...</div>
        ) : error ? (
          <div className="py-4 text-center text-red-500">Failed to load recent workouts</div>
        ) : recentWorkouts && recentWorkouts.length > 0 ? (
          recentWorkouts.map((workout: Workout) => (
            <div key={workout.id} className="py-4 flex items-center">
              <div className={`${getIconBgColor(workout.name)} rounded-md p-2`}>
                {getWorkoutIcon(workout.name)}
              </div>
              <div className="ml-3 flex-1">
                <h4 className="text-sm font-medium">{workout.name}</h4>
                <p className="text-xs text-slate-500">
                  {`Completed ${formatWorkoutDate(workout.completedDate!)} - ${workout.duration} minutes`}
                </p>
              </div>
              <Link href={`/workouts/${workout.id}`}>
                <Button variant="link" className="text-primary text-sm font-medium hover:text-indigo-700">View</Button>
              </Link>
            </div>
          ))
        ) : (
          <div className="py-4 text-center text-slate-500">No recent workouts found</div>
        )}
      </CardContent>
      <CardFooter className="bg-slate-50 px-4 py-4 sm:px-6">
        <div className="text-sm flex justify-center w-full">
          <Link href="/workouts">
            <Button variant="link" className="font-medium text-primary hover:text-indigo-700">View all workouts</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
