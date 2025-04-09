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
import { useUser, useProgress, useDiet, useWorkout } from "@/contexts/AppContext";

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ setActiveTab }: DashboardProps) {
  // Use our context hooks instead of direct API calls
  const { userData, isLoading: isLoadingUser } = useUser();
  const { getProgressSummary } = useProgress();
  const { getCaloriesConsumedToday } = useDiet();
  const { recentWorkouts, upcomingWorkouts } = useWorkout();
  
  // Get stats from progress context
  const progressSummary = getProgressSummary();

  useEffect(() => {
    setActiveTab("dashboard");
  }, [setActiveTab]);

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <h1 className="text-2xl font-semibold">
        Welcome back, <span>{userData?.name || "User"}</span>!
      </h1>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<WorkoutIcon className="h-5 w-5 text-primary" />}
          title="Workouts This Week"
          value={isLoadingUser ? "..." : userData?.workoutsThisWeek !== undefined ? userData.workoutsThisWeek : progressSummary.workoutsCompleted}
          change={{ value: "25%", isPositive: true }}
          iconBgColor="bg-indigo-100"
        />
        
        <StatCard
          icon={<FireIcon className="h-5 w-5 text-secondary" />}
          title="Calories Burned"
          value={isLoadingUser ? "..." : progressSummary.caloriesBurned}
          change={{ value: "12%", isPositive: true }}
          iconBgColor="bg-green-100"
        />
        
        <StatCard
          icon={<DietIcon className="h-5 w-5 text-accent" />}
          title="Meal Plan Adherence"
          value={isLoadingUser ? "..." : `${userData?.mealAdherence !== undefined ? userData.mealAdherence : 0}%`}
          change={{ value: "5%", isPositive: true }}
          iconBgColor="bg-amber-100"
        />
        
        <StatCard
          icon={<MedalIcon className="h-5 w-5 text-purple-500" />}
          title="Goal Progress"
          value={isLoadingUser ? "..." : `${userData?.goalProgress !== undefined ? userData.goalProgress : 0}%`}
          change={{ value: "8%", isPositive: true }}
          iconBgColor="bg-purple-100"
        />
      </div>

      {/* Top row - Main workout and nutrition components */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent workouts - using userId=1 for now until we update the component */}
        <RecentWorkouts userId={1} />
        
        {/* Upcoming workouts - using userId=1 for now until we update the component */}
        <UpcomingWorkouts userId={1} />
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

      {/* Nutrition overview - use context-based data */}
      <NutritionOverview />
    </div>
  );
}
