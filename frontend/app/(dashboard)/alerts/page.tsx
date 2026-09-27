"use client";

import { motion } from "framer-motion";
import { Bell, Shield } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export default function AlertsPage() {
  return (
    <div>
      <PageHeader
        section="Watch"
        title="Alerts"
        description="Alert rules bind to fitted detectors and sensor completeness thresholds."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel p-12 text-center"
      >
        <div className="w-12 h-12 mx-auto mb-4 rounded-md bg-amber-600/15 border border-amber-600/30 flex items-center justify-center">
          <Bell className="w-5 h-5 text-amber-500" />
        </div>
        <h3 className="font-serif font-semibold text-lg mb-2">Alert board is quiet</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
          Alert rules bind to fitted detectors. No alerts are currently raised.
        </p>

        <div className="panel max-w-md mx-auto text-left">
          <div className="panel-header">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span className="micro-label">Active Rules</span>
            </div>
          </div>
          <div className="p-4 space-y-3 text-sm">
            {[
              { name: "High severity anomaly", status: "Armed" },
              { name: "Sensor completeness < 95%", status: "Armed" },
              { name: "Consecutive dropouts > 3", status: "Armed" },
            ].map((rule) => (
              <div key={rule.name} className="flex items-center justify-between">
                <span className="text-muted-foreground">{rule.name}</span>
                <span className="font-mono text-xs text-emerald-500">{rule.status}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}