import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressSummary from "@/components/progress/progress-summary";
import ProgressChart from "@/components/progress/progress-chart";
import BodyMeasurements from "@/components/progress/body-measurements";

interface ProgressProps {
  setActiveTab: (tab: string) => void;
}

export default function Progress({ setActiveTab }: ProgressProps) {
  // Hard-coded user ID for demo purposes
  const userId = 1;
  const [timeframe, setTimeframe] = useState("30days");

  useEffect(() => {
    setActiveTab("progress");
  }, [setActiveTab]);

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Your Progress</h1>
        <div className="flex space-x-4">
          <div className="relative inline-block text-left">
            <Button 
              variant="outline" 
              className="inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <span>{timeframe === "7days" ? "Last 7 Days" : timeframe === "30days" ? "Last 30 Days" : "Last 90 Days"}</span>
              <span className="material-icons text-sm ml-1">arrow_drop_down</span>
            </Button>
            {/* Dropdown menu would go here */}
          </div>
        </div>
      </div>

      {/* Progress Summary Cards */}
      <ProgressSummary userId={userId} />

      {/* Workout Activity Chart */}
      <ProgressChart 
        userId={userId} 
        title="Workout Activity" 
        dataKey="workoutsCompleted" 
      />

      {/* Strength Progress */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-slate-200">
          <h3 className="text-lg leading-6 font-medium text-slate-900">Strength Progress</h3>
          <p className="mt-1 text-sm text-slate-500">Track your lifting progress for key exercises.</p>
        </div>
        <div className="px-4 py-3 sm:px-6 border-b border-slate-200 bg-slate-50">
          <div className="flex flex-wrap gap-2">
            <Button variant="default">
              All
            </Button>
            <Button variant="outline">
              Bench Press
            </Button>
            <Button variant="outline">
              Squat
            </Button>
            <Button variant="outline">
              Deadlift
            </Button>
            <Button variant="outline">
              Shoulder Press
            </Button>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {/* Mock chart - in a real app this would be a real chart component */}
          <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <span className="material-icons text-4xl text-slate-300 mb-2">show_chart</span>
              <p className="text-sm text-slate-500">Weight progress over time for selected exercises</p>
            </div>
          </div>
        </div>
      </div>

      {/* Body Measurements */}
      <BodyMeasurements userId={userId} />
    </div>
  );
}
