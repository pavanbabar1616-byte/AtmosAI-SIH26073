"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  AlertTriangle,
  Lightbulb,
  Shield,
  TrendingUp,
  Activity,
} from "lucide-react";
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
      <div>
        <PageHeader title="Loading anomaly..." />
        <SkeletonList count={4} />
      </div>
    );
  }

  const { station, data_point, detection, explanation, correction, trust } = data;
  const trustColor =
    trust.trust_score >= 80 ? "text-red-400" : trust.trust_score >= 50 ? "text-orange-400" : "text-yellow-400";
  const severityColor =
    explanation.severity === "high"
      ? "border-red-500/50 bg-red-500/5"
      : explanation.severity === "medium"
        ? "border-orange-500/50 bg-orange-500/5"
        : "border-yellow-500/50 bg-yellow-500/5";

  return (
    <div className="space-y-8">
      <Link
        href="/anomalies"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Anomalies
      </Link>

      <PageHeader
        title={`${data_point.anomaly_type?.toUpperCase()} at ${station.name}`}
        description={`Detected at ${new Date(data_point.timestamp).toLocaleString()}`}
      />

      {/* Trust Score Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`glass rounded-2xl p-8 border-l-4 ${severityColor}`}
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
                  stroke="#06b6d4"
                  strokeWidth="8"
                  strokeDasharray={`${(trust.trust_score / 100) * 327} 327`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-3xl font-bold ${trustColor}`}>{trust.trust_score}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">AI Trust Score</p>
              <p className="text-2xl font-bold capitalize">{explanation.severity} Severity</p>
              <p className="text-sm text-muted-foreground mt-1">
                Confidence: {(detection.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">Anomaly Type</p>
            <p className="text-2xl font-bold capitalize">{data_point.anomaly_type}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Index #{index} in station data
            </p>
          </div>
        </div>
      </motion.div>

      {/* Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          <h3 className="font-semibold text-lg">Why was this flagged?</h3>
        </div>

        {explanation.top_features.length > 0 ? (
          <div className="space-y-4">
            {explanation.top_features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{f.feature}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      f.severity === "high"
                        ? "bg-red-500/20 text-red-300"
                        : "bg-orange-500/20 text-orange-300"
                    }`}
                  >
                    {f.severity}
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${f.contribution * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                  />
                </div>
                <p className="text-sm text-muted-foreground">{f.reason}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Statistical outlier detected</p>
        )}
      </motion.div>

      {/* Actual vs Corrected */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-lg">Recorded Values</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Temperature</span>
              <span className="font-mono font-semibold">
                {correction.original.temperature ?? "N/A"}°C
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Pressure</span>
              <span className="font-mono font-semibold">
                {correction.original.pressure ?? "N/A"} hPa
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Humidity</span>
              <span className="font-mono font-semibold">
                {correction.original.humidity ?? "N/A"}%
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-8 border border-emerald-500/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-lg">AI-Suggested Correction</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Temperature</span>
              <span className="font-mono font-semibold text-emerald-400">
                {correction.corrected.temperature ?? "N/A"}°C
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Pressure</span>
              <span className="font-mono font-semibold text-emerald-400">
                {correction.corrected.pressure ?? "N/A"} hPa
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Humidity</span>
              <span className="font-mono font-semibold text-emerald-400">
                {correction.corrected.humidity ?? "N/A"}%
              </span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Method: <span className="font-mono">{correction.method}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Confidence: {(correction.confidence * 100).toFixed(0)}%
            </p>
          </div>
        </motion.div>
      </div>

      {/* Context window */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-lg">Surrounding Context (±12 hours)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-muted-foreground font-medium">Time</th>
                <th className="text-right py-3 px-3 text-muted-foreground font-medium">Temp (°C)</th>
                <th className="text-right py-3 px-3 text-muted-foreground font-medium">Pressure</th>
                <th className="text-right py-3 px-3 text-muted-foreground font-medium">Humidity</th>
                <th className="text-center py-3 px-3 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.context_window.map((row, i) => {
                const isTarget = i === 12;
                return (
                  <tr
                    key={i}
                    className={`border-b border-border/30 ${
                      isTarget ? "bg-cyan-500/10" : row.is_anomaly ? "bg-red-500/5" : ""
                    }`}
                  >
                    <td className="py-2 px-3 text-muted-foreground font-mono text-xs">
                      {new Date(row.timestamp).toLocaleString("en-IN", {
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-2 px-3 text-right font-mono">{row.temperature ?? "—"}</td>
                    <td className="py-2 px-3 text-right font-mono">{row.pressure ?? "—"}</td>
                    <td className="py-2 px-3 text-right font-mono">{row.humidity ?? "—"}</td>
                    <td className="py-2 px-3 text-center">
                      {isTarget ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                          FLAGGED
                        </span>
                      ) : row.is_anomaly ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">
                          anomaly
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">ok</span>
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