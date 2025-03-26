import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { DietIcon, WaterDropIcon, CalendarIcon } from "@/components/ui/icons";
import type { DietPlan } from "@shared/schema";

interface DietPlanOverviewProps {
  userId: number;
}

export default function DietPlanOverview({ userId }: DietPlanOverviewProps) {
  const { data: activePlan, isLoading, error } = useQuery({
    queryKey: [`/api/users/${userId}/active-diet-plan`],
    staleTime: 60000, // 1 minute
  });

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="px-4 py-5 sm:px-6 border-b border-slate-200">
          <CardTitle className="text-lg font-medium">Loading Diet Plan...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error || !activePlan) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="px-4 py-5 sm:px-6 border-b border-slate-200">
          <CardTitle className="text-lg font-medium">No Active Diet Plan</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-5 sm:p-6">
          <p className="text-slate-600">Create a diet plan to get started with your nutrition tracking.</p>
        </CardContent>
      </Card>
    );
  }

  const plan: DietPlan = activePlan;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 py-5 sm:px-6 border-b border-slate-200">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{plan.name}</CardTitle>
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Active
          </Badge>
        </div>
        <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
      </CardHeader>
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <DietIcon className="text-primary mr-2 h-5 w-5" />
              <h3 className="text-md font-medium">Daily Targets</h3>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Calories</span>
                  <span className="font-medium">{plan.dailyCalories} kcal</span>
                </div>
                <Progress value={100} className="bg-slate-200 h-1.5 mt-1" />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Protein</span>
                  <span className="font-medium">
                    {Math.round((plan.dailyCalories * plan.proteinPercentage) / 400)}g ({plan.proteinPercentage}%)
                  </span>
                </div>
                <Progress 
                  value={plan.proteinPercentage} 
                  className="bg-slate-200 h-1.5 mt-1" 
                  indicatorClassName="bg-red-500" 
                />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Carbs</span>
                  <span className="font-medium">
                    {Math.round((plan.dailyCalories * plan.carbsPercentage) / 400)}g ({plan.carbsPercentage}%)
                  </span>
                </div>
                <Progress 
                  value={plan.carbsPercentage} 
                  className="bg-slate-200 h-1.5 mt-1" 
                  indicatorClassName="bg-blue-500" 
                />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Fat</span>
                  <span className="font-medium">
                    {Math.round((plan.dailyCalories * plan.fatPercentage) / 900)}g ({plan.fatPercentage}%)
                  </span>
                </div>
                <Progress 
                  value={plan.fatPercentage} 
                  className="bg-slate-200 h-1.5 mt-1" 
                  indicatorClassName="bg-yellow-500" 
                />
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <WaterDropIcon className="text-primary mr-2 h-5 w-5" />
              <h3 className="text-md font-medium">Additional Goals</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="relative h-5 w-5 flex items-center justify-center mr-2">
                  <span className="material-icons text-secondary text-sm">check_circle</span>
                </div>
                <span className="text-sm">Drink 3L of water daily</span>
              </div>
              <div className="flex items-center">
                <div className="relative h-5 w-5 flex items-center justify-center mr-2">
                  <span className="material-icons text-secondary text-sm">check_circle</span>
                </div>
                <span className="text-sm">Include 30g of fiber</span>
              </div>
              <div className="flex items-center">
                <div className="relative h-5 w-5 flex items-center justify-center mr-2">
                  <span className="material-icons text-secondary text-sm">check_circle</span>
                </div>
                <span className="text-sm">Limit added sugars to 25g</span>
              </div>
              <div className="flex items-center">
                <div className="relative h-5 w-5 flex items-center justify-center mr-2">
                  <span className="material-icons text-secondary text-sm">check_circle</span>
                </div>
                <span className="text-sm">Take daily multivitamin</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <CalendarIcon className="text-primary mr-2 h-5 w-5" />
              <h3 className="text-md font-medium">Meal Schedule</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Breakfast</span>
                <span className="text-xs text-slate-500">7:00 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Mid-Morning Snack</span>
                <span className="text-xs text-slate-500">10:00 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Lunch</span>
                <span className="text-xs text-slate-500">1:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Afternoon Snack</span>
                <span className="text-xs text-slate-500">4:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Dinner</span>
                <span className="text-xs text-slate-500">7:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
