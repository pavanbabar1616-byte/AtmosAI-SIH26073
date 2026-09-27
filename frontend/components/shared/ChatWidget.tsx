"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { useStats } from "@/hooks/useStations";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "How many anomalies detected?",
  "What is a freeze anomaly?",
  "How does the AI work?",
  "Which station is healthiest?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "AtmosAI Assistant online. Ask me about weather stations, anomaly patterns, or how the detection pipeline works.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: stats } = useStats();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    const userMsg: Message = { role: "user", content: msg };
    const history = messages.slice(1);
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const ctx = stats
        ? {
            total_stations: stats.total_stations,
            total_anomalies: stats.total_anomalies,
            by_type: stats.by_type,
            by_severity: stats.by_severity,
          }
        : undefined;
      const result = await api.chat(msg, history, ctx);
      const reply = result.error ? `⚠️ ${result.error}` : result.reply;
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Communication link failed." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "AtmosAI Assistant online. Ask me about weather stations, anomaly patterns, or how the detection pipeline works.",
      },
    ]);
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-md bg-gradient-to-br from-amber-500 to-amber-700 shadow-2xl flex items-center justify-center text-white border border-amber-500/50 hover:shadow-amber-500/30 transition-shadow"
        aria-label="Open assistant"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[600px] flex flex-col overflow-hidden rounded-lg border border-border shadow-2xl bg-[#0f0f0f]"
          >
            {/* Header */}
            <div className="border-b border-amber-600/30 bg-gradient-to-r from-[#1a0f00] to-[#2a1a00]">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-amber-400 font-serif font-semibold text-sm tracking-wide">
                      AtmosAI Assistant
                    </p>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider">
                        online
                      </span>
                    </div>
                  </div>
                  <p className="micro-label mt-0.5">Science · Groq LLM</p>
                </div>
                <button
                  onClick={resetChat}
                  className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-amber-500 hover:bg-muted/50 transition-colors"
                  title="Reset session"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f0f0f]"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-6 h-6 rounded bg-amber-600/20 border border-amber-600/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3 h-3 text-amber-500" />
                    </div>
                  )}
                  <div className="max-w-[80%]">
                    {m.role === "assistant" && (
                      <p className="micro-label mb-1 ml-1">AtmosAI</p>
                    )}
                    <div
                      className={`px-3 py-2 rounded-md text-sm whitespace-pre-wrap leading-relaxed font-mono ${
                        m.role === "user"
                          ? "bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-md"
                          : "bg-[#1a1a1a] text-slate-100 border border-[#262626]"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                  {m.role === "user" && (
                    <div className="w-6 h-6 rounded bg-[#1a1a1a] border border-[#262626] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3 h-3 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-2.5">
                  <div className="w-6 h-6 rounded bg-amber-600/20 border border-amber-600/40 flex items-center justify-center">
                    <Bot className="w-3 h-3 text-amber-500" />
                  </div>
                  <div className="bg-[#1a1a1a] border border-[#262626] px-4 py-3 rounded-md">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          className="w-1.5 h-1.5 rounded-full bg-amber-500"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 pb-3 bg-[#0f0f0f]">
                <p className="micro-label mb-2">Suggested Queries</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-[11px] font-mono px-2.5 py-1.5 rounded border border-amber-600/30 bg-amber-600/5 text-amber-400 hover:bg-amber-600/15 hover:border-amber-600/50 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-[#262626] bg-[#0a0a0a]">
              <div className="flex gap-2 items-end">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-2.5 text-amber-500 font-mono text-xs">
                    &gt;
                  </span>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Query the assistant..."
                    rows={1}
                    className="w-full resize-none bg-[#1a1a1a] border border-[#262626] rounded-md pl-7 pr-3 py-2 text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-600 max-h-24"
                  />
                </div>
                <button
                  onClick={() => send()}
                  disabled={loading || !input.trim()}
                  className="h-9 w-9 rounded-md bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-amber-600 hover:to-amber-800 transition-colors shrink-0"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="micro-label">Verify before acting</p>
                <p className="micro-label">v1.0.0</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}