import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Workouts from "@/pages/workouts";
import Exercises from "@/pages/exercises";
import ExerciseDetail from "@/pages/exercise-detail";
import Diet from "@/pages/diet";
import Progress from "@/pages/progress";
import Profile from "@/pages/profile";
import WorkoutPlanDetail from "@/pages/workout-plan-detail";
import AuthPage from "@/pages/auth-page";
import { AppProvider } from "./contexts/AppContext";
import { UserProvider } from "./contexts/UserContext";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/workouts" component={Workouts} />
      <ProtectedRoute path="/workouts/plans/:planId" component={WorkoutPlanDetail} />
      <ProtectedRoute path="/exercises" component={Exercises} />
      <ProtectedRoute path="/exercises/:id" component={ExerciseDetail} />
      <ProtectedRoute path="/diet" component={Diet} />
      <ProtectedRoute path="/progress" component={Progress} />
      <ProtectedRoute path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base="">
        <AuthProvider>
          <UserProvider>
            <AppProvider>
              <Router />
              <Toaster />
            </AppProvider>
          </UserProvider>
        </AuthProvider>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
