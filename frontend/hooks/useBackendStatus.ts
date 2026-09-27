"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export type BackendStatus = "checking" | "waking" | "online" | "offline";

interface BackendState {
  status: BackendStatus;
  elapsedSeconds: number;
  lastCheck: Date | null;
}

export function useBackendStatus() {
  const [state, setState] = useState<BackendState>({
    status: "checking",
    elapsedSeconds: 0,
    lastCheck: null,
  });

  useEffect(() => {
    let cancelled = false;
    let timer: NodeJS.Timeout;
    const startTime = Date.now();

    const check = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 70000); // 70s max

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/health`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (cancelled) return;

        if (response.ok) {
          setState({
            status: "online",
            elapsedSeconds: Math.round((Date.now() - startTime) / 1000),
            lastCheck: new Date(),
          });
        } else {
          throw new Error("Non-OK response");
        }
      } catch (err) {
        if (cancelled) return;
        const elapsed = Math.round((Date.now() - startTime) / 1000);

        if (elapsed > 3 && elapsed < 60) {
          // Still warming up
          setState({
            status: "waking",
            elapsedSeconds: elapsed,
            lastCheck: new Date(),
          });
          timer = setTimeout(check, 2000); // retry in 2s
        } else if (elapsed >= 60) {
          setState({
            status: "offline",
            elapsedSeconds: elapsed,
            lastCheck: new Date(),
          });
        } else {
          // First attempt failed, retry
          timer = setTimeout(check, 1000);
        }
      }
    };

    check();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  return state;
}