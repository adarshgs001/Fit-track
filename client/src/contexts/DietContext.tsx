import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DietPlan, Meal, InsertMeal, InsertDietPlan } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface DietContextType {
  meals: Meal[];
  dietPlans: DietPlan[];
  activeDietPlan: DietPlan | null;
  isLoading: boolean;
  error: unknown;
  createMeal: (meal: InsertMeal) => Promise<Meal>;
  updateMeal: (id: number, meal: Partial<InsertMeal>) => Promise<void>;
  deleteMeal: (id: number) => Promise<void>;
  createDietPlan: (plan: InsertDietPlan) => Promise<DietPlan>;
  updateDietPlan: (id: number, plan: Partial<InsertDietPlan>) => Promise<void>;
  deleteDietPlan: (id: number) => Promise<void>;
  setActiveDietPlan: (id: number) => Promise<void>;
  getMealsByDate: (date: Date) => Meal[];
  getMealsByDateRange: (startDate: Date, endDate: Date) => Promise<Meal[]>;
  getCaloriesConsumedToday: () => number;
  getNutritionTotals: (meals: Meal[]) => {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const DietContext = createContext<DietContextType | undefined>(undefined);

interface DietProviderProps {
  children: ReactNode;
  userId?: number;
}

export function DietProvider({ children, userId = 1 }: DietProviderProps) {
  const queryClient = useQueryClient();
  
  // Fetch all meals
  const { 
    data: meals = [], 
    isLoading: isMealsLoading, 
    error: mealsError 
  } = useQuery<Meal[]>({
    queryKey: [`/api/users/${userId}/meals`],
    staleTime: 60000, // 1 minute
  });
  
  // Fetch diet plans
  const { 
    data: dietPlans = [], 
    isLoading: isDietPlansLoading, 
    error: dietPlansError 
  } = useQuery<DietPlan[]>({
    queryKey: [`/api/users/${userId}/diet-plans`],
    staleTime: 60000,
  });
  
  // Fetch active diet plan
  const { 
    data: activeDietPlan, 
    isLoading: isActiveDietPlanLoading, 
    error: activeDietPlanError 
  } = useQuery<DietPlan>({
    queryKey: [`/api/users/${userId}/active-diet-plan`],
    staleTime: 60000,
  });
  
  // Create a new meal
  const createMealMutation = useMutation({
    mutationFn: (newMeal: InsertMeal) => {
      return apiRequest<Meal>('/api/meals', {
        method: 'POST',
        body: JSON.stringify(newMeal),
      });
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/meals`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/stats`] });
    },
  });
  
  // Update a meal
  const updateMealMutation = useMutation({
    mutationFn: ({ id, meal }: { id: number; meal: Partial<InsertMeal> }) => {
      return apiRequest<void>(`/api/meals/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(meal),
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [`/api/meals/${variables.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/meals`] });
    },
  });
  
  // Delete a meal
  const deleteMealMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest<void>(`/api/meals/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/meals`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/stats`] });
    },
  });
  
  // Create a diet plan
  const createDietPlanMutation = useMutation({
    mutationFn: (newPlan: InsertDietPlan) => {
      return apiRequest<DietPlan>('/api/diet-plans', {
        method: 'POST',
        body: JSON.stringify(newPlan),
      });
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/diet-plans`] });
    },
  });
  
  // Update a diet plan
  const updateDietPlanMutation = useMutation({
    mutationFn: ({ id, plan }: { id: number; plan: Partial<InsertDietPlan> }) => {
      return apiRequest<void>(`/api/diet-plans/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(plan),
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [`/api/diet-plans/${variables.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/diet-plans`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/active-diet-plan`] });
    },
  });
  
  // Delete a diet plan
  const deleteDietPlanMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest<void>(`/api/diet-plans/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/diet-plans`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/active-diet-plan`] });
    },
  });
  
  // Set active diet plan
  const setActiveDietPlanMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest<void>(`/api/users/${userId}/set-active-diet-plan`, {
        method: 'POST',
        body: JSON.stringify({ dietPlanId: id }),
      });
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/active-diet-plan`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/diet-plans`] });
    },
  });
  
  // Helper functions that invoke the mutations
  const createMeal = async (meal: InsertMeal): Promise<Meal> => {
    return createMealMutation.mutateAsync(meal);
  };
  
  const updateMeal = async (id: number, meal: Partial<InsertMeal>): Promise<void> => {
    await updateMealMutation.mutateAsync({ id, meal });
  };
  
  const deleteMeal = async (id: number): Promise<void> => {
    await deleteMealMutation.mutateAsync(id);
  };
  
  const createDietPlan = async (plan: InsertDietPlan): Promise<DietPlan> => {
    return createDietPlanMutation.mutateAsync(plan);
  };
  
  const updateDietPlan = async (id: number, plan: Partial<InsertDietPlan>): Promise<void> => {
    await updateDietPlanMutation.mutateAsync({ id, plan });
  };
  
  const deleteDietPlan = async (id: number): Promise<void> => {
    await deleteDietPlanMutation.mutateAsync(id);
  };
  
  const setActiveDietPlan = async (id: number): Promise<void> => {
    await setActiveDietPlanMutation.mutateAsync(id);
  };
  
  // Function to fetch meals by date range via a query
  const getMealsByDateRange = async (startDate: Date, endDate: Date): Promise<Meal[]> => {
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    const data = await queryClient.fetchQuery({
      queryKey: [`/api/users/${userId}/meals/range`, startDateStr, endDateStr],
      queryFn: () => 
        apiRequest<Meal[]>(`/api/users/${userId}/meals/range?startDate=${startDateStr}&endDate=${endDateStr}`),
    });
    
    return data || [];
  };
  
  // Function to get meals for a specific date
  const getMealsByDate = (date: Date): Meal[] => {
    const dateStr = date.toISOString().split('T')[0];
    return meals.filter(meal => {
      const mealDate = new Date(meal.date);
      return mealDate.toISOString().split('T')[0] === dateStr;
    });
  };
  
  // Calculate total calories consumed today
  const getCaloriesConsumedToday = (): number => {
    const today = new Date();
    const todayMeals = getMealsByDate(today);
    return todayMeals.reduce((total, meal) => total + (meal.calories || 0), 0);
  };
  
  // Calculate nutrition totals for given meals
  const getNutritionTotals = (mealsToCalculate: Meal[]) => {
    return mealsToCalculate.reduce(
      (totals, meal) => {
        return {
          calories: totals.calories + (meal.calories || 0),
          protein: totals.protein + (meal.protein || 0),
          carbs: totals.carbs + (meal.carbs || 0),
          fat: totals.fat + (meal.fat || 0),
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };
  
  // Combine loading and error states
  const isLoading = 
    isMealsLoading || 
    isDietPlansLoading || 
    isActiveDietPlanLoading;
  
  const error = mealsError || dietPlansError || activeDietPlanError;
  
  // Context value
  const value: DietContextType = {
    meals,
    dietPlans,
    activeDietPlan: activeDietPlan || null,
    isLoading,
    error,
    createMeal,
    updateMeal,
    deleteMeal,
    createDietPlan,
    updateDietPlan,
    deleteDietPlan,
    setActiveDietPlan,
    getMealsByDate,
    getMealsByDateRange,
    getCaloriesConsumedToday,
    getNutritionTotals,
  };
  
  return (
    <DietContext.Provider value={value}>
      {children}
    </DietContext.Provider>
  );
}

// Custom hook to use the diet context
export function useDiet() {
  const context = useContext(DietContext);
  if (context === undefined) {
    throw new Error('useDiet must be used within a DietProvider');
  }
  return context;
}