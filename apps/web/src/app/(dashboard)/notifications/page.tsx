"use client";
import { DemoBadge } from "@/components/demo-badge";
import { usePageTitle } from "@/lib/hooks/use-page-title";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNotificationStore, type AppNotification } from "@/lib/stores/notification-store";
import { StatusIndicator } from "@/components/shared/status-indicator";
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle2,
  ShieldOff,
  Trash2,
  CheckCheck,
  ChevronRight,
  Shield,
  Activity,
  Server,
  Search,
  Terminal,
} from "lucide-react";

const typeConfig = {
  alert: { icon: ShieldOff, color: "text-destructive", bg: "bg-destructive/5" },
  warning: { icon: AlertTriangle, color: "text-[#ffc551]", bg: "bg-[#ffc551]/5" },
  success: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/5" },
  info: { icon: Info, color: "text-primary", bg: "bg-primary/5" },
};

const sourceIcons: Record<string, React.ElementType> = {
  scanner: Terminal,
  monitor: Activity,
  discovery: Search,
  asset: Server,
  system: Shield,
};

const initialNotifications: AppNotification[] = [
  { id: "n1", type: "alert", title: "Critical CVE Detected", message: "CVE-2024-21626 signature matched on docker-host-01.prod", timestamp: new Date(Date.now() - 60000).toISOString(), read: false, source: "scanner" },
  { id: "n2", type: "warning", title: "TLS Certificate Expiring", message: "Certificate for mail.internal expires in 7 days", timestamp: new Date(Date.now() - 300000).toISOString(), read: false, source: "monitor" },
  { id: "n3", type: "success", title: "Scan Completed", message: "Port scan of 10.0.1.0/24 finished — 47 hosts discovered", timestamp: new Date(Date.now() - 600000).toISOString(), read: false, source: "scanner" },
  { id: "n4", type: "info", title: "New Asset Discovered", message: "api-gateway-02.staging.internal added to asset inventory", timestamp: new Date(Date.now() - 1800000).toISOString(), read: false, source: "discovery" },
  { id: "n5", type: "info", title: "Worker Telemetry Update", message: "Exploit-01 CPU usage at 92% — possible resource contention", timestamp: new Date(Date.now() - 3600000).toISOString(), read: true, source: "monitor" },
  { id: "n6", type: "warning", title: "Rate Limit Approaching", message: "Scanner-01 approaching API rate limit on target 10.0.2.0/24", timestamp: new Date(Date.now() - 7200000).toISOString(), read: true, source: "system" },
  { id: "n7", type: "success", title: "DNS Enrichment Complete", message: "DNS resolution completed for *.staging.internal (23 records)", timestamp: new Date(Date.now() - 14400000).toISOString(), read: true, source: "discovery" },
  { id: "n8", type: "info", title: "Asset Risk Updated", message: "jenkins-master.internal risk score updated to 91/100", timestamp: new Date(Date.now() - 28800000).toISOString(), read: true, source: "asset" },
];

export default function NotificationsPage() {
  usePageTitle("Notifications");
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [filter, setFilter] = useState<string>(() => {
    return (typeof window !== "undefined" ? localStorage.getItem("notif-filter") : null) || "all";
  });

  useEffect(() => {
    if (filter !== "all") {
      localStorage.setItem("notif-filter", filter);
    } else {
      localStorage.removeItem("notif-filter");
    }
  }, [filter]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = filter === "all"
    ? notifications
    : filter === "unread"
    ? notifications.filter((n) => !n.read)
    : notifications.filter((n) => n.type === filter);

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg text-on-surface">Notifications</h1>
          <p className="text-body-sm text-on-surface-variant/60 mt-1">
            System alerts, scan results, and intelligence updates
          </p>
        </div>
        <StatusIndicator status="active" label="Live" />
            <DemoBadge />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {[
            { value: "all", label: "All" },
            { value: "unread", label: "Unread", count: unreadCount },
            { value: "alert", label: "Alerts" },
            { value: "warning", label: "Warnings" },
            { value: "success", label: "Success" },
            { value: "info", label: "Info" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-all duration-300 ${
                filter === tab.value
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-outline-variant/30 text-on-surface-variant/60 hover:text-on-surface hover:border-outline-variant"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-2 text-xs text-primary/80">({tab.count})</span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            <CheckCheck className="w-4 h-4 mr-1" />
            Mark all read
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <Trash2 className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-outline-variant/10">
            <AnimatePresence mode="popLayout">
              {filtered.map((notification, i) => {
                const config = typeConfig[notification.type];
                const Icon = config.icon;
                const SourceIcon = sourceIcons[notification.source] || Bell;

                return (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: i * 0.03 }}
                    onClick={() => markRead(notification.id)}
                    className={`flex items-start gap-4 p-5 cursor-pointer transition-all duration-300 group hover:bg-white/[0.02] ${
                      !notification.read ? "bg-primary/[0.02]" : ""
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg border border-outline-variant/20 flex items-center justify-center shrink-0 ${
                        config.bg
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4
                          className={`text-sm ${
                            !notification.read
                              ? "text-on-surface font-medium"
                              : "text-on-surface-variant/80"
                          }`}
                        >
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-primary data-point-glow shrink-0" />
                        )}
                      </div>
                      <p
                        className={`text-xs ${
                          !notification.read
                            ? "text-on-surface-variant/70"
                            : "text-on-surface-variant/40"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <SourceIcon className="w-3 h-3 text-on-surface-variant/30" />
                        <span className="text-[10px] text-on-surface-variant/30">
                          {notification.source}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-on-surface-variant/20" />
                        <span className="text-[10px] text-on-surface-variant/30">
                          {formatTime(notification.timestamp)}
                        </span>
                        <Badge
                          variant={
                            notification.type === "alert"
                              ? "destructive"
                              : notification.type === "warning"
                              ? "warning"
                              : notification.type === "success"
                              ? "success"
                              : "default"
                          }
                          size="sm"
                        >
                          {notification.type}
                        </Badge>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-on-surface-variant/20 group-hover:text-on-surface-variant/60 transition-colors mt-2 shrink-0" />
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <Bell className="w-12 h-12 text-on-surface-variant/20 mb-4" />
                <p className="text-sm text-on-surface-variant/40">No notifications</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}
