import React from "react";
import { Link, useLocation } from "wouter";
import { 
  DashboardIcon, 
  WorkoutIcon, 
  ExerciseIcon, 
  DietIcon, 
  ProgressIcon,
  SettingsIcon,
  UserIcon
} from "@/components/ui/icons";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface Tab {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
}

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  const [location, setLocation] = useLocation();

  const tabs: Tab[] = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: <DashboardIcon className="text-sm mr-1 align-text-bottom h-4 w-4" />,
      path: "/"
    },
    {
      id: "workouts",
      name: "Workouts",
      icon: <WorkoutIcon className="text-sm mr-1 align-text-bottom h-4 w-4" />,
      path: "/workouts"
    },
    {
      id: "exercises",
      name: "Exercises",
      icon: <ExerciseIcon className="text-sm mr-1 align-text-bottom h-4 w-4" />,
      path: "/exercises"
    },
    {
      id: "diet",
      name: "Diet Plan",
      icon: <DietIcon className="text-sm mr-1 align-text-bottom h-4 w-4" />,
      path: "/diet"
    },
    {
      id: "progress",
      name: "Progress",
      icon: <ProgressIcon className="text-sm mr-1 align-text-bottom h-4 w-4" />,
      path: "/progress"
    },
    {
      id: "profile",
      name: "Profile",
      icon: <UserIcon className="text-sm mr-1 align-text-bottom h-4 w-4" />,
      path: "/profile"
    },
    {
      id: "settings",
      name: "Settings",
      icon: <SettingsIcon className="text-sm mr-1 align-text-bottom h-4 w-4" />,
      path: "/settings"
    }
  ];

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab.id);
    setLocation(tab.path);
  };

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-tab={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              } px-1 py-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
