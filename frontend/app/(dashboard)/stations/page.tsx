"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Radio } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useStations, useStats } from "@/hooks/useStations";
import { SkeletonList } from "@/components/shared/Skeleton";

export default function StationsPage() {
  const { data: stations, isLoading } = useStations();
  const { data: stats } = useStats();

  const healthMap = new Map(
    (stats?.station_health || []).map((s) => [s.station_id, s])
  );

  return (
    <div>
      <PageHeader
        section="Field"
        title="Station Registry"
        description="20 Automatic Weather Stations across India. All readings sourced from real ingest streams."
      />

      {isLoading ? (
        <SkeletonList count={6} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stations?.map((station, i) => {
            const health = healthMap.get(station.station_id);
            const healthColor =
              !health
                ? "text-muted-foreground"
                : health.health >= 95
                  ? "text-emerald-500"
                  : health.health >= 90
                    ? "text-amber-500"
                    : "text-red-500";

            return (
              <motion.div
                key={station.station_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link href={`/stations/${station.station_id}`}>
                  <div className="panel p-5 hover:border-amber-600/50 transition-all cursor-pointer h-full">
                    <div className="flex items-start justify-between mb-4">
                      <span className="badge-command">{station.station_id}</span>
                      {health && (
                        <span className={`text-sm font-mono font-bold ${healthColor}`}>
                          {health.health}%
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-semibold text-lg mb-2">
                      {station.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 font-mono">
                      <MapPin className="w-3 h-3" />
                      <span>{station.state}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                      <div>
                        <p className="micro-label mb-1">Anomalies</p>
                        <p className="font-mono text-sm">
                          {health?.anomalies || 0}
                        </p>
                      </div>
                      <div>
                        <p className="micro-label mb-1">Avg Temp</p>
                        <p className="font-mono text-sm">
                          {health?.avg_temperature || 0}°C
                        </p>
                      </div>
                      <div>
                        <p className="micro-label mb-1">Elevation</p>
                        <p className="font-mono text-sm">{station.elevation_m}m</p>
                      </div>
                      <div>
                        <p className="micro-label mb-1">Coordinates</p>
                        <p className="font-mono text-xs">
                          {station.lat.toFixed(2)}, {station.lon.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}