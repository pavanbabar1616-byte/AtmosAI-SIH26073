"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Wifi, WifiOff, Server } from "lucide-react";
import { useBackendStatus } from "@/hooks/useBackendStatus";

export function BackendStatusBanner() {
  const { status, elapsedSeconds } = useBackendStatus();

  if (status === "online" || status === "checking") {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-[100] px-4 py-2"
      >
        {status === "waking" && (
          <div className="max-w-3xl mx-auto rounded-md border border-amber-600/40 bg-amber-950/80 backdrop-blur-md shadow-lg px-4 py-3 flex items-center gap-3">
            <Loader2 className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-amber-300">
                Backend is starting up...
              </p>
              <p className="text-xs text-amber-400/80 font-mono">
                Free tier wake-up · {elapsedSeconds}s elapsed · usually takes 30–50s
              </p>
            </div>
            <div className="text-xs font-mono text-amber-500 shrink-0">
              {elapsedSeconds}s
            </div>
          </div>
        )}

        {status === "offline" && (
          <div className="max-w-3xl mx-auto rounded-md border border-red-600/40 bg-red-950/80 backdrop-blur-md shadow-lg px-4 py-3 flex items-center gap-3">
            <WifiOff className="w-4 h-4 text-red-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-red-300">
                Backend unavailable
              </p>
              <p className="text-xs text-red-400/80 font-mono">
                Server took too long to respond · check Render dashboard
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}