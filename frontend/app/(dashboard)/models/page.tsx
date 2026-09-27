"use client";

import { motion } from "framer-motion";
import { Box, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useStats } from "@/hooks/useStations";

export default function ModelsPage() {
  const { data: stats } = useStats();

  return (
    <div>
      <PageHeader
        section="Science"
        title="Models"
        description="Registered detectors. Status shows FITTED once a training job writes artifacts."
      />

      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel"
        >
          <div className="panel-header">
            <div className="flex items-center gap-3">
              <Box className="w-4 h-4 text-amber-500" />
              <span className="font-serif font-semibold">Isolation Forest</span>
            </div>
            <span className="badge-command">Fitted</span>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <p className="micro-label mb-1">Class</p>
              <p className="font-mono text-sm">sklearn.ensemble.IsolationForest</p>
            </div>
            <div>
              <p className="micro-label mb-1">Description</p>
              <p className="text-sm text-muted-foreground">
                Unsupervised outlier scoring on T, p, and rh after robust scaling.
              </p>
            </div>
            <div>
              <p className="micro-label mb-1">Input Features</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {["T (degC)", "p (mbar)", "rh (%)"].map((f) => (
                  <span
                    key={f}
                    className="px-2 py-1 rounded text-xs font-mono bg-muted border border-border"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="micro-label mb-1">Trained On</p>
              <p className="font-mono text-sm">
                {stats?.total_stations || 0} stations · 100 estimators each
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="panel"
        >
          <div className="panel-header">
            <div className="flex items-center gap-3">
              <Box className="w-4 h-4 text-amber-500" />
              <span className="font-serif font-semibold">Rolling Robust z-score</span>
            </div>
            <span className="badge-command">Active</span>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <p className="micro-label mb-1">Class</p>
              <p className="font-mono text-sm">statistical</p>
            </div>
            <div>
              <p className="micro-label mb-1">Description</p>
              <p className="text-sm text-muted-foreground">
                Windowed median/MAD detector for sensor spikes and dropouts.
              </p>
            </div>
            <div>
              <p className="micro-label mb-1">Input Features</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {["T (degC)", "p (mbar)", "rh (%)"].map((f) => (
                  <span
                    key={f}
                    className="px-2 py-1 rounded text-xs font-mono bg-muted border border-border"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="micro-label mb-1">Detection Types</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {["spike", "dropout"].map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 rounded text-xs font-mono bg-amber-600/15 text-amber-500 border border-amber-600/30 capitalize"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}