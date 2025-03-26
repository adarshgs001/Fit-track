import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart } from "@/components/ui/chart";

export default function WorkoutProgressGraph() {
  // Mock data for workout tracking
  const progressData = [
    { 
      week: "Week 1", 
      completed: 5, 
      scheduled: 5, 
      completion: 100, // percentage
      date: "Mar 1-7"
    },
    { 
      week: "Week 2", 
      completed: 4, 
      scheduled: 5, 
      completion: 80,
      date: "Mar 8-14"
    },
    { 
      week: "Week 3", 
      completed: 5, 
      scheduled: 5, 
      completion: 100,
      date: "Mar 15-21"
    },
    { 
      week: "Week 4", 
      completed: 3, 
      scheduled: 5, 
      completion: 60,
      date: "Mar 22-28"
    }
  ];

  // Calculate average completion rate
  const avgCompletion = progressData.reduce((sum, week) => sum + week.completion, 0) / progressData.length;
  
  // Weekly completion data for trend visualization
  const chartData = progressData.map(week => ({
    name: week.week,
    completed: week.completed,
    scheduled: week.scheduled,
    completion: week.completion
  }));

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
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 9h6v6H9z" />
              <path d="M5 5h14" />
              <path d="M5 12h2" />
              <path d="M5 19h2" />
              <path d="M17 12h2" />
              <path d="M17 19h2" />
            </svg>
            Workout Consistency
          </div>
          <span className={`text-sm font-medium ${
            avgCompletion >= 80 ? "text-emerald-600" : 
            avgCompletion >= 60 ? "text-amber-600" : 
            "text-red-600"
          }`}>{avgCompletion.toFixed(0)}% avg</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Completion rate by week visualization */}
          <div style={{ height: "170px" }}>
            <LineChart
              data={chartData}
              index="name"
              categories={["completed", "scheduled"]}
              colors={["#4f46e5", "#cbd5e1"]}
              valueFormatter={(value) => `${value} workouts`}
            />
          </div>
          
          {/* Stats breakdown */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {progressData.map((week, idx) => (
              <div key={idx} className="bg-slate-50 p-2 rounded flex flex-col">
                <span className="text-slate-500">{week.date}</span>
                <div className="mt-1 font-medium">
                  {week.completed}/{week.scheduled}
                </div>
                <div className="mt-1 relative h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`absolute inset-y-0 left-0 ${
                      week.completion >= 80 ? "bg-emerald-500" : 
                      week.completion >= 60 ? "bg-amber-500" : 
                      "bg-red-500"
                    }`} 
                    style={{ width: `${week.completion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Insights and tips */}
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
            <p className="font-medium mb-1">💡 Insight</p>
            <p className="text-xs">Your workout consistency has decreased this week. Try scheduling workouts in the morning to improve adherence.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}