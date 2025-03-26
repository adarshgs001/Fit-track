import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";
import DietPlanOverview from "@/components/diet/diet-plan-overview";
import MealPlan from "@/components/diet/meal-plan";
import MealSuggestionCard from "@/components/diet/meal-suggestion-card";
import { useQuery } from "@tanstack/react-query";

interface DietProps {
  setActiveTab: (tab: string) => void;
}

// Mock meal suggestions that would normally come from an API
const mealSuggestions = [
  {
    id: "1",
    name: "Quinoa Power Bowl",
    category: "High Protein",
    rating: 4.8,
    calories: 420,
    protein: 30,
    carbs: 45,
    fat: 15,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80"
  },
  {
    id: "2",
    name: "Protein Pancakes",
    category: "Breakfast",
    rating: 4.6,
    calories: 350,
    protein: 25,
    carbs: 30,
    fat: 12,
    imageUrl: "https://images.unsplash.com/photo-1539136788836-5699e78bfc75?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  },
  {
    id: "3",
    name: "Grilled Salmon & Veggies",
    category: "Dinner",
    rating: 4.9,
    calories: 480,
    protein: 40,
    carbs: 15,
    fat: 22,
    imageUrl: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  }
];

export default function Diet({ setActiveTab }: DietProps) {
  // Hard-coded user ID for demo purposes
  const userId = 1;
  const [mealTypeFilter, setMealTypeFilter] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab("diet");
  }, [setActiveTab]);

  const handleMealTypeFilterChange = (mealType: string | null) => {
    setMealTypeFilter(mealType);
  };

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold mb-4 sm:mb-0">Diet Plans</h1>
        <Button>
          <PlusIcon className="h-4 w-4 mr-1" />
          Create New Plan
        </Button>
      </div>

      {/* Diet Plan Overview */}
      <DietPlanOverview userId={userId} />

      {/* Daily Meal Plan */}
      <MealPlan userId={userId} />
      
      {/* Meal Suggestions */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-slate-200">
          <h2 className="text-lg font-medium">Meal Suggestions</h2>
          <p className="mt-1 text-sm text-slate-500">Based on your nutrition goals and preferences.</p>
        </div>
        <div className="px-4 py-3 sm:px-6 border-b border-slate-200 bg-slate-50">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={mealTypeFilter === null ? "default" : "outline"}
              onClick={() => handleMealTypeFilterChange(null)}
            >
              All
            </Button>
            <Button 
              variant={mealTypeFilter === "breakfast" ? "default" : "outline"}
              onClick={() => handleMealTypeFilterChange("breakfast")}
            >
              Breakfast
            </Button>
            <Button 
              variant={mealTypeFilter === "lunch" ? "default" : "outline"}
              onClick={() => handleMealTypeFilterChange("lunch")}
            >
              Lunch
            </Button>
            <Button 
              variant={mealTypeFilter === "dinner" ? "default" : "outline"}
              onClick={() => handleMealTypeFilterChange("dinner")}
            >
              Dinner
            </Button>
            <Button 
              variant={mealTypeFilter === "snacks" ? "default" : "outline"}
              onClick={() => handleMealTypeFilterChange("snacks")}
            >
              Snacks
            </Button>
            <Button 
              variant={mealTypeFilter === "high protein" ? "default" : "outline"}
              onClick={() => handleMealTypeFilterChange("high protein")}
            >
              High Protein
            </Button>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mealSuggestions
              .filter(meal => !mealTypeFilter || meal.category.toLowerCase() === mealTypeFilter.toLowerCase())
              .map(meal => (
                <MealSuggestionCard key={meal.id} meal={meal} userId={userId} />
              ))
            }
          </div>
        </div>
        <div className="bg-slate-50 px-4 py-4 sm:px-6">
          <div className="text-sm flex justify-center">
            <Button variant="link" className="font-medium text-primary hover:text-indigo-700">
              View all meal suggestions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
