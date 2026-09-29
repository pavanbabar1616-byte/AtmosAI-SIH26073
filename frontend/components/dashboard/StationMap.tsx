"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

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

// India bounds: approximately lat 8-37, lon 68-97
const INDIA_BOUNDS = {
  lat_min: 6,
  lat_max: 38,
  lon_min: 67,
  lon_max: 98,
};

function toPercent(lat: number, lon: number) {
  const x = ((lon - INDIA_BOUNDS.lon_min) / (INDIA_BOUNDS.lon_max - INDIA_BOUNDS.lon_min)) * 100;
  const y = ((INDIA_BOUNDS.lat_max - lat) / (INDIA_BOUNDS.lat_max - INDIA_BOUNDS.lat_min)) * 100;
  return { x, y };
}

export function StationMap({ stations }: StationMapProps) {
  const router = useRouter();

  return (
    <div className="panel relative">
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-500" />
          <span className="font-serif font-semibold">Station Map · India</span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {stations.length} stations
        </span>
      </div>

      <div className="relative p-6">
        {/* India outline SVG as background */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-[500px]"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid pattern */}
          <defs>
            <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Simplified India outline (approximate) */}
          <path
            d="M 30 20 L 38 15 L 48 18 L 55 15 L 62 20 L 68 18 L 72 25 L 70 32 L 75 38 L 78 48 L 76 55 L 72 60 L 70 68 L 62 78 L 55 88 L 48 92 L 42 90 L 40 82 L 38 72 L 32 65 L 28 55 L 25 45 L 22 35 L 25 25 Z"
            fill="rgba(217, 119, 6, 0.08)"
            stroke="rgba(217, 119, 6, 0.4)"
            strokeWidth="0.5"
            strokeDasharray="1 1"
          />

          {/* Station dots */}
          {stations.map((s, i) => {
            const { x, y } = toPercent(s.lat, s.lon);
            const health = s.health ?? 100;
            const color =
              health >= 95 ? "#10b981" : health >= 90 ? "#f59e0b" : "#ef4444";

            return (
              <g key={s.station_id}>
                {/* Pulse ring */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r="1"
                  fill={color}
                  opacity="0.3"
                  animate={{ r: [1, 2.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                />
                {/* Main dot */}
                <circle
                  cx={x}
                  cy={y}
                  r="0.9"
                  fill={color}
                  stroke="#0a0a0a"
                  strokeWidth="0.3"
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/stations/${s.station_id}`)}
                />
                {/* Label */}
                <text
                  x={x + 1.5}
                  y={y + 0.5}
                  fontSize="1.2"
                  fill="#94a3b8"
                  fontFamily="var(--font-mono)"
                  style={{ pointerEvents: "none" }}
                >
                  {s.station_id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 panel p-3 flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> ≥95%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> 90-95%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" /> &lt;90%
          </span>
        </div>

        {/* Info */}
        <div className="absolute bottom-4 right-4 text-xs font-mono text-muted-foreground">
          Click any dot to view station
        </div>
      </div>
    </div>
  );
}