"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wifi, WifiOff } from "lucide-react";

type ConnectionStatus = "connected" | "disconnected" | "simulated";

export function ConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>("simulated");

  useEffect(() => {
    const useMock = import.meta.env.VITE_USE_MOCK !== "false";
    setStatus(useMock ? "simulated" : "connected");

    if (!useMock) {
      const ws = new WebSocket(import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws");
      ws.onopen = () => setStatus("connected");
      ws.onerror = () => setStatus("disconnected");
      ws.onclose = () => setStatus("disconnected");
      return () => ws.close();
    }
  }, []);

  const config = {
    connected: { color: "bg-green-400", label: "Live", pulse: true },
    disconnected: { color: "bg-destructive", label: "Disconnected", pulse: false },
    simulated: { color: "bg-[#ffc551]", label: "Simulated", pulse: true },
  };

  const cfg = config[status];

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-outline-variant/10 bg-[#0e0e0e]/50">
      <div className="relative">
        <div className={`w-2 h-2 rounded-full ${cfg.color}`} />
        {cfg.pulse && (
          <div className={`absolute inset-0 w-2 h-2 rounded-full ${cfg.color} animate-ping opacity-40`} />
        )}
      </div>
      <span className="text-[10px] font-mono text-on-surface-variant/60 uppercase tracking-wider">
        {cfg.label}
      </span>
      {status === "simulated" ? (
        <Wifi className="w-3 h-3 text-[#ffc551]/60" />
      ) : status === "connected" ? (
        <Wifi className="w-3 h-3 text-green-400/60" />
      ) : (
        <WifiOff className="w-3 h-3 text-destructive/60" />
      )}
    </div>
  );
}
