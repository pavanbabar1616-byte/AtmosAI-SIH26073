"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import Link from "next/link";

export default function AIInsightsPage() {
  return (
    <div>
      <PageHeader
        section="Science"
        title="AI Insights"
        description="Narrative explanations generated from fitted detectors and residual diagnostics."
      />

      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel p-6"
        >
          <div className="w-10 h-10 rounded-md bg-amber-600/15 border border-amber-600/30 flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="font-serif font-semibold text-lg mb-2">
            Insights pipeline active
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Once Isolation Forest and rolling z-score jobs emit detections, this page will
            summarize drivers, affected channels, and recommended checks.
          </p>
          <Link href="/anomalies">
            <div className="inline-flex items-center gap-2 text-amber-500 text-sm font-medium hover:gap-3 transition-all">
              View anomaly feed <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="panel p-6"
        >
          <div className="panel-header mb-4 -mx-6 -mt-6 px-6 py-4">
            <span className="micro-label">Intended Contract</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            What this module will consume — not mock copy.
          </p>
          <ul className="space-y-3 text-sm font-mono">
            <li className="flex items-start gap-2">
              <span className="text-amber-500">→</span>
              <span>Detection records from <span className="text-amber-500">/api/v1/anomalies</span></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">→</span>
              <span>Channel completeness from <span className="text-amber-500">/api/v1/sensors/channels</span></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">→</span>
              <span>Core triad series from <span className="text-amber-500">/api/v1/telemetry/series</span></span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}