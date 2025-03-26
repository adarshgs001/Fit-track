import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Workouts from "@/pages/workouts";
import Exercises from "@/pages/exercises";
import Diet from "@/pages/diet";
import Progress from "@/pages/progress";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import WorkoutPlanDetail from "@/pages/workout-plan-detail";
import AppHeader from "@/components/layout/app-header";
import TabNavigation from "@/components/layout/tab-navigation";
import MobileNavbar from "@/components/layout/mobile-navbar";
import { useState } from "react";

function Router() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  return (
    <div className="h-screen flex flex-col">
      <AppHeader user={{ name: "Alex", id: 1, username: "alexfitness", email: "alex@example.com" }} />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-auto">
        <Switch>
          <Route path="/" component={() => <Dashboard setActiveTab={setActiveTab} />} />
          <Route path="/workouts" component={() => <Workouts setActiveTab={setActiveTab} />} />
          <Route path="/workouts/plans/:planId" component={() => <WorkoutPlanDetail setActiveTab={setActiveTab} />} />
          <Route path="/exercises" component={() => <Exercises setActiveTab={setActiveTab} />} />
          <Route path="/diet" component={() => <Diet setActiveTab={setActiveTab} />} />
          <Route path="/progress" component={() => <Progress setActiveTab={setActiveTab} />} />
          <Route path="/profile" component={() => <Profile setActiveTab={setActiveTab} />} />
          <Route path="/settings" component={() => <Settings setActiveTab={setActiveTab} />} />
          <Route component={NotFound} />
        </Switch>
      </main>

      <MobileNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
