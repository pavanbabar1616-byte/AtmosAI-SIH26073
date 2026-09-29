"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Play, Pause, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { LiveIndicator } from "@/components/dashboard/LiveIndicator";
import { Button } from "@/components/ui/button";
import { useStations, useStationData } from "@/hooks/useStations";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

interface LiveReading {
  timestamp: string;
  temperature: number | null;
  pressure: number | null;
  humidity: number | null;
  is_anomaly: boolean;
  anomaly_type: string | null;
}

export default function LiveMonitorPage() {
  const { data: stations } = useStations();
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [liveReadings, setLiveReadings] = useState<LiveReading[]>([]);

  const stationId = selectedStation || stations?.[0]?.station_id || null;
  const { data: historicalData } = useStationData(stationId, 24);

  useEffect(() => {
    if (!selectedStation && stations?.[0]) {
      setSelectedStation(stations[0].station_id);
    }
  }, [stations, selectedStation]);

  useEffect(() => {
    if (historicalData && liveReadings.length === 0) {
      setLiveReadings(historicalData.slice(-20));
    }
  }, [historicalData, liveReadings.length]);

  useEffect(() => {
    if (!isLive || !stationId) return;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/simulation/next-reading/${stationId}`);
        const reading = await res.json();
        setLiveReadings((prev) => [...prev.slice(-30), reading]);
      } catch (e) {
        console.error("Live poll failed", e);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive, stationId]);

  const chartData = liveReadings.map((r) => ({
    time: new Date(r.timestamp).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    temperature: r.temperature,
    humidity: r.humidity,
    pressure: r.pressure,
    is_anomaly: r.is_anomaly,
  }));

  const latest = liveReadings[liveReadings.length - 1];

  const reset = () => {
    setIsLive(false);
    if (historicalData) setLiveReadings(historicalData.slice(-20));
  };

  return (
    <div>
      <PageHeader
        section="Command"
        title="Live Monitor"
        description="Real-time streaming of AWS readings with live anomaly detection."
      >
        <LiveIndicator isLive={isLive} />
      </PageHeader>

      <div className="flex items-center gap-3 mb-6">
        <select
          value={stationId || ""}
          onChange={(e) => setSelectedStation(e.target.value)}
          disabled={isLive}
          className="bg-background border border-border rounded-md px-4 py-2 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
        >
          {stations?.map((s) => (
            <option key={s.station_id} value={s.station_id}>
              {s.station_id} · {s.name}
            </option>
          ))}
        </select>

        <Button
          onClick={() => setIsLive(!isLive)}
          className={`gap-2 ${
            isLive
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900"
          }`}
        >
          {isLive ? (
            <>
              <Pause className="w-4 h-4" /> Stop Stream
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Start Live
            </>
          )}
        </Button>

        <Button variant="outline" onClick={reset} className="gap-2">
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="T (degC)"
          value={latest?.temperature ?? "—"}
          sublabel={latest ? new Date(latest.timestamp).toLocaleTimeString() : "Awaiting"}
          icon={<Activity className="w-4 h-4 text-amber-500" />}
        />
        <StatCard label="p (mbar)" value={latest?.pressure ?? "—"} sublabel="Station pressure" />
        <StatCard label="rh (%)" value={latest?.humidity ?? "—"} sublabel="Relative humidity" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="panel">
        <div className="panel-header">
          <div className="flex items-center gap-3">
            <span className="font-serif font-semibold">Streaming series</span>
            {isLive && (
              <span className="text-xs font-mono text-red-400">
                ● {liveReadings.length} readings
              </span>
            )}
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {isLive ? "Polling every 3s" : "Static snapshot"}
          </span>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip
                contentStyle={{
                  background: "#0f0f0f",
                  border: "1px solid #262626",
                  borderRadius: 6,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={2} dot={false} name="T (degC)" />
              <Line type="monotone" dataKey="humidity" stroke="#14b8a6" strokeWidth={2} dot={false} name="rh (%)" />
              <Line type="monotone" dataKey="pressure" stroke="#f97316" strokeWidth={2} dot={false} name="p (mbar)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {isLive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 panel p-4 border border-red-500/30 bg-red-500/5"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-red-500"
            />
            <p className="text-sm text-red-400 font-mono">
              Live stream active — readings update every 3 seconds
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}