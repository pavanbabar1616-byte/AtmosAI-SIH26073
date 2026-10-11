"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

interface StationMapProps {
  stations: Array<{
    station_id: string;
    name: string;
    state: string;
    lat: number;
    lon: number;
    health?: number;
    anomalies?: number;
  }>;
}

export function StationMap({ stations }: StationMapProps) {
  const router = useRouter();

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-500" />
          <span className="font-serif font-semibold">Station Map · India</span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {stations.length} stations
        </span>
      </div>

      <div className="relative">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 1000,
            center: [82, 22],
          }}
          width={800}
          height={700}
          style={{
            width: "100%",
            height: "auto",
            background: "transparent",
          }}
        >
          <ZoomableGroup zoom={1} center={[82, 22]}>
            <Geographies geography="/india.json">
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo: any) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="rgba(217, 119, 6, 0.12)"
                    stroke="rgba(217, 119, 6, 0.6)"
                    strokeWidth={0.8}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "rgba(217, 119, 6, 0.2)", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {stations.map((s, i) => {
              const health = s.health ?? 100;
              const color =
                health >= 95 ? "#10b981" : health >= 90 ? "#f59e0b" : "#ef4444";

              return (
                <Marker
                  key={s.station_id}
                  coordinates={[s.lon, s.lat]}
                  onClick={() => router.push(`/stations/${s.station_id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <motion.circle
                    r={6}
                    fill={color}
                    opacity={0.3}
                    animate={{ r: [6, 14, 6], opacity: [0.3, 0, 0.3] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.08,
                    }}
                  />
                  <circle r={4} fill={color} stroke="#0a0a0a" strokeWidth={1} />
                  <text
                    textAnchor="middle"
                    y={-9}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 7,
                      fill: "#94a3b8",
                      pointerEvents: "none",
                    }}
                  >
                    {s.station_id}
                  </text>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 panel p-3 flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> ≥95%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> 90–95%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" /> &lt;90%
          </span>
        </div>

        <div className="absolute bottom-4 right-4 text-xs font-mono text-muted-foreground">
          Click any dot to view station
        </div>
      </div>
    </div>
  );
}