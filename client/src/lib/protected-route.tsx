import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import AppHeader from "@/components/layout/app-header";
import TabNavigation from "@/components/layout/tab-navigation";
import MobileNavbar from "@/components/layout/mobile-navbar";
import React, { useState } from "react";



export function ProtectedRoute({
  path,
  component,
}: {
  path: string;
  component: React.ComponentType<{setActiveTab: (tab: string) => void}>;
}) {
  const { user, isLoading } = useAuth();

  // Share the activeTab state between layout and component
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Moved this inside the ProtectedRoute component to fix the scope issue
  const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
    // We know user is not null here because of the conditional rendering in the Route
    const safeUser = user!;
    
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader user={safeUser} />
        <div className="hidden md:block">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="flex-1">
          {children}
        </div>
        <div className="md:hidden">
          <MobileNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    );
  };

  // Create a wrapper component to properly pass the props
  const ComponentWithProps = () => {
    if (!component) return null;
    
    // Use createElement to properly pass down props without TypeScript errors
    return React.createElement(component, { setActiveTab: setActiveTab });
  };
  
  return (
    <Route path={path}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      ) : !user ? (
        <Redirect to="/auth" />
      ) : (
        <AuthenticatedLayout>
          <ComponentWithProps />
        </AuthenticatedLayout>
      )}
    </Route>
  );
}