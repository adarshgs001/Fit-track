import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, EditIcon, ChevronLeftIcon, ChevronRightIcon, MoreIcon } from "@/components/ui/icons";
import type { Meal } from "@shared/schema";

interface MealPlanProps {
  userId: number;
}

export default function MealPlan({ userId }: MealPlanProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: meals, isLoading, error } = useQuery({
    queryKey: [`/api/users/${userId}/meals`, { date: format(selectedDate, 'yyyy-MM-dd') }],
    staleTime: 60000, // 1 minute
  });

  const toggleMealCompletionMutation = useMutation({
    mutationFn: async ({ mealId, completed }: { mealId: number; completed: boolean }) => {
      await apiRequest("PUT", `/api/meals/${mealId}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/meals`] });
    }
  });

  const handlePreviousDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const formatSelectedDate = () => {
    const today = new Date();
    
    if (isSameDay(selectedDate, today)) {
      return "Today";
    } else if (isSameDay(selectedDate, addDays(today, 1))) {
      return "Tomorrow";
    } else if (isSameDay(selectedDate, subDays(today, 1))) {
      return "Yesterday";
    } else {
      return format(selectedDate, "EEEE, MMMM d");
    }
  };

  const handleMealCompletion = (meal: Meal) => {
    toggleMealCompletionMutation.mutate({
      mealId: meal.id,
      completed: !meal.completed
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 py-5 sm:px-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Today's Meals</CardTitle>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 rounded-full text-slate-400 hover:text-slate-500 mr-2"
              onClick={handlePreviousDay}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium">{formatSelectedDate()}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 rounded-full text-slate-400 hover:text-slate-500 ml-2"
              onClick={handleNextDay}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-4 text-slate-500">Loading meals...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">Failed to load meals</div>
          ) : meals && meals.length > 0 ? (
            meals.map((meal: Meal) => (
              <div key={meal.id} className="bg-slate-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-medium">{meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}</h3>
                  <div className="flex items-center">
                    <span className="text-xs text-slate-500 mr-2">{meal.calories} calories</span>
                    <div className="relative">
                      <Button variant="ghost" size="sm" className="p-1 h-auto text-slate-400 hover:text-slate-500">
                        <MoreIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-64 h-32 md:h-auto rounded-lg bg-slate-200 overflow-hidden">
                    <img 
                      src={meal.imageUrl || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"} 
                      alt={meal.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 mt-3 md:mt-0 md:ml-4">
                    <h4 className="text-sm font-medium">{meal.name}</h4>
                    <div className="mt-1 text-sm text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                      <div className="flex items-center">
                        <span className="material-icons text-xs mr-1">restaurant</span>
                        <span>Protein: {meal.protein}g</span>
                      </div>
                      <div className="flex items-center">
                        <span className="material-icons text-xs mr-1">grain</span>
                        <span>Carbs: {meal.carbs}g</span>
                      </div>
                      <div className="flex items-center">
                        <span className="material-icons text-xs mr-1">opacity</span>
                        <span>Fat: {meal.fat}g</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{meal.recipe || "No recipe available"}</p>
                    <div className="mt-3 flex space-x-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        <EditIcon className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant={meal.completed ? "default" : "secondary"} 
                        className="text-xs"
                        onClick={() => handleMealCompletion(meal)}
                        disabled={toggleMealCompletionMutation.isPending}
                      >
                        <CheckIcon className="h-3 w-3 mr-1" />
                        {meal.completed ? "Completed" : "Mark Complete"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-slate-500">
              No meals planned for {format(selectedDate, "MMMM d, yyyy")}.
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 px-4 py-4 sm:px-6">
        <div className="text-sm flex justify-center w-full">
          <Button variant="link" className="font-medium text-primary hover:text-indigo-700">
            Add meal to this day
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
