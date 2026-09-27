"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Moon, Sun, Globe, Save, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { useLocaleStore } from "@/stores/localeStore";


export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(user?.name || "");
  const [role, setRole] = useState(user?.role || "");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  

    // Inside component:
    const { locale, setLocale } = useLocaleStore();

  const handleSave = () => {
    updateUser({ name, role });
    toast.success("Settings saved");
  };

  const now = new Date();
  const stamp = now.toLocaleString("en-IN");

  return (
    <div>
      <PageHeader
        section="Ops"
        title="Settings"
        description="Appearance is stored in this browser. Runtime configuration comes from the FastAPI process — no secrets are rendered."
      />

      <div className="space-y-6">
        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel"
        >
          <div className="panel-header">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-amber-500" />
              <span className="micro-label">Operator Profile</span>
            </div>
          </div>
          <div className="p-6 grid md:grid-cols-2 gap-4">
            <div>
              <label className="micro-label mb-2 block">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-4 py-3 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="micro-label mb-2 block">Role</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-4 py-3 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="micro-label mb-2 block">Email (read-only)</label>
              <input
                value={user?.email || ""}
                disabled
                className="w-full bg-muted/40 border border-border rounded-md px-4 py-3 font-mono text-sm text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="panel"
        >
          <div className="panel-header">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-amber-500" />
              <span className="micro-label">Appearance</span>
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Persistent light / dark command palette.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <button
                onClick={() => setTheme("light")}
                className={`p-5 rounded-md border-2 transition-all ${
                  theme === "light"
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-border hover:border-amber-500/50"
                }`}
              >
                <Sun className="w-5 h-5 mb-3 mx-auto text-amber-500" />
                <p className="font-medium text-sm">Light</p>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-5 rounded-md border-2 transition-all ${
                  theme === "dark"
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-border hover:border-amber-500/50"
                }`}
              >
                <Moon className="w-5 h-5 mb-3 mx-auto text-amber-500" />
                <p className="font-medium text-sm">Dark</p>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="panel"
        >
          <div className="panel-header">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <span className="micro-label">Notifications</span>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: "Email alerts for high-severity anomalies", value: emailAlerts, set: setEmailAlerts },
              { label: "Push notifications for all anomalies", value: pushAlerts, set: setPushAlerts },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <span className="text-sm">{item.label}</span>
                <button
                  onClick={() => item.set(!item.value)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    item.value ? "bg-gradient-to-r from-amber-500 to-amber-700" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      item.value ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="panel"
        >
          <div className="panel-header">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-500" />
              <span className="micro-label">Language</span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3">
            <select
                value={locale}
                onChange={(e) => {
                setLocale(e.target.value as "en" | "hi" | "mr");
                toast.success(`Language changed to ${e.target.options[e.target.selectedIndex].text}`);
                }}
                className="w-full max-w-md bg-background border border-border rounded-md px-4 py-3 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
                <option value="en">🇬🇧 English</option>
                <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
                <option value="mr">🇮🇳 मराठी (Marathi)</option>
            </select>
            <span className="text-xs text-muted-foreground font-mono">
                Active: {locale.toUpperCase()}
            </span>
            </div>
          </div>
        </motion.div>

        {/* Runtime config */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="panel"
        >
          <div className="panel-header">
            <span className="micro-label">Runtime</span>
            <span className="text-xs font-mono text-muted-foreground">
              Updated {stamp}
            </span>
          </div>
          <div className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Runtime configuration (non-secret).
            </p>
            <pre className="bg-muted/40 border border-border rounded-md p-4 font-mono text-xs overflow-x-auto">
{JSON.stringify(
  {
    app_name: "AtmosAI",
    datetime_format: "%d.%m.%Y %H:%M:%S",
    station_count: 20,
    core_columns: {
      datetime: "timestamp",
      temperature: "T (degC)",
      pressure: "p (mbar)",
      humidity: "rh (%)",
    },
    ai_model: "openai/gpt-oss-20b",
    ai_provider: "Groq",
  },
  null,
  2
)}
            </pre>
          </div>
        </motion.div>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            size="lg"
            className="gap-2 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 font-semibold"
          >
            <Save className="w-4 h-4" /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}