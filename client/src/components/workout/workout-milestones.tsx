import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function WorkoutMilestones() {
  // Mock data for milestones
  const milestones = [
    {
      id: 1,
      title: "50 Workouts",
      description: "Complete 50 workouts",
      type: "workout_count",
      current: 34,
      target: 50,
      progress: 68, // (34/50) * 100
      unlocked: false,
    },
    {
      id: 2,
      title: "10-Day Streak",
      description: "Complete workouts for 10 consecutive days",
      type: "streak",
      current: 10,
      target: 10,
      progress: 100,
      unlocked: true,
      dateAchieved: "March 20, 2025",
    },
    {
      id: 3,
      title: "Strength Master",
      description: "Lift over 10,000 lbs in a single week",
      type: "strength",
      current: 8650,
      target: 10000,
      progress: 86.5, // (8650/10000) * 100
      unlocked: false,
    },
    {
      id: 4,
      title: "Early Riser",
      description: "Complete 5 workouts before 7 AM",
      type: "schedule",
      current: 5,
      target: 5,
      progress: 100,
      unlocked: true,
      dateAchieved: "March 15, 2025",
    },
    {
      id: 5,
      title: "Marathon Ready",
      description: "Run a total of 100 miles",
      type: "distance",
      current: 73,
      target: 100,
      progress: 73, // (73/100) * 100
      unlocked: false,
    }
  ];

  // Function to get badge color based on progress
  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-gradient-to-r from-emerald-500 to-emerald-700";
    if (progress >= 75) return "bg-emerald-100 text-emerald-800";
    if (progress >= 50) return "bg-amber-100 text-amber-800";
    if (progress >= 25) return "bg-blue-100 text-blue-800";
    return "bg-slate-100 text-slate-800";
  };

  // Function to get icon based on milestone type
  const getMilestoneIcon = (type: string, unlocked: boolean) => {
    const baseClasses = "h-10 w-10 p-2 rounded-full mb-2";
    const lockedClasses = unlocked 
      ? "" 
      : "opacity-50 grayscale";
    
    switch(type) {
      case "workout_count":
        return (
          <div className={`bg-indigo-100 ${baseClasses} ${lockedClasses}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-indigo-600"
            >
              <path d="M16.5 18H18a2 2 0 0 0 2-2v-1.15" />
              <path d="M2 9.15V11a2 2 0 0 0 2 2h10.5" />
              <path d="M2 14.85V13a2 2 0 0 1 2-2h3.5" />
              <path d="M22 9.15V11a2 2 0 0 1-2 2h-6.5" />
              <path d="M16.5 6H5a2 2 0 0 0-2 2v1.15" />
              <path d="M22 14.85V13a2 2 0 0 0-2-2h-3.5" />
              <path d="M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
              <path d="M15.5 17a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
            </svg>
          </div>
        );
      case "streak":
        return (
          <div className={`bg-amber-100 ${baseClasses} ${lockedClasses}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-600"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="m8 9 3 3-3 3" />
              <path d="M13 15h3" />
            </svg>
          </div>
        );
      case "strength":
        return (
          <div className={`bg-red-100 ${baseClasses} ${lockedClasses}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-600"
            >
              <path d="M4 20v-8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8" />
              <path d="M9 20h6" />
              <path d="m8 8-4 4 4 4" />
              <path d="m16 8 4 4-4 4" />
            </svg>
          </div>
        );
      case "schedule":
        return (
          <div className={`bg-emerald-100 ${baseClasses} ${lockedClasses}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-emerald-600"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        );
      case "distance":
        return (
          <div className={`bg-blue-100 ${baseClasses} ${lockedClasses}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
          </div>
        );
      default:
        return (
          <div className={`bg-slate-100 ${baseClasses} ${lockedClasses}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-600"
            >
              <path d="M8.56 3.69a9 9 0 0 0-2.92 1.95" />
              <path d="M3.69 8.56A9 9 0 0 0 3 12" />
              <path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" />
              <path d="M8.56 20.31A9 9 0 0 0 12 21" />
              <path d="M15.44 20.31a9 9 0 0 0 2.92-1.95" />
              <path d="M20.31 15.44A9 9 0 0 0 21 12" />
              <path d="M20.31 8.56a9 9 0 0 0-1.95-2.92" />
              <path d="M15.44 3.69A9 9 0 0 0 12 3" />
            </svg>
          </div>
        );
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
              className="h-5 w-5 text-yellow-500 mr-2"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Achievements
          </div>
          <Badge className="bg-amber-100 text-amber-800">
            2 Unlocked
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {milestones.map((milestone) => (
            <div 
              key={milestone.id} 
              className={`flex flex-col items-center border rounded-lg p-3 text-center relative overflow-hidden ${
                milestone.unlocked ? "border-emerald-200" : "border-slate-100"
              }`}
            >
              {/* Progress overlay */}
              <div 
                className="absolute bottom-0 left-0 right-0 bg-slate-50 opacity-30 transition-all duration-500 ease-in-out"
                style={{ height: `${milestone.progress}%` }}
              />
              
              {/* Content (on top of overlay) */}
              <div className="z-10 flex flex-col items-center">
                {getMilestoneIcon(milestone.type, milestone.unlocked)}
                
                <h3 className="font-medium text-sm mb-1">{milestone.title}</h3>
                
                <p className="text-xs text-slate-500 mb-2">
                  {milestone.description}
                </p>
                
                <div className="mt-auto flex items-center">
                  <Badge className={getProgressColor(milestone.progress)}>
                    {milestone.progress}%
                  </Badge>
                </div>
                
                {milestone.unlocked && (
                  <div className="text-xs text-emerald-600 mt-1">
                    Achieved {milestone.dateAchieved}
                  </div>
                )}
                
                {!milestone.unlocked && (
                  <div className="text-xs text-slate-500 mt-1">
                    {milestone.current} / {milestone.target}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}