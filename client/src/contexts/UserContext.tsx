import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User, InsertUser } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

// Define the user stats interface
interface UserStats {
  workoutsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalCaloriesBurned: number;
  workoutsThisWeek: number;
  goalProgress: number;
  mealAdherence: number;
  caloriesBurned: number;
  dailyCalorieTarget?: number;
}

// Define enhanced user data interface
interface EnhancedUserData extends User, UserStats {
  dailyCalorieTarget: number;
}

interface UserContextType {
  userData: EnhancedUserData | null;
  isLoading: boolean;
  error: unknown;
  isAuthenticated: boolean;
  updateProfile: (profileData: Partial<InsertUser>) => Promise<User>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  
  // Use AuthContext instead of local state
  const { user, isLoading: authLoading } = useAuth();
  const isAuthenticated = !!user;
  const userId = user?.id || null;
  
  // Fetch user stats if authenticated
  const { 
    data: userStats, 
    isLoading: isStatsLoading,
    error: statsError
  } = useQuery<UserStats>({
    queryKey: [`/api/users/${userId}/stats`],
    staleTime: 60000, // 1 minute
    enabled: !!userId && isAuthenticated, // Only fetch if authenticated and userId exists
  });
  
  // Default stats if not available
  const defaultStats: UserStats = {
    workoutsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalCaloriesBurned: 0,
    workoutsThisWeek: 0,
    goalProgress: 0,
    mealAdherence: 0,
    caloriesBurned: 0,
    dailyCalorieTarget: 2000
  };
  
  // Combine user and stats data
  const enhancedUserData = user && userStats ? {
    ...user,
    ...userStats,
    // Ensure dailyCalorieTarget is available
    dailyCalorieTarget: userStats.dailyCalorieTarget || 2000
  } : user ? {
    ...user,
    ...defaultStats
  } : null;
  
  const isLoading = authLoading || isStatsLoading;
  const error = statsError;
  
  // Update profile function
  const updateProfile = async (profileData: Partial<InsertUser>): Promise<User> => {
    if (!userId) {
      toast({
        title: 'Error',
        description: 'You need to be logged in to update your profile.',
        variant: 'destructive',
      });
      throw new Error('User not authenticated');
    }
    
    try {
      const updatedUser = await apiRequest<User>(
        "PUT", 
        `/api/users/${userId}`, 
        profileData
      );
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
      
      return updatedUser;
    } catch (error) {
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Update failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw error;
    }
  };
  
  // Context value
  const value: UserContextType = {
    userData: enhancedUserData as EnhancedUserData | null,
    isLoading,
    error,
    isAuthenticated,
    updateProfile,
  };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}