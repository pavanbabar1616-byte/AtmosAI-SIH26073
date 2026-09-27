"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Mountain, Radio, Activity } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useStationData } from "@/hooks/useStations";
import { useStations } from "@/hooks/useStations";
import { SkeletonList } from "@/components/shared/Skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function StationDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: stations } = useStations();
  const { data: data, isLoading } = useStationData(id, 96);

  const station = stations?.find((s) => s.station_id === id);

  if (isLoading || !station) {
    return (
      <div>
        <PageHeader title="Loading station..." />
        <SkeletonList count={3} />
      </div>
    );
  }

  // Prepare chart data
  const chartData = (data || []).map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    temperature: d.temperature,
    humidity: d.humidity,
    pressure: d.pressure,
    is_anomaly: d.is_anomaly,
  }));

  // Summary stats
  const validTemps = (data || []).map((d) => d.temperature).filter((t) => t !== null) as number[];
  const avgTemp = validTemps.length
    ? Math.round((validTemps.reduce((a, b) => a + b, 0) / validTemps.length) * 10) / 10
    : 0;

  const anomalyCount = (data || []).filter((d) => d.is_anomaly).length;

  return (
    <div className="space-y-8">
      <Link href="/stations" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-cyan-400 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Stations
      </Link>

      <PageHeader
        title={station.name}
        description={`${station.state} · ${station.lat.toFixed(2)}°N, ${station.lon.toFixed(2)}°E`}
      />

      {/* Info cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { icon: MapPin, label: "State", value: station.state },
          { icon: Mountain, label: "Elevation", value: `${station.elevation_m} m` },
          { icon: Activity, label: "Avg Temp (96h)", value: `${avgTemp}°C` },
          { icon: Radio, label: "Anomalies (96h)", value: anomalyCount.toString() },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <Icon className="w-5 h-5 text-cyan-400 mb-3" />
              <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
              <p className="text-lg font-semibold">{item.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Temperature Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-8"
      >
        <h3 className="font-semibold text-lg mb-6">Temperature (Last 96 hours)</h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              fontSize={11}
              interval={Math.floor(chartData.length / 12)}
            />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip
              contentStyle={{
                background: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                borderRadius: 12,
                color: "white",
              }}
            />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                if (payload.is_anomaly) {
                  return <circle cx={cx} cy={cy} r={5} fill="#ef4444" stroke="#7f1d1d" strokeWidth={2} />;
                }
                return <circle cx={cx} cy={cy} r={0} />;
              }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            Red dots mark detected anomalies
          </span>
        </p>
      </motion.div>

      {/* Humidity + Pressure */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-8"
        >
          <h3 className="font-semibold text-lg mb-6">Humidity (%)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} interval={Math.floor(chartData.length / 6)} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip contentStyle={{ background: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: 12, color: "white" }} />
              <Line type="monotone" dataKey="humidity" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-8"
        >
          <h3 className="font-semibold text-lg mb-6">Pressure (hPa)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} interval={Math.floor(chartData.length / 6)} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip contentStyle={{ background: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: 12, color: "white" }} />
              <Line type="monotone" dataKey="pressure" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}