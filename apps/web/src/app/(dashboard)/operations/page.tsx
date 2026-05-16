"use client";
import { DemoBadge } from "@/components/demo-badge";
import { usePageTitle } from "@/lib/hooks/use-page-title";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScanEvents } from "@/lib/hooks/use-scanner";
import { useTelemetry } from "@/lib/hooks/use-telemetry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { CardSkeleton } from "@/components/ui/skeleton";
import {
  Activity,
  Cpu,
  HardDrive,
  Terminal,
  CheckCircle2,
  XCircle,
  Trash2,
  Download,
  Filter,
  AlertTriangle,
  Radio,
  Zap,
} from "lucide-react";

export default function OperationsPage() {
  const { data: telemetry, isLoading } = useTelemetry();
  const { events, isStreaming } = useScanEvents();
  const [logLevel, setLogLevel] = useState("all");
  const terminalRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && typeof window !== "undefined") {
      const saved = localStorage.getItem("ops-log-level");
      if (saved) setLogLevel(saved);
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (logLevel !== "all") {
      localStorage.setItem("ops-log-level", logLevel);
    } else if (initialized.current) {
      localStorage.removeItem("ops-log-level");
    }
  }, [logLevel]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [events.length]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in">
        <div className="h-8 w-64 bg-[#1a1a1a] rounded animate-pulse" />
        <div className="h-4 w-48 bg-[#1a1a1a] rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const filteredEvents = logLevel === "all"
    ? events
    : events.filter((e) => e.type === logLevel);

  const errorCount = events.filter((e) => e.type === "ERROR" || e.type === "CRITICAL").length;

  const totalTasks = telemetry?.reduce((s, w) => s + w.tasksCompleted, 0) || 0;
  const avgCpu = telemetry ? Math.round(telemetry.reduce((s, w) => s + w.cpu, 0) / telemetry.length) : 0;
  const avgMem = telemetry ? Math.round(telemetry.reduce((s, w) => s + w.memory, 0) / telemetry.length) : 0;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg text-on-surface">Live Operations</h1>
          <p className="text-body-sm text-on-surface-variant/60 mt-1">
            Real-time pipeline monitoring and worker telemetry
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusIndicator status={isStreaming ? "active" : "idle"} label={isStreaming ? "Live" : "Idle"} />
          <DemoBadge />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Workers", value: telemetry?.filter((w) => w.status === "busy").length || 0, icon: Cpu, color: "text-primary" },
          { label: "Tasks Completed", value: totalTasks.toLocaleString(), icon: CheckCircle2, color: "text-green-400" },
          { label: "Avg CPU", value: `${avgCpu}%`, icon: Activity, color: avgCpu > 70 ? "text-destructive" : "text-[#ffc551]" },
          { label: "Errors", value: errorCount, icon: AlertTriangle, color: errorCount > 0 ? "text-destructive" : "text-green-400" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-[#121212] border border-outline-variant rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-on-surface-variant/60 uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {telemetry?.map((worker, i) => (
          <motion.div
            key={worker.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {worker.status === "busy" ? (
                      <Activity className="w-4 h-4 text-primary" />
                    ) : worker.status === "error" ? (
                      <XCircle className="w-4 h-4 text-destructive" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    )}
                    <CardTitle className="text-sm">{worker.name}</CardTitle>
                  </div>
                  <Badge
                    variant={worker.status === "busy" ? "default" : worker.status === "error" ? "destructive" : "success"}
                    size="sm"
                  >
                    {worker.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {worker.currentTask && (
                  <div className="flex items-center gap-2 p-2 bg-[#0e0e0e] border border-outline-variant/10 rounded">
                    <Radio className="w-3 h-3 text-primary/60 shrink-0" />
                    <p className="text-xs text-on-surface-variant/60 truncate">{worker.currentTask}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-on-surface-variant/60">CPU</span>
                      <span className="font-mono text-on-surface-variant/80">{worker.cpu}%</span>
                    </div>
                    <Progress value={worker.cpu} className="h-1.5" 
                      indicatorClassName={worker.cpu > 80 ? "bg-destructive" : worker.cpu > 60 ? "bg-[#ffc551]" : "bg-primary"} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-on-surface-variant/60">Memory</span>
                      <span className="font-mono text-on-surface-variant/80">{worker.memory}%</span>
                    </div>
                    <Progress value={worker.memory} className="h-1.5" 
                      indicatorClassName={worker.memory > 80 ? "bg-destructive" : worker.memory > 60 ? "bg-[#ffc551]" : "bg-primary"} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/10">
                  <span className="text-on-surface-variant/40">Tasks completed</span>
                  <span className="font-mono text-primary">{worker.tasksCompleted.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" />
              <CardTitle>Live Terminal</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[#0e0e0e] border border-outline-variant/20 rounded-lg p-0.5">
{["all", "INFO", "WARN", "ERROR", "CRITICAL"].map((level) => (
                  <button
                    type="button"
                    key={level}
                    onClick={() => setLogLevel(level)}
                    className={`px-2 py-1 text-[10px] rounded transition-all ${
                      logLevel === level ? "bg-primary/10 text-primary" : "text-on-surface-variant/40 hover:text-on-surface"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-on-surface-variant/40">{filteredEvents.length} events</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div
              ref={terminalRef}
              className="h-96 bg-[#0a0a0a] border-t border-outline-variant/20 p-4 font-mono text-xs overflow-y-auto scrollbar-thin"
            >
              <AnimatePresence initial={false}>
                {filteredEvents.slice(-150).map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3 py-0.5 hover:bg-white/[0.02] rounded px-1"
                  >
                    <span className="text-on-surface-variant/25 w-20 shrink-0">
                      {event.timestamp.split("T")[1]?.split(".")[0]}
                    </span>
                    <span className={`w-14 shrink-0 ${
                      event.type === "INFO" ? "text-primary/70" :
                      event.type === "WARN" ? "text-[#ffc551]" :
                      event.type === "ERROR" ? "text-destructive" :
                      "text-red-400"
                    }`}>
                      [{event.type}]
                    </span>
                    <span className="text-primary/45 w-28 shrink-0 truncate">{event.source}</span>
                    <span className="text-on-surface/60 truncate">{event.message}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <CardTitle>Pipeline Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { stage: "Discovery", status: "completed", tasks: "1,247 assets discovered", icon: Activity, progress: 100 },
                { stage: "Port Scanning", status: "in_progress", tasks: "Scanning 10.0.1.0/24", icon: Cpu, progress: 65 },
                { stage: "Service Enumeration", status: "pending", tasks: "12 services queued", icon: HardDrive, progress: 30 },
                { stage: "Vulnerability Detection", status: "pending", tasks: "Awaiting input", icon: Terminal, progress: 0 },
              ].map((stage, i) => {
                const Icon = stage.icon;
                return (
                  <div key={stage.stage} className="flex items-center gap-4 p-4 bg-[#0e0e0e] border border-outline-variant/20 rounded-lg">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      stage.status === "completed" ? "border-primary bg-primary/10" :
                      stage.status === "in_progress" ? "border-[#ffc551] bg-[#ffc551]/10" :
                      "border-outline-variant bg-[#1a1a1a]"
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        stage.status === "completed" ? "text-primary" :
                        stage.status === "in_progress" ? "text-[#ffc551]" :
                        "text-on-surface-variant/40"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm font-medium ${
                          stage.status === "completed" ? "text-on-surface" :
                          stage.status === "in_progress" ? "text-[#ffc551]" :
                          "text-on-surface-variant/40"
                        }`}>{stage.stage}</p>
                        <Badge variant={stage.status === "completed" ? "success" : stage.status === "in_progress" ? "warning" : "secondary"} size="sm">
                          {stage.status === "in_progress" ? "In Progress" : stage.status.charAt(0).toUpperCase() + stage.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-xs text-on-surface-variant/60 mb-2">{stage.tasks}</p>
                      <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${stage.progress}%` }}
                          transition={{ duration: 1, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
