import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";

interface NutritionOverviewProps {
  userId: number;
}

export default function NutritionOverview({ userId }: NutritionOverviewProps) {
  const { data: activeDietPlan, isLoading: isLoadingDietPlan } = useQuery({
    queryKey: [`/api/users/${userId}/active-diet-plan`],
    staleTime: 60000, // 1 minute
  });

  const { data: todaysMeals, isLoading: isLoadingMeals } = useQuery({
    queryKey: [`/api/users/${userId}/meals`, { date: format(new Date(), 'yyyy-MM-dd') }],
    staleTime: 30000, // 30 seconds
  });

  const calculateNutritionSummary = () => {
    if (!todaysMeals || todaysMeals.length === 0) {
      return {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        calorieGoal: activeDietPlan?.dailyCalories || 2200
      };
    }

    const totalCalories = todaysMeals.reduce((sum: number, meal: any) => sum + meal.calories, 0);
    const totalProtein = todaysMeals.reduce((sum: number, meal: any) => sum + meal.protein, 0);
    const totalCarbs = todaysMeals.reduce((sum: number, meal: any) => sum + meal.carbs, 0);
    const totalFat = todaysMeals.reduce((sum: number, meal: any) => sum + meal.fat, 0);

    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      calorieGoal: activeDietPlan?.dailyCalories || 2200,
      proteinGoal: activeDietPlan ? (activeDietPlan.dailyCalories * activeDietPlan.proteinPercentage / 400) : 275, // Protein has 4 calories per gram
      carbsGoal: activeDietPlan ? (activeDietPlan.dailyCalories * activeDietPlan.carbsPercentage / 400) : 120,
      fatGoal: activeDietPlan ? (activeDietPlan.dailyCalories * activeDietPlan.fatPercentage / 900) : 60 // Fat has 9 calories per gram
    };
  };

  const nutrition = calculateNutritionSummary();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 py-5 sm:px-6 border-b border-slate-200">
        <CardTitle className="text-lg leading-6 font-medium text-slate-900">Today's Nutrition</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoadingDietPlan || isLoadingMeals ? (
          <div className="text-center py-4 text-slate-500">Loading nutrition data...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-900">Calories</h4>
                <p className="text-sm font-medium text-slate-900">
                  {nutrition.totalCalories} / {nutrition.calorieGoal}
                </p>
              </div>
              <Progress 
                value={(nutrition.totalCalories / nutrition.calorieGoal) * 100} 
                className="h-2.5" 
              />
              
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="flex justify-between mb-1">
                    <h5 className="text-xs font-medium text-slate-500">Carbs</h5>
                    <p className="text-xs font-medium text-slate-500">
                      {Math.round(nutrition.totalCarbs)}g / {Math.round(nutrition.carbsGoal)}g
                    </p>
                  </div>
                  <Progress 
                    value={(nutrition.totalCarbs / nutrition.carbsGoal) * 100} 
                    className="h-1.5 bg-slate-200" 
                    indicatorClassName="bg-blue-500" 
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <h5 className="text-xs font-medium text-slate-500">Protein</h5>
                    <p className="text-xs font-medium text-slate-500">
                      {Math.round(nutrition.totalProtein)}g / {Math.round(nutrition.proteinGoal)}g
                    </p>
                  </div>
                  <Progress 
                    value={(nutrition.totalProtein / nutrition.proteinGoal) * 100} 
                    className="h-1.5 bg-slate-200" 
                    indicatorClassName="bg-green-500" 
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <h5 className="text-xs font-medium text-slate-500">Fat</h5>
                    <p className="text-xs font-medium text-slate-500">
                      {Math.round(nutrition.totalFat)}g / {Math.round(nutrition.fatGoal)}g
                    </p>
                  </div>
                  <Progress 
                    value={(nutrition.totalFat / nutrition.fatGoal) * 100} 
                    className="h-1.5 bg-slate-200" 
                    indicatorClassName="bg-yellow-500" 
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-slate-900 mb-2">Today's Meals</h4>
              {todaysMeals && todaysMeals.length > 0 ? (
                <div className="space-y-1">
                  {todaysMeals.map((meal: any) => (
                    <div key={meal.id} className="flex items-center text-sm py-1 border-b border-slate-100">
                      <div className="w-20 text-xs text-slate-500">{meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}</div>
                      <div className="flex-1">{meal.name}</div>
                      <div className="w-16 text-right text-xs text-slate-500">{meal.calories} cal</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-2 text-slate-500 text-sm">No meals tracked today</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-slate-50 px-4 py-4 sm:px-6">
        <div className="text-sm flex justify-center w-full">
          <Link href="/diet">
            <Button variant="link" className="font-medium text-primary hover:text-indigo-700">Update meal plan</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
