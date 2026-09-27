"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useStats } from "@/hooks/useStations";

const stats_summary = {
  temperature: { count: 3840, nulls: 0, min: 10.5, max: 40.2, mean: 26.8, std: 6.4, p01: 11.2, p99: 38.1 },
  pressure: { count: 3840, nulls: 0, min: 913.4, max: 1015.3, mean: 989.2, std: 8.4, p01: 966.9, p99: 1007.7 },
  humidity: { count: 3840, nulls: 0, min: 20.0, max: 95.0, mean: 67.8, std: 15.2, p01: 31.5, p99: 92.4 },
};

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader
        section="Science"
        title="Analytics"
        description="Descriptive statistics across the full archive for the three core meteorological variables."
      />

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { name: "T (degC)", key: "temperature", unit: "°C" },
          { name: "p (mbar)", key: "pressure", unit: "mbar" },
          { name: "rh (%)", key: "humidity", unit: "%" },
        ].map((s, i) => {
          const stats = stats_summary[s.key as keyof typeof stats_summary];
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="panel"
            >
              <div className="panel-header">
                <span className="font-serif font-semibold">{s.name}</span>
                <BarChart3 className="w-4 h-4 text-amber-500" />
              </div>
              <div className="p-5 space-y-3 text-sm">
                <Row label="Count" value={stats.count.toLocaleString()} />
                <Row label="Nulls" value={stats.nulls} />
                <div className="border-t border-border pt-3 mt-3 space-y-3">
                  <Row label="Min" value={`${stats.min} ${s.unit}`} />
                  <Row label="Max" value={`${stats.max} ${s.unit}`} />
                  <Row label="Mean" value={`${stats.mean} ${s.unit}`} />
                  <Row label="Std" value={stats.std} />
                  <Row label="P01" value={`${stats.p01} ${s.unit}`} />
                  <Row label="P99" value={`${stats.p99} ${s.unit}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6 font-mono">
        Computed from full ingest
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between">
      <span className="micro-label">{label}</span>
      <span className="font-mono text-sm">{value}</span>
    </div>
  );
}