"use client";

import { motion } from "framer-motion";
import { Table, Database } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useStations, useStationData } from "@/hooks/useStations";
import { SkeletonList } from "@/components/shared/Skeleton";

export default function WeatherDataPage() {
  const { data: stations } = useStations();
  const firstStation = stations?.[0]?.station_id || null;
  const { data, isLoading } = useStationData(firstStation, 96);

  return (
    <div>
      <PageHeader
        section="Field"
        title="Weather Data"
        description="Direct preview of ingested records. Core AtmosAI fields are DateTime, T (degC), p (mbar), and rh (%)."
      />

      {isLoading ? (
        <SkeletonList count={3} />
      ) : data && data.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel overflow-hidden"
        >
          <div className="panel-header">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-500" />
              <span className="micro-label">
                {stations?.[0]?.name} · {data.length} records
              </span>
            </div>
          </div>
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-card border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 micro-label">Timestamp</th>
                  <th className="text-right py-3 px-4 micro-label">T (degC)</th>
                  <th className="text-right py-3 px-4 micro-label">p (mbar)</th>
                  <th className="text-right py-3 px-4 micro-label">rh (%)</th>
                  <th className="text-center py-3 px-4 micro-label">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.slice().reverse().map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-border/40 ${
                      row.is_anomaly ? "bg-red-500/5" : "hover:bg-muted/30"
                    }`}
                  >
                    <td className="py-2 px-4 font-mono text-muted-foreground">
                      {new Date(row.timestamp).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-2 px-4 text-right font-mono">
                      {row.temperature ?? "—"}
                    </td>
                    <td className="py-2 px-4 text-right font-mono">
                      {row.pressure ?? "—"}
                    </td>
                    <td className="py-2 px-4 text-right font-mono">
                      {row.humidity ?? "—"}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {row.is_anomaly ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                          {row.anomaly_type}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-[10px] font-mono">
                          ok
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <div className="panel p-12 text-center text-muted-foreground">
          No data available
        </div>
      )}
    </div>
  );
}