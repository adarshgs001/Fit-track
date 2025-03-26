import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WorkoutIcon, FireIcon, MedalIcon, DietIcon } from "@/components/ui/icons";
import { useQuery } from "@tanstack/react-query";

interface ProgressSummaryProps {
  userId: number;
}

export default function ProgressSummary({ userId }: ProgressSummaryProps) {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: [`/api/users/${userId}/stats`],
    staleTime: 60000, // 1 minute
  });

  const statCards = [
    {
      title: "Workouts Completed",
      icon: <WorkoutIcon className="text-primary" />,
      bgColor: "bg-indigo-100",
      value: stats?.workoutsThisWeek || 0,
      change: { value: "20%", isPositive: true }
    },
    {
      title: "Total Workout Time",
      icon: <WorkoutIcon className="text-secondary" />,
      bgColor: "bg-green-100",
      value: "14h 30m",
      change: { value: "12%", isPositive: true }
    },
    {
      title: "Calories Burned",
      icon: <FireIcon className="text-red-500" />,
      bgColor: "bg-red-100",
      value: stats?.caloriesBurned || 0,
      change: { value: "15%", isPositive: true }
    },
    {
      title: "Meal Plan Adherence",
      icon: <DietIcon className="text-amber-500" />,
      bgColor: "bg-amber-100",
      value: `${stats?.mealAdherence || 0}%`,
      change: { value: "5%", isPositive: true }
    }
  ];

  if (isLoading) {
    return <div className="text-center py-4">Loading progress summary...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Failed to load progress summary</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${card.bgColor} rounded-md p-3`}>
                  {card.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">{card.title}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-slate-900">{card.value}</div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${card.change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="material-icons text-xs">
                          {card.change.isPositive ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                        <span className="sr-only">
                          {card.change.isPositive ? 'Increased by' : 'Decreased by'}
                        </span>
                        {card.change.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
