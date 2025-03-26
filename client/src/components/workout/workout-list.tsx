import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, TimerIcon, ChevronRightIcon } from "@/components/ui/icons";
import type { Workout } from "@shared/schema";
import { format, parseISO, isToday, isTomorrow } from "date-fns";

interface WorkoutListProps {
  userId: number;
  planId?: number;
  limit?: number;
}

export default function WorkoutList({ userId, planId, limit }: WorkoutListProps) {
  const { data: workouts, isLoading } = useQuery({
    queryKey: [`/api/users/${userId}/workouts`, { planId }],
    staleTime: 60000, // 1 minute
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!workouts || workouts.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500">
        <p>No workouts found for this plan.</p>
      </div>
    );
  }

  const displayWorkouts = limit ? workouts.slice(0, limit) : workouts;

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return "bg-green-100 text-green-800";
      case 'in_progress':
        return "bg-blue-100 text-blue-800";
      case 'scheduled':
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const formatScheduledDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      if (isToday(date)) {
        return "Today";
      } else if (isTomorrow(date)) {
        return "Tomorrow";
      } else {
        return format(date, "MMM d, yyyy");
      }
    } catch (error) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      {displayWorkouts.map((workout: Workout) => (
        <Link key={workout.id} href={`/workouts/${workout.id}`}>
          <Card className="hover:bg-slate-50 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-slate-900">{workout.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{workout.description}</p>
                  
                  <div className="flex flex-wrap mt-2 gap-x-4 gap-y-1">
                    <div className="flex items-center text-xs text-slate-500">
                      <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                      {formatScheduledDate(workout.scheduledDate)}
                    </div>
                    
                    {workout.duration && (
                      <div className="flex items-center text-xs text-slate-500">
                        <TimerIcon className="h-3.5 w-3.5 mr-1" />
                        {workout.duration} min
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getStatusBadgeColor(workout.status)}>
                    {workout.status === 'in_progress' 
                      ? 'In Progress' 
                      : workout.status.charAt(0).toUpperCase() + workout.status.slice(1)}
                  </Badge>
                  
                  <ChevronRightIcon className="h-5 w-5 text-slate-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}