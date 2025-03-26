import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";

export default function WorkoutHistoryCalendar() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // Mock data for workout history
  const workoutDates = [
    new Date(2025, 2, 3), // March 3, 2025
    new Date(2025, 2, 4), // March 4, 2025
    new Date(2025, 2, 5), // March 5, 2025
    new Date(2025, 2, 7), // March 7, 2025
    new Date(2025, 2, 10), // March 10, 2025
    new Date(2025, 2, 11), // March 11, 2025
    new Date(2025, 2, 12), // March 12, 2025
    new Date(2025, 2, 14), // March 14, 2025
    new Date(2025, 2, 17), // March 17, 2025
    new Date(2025, 2, 18), // March 18, 2025
    new Date(2025, 2, 19), // March 19, 2025
    new Date(2025, 2, 21), // March 21, 2025
    new Date(2025, 2, 24), // March 24, 2025
    new Date(2025, 2, 25), // March 25, 2025
  ];
  
  // Calculate current streak of consecutive workout days
  const calculateCurrentStreak = () => {
    // Sort dates in descending order (newest first)
    const sortedDates = [...workoutDates].sort((a, b) => b.getTime() - a.getTime());
    
    if (sortedDates.length === 0) return 0;
    
    // Check if today or yesterday has a workout
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const hasWorkoutToday = sortedDates.some(d => d.toDateString() === today.toDateString());
    const hasWorkoutYesterday = sortedDates.some(d => d.toDateString() === yesterday.toDateString());
    
    if (!hasWorkoutToday && !hasWorkoutYesterday) return 0;
    
    // Calculate streak
    let streak = hasWorkoutToday ? 1 : 0;
    let currentDate = hasWorkoutToday ? yesterday : new Date(yesterday);
    currentDate.setDate(currentDate.getDate() - 1);
    
    while (true) {
      // Check if there's a workout on the current date
      const hasWorkout = sortedDates.some(d => d.toDateString() === currentDate.toDateString());
      if (!hasWorkout) break;
      
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };
  
  // Calculate longest streak
  const calculateLongestStreak = () => {
    // Sort dates in ascending order (oldest first)
    const sortedDates = [...workoutDates].sort((a, b) => a.getTime() - b.getTime());
    
    if (sortedDates.length === 0) return 0;
    
    let currentStreak = 1;
    let longestStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i-1]);
      const currDate = new Date(sortedDates[i]);
      
      // Set hours, minutes, seconds, and milliseconds to 0 for accurate date comparison
      prevDate.setHours(0, 0, 0, 0);
      currDate.setHours(0, 0, 0, 0);
      
      // Check if dates are consecutive
      const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        // Consecutive day
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else if (dayDiff > 1) {
        // Break in streak
        currentStreak = 1;
      }
    }
    
    return longestStreak;
  };
  
  // Get workout type for a specific date (just for demonstration)
  const getWorkoutType = (date: Date) => {
    const day = date.getDay();
    
    // Assign workout types based on day of week (for demo purposes)
    switch (day) {
      case 1: // Monday
        return "Upper Body";
      case 2: // Tuesday
        return "Cardio";
      case 3: // Wednesday
        return "Lower Body";
      case 4: // Thursday
        return "Rest";
      case 5: // Friday
        return "Full Body";
      default:
        return "Custom";
    }
  };
  
  // Get CSS class for calendar day based on whether it has a workout
  const getDayClass = (date: Date) => {
    const hasWorkout = workoutDates.some(
      d => d.getDate() === date.getDate() && 
           d.getMonth() === date.getMonth() && 
           d.getFullYear() === date.getFullYear()
    );
    
    if (hasWorkout) {
      // Return specific style for days with workouts
      return "bg-green-100 text-green-800 font-medium rounded-full";
    }
    
    return "";
  };
  
  const currentStreak = calculateCurrentStreak();
  const longestStreak = calculateLongestStreak();
  const totalWorkouts = workoutDates.length;
  const workoutsThisMonth = workoutDates.filter(
    date => date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear()
  ).length;
  
  const streakColor = currentStreak >= 5 ? "text-red-500" : 
                      currentStreak >= 3 ? "text-amber-500" : 
                      "text-blue-500";
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Workout History</h2>
        <Button variant="outline" size="sm">
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
            <path d="M17 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
            <path d="m9 5 1-2h4l1 2" />
            <path d="M8 10h8" />
            <path d="M8 14h5" />
            <path d="M8 18h2" />
          </svg>
          Export
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-slate-500 mr-2"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                Calendar View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar 
                mode="single"
                selected={undefined}
                onSelect={() => {}}
                onMonthChange={setCurrentMonth}
                className="rounded-md border"
                classNames={{
                  day_selected: "",
                  day: (date) => getDayClass(date),
                }}
              />
              
              <div className="flex items-center justify-center gap-3 mt-4 text-sm">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-green-100 mr-1"></div>
                  <span>Workout Day</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-white border border-slate-200 mr-1"></div>
                  <span>No Workout</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Streak and Stats */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-red-500 mr-2"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M12 18v-6" />
                  <path d="M8 18v-1" />
                  <path d="M16 18v-3" />
                </svg>
                Stats & Streaks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Streak */}
              <div className="text-center border rounded-lg p-4 bg-slate-50 relative overflow-hidden">
                <span className="text-xs text-slate-600">Current Streak</span>
                <h3 className={`text-3xl font-bold ${streakColor}`}>
                  {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
                </h3>
                
                <div className="flex justify-center my-2">
                  {[...Array(7)].map((_, i) => {
                    // Calculate if this day had a workout (for demo purposes)
                    const today = new Date();
                    const dayToCheck = new Date(today);
                    dayToCheck.setDate(today.getDate() - (6 - i));
                    
                    const hadWorkout = workoutDates.some(
                      d => d.getDate() === dayToCheck.getDate() && 
                           d.getMonth() === dayToCheck.getMonth() && 
                           d.getFullYear() === dayToCheck.getFullYear()
                    );
                    
                    return (
                      <div 
                        key={i} 
                        className={`h-2 w-6 mx-0.5 rounded-sm ${
                          hadWorkout ? 'bg-green-500' : 'bg-slate-200'
                        }`}
                      />
                    );
                  })}
                </div>
                
                <span className="text-xs text-slate-600">
                  {currentStreak > 0 
                    ? "Keep it up! Don't break your streak." 
                    : "Start your streak today!"}
                </span>
                
                {/* Flame icon for long streaks */}
                {currentStreak >= 3 && (
                  <div className="absolute -right-4 -top-4 opacity-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={`h-24 w-24 ${streakColor}`}
                    >
                      <path d="M12 23a7.5 7.5 0 0 1-5.138-12.963C8.204 8.774 11.5 6.5 11 1.5c6 4 9 8 3 14 1 0 2.5 0 5-2.47.27.773.5 1.604.5 2.47A7.5 7.5 0 0 1 12 23z" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Other Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="border rounded-lg p-3 text-center">
                  <span className="text-xs text-slate-600">Longest Streak</span>
                  <h4 className="text-xl font-bold text-slate-800">{longestStreak} days</h4>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <span className="text-xs text-slate-600">This Month</span>
                  <h4 className="text-xl font-bold text-slate-800">{workoutsThisMonth}</h4>
                </div>
                <div className="border rounded-lg p-3 text-center col-span-2">
                  <span className="text-xs text-slate-600">Total Workouts</span>
                  <h4 className="text-xl font-bold text-slate-800">{totalWorkouts}</h4>
                </div>
              </div>
              
              {/* Recent History */}
              <div>
                <h4 className="text-sm font-medium mb-2">Recent Workouts</h4>
                <div className="space-y-2">
                  {workoutDates.slice(0, 3).map((date, idx) => {
                    const workoutType = getWorkoutType(date);
                    return (
                      <div key={idx} className="flex justify-between items-center text-sm p-2 border rounded-lg">
                        <div className="flex items-center">
                          <div className={`h-2 w-2 rounded-full mr-2 ${
                            workoutType === "Upper Body" ? "bg-blue-500" :
                            workoutType === "Lower Body" ? "bg-purple-500" :
                            workoutType === "Cardio" ? "bg-red-500" :
                            workoutType === "Full Body" ? "bg-green-500" :
                            "bg-slate-500"
                          }`}></div>
                          <span>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <Badge variant="outline">
                          {workoutType}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}