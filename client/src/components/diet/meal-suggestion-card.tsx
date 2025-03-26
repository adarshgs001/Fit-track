import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusIcon, StarIcon } from "@/components/ui/icons";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface MealSuggestion {
  id: string;
  name: string;
  category: string;
  rating: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl: string;
}

interface MealSuggestionCardProps {
  meal: MealSuggestion;
  userId: number;
}

export default function MealSuggestionCard({ meal, userId }: MealSuggestionCardProps) {
  const { toast } = useToast();

  const addMealMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/meals", {
        userId,
        name: meal.name,
        mealType: meal.category.toLowerCase(),
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        imageUrl: meal.imageUrl,
        date: format(new Date(), "yyyy-MM-dd"),
        completed: false
      });
    },
    onSuccess: () => {
      toast({
        title: "Meal added",
        description: `${meal.name} has been added to your meal plan for today.`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/meals`] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add meal to your plan. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleAddMeal = () => {
    addMealMutation.mutate();
  };

  return (
    <div className="bg-slate-50 rounded-lg overflow-hidden shadow-sm">
      <div className="h-40 bg-slate-200">
        <img 
          src={meal.imageUrl} 
          alt={meal.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium">{meal.name}</h3>
        <div className="mt-1 flex items-center text-xs text-slate-500">
          <Badge variant="outline" className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded-sm mr-1.5">
            {meal.category}
          </Badge>
          <StarIcon className="text-amber-400 text-xs h-3 w-3" />
          <span className="ml-1">{meal.rating.toFixed(1)}</span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex space-x-2">
          <div className="flex items-center">
            <span className="font-medium">{meal.calories}</span> cal
          </div>
          <div className="flex items-center">
            <span className="font-medium">{meal.protein}g</span> protein
          </div>
          <div className="flex items-center">
            <span className="font-medium">{meal.carbs}g</span> carbs
          </div>
        </div>
        <Button 
          onClick={handleAddMeal}
          disabled={addMealMutation.isPending}
          className="mt-3 w-full text-sm h-8"
          variant="outline"
        >
          <PlusIcon className="h-3 w-3 mr-1" />
          Add to Meal Plan
        </Button>
      </div>
    </div>
  );
}
