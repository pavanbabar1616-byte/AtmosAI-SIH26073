"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Radar, Shield, Zap, CloudLightning, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Radar, title: "Real-time Detection", description: "LSTM Autoencoder monitors 20 AWS stations continuously" },
  { icon: Activity, title: "Explainable AI", description: "SHAP-powered explanations show WHY each anomaly was flagged" },
  { icon: Shield, title: "Trust Scores", description: "Confidence ratings for every detection decision" },
  { icon: Zap, title: "Instant Corrections", description: "Interpolation suggests corrected values in real-time" },
  { icon: CloudLightning, title: "Real Weather Data", description: "Live data from IMD stations across India" },
  { icon: TrendingUp, title: "Station Health", description: "Monitor sensor degradation across the entire network" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-3xl animate-float" />
      </div>

      <header className="relative z-10 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
            <CloudLightning className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold leading-tight">AtmosAi</h2>
            <p className="text-xs text-muted-foreground">SIH26073</p>
          </div>
        </div>
        <Link href="/dashboard">
          <Button className="gap-2">
            Open Dashboard <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </header>

      <section className="relative z-10 px-8 pt-20 pb-24 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-sm text-cyan-400 mb-8"
        >
          <Radar className="w-4 h-4" /> Detect · Explain · Trust
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="gradient-text">AI-Powered</span>
          <br />
          <span>Weather Data Quality</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12"
        >
          AtmosAi monitors India&apos;s Automatic Weather Stations in real-time, detects sensor anomalies with
          explainable AI, and suggests corrections — ensuring the data behind India&apos;s forecasts is trustworthy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 h-12 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
              Launch Live Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      <section className="relative z-10 px-8 pb-24 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Everything you need for weather data integrity
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="glass rounded-2xl p-6 hover:border-cyan-500/50 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <footer className="relative z-10 border-t border-border px-8 py-8 text-center text-sm text-muted-foreground">
        <p>SIH26073 · AtmosAi · Dy Patil School of Engineering, Pune</p>
      </footer>
    </div>
  );
}