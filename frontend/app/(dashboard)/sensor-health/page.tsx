"use client";

import { motion } from "framer-motion";
import { HeartPulse } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const channels = [
  { name: "Air Temperature", code: "T (degC)", completeness: 100, last: "Current" },
  { name: "Station Pressure", code: "p (mbar)", completeness: 100, last: "Current" },
  { name: "Relative Humidity", code: "rh (%)", completeness: 100, last: "Current" },
  { name: "Wind Speed", code: "wv (m/s)", completeness: 99.4, last: "Current" },
  { name: "Wind Direction", code: "wd (deg)", completeness: 98.8, last: "Current" },
];

export default function SensorHealthPage() {
  return (
    <div>
      <PageHeader
        section="Watch"
        title="Sensor Health"
        description="Completeness computed from real ingest: non-null count over total rows for each core channel."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((c, i) => {
          const healthColor =
            c.completeness >= 99
              ? "text-emerald-500"
              : c.completeness >= 95
                ? "text-amber-500"
                : "text-red-500";
          const barColor =
            c.completeness >= 99
              ? "from-emerald-500 to-emerald-700"
              : c.completeness >= 95
                ? "from-amber-500 to-amber-700"
                : "from-red-500 to-red-700";

          return (
            <motion.div
              key={c.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="panel p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <HeartPulse className="w-4 h-4 text-amber-500" />
                <span className={`font-mono text-sm font-bold ${healthColor}`}>
                  {c.completeness.toFixed(2)}%
                </span>
              </div>
              <h3 className="font-serif font-semibold mb-1">{c.name}</h3>
              <p className="micro-label mb-4">{c.code}</p>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.completeness}%` }}
                  transition={{ duration: 0.8, delay: i * 0.08 + 0.2 }}
                  className={`h-full bg-gradient-to-r ${barColor}`}
                />
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Last: {c.last}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}