"use client";

import { motion } from "framer-motion";

export function LiveIndicator({ isLive }: { isLive: boolean }) {
  if (!isLive) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-500/10 border border-red-500/40">
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-2 h-2 rounded-full bg-red-500"
      />
      <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
        Live
      </span>
    </div>
  );
}