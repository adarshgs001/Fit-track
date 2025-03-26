import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface WorkoutQuickActionsProps {
  workoutId?: number;
}

export default function WorkoutQuickActions({ workoutId }: WorkoutQuickActionsProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  // Mock data for upcoming workouts
  const upcomingWorkouts = [
    {
      id: 1,
      name: "Upper Body Strength",
      date: "Today", // Or actual date
      time: "6:00 PM",
      duration: 45,
      isFavorite: true,
      type: "strength",
      difficulty: "Medium"
    },
    {
      id: 2,
      name: "HIIT Cardio Session",
      date: "Tomorrow", // Or actual date
      time: "7:30 AM",
      duration: 30,
      isFavorite: false,
      type: "cardio",
      difficulty: "High"
    },
    {
      id: 3,
      name: "Leg Day",
      date: "Mar 28", // Or actual date
      time: "6:00 PM",
      duration: 50,
      isFavorite: false,
      type: "strength",
      difficulty: "Medium-High"
    }
  ];
  
  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    // In a real app, this would update the state and make an API call
    console.log(`Toggling favorite status for workout ${id}`);
  };
  
  // Skip workout
  const skipWorkout = (id: number) => {
    // In a real app, this would update the state and make an API call
    console.log(`Skipping workout ${id}`);
  };
  
  // Complete workout
  const completeWorkout = (id: number) => {
    // In a real app, this would update the state and make an API call
    console.log(`Marking workout ${id} as complete`);
  };
  
  // Reschedule workout
  const rescheduleWorkout = (id: number, newDate: Date) => {
    // In a real app, this would update the state and make an API call
    console.log(`Rescheduling workout ${id} to ${newDate.toLocaleDateString()}`);
    setDate(undefined);
  };
  
  // Get workout type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "strength":
        return "bg-blue-100 text-blue-800";
      case "cardio":
        return "bg-red-100 text-red-800";
      case "flexibility":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };
  
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
              className="h-5 w-5 text-blue-500 mr-2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m4.9 4.9 14.2 14.2" />
              <path d="M12 8v4l2 2" />
            </svg>
            Quick Actions
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingWorkouts.map((workout) => (
            <div 
              key={workout.id}
              className="bg-white border rounded-lg overflow-hidden"
            >
              <div className="flex items-center p-3 border-b">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium text-sm">{workout.name}</h3>
                    {workout.isFavorite && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4 text-amber-500 ml-1"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center mt-1 text-xs text-slate-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3 mr-1"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    {workout.date} at {workout.time}
                    <span className="mx-2">•</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3 mr-1"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {workout.duration} min
                  </div>
                </div>
                <Badge className={getTypeColor(workout.type)}>
                  {workout.type}
                </Badge>
              </div>
              
              <div className="p-3 flex justify-between items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs"
                  onClick={() => toggleFavorite(workout.id)}
                >
                  {workout.isFavorite ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-3.5 w-3.5 mr-1 text-amber-500"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      Unfavorite
                    </>
                  ) : (
                    <>
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
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      Favorite
                    </>
                  )}
                </Button>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs"
                    >
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
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                      </svg>
                      Reschedule
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                    <div className="p-3 border-t flex justify-end">
                      <Button 
                        size="sm"
                        disabled={!date} 
                        onClick={() => date && rescheduleWorkout(workout.id, date)}
                      >
                        Apply
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs"
                  onClick={() => skipWorkout(workout.id)}
                >
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
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                  Skip
                </Button>
                
                <Button 
                  size="sm" 
                  className="flex-1 text-xs"
                  onClick={() => completeWorkout(workout.id)}
                >
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
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Complete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}