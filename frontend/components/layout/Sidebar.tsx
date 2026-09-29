"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { useTranslation } from "@/hooks/useTranslation";
import {
  LayoutDashboard,
  Radio,
  Activity,
  AlertTriangle,
  Bell,
  HeartPulse,
  BarChart3,
  Sparkles,
  Box,
  Database,
  Settings,
  Satellite,
  Brain,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const sections = [
    {
      label: t("nav.command"),
      items: [
        { href: "/dashboard", label: t("nav.overview"), icon: LayoutDashboard },
        { href: "/live-monitor", label: t("nav.liveMonitor"), icon: Activity },
      ],
    },
    {
      label: t("nav.field"),
      items: [
        { href: "/stations", label: t("nav.stations"), icon: Radio },
        { href: "/weather-data", label: t("nav.weatherData"), icon: BarChart3 },
      ],
    },
    {
      label: t("nav.watch"),
      items: [
        { href: "/anomalies", label: t("nav.anomalies"), icon: AlertTriangle },
        { href: "/alerts", label: t("nav.alerts"), icon: Bell },
        { href: "/sensor-health", label: t("nav.sensorHealth"), icon: HeartPulse },
        { href: "/satellite", label: t("nav.satellite"), icon: Satellite },
      ],
    },
    
    {
      label: t("nav.science"),
      items: [
        { href: "/analytics", label: t("nav.analytics"), icon: BarChart3 },
        { href: "/xai", label: "XAI Insights", icon: Brain },
        { href: "/ai-insights", label: t("nav.aiInsights"), icon: Sparkles },
        { href: "/models", label: t("nav.models"), icon: Box },
      ],
    },
    {
      label: t("nav.ops"),
      items: [
        { href: "/datasets", label: t("nav.datasets"), icon: Database },
        { href: "/settings", label: t("nav.settings"), icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col border-r border-border bg-card/40 backdrop-blur-xl">
      <div className="p-5 border-b border-border">
        <Link href="/dashboard">
          <Logo size={40} />
        </Link>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.label} className="mb-5">
            <div className="px-5 mb-2 micro-label">{section.label}</div>
            <div className="space-y-0.5 px-2">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm ${
                        isActive
                          ? "bg-amber-600/15 text-amber-500 border border-amber-600/30"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <p className="micro-label">{t("nav.classification")}</p>
      </div>
    </aside>
  );
}