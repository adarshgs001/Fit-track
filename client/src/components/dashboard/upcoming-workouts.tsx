import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkoutIcon, RunIcon, EditIcon, TrashIcon } from "@/components/ui/icons";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Workout } from "@shared/schema";
import { Link } from "wouter";
import { format } from 'date-fns';
import { Progress } from "@/components/ui/progress";

interface UpcomingWorkoutsProps {
  userId: number;
}

export default function UpcomingWorkouts({ userId }: UpcomingWorkoutsProps) {
  const { data: upcomingWorkouts, isLoading, error } = useQuery({
    queryKey: [`/api/users/${userId}/upcoming-workouts`],
    staleTime: 60000, // 1 minute
  });

  const deleteWorkoutMutation = useMutation({
    mutationFn: async (workoutId: number) => {
      await apiRequest("DELETE", `/api/workouts/${workoutId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/upcoming-workouts`] });
    }
  });

  const getWorkoutIcon = (name: string) => {
    if (name.toLowerCase().includes('cardio')) {
      return <RunIcon className="text-secondary" />;
    } else {
      return <WorkoutIcon className="text-primary" />;
    }
  };

  const getIconBgColor = (name: string) => {
    if (name.toLowerCase().includes('cardio')) {
      return "bg-secondary bg-opacity-10";
    } else {
      return "bg-indigo-100";
    }
  };

  const formatWorkoutDate = (date: string | Date) => {
    const workoutDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (workoutDate.toDateString() === today.toDateString()) {
      return `Today - ${format(workoutDate, 'h:mm a')}`;
    } else if (workoutDate.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow - ${format(workoutDate, 'h:mm a')}`;
    } else {
      return `${format(workoutDate, 'EEEE')} - ${format(workoutDate, 'h:mm a')}`;
    }
  };

  const handleDeleteWorkout = (workoutId: number) => {
    if (confirm("Are you sure you want to delete this workout?")) {
      deleteWorkoutMutation.mutate(workoutId);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 py-5 sm:px-6 border-b border-slate-200">
        <CardTitle className="text-lg leading-6 font-medium text-slate-900">Upcoming Workouts</CardTitle>
      </CardHeader>
      <CardContent className="bg-white p-4 divide-y divide-slate-200">
        {isLoading ? (
          <div className="py-4 text-center text-slate-500">Loading upcoming workouts...</div>
        ) : error ? (
          <div className="py-4 text-center text-red-500">Failed to load upcoming workouts</div>
        ) : upcomingWorkouts && upcomingWorkouts.length > 0 ? (
          upcomingWorkouts.map((workout: Workout) => (
            <div key={workout.id} className="py-4">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className={`${getIconBgColor(workout.name)} rounded-md p-2`}>
                    {getWorkoutIcon(workout.name)}
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">{workout.name}</h4>
                    <p className="text-xs text-slate-500">{formatWorkoutDate(workout.scheduledDate)}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/workouts/${workout.id}/edit`}>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-500 p-1 h-auto">
                      <EditIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-400 hover:text-red-500 p-1 h-auto"
                    onClick={() => handleDeleteWorkout(workout.id)}
                    disabled={deleteWorkoutMutation.isPending}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-2">
                <Progress value={0} className="bg-slate-200 h-1.5 rounded-full" />
              </div>
            </div>
          ))
        ) : (
          <div className="py-4 text-center text-slate-500">No upcoming workouts scheduled</div>
        )}
      </CardContent>
      <CardFooter className="bg-slate-50 px-4 py-4 sm:px-6">
        <div className="text-sm flex justify-center w-full">
          <Link href="/workouts/new">
            <Button variant="link" className="font-medium text-primary hover:text-indigo-700">Schedule new workout</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
