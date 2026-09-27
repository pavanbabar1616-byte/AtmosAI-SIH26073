"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Mountain, Radio, Activity } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useStationData, useStations } from "@/hooks/useStations";
import { SkeletonList } from "@/components/shared/Skeleton";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

export default function StationDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: stations } = useStations();
  const { data, isLoading } = useStationData(id, 96);

  const station = stations?.find((s) => s.station_id === id);

  if (isLoading || !station) {
    return (
      <div className="space-y-8">
        <PageHeader section="Field" title="Loading station..." />
        <SkeletonList count={3} />
      </div>
    );
  }

  const chartData = (data || []).map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    temperature: d.temperature,
    humidity: d.humidity,
    pressure: d.pressure,
    is_anomaly: d.is_anomaly,
  }));

  const validTemps = (data || []).map((d) => d.temperature).filter((t) => t !== null) as number[];
  const avgTemp = validTemps.length
    ? Math.round((validTemps.reduce((a, b) => a + b, 0) / validTemps.length) * 10) / 10
    : 0;
  const anomalyCount = (data || []).filter((d) => d.is_anomaly).length;

  return (
    <div className="space-y-8">
      <Link
        href="/stations"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-500 transition-colors font-mono"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Station Registry
      </Link>

      <PageHeader
        section="Field"
        title={station.name}
        description={`${station.state} · ${station.lat.toFixed(2)}°N, ${station.lon.toFixed(2)}°E`}
      />

      <div className="grid md:grid-cols-4 gap-4">
        {[
          { icon: MapPin, label: "State", value: station.state },
          { icon: Mountain, label: "Elevation", value: `${station.elevation_m} m` },
          { icon: Activity, label: "Avg Temp", value: `${avgTemp}°C` },
          { icon: Radio, label: "Anomalies", value: anomalyCount.toString() },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="panel p-5"
            >
              <Icon className="w-4 h-4 text-amber-500 mb-3" />
              <p className="micro-label mb-1">{item.label}</p>
              <p className="text-lg font-mono font-semibold">{item.value}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="panel"
      >
        <div className="panel-header">
          <span className="font-serif font-semibold">Temperature · Last 96 hours</span>
          <span className="text-xs font-mono text-muted-foreground">{chartData.length} points</span>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} interval={Math.floor(chartData.length / 12)} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "#0f0f0f",
                  border: "1px solid #262626",
                  borderRadius: 6,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="panel">
          <div className="panel-header">
            <span className="font-serif font-semibold">Humidity (%)</span>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} interval={Math.floor(chartData.length / 6)} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ background: "#0f0f0f", border: "1px solid #262626", borderRadius: 6, fontFamily: "var(--font-mono)", fontSize: 12 }} />
                <Line type="monotone" dataKey="humidity" stroke="#14b8a6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="panel">
          <div className="panel-header">
            <span className="font-serif font-semibold">Pressure (hPa)</span>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} interval={Math.floor(chartData.length / 6)} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ background: "#0f0f0f", border: "1px solid #262626", borderRadius: 6, fontFamily: "var(--font-mono)", fontSize: 12 }} />
                <Line type="monotone" dataKey="pressure" stroke="#f97316" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}