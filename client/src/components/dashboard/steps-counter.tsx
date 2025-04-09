import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/contexts/ProgressContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function StepsCounter() {
  const { getStepsData, logSteps, isLoading } = useProgress();
  const { toast } = useToast();
  const stepsData = getStepsData();
  const [showAdd, setShowAdd] = useState(false);
  const [stepsToAdd, setStepsToAdd] = useState(1000);

  const handleAddSteps = async () => {
    if (showAdd) {
      try {
        await logSteps(stepsData.current + stepsToAdd);
        toast({
          title: "Steps logged",
          description: `Added ${stepsToAdd} steps to your count.`,
        });
        setShowAdd(false);
      } catch (error) {
        toast({
          title: "Failed to log steps",
          description: "An error occurred while logging your steps.",
          variant: "destructive",
        });
      }
    } else {
      setShowAdd(true);
    }
  };

  return (
    <Card>
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
              className="h-5 w-5 text-emerald-500 mr-2"
            >
              <path d="M19 5.93 12.73 12 9.43 9.34a1 1 0 0 0-1.6.22l-5.6 12A1 1 0 0 0 3 23h18a1 1 0 0 0 .9-1.45L15.42 7.12a1 1 0 0 0-1.55-.75L12 7.5" />
              <path d="M14 2v2" />
              <path d="M20 2v6" />
            </svg>
            Steps
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={handleAddSteps}
            disabled={isLoading}
          >
            {showAdd ? "Save Steps" : "Log Steps"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {showAdd ? (
            <div className="flex items-center justify-between">
              <input
                type="number"
                className="w-full py-2 px-3 border rounded-md text-base"
                value={stepsToAdd}
                onChange={(e) => setStepsToAdd(Number(e.target.value))}
                min="1"
                max="50000"
              />
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-3xl font-bold">{stepsData.current.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">of {stepsData.goal.toLocaleString()} goal</span>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
                <span className="text-emerald-600 font-medium text-sm">{stepsData.trend}</span>
              </div>
            </div>
          )}
          
          <Progress 
            value={stepsData.percentage} 
            className="h-2 bg-slate-100" 
          />
          
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-emerald-50 p-2 rounded">
              <div className="font-medium text-emerald-600">{stepsData.distance}</div>
              <div className="text-muted-foreground">Distance</div>
            </div>
            <div className="bg-amber-50 p-2 rounded">
              <div className="font-medium text-amber-600">{stepsData.calories}</div>
              <div className="text-muted-foreground">Calories</div>
            </div>
            <div className="bg-blue-50 p-2 rounded">
              <div className="font-medium text-blue-600">{stepsData.activeMinutes} min</div>
              <div className="text-muted-foreground">Active</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}