"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAnomalies } from "@/hooks/useStations";
import { SkeletonList } from "@/components/shared/Skeleton";

export default function AnomaliesPage() {
  const { data: anomalies, isLoading } = useAnomalies(100);

  return (
    <div>
      <PageHeader
        section="Watch"
        title="Anomaly Feed"
        description="Real-time detections from Isolation Forest and rolling z-score models operating on the core triad (T, p, rh)."
      />

      {isLoading ? (
        <SkeletonList count={5} />
      ) : anomalies && anomalies.length > 0 ? (
        <div className="panel">
          <div className="panel-header">
            <span className="micro-label">Detection Log</span>
            <span className="text-xs font-mono text-muted-foreground">
              {anomalies.length} entries
            </span>
          </div>
          <div className="divide-y divide-border">
            {anomalies.map((a, i) => {
              const sevColor =
                a.severity === "high"
                  ? "bg-red-500/20 text-red-400 border-red-500/40"
                  : "bg-amber-500/20 text-amber-400 border-amber-500/40";

              return (
                <motion.div
                  key={`${a.station_id}-${a.index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <Link href={`/anomalies/${a.station_id}/${a.index}`}>
                    <div className="p-5 hover:bg-muted/30 transition-colors cursor-pointer group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle
                              className={`w-4 h-4 ${
                                a.severity === "high" ? "text-red-500" : "text-amber-500"
                              }`}
                            />
                            <span className="font-serif font-semibold capitalize">
                              {a.type}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${sevColor}`}
                            >
                              {a.severity}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs font-mono text-muted-foreground">
                            <span>
                              {a.station_id} · {a.station_name}
                            </span>
                            <span>{a.state}</span>
                            <span>
                              {new Date(a.timestamp).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="flex gap-4 mt-2 text-xs font-mono">
                            {a.temperature !== null && (
                              <span className="text-muted-foreground">
                                T: <span className="text-foreground">{a.temperature}°C</span>
                              </span>
                            )}
                            {a.pressure !== null && (
                              <span className="text-muted-foreground">
                                p: <span className="text-foreground">{a.pressure}</span>
                              </span>
                            )}
                            {a.humidity !== null && (
                              <span className="text-muted-foreground">
                                rh: <span className="text-foreground">{a.humidity}%</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-2" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="panel p-12 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="font-serif font-semibold text-lg mb-1">No detections logged</h3>
          <p className="text-muted-foreground text-sm font-mono">
            Detector pipeline has not emitted any events.
          </p>
        </div>
      )}
    </div>
  );
}