import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import AppHeader from "./app-header";
import TabNavigation from "./tab-navigation";
import MobileNavbar from "./mobile-navbar";

interface AuthenticatedWrapperProps {
  component: React.ComponentType<any>;
}

export function AuthenticatedWrapper({ component: Component }: AuthenticatedWrapperProps) {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const { user } = useAuth();
  
  return (
    <div className="h-screen flex flex-col">
      <AppHeader user={{
        name: user?.name || "Guest",
        id: user?.id || 0,
        username: user?.username || "guest",
        email: user?.email || "guest@example.com"
      }} />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-auto">
        <Component setActiveTab={setActiveTab} />
      </main>

      <MobileNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}