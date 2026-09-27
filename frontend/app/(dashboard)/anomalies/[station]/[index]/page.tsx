"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Lightbulb, Shield, Activity, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAnomalyDetail } from "@/hooks/useStations";
import { SkeletonList } from "@/components/shared/Skeleton";

export default function AnomalyDetailPage() {
  const params = useParams();
  const stationId = params.station as string;
  const index = parseInt(params.index as string);

  const { data, isLoading } = useAnomalyDetail(stationId, index);

  if (isLoading || !data) {
    return (
      <div className="space-y-8">
        <PageHeader section="Watch" title="Loading anomaly..." />
        <SkeletonList count={4} />
      </div>
    );
  }

  const { station, data_point, detection, explanation, correction, trust } = data;
  const trustColor =
    trust.trust_score >= 80 ? "text-red-500" : trust.trust_score >= 50 ? "text-amber-500" : "text-yellow-500";

  return (
    <div className="space-y-8">
      <Link
        href="/anomalies"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-500 transition-colors font-mono"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Anomaly Feed
      </Link>

      <PageHeader
        section="Watch"
        title={`${data_point.anomaly_type?.toUpperCase()} · ${station.name}`}
        description={`Detected at ${new Date(data_point.timestamp).toLocaleString("en-IN")}`}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="panel p-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="8" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="8"
                  strokeDasharray={`${(trust.trust_score / 100) * 327} 327`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-3xl font-mono font-bold ${trustColor}`}>{trust.trust_score}</span>
              </div>
            </div>
            <div>
              <p className="micro-label mb-1">AI Trust Score</p>
              <p className="text-2xl font-serif font-bold capitalize">{explanation.severity} Severity</p>
              <p className="text-sm text-muted-foreground mt-1 font-mono">
                Confidence: {(detection.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="micro-label mb-1">Anomaly Type</p>
            <p className="text-2xl font-serif font-bold capitalize">{data_point.anomaly_type}</p>
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
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="font-serif font-semibold">Why was this flagged?</span>
          </div>
        </div>
        <div className="p-6">
          {explanation.top_features.length > 0 ? (
            <div className="space-y-5">
              {explanation.top_features.map((f, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium font-mono text-sm">{f.feature}</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-600/20 text-amber-400 border border-amber-600/30">
                      {f.severity}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${f.contribution * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-700"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{f.reason}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Statistical outlier detected</p>
          )}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="panel"
        >
          <div className="panel-header">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-500" />
              <span className="font-serif font-semibold">Recorded Values</span>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <Row label="Temperature" value={`${correction.original.temperature ?? "N/A"}°C`} />
            <Row label="Pressure" value={`${correction.original.pressure ?? "N/A"} hPa`} />
            <Row label="Humidity" value={`${correction.original.humidity ?? "N/A"}%`} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="panel border-emerald-500/30"
        >
          <div className="panel-header">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="font-serif font-semibold">AI-Suggested Correction</span>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <Row label="Temperature" value={`${correction.corrected.temperature ?? "N/A"}°C`} green />
            <Row label="Pressure" value={`${correction.corrected.pressure ?? "N/A"} hPa`} green />
            <Row label="Humidity" value={`${correction.corrected.humidity ?? "N/A"}%`} green />
          </div>
          <div className="px-6 pb-6">
            <p className="micro-label">Method: {correction.method}</p>
            <p className="micro-label">Confidence: {(correction.confidence * 100).toFixed(0)}%</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="panel"
      >
        <div className="panel-header">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            <span className="font-serif font-semibold">Surrounding Context (±12 hours)</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 micro-label">Time</th>
                <th className="text-right py-3 px-4 micro-label">Temp</th>
                <th className="text-right py-3 px-4 micro-label">Pressure</th>
                <th className="text-right py-3 px-4 micro-label">Humidity</th>
                <th className="text-center py-3 px-4 micro-label">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.context_window.map((row, i) => {
                const isTarget = i === 12;
                return (
                  <tr
                    key={i}
                    className={`border-b border-border/40 ${
                      isTarget ? "bg-amber-600/10" : row.is_anomaly ? "bg-red-500/5" : ""
                    }`}
                  >
                    <td className="py-2 px-4 font-mono text-muted-foreground">
                      {new Date(row.timestamp).toLocaleString("en-IN", {
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-2 px-4 text-right font-mono">{row.temperature ?? "—"}</td>
                    <td className="py-2 px-4 text-right font-mono">{row.pressure ?? "—"}</td>
                    <td className="py-2 px-4 text-right font-mono">{row.humidity ?? "—"}</td>
                    <td className="py-2 px-4 text-center">
                      {isTarget ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-600/20 text-amber-400 border border-amber-600/30">
                          Flagged
                        </span>
                      ) : row.is_anomaly ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                          anomaly
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-muted-foreground">ok</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

function Row({ label, value, green }: { label: string; value: string | number; green?: boolean }) {
  return (
    <div className="flex justify-between py-2 border-b border-border/40 last:border-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className={`font-mono text-sm font-semibold ${green ? "text-emerald-500" : ""}`}>
        {value}
      </span>
    </div>
  );
}