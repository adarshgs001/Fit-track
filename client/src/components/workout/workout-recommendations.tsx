import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function WorkoutRecommendations() {
  // Mock data for personalized workout recommendations
  const recommendations = [
    {
      id: 1,
      type: "missed_muscle",
      title: "Leg Day Needed",
      reason: "You haven't trained legs in 10 days",
      workoutName: "Lower Body Power",
      duration: 45,
      intensity: "Medium-High",
      exercises: ["Squats", "Deadlifts", "Lunges", "Leg Press"],
      priority: "high"
    },
    {
      id: 2,
      type: "goal_based",
      title: "Core Strength Builder",
      reason: "Aligns with your 'stronger core' goal",
      workoutName: "Core Focus",
      duration: 30,
      intensity: "Medium",
      exercises: ["Planks", "Russian Twists", "Mountain Climbers", "Leg Raises"],
      priority: "medium"
    },
    {
      id: 3,
      type: "recovery",
      title: "Active Recovery Session",
      reason: "After your intense workouts this week",
      workoutName: "Recovery",
      duration: 25,
      intensity: "Low",
      exercises: ["Light Cycling", "Stretching", "Foam Rolling", "Yoga Poses"],
      priority: "low"
    },
    {
      id: 4,
      type: "progression",
      title: "Progressive Overload",
      reason: "Time to increase weight on bench press",
      workoutName: "Chest Progression",
      duration: 40,
      intensity: "High",
      exercises: ["Bench Press", "Incline Press", "Chest Flies", "Push-ups"],
      priority: "medium"
    }
  ];

  // Function to get badge color based on priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-amber-100 text-amber-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  // Function to get badge for workout type
  const getTypeColor = (type: string) => {
    switch (type) {
      case "missed_muscle":
        return "bg-purple-100 text-purple-800";
      case "goal_based":
        return "bg-emerald-100 text-emerald-800";
      case "recovery":
        return "bg-blue-100 text-blue-800";
      case "progression":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  // Function to get icon based on recommendation type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "missed_muscle":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-purple-600"
          >
            <path d="M7 10v12" />
            <path d="M15 10v12" />
            <path d="M11 10v12" />
            <path d="M11 10a5 5 0 0 1-5-5V3" />
            <path d="M11 10a5 5 0 0 0 5-5V3" />
            <path d="m4 5 3 3" />
            <path d="m17 5-3 3" />
          </svg>
        );
      case "goal_based":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-emerald-600"
          >
            <path d="M18.3 5.6 21 8l-7 7-4-4-7.6 7.6a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0L13 15l-4-4 7-7 2.4 2.6" />
            <path d="M5 8h7" />
            <path d="M5 12h4" />
            <path d="M13 19h6" />
          </svg>
        );
      case "recovery":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-blue-600"
          >
            <path d="M10 3v4" />
            <path d="M14 3v4" />
            <path d="M18 10a4 4 0 0 1 0 8" />
            <path d="M7 21v-4" />
            <path d="M11 21v-4" />
            <path d="M6 10a4 4 0 0 0 0 8" />
            <path d="M12 8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z" />
          </svg>
        );
      case "progression":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-amber-600"
          >
            <path d="M2 20h20" />
            <path d="M5 20v-8" />
            <path d="M9 20v-9" />
            <path d="M13 20v-5" />
            <path d="M17 20V8" />
            <path d="m4 11 6-7 6 5 4-4" />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-slate-600"
          >
            <path d="M9 18h6" />
            <path d="M20 7v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7" />
            <path d="M12 11v5" />
            <path d="m9 11 3-3 3 3" />
            <path d="M10 3h4" />
            <path d="M12 3v8" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Smart Recommendations</h2>
        <Button variant="outline" size="sm">
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec) => (
          <Card key={rec.id} className={`border-l-4 ${
            rec.priority === 'high' ? 'border-l-red-500' : 
            rec.priority === 'medium' ? 'border-l-amber-500' : 
            'border-l-blue-500'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center justify-between">
                <div className="flex items-center">
                  {getTypeIcon(rec.type)}
                  <span className="ml-2">{rec.title}</span>
                </div>
                <Badge className={getPriorityColor(rec.priority)}>
                  {rec.priority === 'high' ? 'Recommended' : 
                   rec.priority === 'medium' ? 'Suggested' : 
                   'Optional'
                  }
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-slate-600">{rec.reason}</p>
                
                <div className="flex justify-between text-sm">
                  <div>
                    <Badge variant="outline" className="bg-white mr-2">
                      {rec.duration} min
                    </Badge>
                    <Badge variant="outline" className="bg-white">
                      {rec.intensity}
                    </Badge>
                  </div>
                  <Badge className={getTypeColor(rec.type)}>
                    {rec.type === 'missed_muscle' ? 'Balance' : 
                     rec.type === 'goal_based' ? 'Goal' : 
                     rec.type === 'recovery' ? 'Recovery' : 
                     'Progress'
                    }
                  </Badge>
                </div>
                
                <div className="bg-slate-50 p-2 rounded text-sm">
                  <p className="font-medium text-xs mb-1.5 text-slate-700">Key Exercises:</p>
                  <div className="flex flex-wrap gap-1">
                    {rec.exercises.map((exercise, idx) => (
                      <Badge key={idx} variant="outline" className="bg-white font-normal">
                        {exercise}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between mt-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    Modify
                  </Button>
                  <Button size="sm" className="text-xs">
                    Add to Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <h3 className="text-base font-medium mb-2">How Recommendations Work</h3>
        <p className="text-sm text-slate-600 mb-4">
          Our AI analyzes your workout history, goals, and preferences to suggest the most effective exercises for your fitness journey.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-3 rounded border border-slate-100">
            <div className="flex items-center mb-2">
              <div className="bg-purple-100 p-1.5 rounded-full mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-purple-600"
                >
                  <path d="M7 10v12" />
                  <path d="M15 10v12" />
                  <path d="M11 10v12" />
                  <path d="M11 10a5 5 0 0 1-5-5V3" />
                  <path d="M11 10a5 5 0 0 0 5-5V3" />
                </svg>
              </div>
              <span className="font-medium">Balance</span>
            </div>
            <p className="text-slate-600">
              Identifies muscle groups you've neglected to ensure balanced development
            </p>
          </div>
          
          <div className="bg-white p-3 rounded border border-slate-100">
            <div className="flex items-center mb-2">
              <div className="bg-emerald-100 p-1.5 rounded-full mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-emerald-600"
                >
                  <path d="M18.3 5.6 21 8l-7 7-4-4-7.6 7.6a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0L13 15l-4-4 7-7 2.4 2.6" />
                </svg>
              </div>
              <span className="font-medium">Goal-Based</span>
            </div>
            <p className="text-slate-600">
              Tailored workouts designed to help you achieve your specific fitness goals
            </p>
          </div>
          
          <div className="bg-white p-3 rounded border border-slate-100">
            <div className="flex items-center mb-2">
              <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-blue-600"
                >
                  <path d="M10 3v4" />
                  <path d="M14 3v4" />
                  <path d="M18 10a4 4 0 0 1 0 8" />
                  <path d="M7 21v-4" />
                  <path d="M11 21v-4" />
                  <path d="M6 10a4 4 0 0 0 0 8" />
                </svg>
              </div>
              <span className="font-medium">Recovery</span>
            </div>
            <p className="text-slate-600">
              Suggests active recovery sessions when your body needs to recuperate
            </p>
          </div>
          
          <div className="bg-white p-3 rounded border border-slate-100">
            <div className="flex items-center mb-2">
              <div className="bg-amber-100 p-1.5 rounded-full mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-amber-600"
                >
                  <path d="M2 20h20" />
                  <path d="M5 20v-8" />
                  <path d="M9 20v-9" />
                  <path d="M13 20v-5" />
                  <path d="M17 20V8" />
                </svg>
              </div>
              <span className="font-medium">Progress</span>
            </div>
            <p className="text-slate-600">
              Identifies when you're ready to increase intensity or weights for continued growth
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}