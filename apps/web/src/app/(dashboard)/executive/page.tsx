"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDashboardSummary } from "@/lib/hooks/use-dashboard";
import { useScanEvents } from "@/lib/hooks/use-scanner";
import { MetricCard } from "@/components/shared/metric-card";
import { LiveFeed } from "@/components/shared/live-feed";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { TimelineNode } from "@/components/charts/timeline-node";
import { DemoBadge } from "@/components/demo-badge";
import { usePageTitle } from "@/lib/hooks/use-page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardSkeleton } from "@/components/ui/skeleton";
import {
  Shield,
  Activity,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  Download,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { cn, downloadJSON } from "@/lib/utils";
import { useToast } from "@/components/toast";

const chartData = [
  { time: "00:00", assets: 120, threats: 8, scans: 45 },
  { time: "04:00", assets: 245, threats: 12, scans: 78 },
  { time: "08:00", assets: 589, threats: 23, scans: 156 },
  { time: "12:00", assets: 1245, threats: 45, scans: 312 },
  { time: "16:00", assets: 2100, threats: 67, scans: 489 },
  { time: "20:00", assets: 2680, threats: 82, scans: 567 },
  { time: "24:00", assets: 2847, threats: 89, scans: 623 },
];

const severityData = [
  { name: "Critical", value: 72, color: "#ffb4ab" },
  { name: "High", value: 18, color: "#ffc551" },
  { name: "Medium", value: 8, color: "#99907c" },
  { name: "Low", value: 2, color: "#4d4635" },
];

export default function ExecutiveDashboard() {
  const { data: summary, isLoading, refetch } = useDashboardSummary();
  const { events, isStreaming } = useScanEvents();
  const [timeframe, setTimeframe] = useState("24h");
  usePageTitle("Executive Dashboard");
  const { addToast } = useToast();

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-[#1a1a1a] rounded animate-pulse" />
            <div className="h-4 w-48 bg-[#1a1a1a] rounded animate-pulse mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-[300px] bg-[#121212] border border-outline-variant rounded-lg animate-pulse" />
          </div>
          <div className="h-[300px] bg-[#121212] border border-outline-variant rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-headline-lg text-on-surface">Executive Dashboard</h1>
            <StatusIndicator status="active" label="Live" />
            <DemoBadge />
          </div>
          <p className="text-body-sm text-on-surface-variant/60 mt-1">
            Attack surface overview · {summary?.kpis[0]?.value || "2,847"} assets tracked
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#0e0e0e] border border-outline-variant/30 rounded-lg p-0.5">
            {["6h", "12h", "24h", "7d"].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                  timeframe === t
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "text-on-surface-variant/60 hover:text-on-surface"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <Button variant="ghost" size="icon" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            const exportData = {
              exportedAt: new Date().toISOString(),
              kpis: summary?.kpis || [],
              timeline: summary?.timeline || [],
              threatStats: {
                critical: 72,
                high: 18,
                medium: 8,
                low: 2,
              },
            };
            downloadJSON(exportData, `aegis-dashboard-${Date.now()}.json`);
            addToast({ type: "success", title: "Export ready", message: "Dashboard data exported as JSON" });
          }}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {summary?.kpis.map((kpi, i) => (
          <MetricCard key={kpi.id} metric={kpi} delay={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-primary" />
                <CardTitle>Attack Surface Growth</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default" size="sm">+12.5% vs last period</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="assetsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f2ca50" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#f2ca50" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#99907c", fontSize: 11, fontFamily: "JetBrains Mono" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#99907c", fontSize: 11, fontFamily: "JetBrains Mono" }}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        background: "#1a1a1a",
                        border: "1px solid rgba(77, 70, 53, 0.3)",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontFamily: "JetBrains Mono",
                      }}
                      labelStyle={{ color: "#e5e2e1" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="assets"
                      stroke="#f2ca50"
                      strokeWidth={2}
                      fill="url(#assetsGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="threats"
                      stroke="#ffb4ab"
                      strokeWidth={2}
                      fill="none"
                      strokeDasharray="4 4"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-primary rounded" />
                  <span className="text-xs text-on-surface-variant/60">Assets</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-destructive rounded" style={{ borderTop: "1px dashed" }} />
                  <span className="text-xs text-on-surface-variant/60">Threats</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Vulnerability Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative flex items-center justify-center mb-6">
                  <svg width="160" height="160" className="-rotate-90">
                    {severityData.map((s, i) => {
                      const total = severityData.reduce((a, b) => a + b.value, 0);
                      const offset = severityData
                        .slice(0, i)
                        .reduce((a, b) => a + (b.value / total) * 283, 0);
                      const length = (s.value / total) * 283;
                      return (
                        <motion.circle
                          key={s.name}
                          cx="80"
                          cy="80"
                          r="45"
                          fill="none"
                          stroke={s.color}
                          strokeWidth="12"
                          strokeDasharray={`${length} ${283 - length}`}
                          strokeDashoffset={-offset}
                          initial={{ strokeDashoffset: 283 }}
                          animate={{ strokeDashoffset: -offset }}
                          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-on-surface">1,234</span>
                    <span className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider">Total</span>
                  </div>
                </div>
                <div className="w-full space-y-3">
                  {severityData.map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-on-surface-variant/80">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-on-surface">{s.value}%</span>
                        <div className="w-20 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: s.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${s.value}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Discovery Timeline</CardTitle>
              <Badge variant="default" size="sm">5 events</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {summary?.timeline.map((event, i) => (
                  <TimelineNode
                    key={event.id}
                    event={event}
                    isLast={i === (summary?.timeline.length ?? 1) - 1}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <CardTitle>Top Threats</CardTitle>
              </div>
              <StatusIndicator status="active" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    rank: 1,
                    name: "CVE-2024-21626",
                    severity: "CRITICAL",
                    cvss: 9.8,
                    asset: "docker-host-01.prod",
                    progress: 100,
                  },
                  {
                    rank: 2,
                    name: "CVE-2024-27198",
                    severity: "CRITICAL",
                    cvss: 9.1,
                    asset: "jenkins-master.internal",
                    progress: 65,
                  },
                  {
                    rank: 3,
                    name: "CVE-2024-0204",
                    severity: "HIGH",
                    cvss: 8.6,
                    asset: "logstash-worker-02",
                    progress: 30,
                  },
                  {
                    rank: 4,
                    name: "CVE-2024-28741",
                    severity: "HIGH",
                    cvss: 8.3,
                    asset: "api-prod-05.internal",
                    progress: 0,
                  },
                  {
                    rank: 5,
                    name: "CVE-2024-30990",
                    severity: "MEDIUM",
                    cvss: 6.4,
                    asset: "dashboard.internal",
                    progress: 100,
                  },
                ].map((threat, i) => (
                  <Link
                    key={threat.rank}
                    href="/vulnerabilities"
                    className="flex items-center gap-4 p-3 bg-[#0e0e0e] border border-outline-variant/10 rounded-lg hover:border-primary/20 transition-all duration-300 group"
                  >
                    <span className="text-xs font-mono text-on-surface-variant/40 w-5">{threat.rank}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-on-surface group-hover:text-primary transition-colors truncate">
                          {threat.name}
                        </span>
                        <Badge
                          variant={threat.severity === "CRITICAL" ? "destructive" : "warning"}
                          size="sm"
                        >
                          {threat.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-on-surface-variant/40">CVSS {threat.cvss}</span>
                        <span className="w-1 h-1 rounded-full bg-outline-variant" />
                        <span className="text-on-surface-variant/40 truncate">{threat.asset}</span>
                      </div>
                    </div>
                    <div className="w-20">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-on-surface-variant/40">Remediation</span>
                        <span className={`font-mono text-xs ${threat.progress === 100 ? "text-green-400" : threat.progress > 0 ? "text-[#ffc551]" : "text-destructive"}`}>
                          {threat.progress}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            threat.progress === 100
                              ? "bg-green-400"
                              : threat.progress > 0
                              ? "bg-[#ffc551]"
                              : "bg-destructive"
                          }`}
                          style={{ width: `${threat.progress}%` }}
                        />
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-on-surface-variant/20 group-hover:text-primary transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-primary" />
              <CardTitle>Live Operations Feed</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <StatusIndicator status={isStreaming ? "active" : "idle"} />
              <span className="text-[10px] text-on-surface-variant/40">{events.length} events</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-72">
              <LiveFeed events={events} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
