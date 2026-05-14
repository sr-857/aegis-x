"use client";

import { useEffect, useState } from "react";
import { useScanStore } from "@/lib/stores/scan-store";
import { useNotificationStore } from "@/lib/stores/notification-store";
import { useDashboardKpis } from "@/lib/hooks/use-dashboard";
import { Activity, Cpu, Bell, Zap, Clock } from "lucide-react";

export function StatusBar() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());
  const eventCount = useScanStore((s) => s.events.length);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const { data: kpis } = useDashboardKpis();

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <footer className="h-8 border-t border-outline-variant/10 bg-[#0a0a0a] flex items-center justify-between px-4 text-[10px] text-on-surface-variant/30 font-mono">
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5">
          <Activity className="w-3 h-3" />
          <span>{eventCount} events</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3 h-3" />
          <span>{kpis?.[0]?.value || "—"} assets</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Bell className="w-3 h-3" />
          <span>{unreadCount} unread</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <Zap className="w-3 h-3" />
          <span>{kpis?.[2]?.value || "—"} critical</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className="w-3 h-3" />
        <span suppressHydrationWarning>
          {time.toLocaleTimeString("en-US", { hour12: false })}
        </span>
        <span className="mx-1">·</span>
        <span>AEGIS v1.0</span>
      </div>
    </footer>
  );
}
