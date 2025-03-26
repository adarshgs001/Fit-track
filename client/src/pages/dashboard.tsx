import React, { useEffect } from "react";
import { WorkoutIcon, FireIcon, DietIcon, MedalIcon } from "@/components/ui/icons";
import StatCard from "@/components/dashboard/stat-card";
import RecentWorkouts from "@/components/dashboard/recent-workouts";
import UpcomingWorkouts from "@/components/dashboard/upcoming-workouts";
import NutritionOverview from "@/components/dashboard/nutrition-overview";
import WaterTracker from "@/components/dashboard/water-tracker";
import SleepTracker from "@/components/dashboard/sleep-tracker";
import StepsCounter from "@/components/dashboard/steps-counter";
import AIRecommendations from "@/components/dashboard/ai-recommendations";
import GoalSetting from "@/components/dashboard/goal-setting";
import CommunityChallenges from "@/components/dashboard/community-challenges";
import SubscriptionStatus from "@/components/dashboard/subscription-status";
import { useQuery } from "@tanstack/react-query";

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ setActiveTab }: DashboardProps) {
  // Hard-coded user ID for demo purposes
  const userId = 1;

  useEffect(() => {
    setActiveTab("dashboard");
  }, [setActiveTab]);

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: [`/api/users/${userId}/stats`],
    staleTime: 60000, // 1 minute
  });

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <h1 className="text-2xl font-semibold">
        Welcome back, <span>Alex</span>!
      </h1>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<WorkoutIcon className="h-5 w-5 text-primary" />}
          title="Workouts This Week"
          value={isLoadingStats ? "..." : stats?.workoutsThisWeek || 0}
          change={{ value: "25%", isPositive: true }}
          iconBgColor="bg-indigo-100"
        />
        
        <StatCard
          icon={<FireIcon className="h-5 w-5 text-secondary" />}
          title="Calories Burned"
          value={isLoadingStats ? "..." : stats?.caloriesBurned || 0}
          change={{ value: "12%", isPositive: true }}
          iconBgColor="bg-green-100"
        />
        
        <StatCard
          icon={<DietIcon className="h-5 w-5 text-accent" />}
          title="Meal Plan Adherence"
          value={isLoadingStats ? "..." : `${stats?.mealAdherence || 0}%`}
          change={{ value: "5%", isPositive: true }}
          iconBgColor="bg-amber-100"
        />
        
        <StatCard
          icon={<MedalIcon className="h-5 w-5 text-purple-500" />}
          title="Goal Progress"
          value={isLoadingStats ? "..." : `${stats?.goalProgress || 0}%`}
          change={{ value: "8%", isPositive: true }}
          iconBgColor="bg-purple-100"
        />
      </div>

      {/* Top row - Main workout and nutrition components */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent workouts */}
        <RecentWorkouts userId={userId} />
        
        {/* Upcoming workouts */}
        <UpcomingWorkouts userId={userId} />
      </div>

      {/* Middle row - AI Recommendations, Tracking, Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <AIRecommendations />
        </div>
        
        <div className="md:col-span-1 grid grid-cols-1 gap-6">
          <WaterTracker />
          <StepsCounter />
        </div>
        
        <div className="md:col-span-1">
          <SleepTracker />
        </div>
      </div>
      
      {/* Third row - Community, Goals, Subscription */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <GoalSetting />
        </div>
        
        <div className="lg:col-span-1">
          <CommunityChallenges />
        </div>
        
        <div className="lg:col-span-1">
          <SubscriptionStatus />
        </div>
      </div>

      {/* Nutrition overview */}
      <NutritionOverview userId={userId} />
    </div>
  );
}
