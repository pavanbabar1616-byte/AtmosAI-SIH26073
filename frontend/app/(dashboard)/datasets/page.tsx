"use client";

import { motion } from "framer-motion";
import { Database, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useStats } from "@/hooks/useStations";

export default function DatasetsPage() {
  const { data: stats } = useStats();

  return (
    <div>
      <PageHeader
        section="Ops"
        title="Datasets"
        description="Catalog of ingest sources. All files mounted and available for analysis."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel"
      >
        <div className="panel-header">
          <span className="micro-label">Mounted Sources</span>
          <span className="text-xs font-mono text-muted-foreground">
            1 active
          </span>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-md bg-amber-600/15 border border-amber-600/30 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-amber-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-serif font-semibold text-lg">weather.csv</h3>
                <span className="badge-command">Mounted</span>
              </div>
              <p className="text-xs font-mono text-muted-foreground break-all mb-4">
                /backend/app/data/weather_data.json
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Real AWS observations from Open-Meteo Archive API. Core AtmosAI variables are DateTime, T (degC), p (mbar), and rh (%).
              </p>

              <div className="grid md:grid-cols-2 gap-3 mb-6">
                <div className="p-4 rounded-md bg-muted/40 border border-border">
                  <p className="micro-label mb-1">Rows</p>
                  <p className="font-mono text-2xl font-semibold">
                    {stats?.total_data_points.toLocaleString() || "0"}
                  </p>
                </div>
                <div className="p-4 rounded-md bg-muted/40 border border-border">
                  <p className="micro-label mb-1">Columns</p>
                  <p className="font-mono text-2xl font-semibold">5</p>
                </div>
                <div className="p-4 rounded-md bg-muted/40 border border-border">
                  <p className="micro-label mb-1">Stations</p>
                  <p className="font-mono text-2xl font-semibold">
                    {stats?.total_stations || "0"}
                  </p>
                </div>
                <div className="p-4 rounded-md bg-muted/40 border border-border">
                  <p className="micro-label mb-1">Window</p>
                  <p className="font-mono text-xs pt-1">8-day hourly archive</p>
                </div>
              </div>

              <div>
                <p className="micro-label mb-2">Columns</p>
                <div className="flex flex-wrap gap-2">
                  {["timestamp", "temperature", "pressure", "humidity", "wind_speed", "is_anomaly", "anomaly_type"].map((col) => (
                    <span
                      key={col}
                      className="px-2 py-1 rounded text-xs font-mono bg-muted border border-border"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}