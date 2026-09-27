"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { useStations, useStationData } from "@/hooks/useStations";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

export default function LiveMonitorPage() {
  const { data: stations } = useStations();
  const firstStation = stations?.[0]?.station_id || null;
  const { data } = useStationData(firstStation, 48);

  const chartData = (data || []).map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    temperature: d.temperature,
    humidity: d.humidity,
    pressure: d.pressure,
  }));

  const latest = data?.[data.length - 1];

  return (
    <div>
      <PageHeader
        section="Command"
        title="Live Monitor"
        description="Latest observation and preceding 48-hour hourly series. Real values — no synthetic data."
      />

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="T (degC)"
          value={latest?.temperature ?? "—"}
          sublabel={latest ? new Date(latest.timestamp).toLocaleString() : "Awaiting data"}
          icon={<Activity className="w-4 h-4 text-amber-500" />}
        />
        <StatCard
          label="p (mbar)"
          value={latest?.pressure ?? "—"}
          sublabel={latest ? "Station pressure" : "Awaiting data"}
        />
        <StatCard
          label="rh (%)"
          value={latest?.humidity ?? "—"}
          sublabel={latest ? "Relative humidity" : "Awaiting data"}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel"
      >
        <div className="panel-header">
          <span className="font-serif font-semibold">Hourly series — trailing 48h</span>
          <span className="text-xs font-mono text-muted-foreground">
            {chartData.length} points
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
    </div>
  );
}