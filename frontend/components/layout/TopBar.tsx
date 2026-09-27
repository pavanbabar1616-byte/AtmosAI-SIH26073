"use client";

import { usePathname } from "next/navigation";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const pageInfo: Record<string, { section: string; title: string }> = {
  "/dashboard": { section: "Command", title: "Overview" },
  "/live-monitor": { section: "Command", title: "Live Monitor" },
  "/stations": { section: "Field", title: "Stations" },
  "/weather-data": { section: "Field", title: "Weather Data" },
  "/anomalies": { section: "Watch", title: "Anomalies" },
  "/alerts": { section: "Watch", title: "Alerts" },
  "/sensor-health": { section: "Watch", title: "Sensor Health" },
  "/analytics": { section: "Science", title: "Analytics" },
  "/ai-insights": { section: "Science", title: "AI Insights" },
  "/models": { section: "Science", title: "Models" },
  "/datasets": { section: "Ops", title: "Datasets" },
  "/settings": { section: "Ops", title: "Settings" },
};

export function TopBar() {
  const pathname = usePathname();
  const info = pageInfo[pathname] || { section: "Command", title: "Dashboard" };
  const now = new Date();
  const stamp = now.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40 grid-pattern">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="micro-label">AtmosAI // {info.section}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-sm font-serif font-semibold">{info.title}</span>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right hidden md:block">
            <p className="micro-label">Last Ingest Stamp</p>
            <p className="text-xs font-mono">{stamp}</p>
          </div>

          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}