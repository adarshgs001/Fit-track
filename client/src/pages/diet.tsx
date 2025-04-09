import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DietPlanOverview from "@/components/diet/diet-plan-overview";
import MealPlan from "@/components/diet/meal-plan";
import MealScheduler from "@/components/diet/meal-scheduler";
import MealFilters from "@/components/diet/meal-filters";
import MealSuggestionCard from "@/components/diet/meal-suggestion-card";
import NutritionProgressChart from "@/components/diet/nutrition-progress-chart";
import { useQuery } from "@tanstack/react-query";

interface DietProps {
  setActiveTab: (tab: string) => void;
}

export default function Diet({ setActiveTab }: DietProps) {
  // Hard-coded user ID for demo purposes
  const userId = 1;
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  const [caloriesRange, setCaloriesRange] = useState<[number, number]>([0, 1000]);
  const [proteinRange, setProteinRange] = useState<[number, number]>([0, 100]);
  const [carbsRange, setCarbsRange] = useState<[number, number]>([0, 100]);
  const [fatRange, setFatRange] = useState<[number, number]>([0, 100]);

  useEffect(() => {
    setActiveTab("diet");
  }, [setActiveTab]);

  // Fetch meal suggestions based on filters
  const { data: mealSuggestions, isLoading: suggestionsLoading } = useQuery({
    queryKey: [
      '/api/meal-suggestions', 
      { 
        query: searchQuery,
        mealType: selectedMealType,
        minCalories: caloriesRange[0],
        maxCalories: caloriesRange[1],
        minProtein: proteinRange[0],
        maxProtein: proteinRange[1],
        minCarbs: carbsRange[0],
        maxCarbs: carbsRange[1],
        minFat: fatRange[0],
        maxFat: fatRange[1]
      }
    ],
    staleTime: 60000, // 1 minute
    placeholderData: [], // Use empty array as placeholder data while loading
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleMealTypeChange = (mealType: string | null) => {
    setSelectedMealType(mealType);
  };

  const handleCaloriesChange = (range: [number, number]) => {
    setCaloriesRange(range);
  };

  const handleNutrientFilterChange = (type: string, range: [number, number]) => {
    switch (type) {
      case "protein":
        setProteinRange(range);
        break;
      case "carbs":
        setCarbsRange(range);
        break;
      case "fat":
        setFatRange(range);
        break;
    }
  };

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold mb-4 sm:mb-0">Nutrition Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <PlusIcon className="h-4 w-4 mr-1" />
            Create New Plan
          </Button>
          <Button>Track Water Intake</Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="w-full border-b p-0 mb-4">
          <TabsTrigger value="overview" className="flex-1 py-3 rounded-none">Overview</TabsTrigger>
          <TabsTrigger value="meal-planning" className="flex-1 py-3 rounded-none">Meal Planning</TabsTrigger>
          <TabsTrigger value="progress" className="flex-1 py-3 rounded-none">Progress</TabsTrigger>
          <TabsTrigger value="suggestions" className="flex-1 py-3 rounded-none">Meal Ideas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-0">
          {/* Diet Plan Overview */}
          <DietPlanOverview userId={userId} />

          {/* Daily Meal Plan */}
          <MealPlan userId={userId} />
        </TabsContent>

        <TabsContent value="meal-planning" className="space-y-6 mt-0">
          {/* Enhanced Meal Scheduler */}
          <MealScheduler 
            userId={userId} 
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate} 
          />
        </TabsContent>

        <TabsContent value="progress" className="space-y-6 mt-0">
          {/* Nutrition Progress Tracking */}
          <NutritionProgressChart userId={userId} />
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6 mt-0">
          {/* Advanced Meal Filtering */}
          <MealFilters
            onSearch={handleSearch}
            onMealTypeChange={handleMealTypeChange}
            onDateChange={(date) => null} // Not used in suggestions
            onCaloriesChange={handleCaloriesChange}
            onNutrientFilterChange={handleNutrientFilterChange}
            selectedMealType={selectedMealType}
            selectedDate={null} // Not used in suggestions
            caloriesRange={caloriesRange}
            proteinRange={proteinRange}
            carbsRange={carbsRange}
            fatRange={fatRange}
          />

          {/* Meal Suggestions List */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              {suggestionsLoading ? (
                <div className="text-center py-8">Loading meal suggestions...</div>
              ) : mealSuggestions && mealSuggestions.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {mealSuggestions.map((meal: any) => (
                    <MealSuggestionCard key={meal.id} meal={meal} userId={userId} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>No meal suggestions found matching your filters.</p>
                  <Button variant="link" onClick={() => {
                    setSearchQuery("");
                    setSelectedMealType(null);
                    setCaloriesRange([0, 1000]);
                    setProteinRange([0, 100]);
                    setCarbsRange([0, 100]);
                    setFatRange([0, 100]);
                  }}>
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
