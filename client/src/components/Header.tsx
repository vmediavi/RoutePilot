import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, User, Moon, Sun } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  userRole: "driver" | "customer";
  onRoleSwitch: (role: "driver" | "customer") => void;
  notificationCount?: number;
}

export default function Header({ userRole, onRoleSwitch, notificationCount = 0 }: HeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-foreground">TrackRide</h1>
          <Badge 
            variant={userRole === "driver" ? "default" : "secondary"}
            className="capitalize"
            data-testid="badge-user-role"
          >
            {userRole}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRoleSwitch(userRole === "driver" ? "customer" : "driver")}
            data-testid="button-switch-role"
          >
            Switch to {userRole === "driver" ? "Customer" : "Driver"}
          </Button>

          <Button 
            size="icon" 
            variant="ghost" 
            className="relative"
            data-testid="button-notifications"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-chart-3 text-xs font-medium text-white flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </Button>

          <Button 
            size="icon" 
            variant="ghost"
            data-testid="button-profile"
          >
            <User className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
