"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, Radio, TrendingUp, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { useStats } from "@/hooks/useStations";
import { SkeletonList } from "@/components/shared/Skeleton";

export default function DashboardPage() {
  const { data: stats, isLoading } = useStats();

  return (
    <div>
      <PageHeader
        section="Command"
        title="Mission Overview"
        description="Live operational picture across India's Automatic Weather Station network. All metrics computed directly from ingested sensor data."
      />

      {isLoading ? (
        <SkeletonList count={4} />
      ) : stats ? (
        <div className="space-y-6">
          {/* Top stat row */}
          <div className="grid md:grid-cols-3 gap-4">
            <StatCard
              label="Active Stations"
              value={stats.total_stations}
              sublabel="Across India"
              icon={<Radio className="w-4 h-4 text-amber-500" />}
            />
            <StatCard
              label="Total Anomalies"
              value={stats.total_anomalies}
              sublabel="Detected across all stations"
              icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
            />
            <StatCard
              label="Data Points"
              value={stats.total_data_points.toLocaleString()}
              sublabel="8-day archive"
              icon={<Activity className="w-4 h-4 text-amber-500" />}
            />
          </div>

          {/* Second stat row */}
          <div className="grid md:grid-cols-4 gap-4">
            <StatCard
              label="High Severity"
              value={stats.by_severity.high || 0}
              sublabel="Requires immediate review"
            />
            <StatCard
              label="Medium Severity"
              value={stats.by_severity.medium || 0}
              sublabel="Investigate when possible"
            />
            <StatCard
              label="Spikes Detected"
              value={stats.by_type.spike || 0}
              sublabel="Sudden outliers"
            />
            <StatCard
              label="Dropouts"
              value={stats.by_type.dropout || 0}
              sublabel="Missing values"
            />
          </div>

          {/* Anomaly breakdown + Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="panel"
            >
              <div className="panel-header">
                <span className="micro-label">Anomaly Distribution</span>
                <span className="text-xs font-mono text-muted-foreground">
                  {stats.total_anomalies} total
                </span>
              </div>
              <div className="p-5 space-y-4">
                {Object.entries(stats.by_type).map(([type, count]) => {
                  const pct = Math.round((count / stats.total_anomalies) * 100);
                  return (
                    <div key={type}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="capitalize font-medium">{type}</span>
                        <span className="text-muted-foreground font-mono text-xs">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-700"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="panel"
            >
              <div className="panel-header">
                <span className="micro-label">Quick Operations</span>
              </div>
              <div className="p-5 space-y-2">
                <Link href="/stations">
                  <div className="flex items-center justify-between p-3 rounded-md border border-border hover:border-amber-600/50 hover:bg-muted/50 transition-all group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Radio className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium">Station Registry</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
                <Link href="/anomalies">
                  <div className="flex items-center justify-between p-3 rounded-md border border-border hover:border-amber-600/50 hover:bg-muted/50 transition-all group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium">Anomaly Feed</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
                <Link href="/datasets">
                  <div className="flex items-center justify-between p-3 rounded-md border border-border hover:border-amber-600/50 hover:bg-muted/50 transition-all group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium">Dataset Catalog</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Station Health Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="panel"
          >
            <div className="panel-header">
              <span className="micro-label">Station Health Matrix</span>
              <span className="text-xs font-mono text-muted-foreground">
                {stats.station_health.length} stations
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-5 micro-label">Station</th>
                    <th className="text-left py-3 px-5 micro-label">State</th>
                    <th className="text-right py-3 px-5 micro-label">Anomalies</th>
                    <th className="text-right py-3 px-5 micro-label">Avg Temp</th>
                    <th className="text-right py-3 px-5 micro-label">Health</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.station_health.map((s) => {
                    const healthColor =
                      s.health >= 95
                        ? "text-emerald-500"
                        : s.health >= 90
                          ? "text-amber-500"
                          : "text-red-500";
                    return (
                      <tr
                        key={s.station_id}
                        className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 px-5">
                          <Link
                            href={`/stations/${s.station_id}`}
                            className="font-medium hover:text-amber-500 transition-colors"
                          >
                            {s.name}
                          </Link>
                          <p className="text-xs text-muted-foreground font-mono">
                            {s.station_id}
                          </p>
                        </td>
                        <td className="py-3 px-5 text-muted-foreground text-sm">{s.state}</td>
                        <td className="py-3 px-5 text-right font-mono text-sm">
                          {s.anomalies}
                        </td>
                        <td className="py-3 px-5 text-right font-mono text-sm">
                          {s.avg_temperature}°C
                        </td>
                        <td className={`py-3 px-5 text-right font-mono font-semibold ${healthColor}`}>
                          {s.health}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="panel p-12 text-center">
          <p className="text-muted-foreground font-mono text-sm">
            Backend unavailable. Verify FastAPI server is running.
          </p>
        </div>
      )}
    </div>
  );
}