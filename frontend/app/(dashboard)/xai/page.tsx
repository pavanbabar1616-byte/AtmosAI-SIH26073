"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Brain, TrendingUp, TrendingDown, Minus, Lightbulb } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAnomalies } from "@/hooks/useStations";
import { SkeletonList } from "@/components/shared/Skeleton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function XAIPage() {
  const { data: anomalies, isLoading: loadingAnomalies } = useAnomalies(10);
  const [selected, setSelected] = useState<{ station: string; index: number } | null>(null);

  const { data: explanation, isLoading } = useQuery({
    queryKey: ["xai", selected?.station, selected?.index],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/api/v1/xai/explain/${selected!.station}/${selected!.index}`
      );
      return res.json();
    },
    enabled: !!selected,
  });

  return (
    <div>
      <PageHeader
        section="Science"
        title="XAI Insights"
        description="SHAP-style feature attribution explaining why the AI flagged each anomaly."
      />

      <div className="grid md:grid-cols-3 gap-4">
        {/* Anomaly picker */}
        <div className="panel md:col-span-1">
          <div className="panel-header">
            <span className="micro-label">Select Anomaly</span>
          </div>
          <div className="p-3 max-h-[600px] overflow-y-auto">
            {loadingAnomalies ? (
              <SkeletonList count={3} />
            ) : (
              anomalies?.slice(0, 10).map((a) => (
                <button
                  key={`${a.station_id}-${a.index}`}
                  onClick={() => setSelected({ station: a.station_id, index: a.index })}
                  className={`w-full text-left p-3 rounded-md mb-2 transition-colors ${
                    selected?.station === a.station_id && selected?.index === a.index
                      ? "bg-amber-600/15 border border-amber-600/40"
                      : "hover:bg-muted/50 border border-transparent"
                  }`}
                >
                  <p className="text-xs font-mono text-amber-500">{a.station_id}</p>
                  <p className="text-sm font-medium capitalize">{a.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(a.timestamp).toLocaleString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* XAI Panel */}
        <div className="md:col-span-2 space-y-4">
          {!selected && (
            <div className="panel p-12 text-center">
              <Brain className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="font-serif font-semibold text-lg mb-2">
                Select an anomaly to see its explanation
              </h3>
              <p className="text-sm text-muted-foreground">
                XAI shows why the model flagged each reading using SHAP feature attribution.
              </p>
            </div>
          )}

          {isLoading && <SkeletonList count={3} />}

          {explanation && (
            <>
              {/* Verdict */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`panel p-6 border-l-4 ${
                  explanation.severity === "high"
                    ? "border-red-500/60"
                    : explanation.severity === "medium"
                      ? "border-amber-500/60"
                      : "border-emerald-500/60"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="micro-label mb-1">AI Verdict</p>
                    <p className="text-2xl font-serif font-bold capitalize">
                      {explanation.verdict.replace("_", " ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="micro-label mb-1">Anomaly Score</p>
                    <p className="text-3xl font-mono font-bold text-amber-500">
                      {(explanation.anomaly_score * 100).toFixed(0)}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* SHAP Feature Attribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="panel"
              >
                <div className="panel-header">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    <span className="font-serif font-semibold">Feature Attribution (SHAP-style)</span>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  {explanation.shap_values.map((f: any, i: number) => {
                    const Icon =
                      f.direction === "positive"
                        ? TrendingUp
                        : f.direction === "negative"
                          ? TrendingDown
                          : Minus;
                    const barColor =
                      f.impact === "high"
                        ? "from-red-500 to-red-700"
                        : f.impact === "medium"
                          ? "from-amber-500 to-amber-700"
                          : "from-emerald-500 to-emerald-700";

                    return (
                      <div key={f.feature} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span className="font-mono text-sm font-medium">{f.feature}</span>
                          </div>
                          <span className="font-mono text-sm">
                            SHAP: {f.shap_value.toFixed(3)}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${f.shap_value * 100}%` }}
                            transition={{ duration: 0.8, delay: i * 0.15 }}
                            className={`h-full bg-gradient-to-r ${barColor}`}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{f.explanation}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Counterfactuals */}
              {explanation.counterfactuals.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="panel"
                >
                  <div className="panel-header">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span className="font-serif font-semibold">Counterfactual Explanations</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    {explanation.counterfactuals.map((c: any, i: number) => (
                      <div
                        key={i}
                        className="p-4 rounded-md bg-emerald-500/5 border border-emerald-500/30"
                      >
                        <p className="text-sm font-mono mb-1">
                          <span className="text-muted-foreground">If </span>
                          <span className="text-amber-500">{c.feature}</span>
                          <span className="text-muted-foreground"> were </span>
                          <span className="text-emerald-500">{c.suggested}</span>
                          <span className="text-muted-foreground"> instead of </span>
                          <span className="text-red-500">{c.current}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{c.impact}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}