import React from "react";
import { Link, useLocation } from "wouter";
import { 
  DashboardIcon, 
  WorkoutIcon, 
  ExerciseIcon, 
  DietIcon, 
  ProgressIcon, 
  UserIcon,
  SettingsIcon 
} from "@/components/ui/icons";

interface MobileNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface NavItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
}

export default function MobileNavbar({ activeTab, setActiveTab }: MobileNavbarProps) {
  const [location, setLocation] = useLocation();

  const navItems: NavItem[] = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: <DashboardIcon className="h-5 w-5" />,
      path: "/"
    },
    {
      id: "workouts",
      name: "Workouts",
      icon: <WorkoutIcon className="h-5 w-5" />,
      path: "/workouts"
    },
    {
      id: "exercises",
      name: "Exercises",
      icon: <ExerciseIcon className="h-5 w-5" />,
      path: "/exercises"
    },
    {
      id: "diet",
      name: "Diet",
      icon: <DietIcon className="h-5 w-5" />,
      path: "/diet"
    },
    {
      id: "profile",
      name: "Profile",
      icon: <UserIcon className="h-5 w-5" />,
      path: "/profile"
    }
  ];

  const handleNavItemClick = (item: NavItem) => {
    setActiveTab(item.id);
    setLocation(item.path);
  };

  return (
    <div className="sm:hidden bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavItemClick(item)}
            className={`flex flex-col items-center py-2 px-3 ${
              activeTab === item.id ? "text-primary" : "text-slate-500"
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
