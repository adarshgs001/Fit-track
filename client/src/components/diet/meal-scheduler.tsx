import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, ClockIcon, PlusIcon } from "@/components/ui/icons";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, parseISO, isSameDay, addDays } from "date-fns";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Meal } from "@shared/schema";

interface MealSchedulerProps {
  userId: number;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function MealScheduler({ userId, selectedDate, onDateChange }: MealSchedulerProps) {
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMealData, setNewMealData] = useState({
    name: "",
    mealType: "breakfast",
    time: "08:00",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    notes: ""
  });
  
  const { data: meals, isLoading: mealsLoading } = useQuery({
    queryKey: [`/api/users/${userId}/meals`, { date: format(selectedDate, 'yyyy-MM-dd') }],
    staleTime: 60000, // 1 minute
  });
  
  const { data: mealSuggestions, isLoading: suggestionsLoading } = useQuery<Meal[]>({
    queryKey: [`/api/meal-suggestions`],
    staleTime: 3600000, // 1 hour
  });
  
  const createMealMutation = useMutation({
    mutationFn: async (mealData: any) => {
      return await apiRequest("POST", `/api/meals`, {
        ...mealData,
        userId,
        date: format(selectedDate, 'yyyy-MM-dd'),
        completed: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/meals`] });
      setShowAddMeal(false);
      setNewMealData({
        name: "",
        mealType: "breakfast",
        time: "08:00",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        notes: ""
      });
    }
  });
  
  const updateMealMutation = useMutation({
    mutationFn: async ({ mealId, completed }: { mealId: number; completed: boolean }) => {
      await apiRequest("PUT", `/api/meals/${mealId}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/meals`] });
    }
  });
  
  const deleteMealMutation = useMutation({
    mutationFn: async (mealId: number) => {
      await apiRequest("DELETE", `/api/meals/${mealId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/meals`] });
    }
  });
  
  const handlePreviousDay = () => {
    onDateChange(addDays(selectedDate, -1));
  };
  
  const handleNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };
  
  const handleCreateMeal = () => {
    createMealMutation.mutate(newMealData);
  };
  
  const handleMealCompletion = (meal: Meal) => {
    updateMealMutation.mutate({
      mealId: meal.id,
      completed: !meal.completed
    });
  };
  
  const handleDeleteMeal = (mealId: number) => {
    if (window.confirm("Are you sure you want to delete this meal?")) {
      deleteMealMutation.mutate(mealId);
    }
  };
  
  const handleSuggestionSelect = (suggestion: Meal) => {
    setNewMealData({
      ...newMealData,
      name: suggestion.name,
      calories: suggestion.calories,
      protein: suggestion.protein,
      carbs: suggestion.carbs,
      fat: suggestion.fat
    });
  };
  
  interface NutrientTotals {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }

  const getTotalNutrients = (): NutrientTotals => {
    if (!meals || !Array.isArray(meals) || meals.length === 0) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    
    return meals.reduce((totals: NutrientTotals, meal: Meal) => {
      return {
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };
  
  const formatSelectedDate = () => {
    const today = new Date();
    
    if (isSameDay(selectedDate, today)) {
      return "Today";
    } else if (isSameDay(selectedDate, addDays(today, 1))) {
      return "Tomorrow";
    } else if (isSameDay(selectedDate, addDays(today, -1))) {
      return "Yesterday";
    } else {
      return format(selectedDate, "EEEE, MMMM d");
    }
  };
  
  const getFormattedTime = (timeString: string) => {
    try {
      // Convert HH:MM to a date object for formatting
      const date = new Date();
      const [hours, minutes] = timeString.split(':').map(Number);
      date.setHours(hours, minutes);
      return format(date, 'h:mm a');
    } catch (e) {
      return timeString;
    }
  };
  
  const groupMealsByType = (): Record<string, Meal[]> => {
    if (!meals || !Array.isArray(meals)) return {};
    
    const mealTypes = ["breakfast", "morning snack", "lunch", "afternoon snack", "dinner", "evening snack"];
    const grouped: Record<string, Meal[]> = {};
    
    mealTypes.forEach(type => {
      grouped[type] = meals.filter((meal: Meal) => meal.mealType.toLowerCase() === type);
    });
    
    return grouped;
  };
  
  const groupedMeals = groupMealsByType();
  const totals = getTotalNutrients();
  
  const getMealTypeTitle = (type: string) => {
    return type.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="px-4 py-5 sm:px-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Meal Schedule</CardTitle>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 rounded-full text-slate-400 hover:text-slate-500 mr-2"
                onClick={handlePreviousDay}
              >
                <span className="sr-only">Previous day</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{formatSelectedDate()}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && onDateChange(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 rounded-full text-slate-400 hover:text-slate-500 ml-2"
                onClick={handleNextDay}
              >
                <span className="sr-only">Next day</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {mealsLoading ? (
            <div className="p-6 text-center text-slate-500">Loading meals...</div>
          ) : meals && Array.isArray(meals) && meals.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {Object.keys(groupedMeals).map(mealType => {
                const mealsList = groupedMeals[mealType];
                if (mealsList.length === 0) return null;
                
                return (
                  <div key={mealType} className="py-4 px-6">
                    <h3 className="text-sm font-medium text-slate-900 mb-3">{getMealTypeTitle(mealType)}</h3>
                    <div className="space-y-3">
                      {mealsList.map((meal: Meal) => (
                        <div key={meal.id} className="flex items-start p-3 bg-slate-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="text-sm font-medium text-slate-900">{meal.name}</h4>
                                <div className="text-xs text-slate-500 mt-0.5 flex items-center">
                                  <ClockIcon className="h-3 w-3 mr-1" />
                                  {getFormattedTime(meal.time || "12:00")}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-medium text-slate-900">{meal.calories} kcal</span>
                                <div className="text-xs text-slate-500 mt-0.5 flex items-center justify-end">
                                  <span className="mr-2">P: {meal.protein}g</span>
                                  <span className="mr-2">C: {meal.carbs}g</span>
                                  <span>F: {meal.fat}g</span>
                                </div>
                              </div>
                            </div>
                            
                            {meal.notes && (
                              <p className="mt-1 text-xs text-slate-500">{meal.notes}</p>
                            )}
                            
                            <div className="mt-2 flex items-center gap-2">
                              <Button 
                                variant={meal.completed ? "default" : "outline"} 
                                size="sm" 
                                className="h-7 text-xs"
                                onClick={() => handleMealCompletion(meal)}
                              >
                                {meal.completed ? "Completed" : "Mark as eaten"}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteMeal(meal.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500">
              No meals planned for {format(selectedDate, "MMMM d, yyyy")}.<br />
              Add a meal to get started.
            </div>
          )}
        </CardContent>
        
        <CardFooter className="bg-slate-50 p-4 border-t border-slate-200">
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium">Daily Totals</h3>
              <Dialog open={showAddMeal} onOpenChange={setShowAddMeal}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Meal
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Meal</DialogTitle>
                    <DialogDescription>
                      Schedule a meal for {format(selectedDate, "MMMM d, yyyy")}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-4">
                        <Label htmlFor="meal-name">Meal Name</Label>
                        <Input 
                          id="meal-name" 
                          value={newMealData.name} 
                          onChange={(e) => setNewMealData({...newMealData, name: e.target.value})}
                          placeholder="e.g., Grilled Chicken Salad" 
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="meal-type">Meal Type</Label>
                        <Select 
                          value={newMealData.mealType} 
                          onValueChange={(value) => setNewMealData({...newMealData, mealType: value})}
                        >
                          <SelectTrigger id="meal-type">
                            <SelectValue placeholder="Select meal type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="breakfast">Breakfast</SelectItem>
                            <SelectItem value="morning snack">Morning Snack</SelectItem>
                            <SelectItem value="lunch">Lunch</SelectItem>
                            <SelectItem value="afternoon snack">Afternoon Snack</SelectItem>
                            <SelectItem value="dinner">Dinner</SelectItem>
                            <SelectItem value="evening snack">Evening Snack</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="meal-time">Time</Label>
                        <Input 
                          id="meal-time" 
                          type="time" 
                          value={newMealData.time} 
                          onChange={(e) => setNewMealData({...newMealData, time: e.target.value})}
                        />
                      </div>
                      <div className="col-span-1">
                        <Label htmlFor="calories">Calories</Label>
                        <Input 
                          id="calories" 
                          type="number" 
                          value={newMealData.calories.toString()} 
                          onChange={(e) => setNewMealData({...newMealData, calories: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div className="col-span-1">
                        <Label htmlFor="protein">Protein (g)</Label>
                        <Input 
                          id="protein" 
                          type="number" 
                          value={newMealData.protein.toString()} 
                          onChange={(e) => setNewMealData({...newMealData, protein: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div className="col-span-1">
                        <Label htmlFor="carbs">Carbs (g)</Label>
                        <Input 
                          id="carbs" 
                          type="number" 
                          value={newMealData.carbs.toString()} 
                          onChange={(e) => setNewMealData({...newMealData, carbs: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div className="col-span-1">
                        <Label htmlFor="fat">Fat (g)</Label>
                        <Input 
                          id="fat" 
                          type="number" 
                          value={newMealData.fat.toString()} 
                          onChange={(e) => setNewMealData({...newMealData, fat: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div className="col-span-4">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Input 
                          id="notes" 
                          value={newMealData.notes} 
                          onChange={(e) => setNewMealData({...newMealData, notes: e.target.value})}
                          placeholder="Any special instructions or ingredients" 
                        />
                      </div>
                    </div>
                    
                    {!suggestionsLoading && mealSuggestions && Array.isArray(mealSuggestions) && mealSuggestions.length > 0 && (
                      <div>
                        <Label className="mb-2 block">Suggestions</Label>
                        <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto p-1">
                          {mealSuggestions.map((suggestion: Meal) => (
                            <Button 
                              key={suggestion.id} 
                              variant="outline" 
                              size="sm" 
                              className="justify-start text-xs"
                              onClick={() => handleSuggestionSelect(suggestion)}
                            >
                              <div className="truncate">{suggestion.name}</div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddMeal(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateMeal}
                      disabled={!newMealData.name || createMealMutation.isPending}
                    >
                      {createMealMutation.isPending ? "Adding..." : "Add Meal"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white rounded p-2 text-center">
                <div className="text-xs text-slate-500">Calories</div>
                <div className="text-sm font-bold">{totals.calories} kcal</div>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <div className="text-xs text-slate-500">Protein</div>
                <div className="text-sm font-bold">{totals.protein}g</div>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <div className="text-xs text-slate-500">Carbs</div>
                <div className="text-sm font-bold">{totals.carbs}g</div>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <div className="text-xs text-slate-500">Fat</div>
                <div className="text-sm font-bold">{totals.fat}g</div>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}