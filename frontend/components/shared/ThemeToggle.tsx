"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-[68px] h-8" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-[68px] h-8 rounded-full border border-border bg-muted/40 flex items-center px-1 transition-colors"
      title={isDark ? "Switch to light" : "Switch to dark"}
    >
      <div className="flex-1 flex items-center justify-around">
        <Sun className={`w-4 h-4 ${isDark ? "text-muted-foreground" : "text-amber-500"}`} />
        <Moon className={`w-4 h-4 ${isDark ? "text-amber-500" : "text-muted-foreground"}`} />
      </div>
      <div
        className={`absolute top-1 w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 shadow-md transition-transform ${
          isDark ? "translate-x-[38px]" : "translate-x-1"
        }`}
      />
    </button>
  );
}