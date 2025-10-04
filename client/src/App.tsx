import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import Header from "@/components/Header";
import DriverDashboard from "@/pages/DriverDashboard";
import CustomerDashboard from "@/pages/CustomerDashboard";
import NotFound from "@/pages/not-found";

function Router({ userRole }: { userRole: "driver" | "customer" }) {
  return (
    <Switch>
      <Route path="/">
        {userRole === "driver" ? <DriverDashboard /> : <CustomerDashboard />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [userRole, setUserRole] = useState<"driver" | "customer">("driver");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col h-screen">
          <Header 
            userRole={userRole} 
            onRoleSwitch={setUserRole}
            notificationCount={3}
          />
          <Router userRole={userRole} />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
