"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { BackendStatusBanner } from "@/components/shared/BackendStatusBanner";
import { TopBar } from "@/components/layout/TopBar";
import { ChatWidget } from "@/components/shared/ChatWidget";
import { useAuthStore } from "@/stores/authStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground font-mono text-sm">
          Redirecting to sign in...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
       <BackendStatusBanner />
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 px-8 py-8 overflow-x-hidden grid-pattern">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
      <ChatWidget />
    </div>
  );
}