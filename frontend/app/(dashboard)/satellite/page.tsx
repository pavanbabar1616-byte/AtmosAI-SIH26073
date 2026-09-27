"use client";

import { motion } from "framer-motion";
import { Satellite, CheckCircle2, AlertTriangle, HelpCircle, Shield } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { SkeletonList } from "@/components/shared/Skeleton";

export default function SatellitePage() {
  const { data: overview, isLoading } = useQuery({
    queryKey: ["satellite-overview"],
    queryFn: api.getSatelliteOverview,
  });

  const { data: sources } = useQuery({
    queryKey: ["satellite-sources"],
    queryFn: api.getSatelliteSources,
  });

  return (
    <div>
      <PageHeader
        section="Watch"
        title="Satellite Validation"
        description="Cross-validate AWS sensor readings against satellite-derived observations from ISRO INSAT-3DR and NASA MODIS."
      />

      {isLoading ? (
        <SkeletonList count={4} />
      ) : overview ? (
        <>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Satellite Sources"
              value={overview.satellite_sources.length}
              sublabel={overview.satellite_sources.join(" · ")}
              icon={<Satellite className="w-4 h-4 text-amber-500" />}
            />
            <StatCard
              label="Stations Covered"
              value={overview.stations_covered}
              sublabel="Cross-validated"
            />
            <StatCard
              label="Validated"
              value={overview.validated}
              sublabel={`${overview.overall_validation_rate}% agreement`}
              icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            />
            <StatCard
              label="Sensor Faults"
              value={overview.sensor_faults}
              sublabel="Large deviations"
              icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
            />
          </div>

          {sources && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="panel mb-6"
            >
              <div className="panel-header">
                <span className="micro-label">Active Satellite Sources</span>
              </div>
              <div className="p-6 grid md:grid-cols-2 gap-4">
                {sources.sources.map((s) => (
                  <div key={s.id} className="p-4 rounded-md border border-border bg-muted/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Satellite className="w-4 h-4 text-amber-500" />
                      <span className="font-serif font-semibold">{s.name}</span>
                      <span className="badge-command">Active</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      <span className="font-mono">{s.agency}</span> · {s.type}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {s.products.map((p) => (
                        <span
                          key={p}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-600/10 text-amber-400 border border-amber-600/30"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="panel mb-6"
          >
            <div className="panel-header">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-500" />
                <span className="font-serif font-semibold">Station Validation Rates</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {overview.station_summaries.length} stations
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-5 micro-label">Station</th>
                    <th className="text-left py-3 px-5 micro-label">State ID</th>
                    <th className="text-right py-3 px-5 micro-label">Comparisons</th>
                    <th className="text-right py-3 px-5 micro-label">Faults</th>
                    <th className="text-right py-3 px-5 micro-label">Validation Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.station_summaries.map((s) => {
                    const rateColor =
                      s.validation_rate >= 75
                        ? "text-emerald-500"
                        : s.validation_rate >= 50
                          ? "text-amber-500"
                          : "text-red-500";
                    return (
                      <tr key={s.station_id} className="border-b border-border/40 hover:bg-muted/30">
                        <td className="py-3 px-5 font-medium">{s.station_name}</td>
                        <td className="py-3 px-5 font-mono text-xs text-muted-foreground">
                          {s.station_id}
                        </td>
                        <td className="py-3 px-5 text-right font-mono">
                          {s.total_comparisons}
                        </td>
                        <td className="py-3 px-5 text-right font-mono text-red-500">
                          {s.sensor_faults}
                        </td>
                        <td className={`py-3 px-5 text-right font-mono font-semibold ${rateColor}`}>
                          {s.validation_rate}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="panel p-6"
          >
            <h3 className="font-serif font-semibold mb-4">Upgraded Approach</h3>
            <div className="grid md:grid-cols-5 gap-3">
              {[
                { n: "AWS", d: "Sensors" },
                { n: "AI/ML", d: "Detection" },
                { n: "Spatial", d: "Intelligence" },
                { n: "Satellite", d: "Validation" },
                { n: "XAI", d: "Explainability" },
              ].map((step, i) => (
                <div
                  key={step.n}
                  className="p-3 rounded-md bg-amber-600/5 border border-amber-600/30 text-center"
                >
                  <p className="micro-label mb-1">Layer {i + 1}</p>
                  <p className="text-sm font-semibold">{step.n}</p>
                  <p className="text-xs text-muted-foreground">{step.d}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      ) : (
        <div className="panel p-12 text-center text-muted-foreground font-mono text-sm">
          Backend unavailable
        </div>
      )}
    </div>
  );
}