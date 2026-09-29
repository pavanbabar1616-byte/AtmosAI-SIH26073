"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, WifiOff, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const MAX_WAIT_SECONDS = 90;
const WARMUP_EXPECTED = 50;

type Status = "checking" | "waking" | "online" | "offline";

interface BackendWakeTimerProps {
  onReady?: () => void;
  variant?: "overlay" | "banner";
}

export function BackendWakeTimer({
  onReady,
  variant = "overlay",
}: BackendWakeTimerProps) {
  const [status, setStatus] = useState<Status>("checking");
  const [elapsed, setElapsed] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (status === "online" || status === "offline") return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    let cancelled = false;
    let timer: NodeJS.Timeout;
    let localAttempts = 0;

    const check = async () => {
      if (cancelled) return;
      localAttempts++;
      setAttempts(localAttempts);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(`${API_URL}/health`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (cancelled) return;

        if (res.ok) {
          setStatus("online");
          setShowToast(true);
          onReady?.();
          setTimeout(() => setShowToast(false), 2500);
          return;
        }
      } catch (err) {
        // Expected while waking up
      }

      if (cancelled) return;

      if (elapsed > 3 && status === "checking") {
        setStatus("waking");
      }

      if (elapsed >= MAX_WAIT_SECONDS) {
        setStatus("offline");
        return;
      }

      timer = setTimeout(check, 2000);
    };

    timer = setTimeout(check, 500);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => {
    setStatus("checking");
    setElapsed(0);
    setAttempts(0);
    window.location.reload();
  };

  // Success toast (shown briefly when backend becomes ready)
  if (showToast) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 right-4 z-[200] px-4 py-3 rounded-md border border-emerald-500/50 bg-emerald-950/90 backdrop-blur-md shadow-lg flex items-center gap-3"
      >
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        <div>
          <p className="text-sm font-medium text-emerald-300">Backend ready</p>
          <p className="text-xs text-emerald-400/80 font-mono">
            Connected in {elapsed}s
          </p>
        </div>
      </motion.div>
    );
  }

  // Once online and no toast, render nothing
  if (status === "online") {
    return null;
  }

  // Banner variant
  if (variant === "banner") {
    return (
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-[100] px-4 py-2"
      >
        <div
          className={`max-w-3xl mx-auto rounded-md border backdrop-blur-md shadow-lg px-4 py-3 flex items-center gap-3 ${
            status === "offline"
              ? "border-red-600/40 bg-red-950/80"
              : "border-amber-600/40 bg-amber-950/80"
          }`}
        >
          {status === "offline" ? (
            <WifiOff className="w-4 h-4 text-red-500 shrink-0" />
          ) : (
            <Loader2 className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium ${
                status === "offline" ? "text-red-300" : "text-amber-300"
              }`}
            >
              {status === "offline"
                ? "Backend unavailable"
                : elapsed < WARMUP_EXPECTED
                  ? "Backend waking up..."
                  : "Almost ready..."}
            </p>
            <p
              className={`text-xs font-mono ${
                status === "offline" ? "text-red-400/80" : "text-amber-400/80"
              }`}
            >
              {status === "offline"
                ? "Service took too long to respond"
                : "Free tier cold start · usually 30–50s"}
            </p>
          </div>
          <div
            className={`text-sm font-mono font-bold shrink-0 ${
              status === "offline" ? "text-red-500" : "text-amber-500"
            }`}
          >
            {elapsed}s
          </div>
        </div>
      </motion.div>
    );
  }

  // Overlay variant (default)
  return (
    <div className="min-h-screen flex items-center justify-center bg-background grid-pattern">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="panel p-10 max-w-md w-full mx-4 text-center"
      >
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg width="128" height="128" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="rgba(148, 163, 184, 0.15)"
              strokeWidth="8"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke={
                status === "offline"
                  ? "#ef4444"
                  : elapsed < WARMUP_EXPECTED
                    ? "#f59e0b"
                    : "#10b981"
              }
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="351.86"
              animate={{
                strokeDashoffset:
                  351.86 -
                  (Math.min(elapsed, WARMUP_EXPECTED) / WARMUP_EXPECTED) *
                    351.86,
              }}
              transition={{ duration: 0.5 }}
              transform="rotate(-90 64 64)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {status === "offline" ? (
              <WifiOff className="w-10 h-10 text-red-500" />
            ) : (
              <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            )}
          </div>
        </div>

        <h2 className="font-serif text-2xl font-bold mb-2">
          {status === "offline" ? "Backend Unavailable" : "Starting AtmosAI"}
        </h2>

        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {status === "offline"
            ? "The server took too long to respond. Please check the Render dashboard."
            : elapsed < 3
              ? "Connecting to backend..."
              : elapsed < WARMUP_EXPECTED
                ? "Free tier waking up. Usually 30–50 seconds on first load."
                : "Almost there — finishing startup..."}
        </p>

        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-3xl font-mono font-bold text-amber-500">
            {elapsed}s
          </span>
          <span className="text-sm text-muted-foreground font-mono">
            / ~{WARMUP_EXPECTED}s
          </span>
        </div>

        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-6">
          <motion.div
            className={`h-full ${
              status === "offline"
                ? "bg-red-500"
                : "bg-gradient-to-r from-amber-500 to-amber-700"
            }`}
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min((elapsed / WARMUP_EXPECTED) * 100, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {status === "offline" && (
          <Button
            onClick={handleRetry}
            className="gap-2 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900"
          >
            <RefreshCw className="w-4 h-4" /> Retry Connection
          </Button>
        )}

        {attempts > 3 && status !== "offline" && (
          <p className="mt-4 text-xs text-muted-foreground font-mono">
            Attempt {attempts} · checking every 2s
          </p>
        )}
      </motion.div>
    </div>
  );
}