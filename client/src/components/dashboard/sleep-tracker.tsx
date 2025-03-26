import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart } from "@/components/ui/chart";

export default function SleepTracker() {
  // Mock data for sleep quality
  const sleepData = [
    { day: "Mon", hours: 7.5, quality: 80 },
    { day: "Tue", hours: 8, quality: 85 },
    { day: "Wed", hours: 6.5, quality: 60 },
    { day: "Thu", hours: 7, quality: 75 },
    { day: "Fri", hours: 8.5, quality: 90 },
    { day: "Sat", hours: 9, quality: 95 },
    { day: "Sun", hours: 7.5, quality: 80 },
  ];

  // Calculate sleep quality score (average of the week)
  const avgQuality = sleepData.reduce((sum, day) => sum + day.quality, 0) / sleepData.length;
  
  // Calculate average sleep hours
  const avgHours = sleepData.reduce((sum, day) => sum + day.hours, 0) / sleepData.length;

  return (
    <Card className="col-span-1">
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
            className="h-5 w-5 text-blue-500 mr-2"
          >
            <path d="M12 21.39A10.5 10.5 0 1 1 22.5 10.5" />
            <path d="M11 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            <path d="M12 8v1" />
            <path d="M12 15v1" />
            <path d="M16 12h-1" />
            <path d="M9 12H8" />
          </svg>
          Sleep Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Sleep Quality</span>
              <span className="text-sm font-medium">{avgQuality.toFixed(0)}%</span>
            </div>
            <Progress 
              value={avgQuality} 
              className="h-2 bg-slate-100" 
            />
            <div className="text-xs text-muted-foreground mt-1">Based on last 7 nights</div>
          </div>
          
          <div className="flex flex-col mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Avg. Sleep Time</span>
              <span className="text-sm font-medium">{avgHours.toFixed(1)} hrs</span>
            </div>
            <div className="flex items-center">
              {sleepData.map((day, i) => (
                <div 
                  key={day.day} 
                  className="flex-1 flex flex-col items-center"
                >
                  <div 
                    className="w-full bg-blue-50 rounded-sm overflow-hidden" 
                    style={{ height: "60px" }}
                  >
                    <div 
                      className="bg-blue-500 w-full" 
                      style={{ 
                        height: `${(day.hours / 12) * 100}%`,
                        marginTop: `${100 - (day.hours / 12) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-xs mt-1">{day.day}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Weekly Analysis</span>
            </div>
            <div style={{ height: "120px" }}>
              <BarChart
                data={sleepData}
                index="day"
                categories={["hours"]}
                colors={["#3b82f6"]}
                valueFormatter={(value) => `${value}h`}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}