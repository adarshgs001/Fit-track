import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function GoalSetting() {
  // Mock data for goals
  const goals = [
    {
      id: 1,
      title: "Lose 5kg",
      category: "weight",
      progress: 60,
      deadline: "April 15, 2025",
      startValue: 75,
      currentValue: 72,
      targetValue: 70,
      unit: "kg"
    },
    {
      id: 2,
      title: "Run 10km",
      category: "cardio",
      progress: 45,
      deadline: "May 1, 2025",
      startValue: 5,
      currentValue: 7.5,
      targetValue: 10,
      unit: "km"
    },
    {
      id: 3,
      title: "Bench Press 100kg",
      category: "strength",
      progress: 80,
      deadline: "April 30, 2025",
      startValue: 80,
      currentValue: 95,
      targetValue: 100,
      unit: "kg"
    }
  ];

  // Function to get badge color based on category
  const getBadgeColor = (category: string) => {
    switch (category) {
      case "weight":
        return "bg-emerald-100 text-emerald-800";
      case "cardio":
        return "bg-blue-100 text-blue-800";
      case "strength":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
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
            className="h-5 w-5 text-indigo-500 mr-2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="border border-slate-100 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-sm">{goal.title}</h3>
                <Badge className={getBadgeColor(goal.category)}>
                  {goal.category}
                </Badge>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Progress</span>
                  <span>{goal.progress}%</span>
                </div>
                <Progress 
                  value={goal.progress} 
                  className="h-2 bg-slate-100" 
                />
              </div>
              
              <div className="flex justify-between text-xs text-slate-500">
                <div>
                  <span className="font-medium">{goal.startValue}</span>
                  <span className="text-slate-400 ml-1">{goal.unit}</span>
                </div>
                <div>
                  <span className="text-indigo-500 font-medium">{goal.currentValue}</span>
                  <span className="text-slate-400 ml-1">{goal.unit}</span>
                </div>
                <div>
                  <span className="font-medium">{goal.targetValue}</span>
                  <span className="text-slate-400 ml-1">{goal.unit}</span>
                </div>
              </div>
              
              <div className="text-xs text-slate-500 mt-2">
                Deadline: {goal.deadline}
              </div>
            </div>
          ))}
          
          {/* Add Goal button */}
          <button className="w-full py-2 rounded-md border border-dashed border-slate-300 text-sm text-slate-500 hover:bg-slate-50 transition-colors">
            + Add New Goal
          </button>
        </div>
      </CardContent>
    </Card>
  );
}