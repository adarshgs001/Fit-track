import React from "react";
import { Card } from "@/components/ui/card";
import { WorkoutIcon, RunIcon, CalendarIcon, TimerIcon } from "@/components/ui/icons";
import { Link } from "wouter";
import type { WorkoutPlan } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WorkoutPlanCardProps {
  plan: WorkoutPlan;
  currentWeek?: number;
}

export default function WorkoutPlanCard({ plan, currentWeek }: WorkoutPlanCardProps) {
  const getPlanIcon = () => {
    if (plan.focus.toLowerCase().includes('cardio') || plan.focus.toLowerCase().includes('hiit')) {
      return <RunIcon className="h-8 w-8 text-secondary" />;
    } else {
      return <WorkoutIcon className="h-8 w-8 text-primary" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return "bg-green-100 text-green-800";
      case 'scheduled':
        return "bg-slate-100 text-slate-800";
      case 'completed':
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-slate-900">{plan.name}</h3>
          <Badge variant="outline" className={getStatusBadgeColor(plan.status)}>
            {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
        <div className="mt-4">
          <div className="flex items-center text-sm text-slate-500">
            <CalendarIcon className="text-slate-400 text-sm mr-1 h-4 w-4" />
            {plan.workoutsPerWeek} workouts per week
          </div>
          <div className="flex items-center text-sm text-slate-500 mt-1">
            <TimerIcon className="text-slate-400 text-sm mr-1 h-4 w-4" />
            45-60 min per session
          </div>
          <div className="flex items-center text-sm text-slate-500 mt-1">
            {getPlanIcon()}
            <span className="ml-1">Focus: {plan.focus}</span>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 px-5 py-3 flex justify-between items-center">
        <div className="text-sm">
          {plan.status === 'active' && currentWeek ? (
            <>
              <span className="text-slate-500">Progress:</span>
              <span className="font-medium text-slate-700 ml-1">
                Week {currentWeek} / {plan.durationWeeks}
              </span>
            </>
          ) : plan.status === 'scheduled' ? (
            <>
              <span className="text-slate-500">Starts:</span>
              <span className="font-medium text-slate-700 ml-1">Next Monday</span>
            </>
          ) : (
            <>
              <span className="text-slate-500">Duration:</span>
              <span className="font-medium text-slate-700 ml-1">{plan.durationWeeks} weeks</span>
            </>
          )}
        </div>
        <Link href={`/workouts/plans/${plan.id}`}>
          <Button variant="link" className="text-primary text-sm font-medium hover:text-indigo-700">
            {plan.status === 'active' ? 'Start Workout' : 'View Plan'}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
