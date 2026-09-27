"use client";

import { useRouter } from "next/navigation";
import { User as UserIcon, Settings, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

export function UserMenu() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AI";

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    router.push("/signin");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 pl-1.5 pr-3 h-9">
          <Avatar className="w-7 h-7">
            <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-700 text-white text-[10px] font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium hidden sm:inline">
            {user?.name || "Guest"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div>
            <p className="font-semibold text-sm">{user?.name || "Guest"}</p>
            <p className="text-xs text-muted-foreground font-mono">
              {user?.email || "Not signed in"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <UserIcon className="w-4 h-4 mr-2" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <Settings className="w-4 h-4 mr-2" /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? (
            <>
              <Sun className="w-4 h-4 mr-2" /> Light Mode
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 mr-2" /> Dark Mode
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}