"use client";

import { motion } from "framer-motion";
import { Brain, Shield, Zap, Database } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const features = [
  {
    icon: Brain,
    title: "Isolation Forest",
    desc: "Per-station unsupervised outlier scoring on the core triad after robust scaling.",
  },
  {
    icon: Shield,
    title: "Explainable Decisions",
    desc: "Feature attribution for every anomaly — which sensor reading drove the flag.",
  },
  {
    icon: Zap,
    title: "Instant Corrections",
    desc: "Weighted linear interpolation suggests the corrected value for review.",
  },
  {
    icon: Database,
    title: "Real Weather Data",
    desc: "Sourced from Open-Meteo Archive API. 20 stations across India. 3,840 observations.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        section="Command"
        title="About AtmosAI"
        description="AI-powered quality control for India's Automatic Weather Station network."
      />

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel p-8"
        >
          <span className="micro-label mb-3 block">Problem Statement</span>
          <h2 className="font-serif text-2xl font-bold mb-4">
            SIH26073 — Anomaly Detection for AWS
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            India&apos;s Automatic Weather Stations generate critical meteorological data used for
            forecasting, disaster management, agriculture, and aviation. Sensor failures,
            calibration drift, communication dropouts, and hardware faults frequently produce
            erroneous readings that contaminate downstream data products. Traditional
            threshold-based quality control is insufficient to catch complex or hidden anomalies
            in real-time.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-md bg-muted/40 border border-border">
              <p className="micro-label mb-1">Ministry</p>
              <p className="text-sm font-medium">Ministry of Earth Sciences (MoES)</p>
            </div>
            <div className="p-4 rounded-md bg-muted/40 border border-border">
              <p className="micro-label mb-1">Theme</p>
              <p className="text-sm font-medium">Disaster Management</p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="panel p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-amber-600/15 border border-amber-600/30 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold mb-1">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="panel p-8"
        >
          <span className="micro-label mb-4 block">Stack</span>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {[
              ["Frontend", "Next.js 16 · React 19 · Tailwind v4"],
              ["Backend", "FastAPI · Python 3.12 · scikit-learn"],
              ["AI Engine", "Isolation Forest · rolling z-score"],
              ["LLM Assistant", "Groq · openai/gpt-oss-20b"],
              ["Data", "Open-Meteo Archive · 20 Indian stations"],
              ["Charts", "Recharts · real-time time-series"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-4">
                <span className="text-muted-foreground w-32 shrink-0">{k}</span>
                <span className="font-mono text-xs">{v}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}