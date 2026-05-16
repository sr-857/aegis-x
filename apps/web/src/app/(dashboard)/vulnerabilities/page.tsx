"use client";
import { DemoBadge } from "@/components/demo-badge";
import { CopyButton } from "@/components/clipboard";
import { usePageTitle } from "@/lib/hooks/use-page-title";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVulnerabilities } from "@/lib/hooks/use-vulnerabilities";
import { downloadJSON } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { VulnCard } from "@/components/shared/vuln-card";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { useToast } from "@/components/toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TableSkeleton } from "@/components/ui/skeleton";
import type { Vulnerability } from "@/types";
import {
  AlertTriangle,
  Bug,
  FileText,
  Terminal,
  Shield,
  CheckCircle2,
  Clock,
  Search,
  X,
  ChevronRight,
  ExternalLink,
  ArrowUpDown,
  BarChart3,
  Target,
  Download,
} from "lucide-react";

const severityColors = {
  CRITICAL: "border-l-destructive",
  HIGH: "border-l-[#ffc551]",
  MEDIUM: "border-l-primary/50",
  LOW: "border-l-outline-variant",
};

export default function VulnerabilitiesPage() {
  usePageTitle("Vulnerability Triage");
  const { data: vulnerabilities, isLoading } = useVulnerabilities();
  const [selected, setSelected] = useState<Vulnerability | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(10);
  const { addToast } = useToast();

  const filtered = useMemo(() => {
    if (!vulnerabilities) return [];
    let result = filter === "all"
      ? vulnerabilities
      : vulnerabilities.filter((v) => v.severity === filter);

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.asset.toLowerCase().includes(q) ||
          v.id.toLowerCase().includes(q)
      );
    }

    return result;
  }, [vulnerabilities, filter, search]);

  useEffect(() => {
    setVisibleCount(10);
  }, [filter, search]);

  const stats = useMemo(() => {
    if (!vulnerabilities) return { total: 0, critical: 0, high: 0, medium: 0, low: 0, open: 0 };
    return {
      total: vulnerabilities.length,
      critical: vulnerabilities.filter((v) => v.severity === "CRITICAL").length,
      high: vulnerabilities.filter((v) => v.severity === "HIGH").length,
      medium: vulnerabilities.filter((v) => v.severity === "MEDIUM").length,
      low: vulnerabilities.filter((v) => v.severity === "LOW").length,
      open: vulnerabilities.filter((v) => v.status === "OPEN").length,
    };
  }, [vulnerabilities]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in">
        <div className="h-8 w-64 bg-[#1a1a1a] rounded animate-pulse" />
        <div className="h-4 w-48 bg-[#1a1a1a] rounded animate-pulse" />
        <TableSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg text-on-surface">Vulnerability Triage</h1>
          <p className="text-body-sm text-on-surface-variant/60 mt-1">
            Queue-based vulnerability analysis and threat intelligence
          </p>
        </div>
        <StatusIndicator status="active" label="Monitoring" />
        <DemoBadge />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total", value: stats.total, icon: Bug, color: "text-on-surface" },
          { label: "Critical", value: stats.critical, icon: AlertTriangle, color: "text-destructive" },
          { label: "High", value: stats.high, icon: AlertTriangle, color: "text-[#ffc551]" },
          { label: "Open", value: stats.open, icon: Target, color: "text-destructive" },
          { label: "Resolved", value: vulnerabilities?.filter((v) => v.status === "RESOLVED").length || 0, icon: CheckCircle2, color: "text-green-400" },
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

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
          <Input
            placeholder="Search by CVE, title, or asset..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-10"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="CRITICAL">Critical ({stats.critical})</TabsTrigger>
            <TabsTrigger value="HIGH">High ({stats.high})</TabsTrigger>
            <TabsTrigger value="MEDIUM">Medium ({stats.medium})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={selectedIds.size > 0 && selectedIds.size === filtered.length}
            onChange={() => {
              if (selectedIds.size === filtered.length) {
                setSelectedIds(new Set());
              } else {
                setSelectedIds(new Set(filtered.map((v) => v.id)));
              }
            }}
            className="w-4 h-4 rounded border-outline-variant bg-[#0e0e0e] text-primary focus:ring-primary/30"
          />
          <span className="text-xs text-on-surface-variant/60 group-hover:text-on-surface transition-colors">
            Select all {visibleCount < filtered.length ? `(${selectedIds.size} of ${filtered.length} visible)` : `(${selectedIds.size} selected)`}
          </span>
        </label>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => {
            const exportData = filtered.map((v) => ({
              id: v.id,
              title: v.title,
              severity: v.severity,
              cvss: v.cvss,
              asset: v.asset,
              status: v.status,
              discovered: v.discovered,
            }));
            downloadJSON(exportData, `aegis-vulnerabilities-${Date.now()}.json`);
          }}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            addToast({ type: "success", title: "Resolved", message: `${selectedIds.size} vulnerabilities marked as resolved` });
            setSelectedIds(new Set());
          }}>
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Resolve Selected
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-2">
          <ScrollArea className="h-[600px] pr-2">
            <AnimatePresence mode="popLayout">
              {filtered.slice(0, visibleCount).map((vuln) => (
                <motion.div
                  key={vuln.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-2"
                >
                  <VulnCard
                    vulnerability={vuln}
                    selected={selected?.id === vuln.id}
                    onSelect={() => setSelected(vuln)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <Search className="w-12 h-12 text-on-surface-variant/20 mb-4" />
                <p className="text-sm text-on-surface-variant/40">No vulnerabilities match</p>
              </div>
            )}
            {visibleCount < filtered.length && (
              <div className="flex justify-center py-4">
                <Button variant="outline" size="sm" onClick={() => setVisibleCount((c) => c + 10)}>
                  Load more ({filtered.length - visibleCount} remaining)
                </Button>
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="lg:col-span-3">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className={`w-1 h-full min-h-[3rem] rounded-full shrink-0 ${selected.severity === "CRITICAL" ? "bg-destructive" : selected.severity === "HIGH" ? "bg-[#ffc551]" : "bg-primary/50"}`} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{selected.title}</CardTitle>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                          <CopyButton text={selected.title} id={`vuln-${selected.id}`} />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant={selected.severity === "CRITICAL" ? "destructive" : selected.severity === "HIGH" ? "warning" : "default"}>
                          {selected.severity}
                        </Badge>
                        <span className="text-sm font-mono text-destructive">CVSS {selected.cvss}</span>
                        <span className="text-sm text-on-surface-variant/60">{selected.asset}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-on-surface/80 leading-relaxed">{selected.description}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <Terminal className="w-4 h-4 text-primary" />
                      Exploit Payload
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selected.exploitPayload ? (
                      <div className="relative group">
                        <pre className="bg-[#0a0a0a] border border-outline-variant/20 rounded-lg p-4 text-xs font-mono text-on-surface-variant/80 overflow-x-auto leading-relaxed">
                          {selected.exploitPayload}
                        </pre>
                        <CopyButton text={selected.exploitPayload || ""} id={`payload-${selected.id}`} className="absolute top-2 right-2" />
                      </div>
                    ) : (
                      <p className="text-sm text-on-surface-variant/40 italic">No exploit payload recorded</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      <Shield className="w-4 h-4 text-primary" />
                      Threat Context
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: "Status", value: selected.status === "IN_PROGRESS" ? "In Progress" : selected.status },
                        { label: "Discovered", value: new Date(selected.discovered).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
                        { label: "CVSS Score", value: selected.cvss },
                        { label: "Severity", value: selected.severity },
                        { label: "Asset", value: selected.asset },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between items-center">
                          <span className="text-sm text-on-surface-variant/60">{item.label}</span>
                          <span className={`text-sm font-mono ${item.label === "CVSS Score" ? "text-destructive" : "text-on-surface"}`}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                    <div className="flex gap-2">
                      <Button variant="default" size="sm" className="flex-1">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Mark Resolved
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Clock className="w-4 h-4 mr-1" />
                        In Progress
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>
                    <FileText className="w-4 h-4 text-primary" />
                    Analyst Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    placeholder="Enter analysis notes, remediation steps, or contextual information..."
                    className="w-full h-32 bg-[#0e0e0e] border border-outline-variant/30 rounded-lg p-4 text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 resize-none transition-all duration-300"
                    defaultValue="Initial analysis indicates this CVE is exploitable via the public-facing API endpoint. Recommend patching within the remediation window."
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-on-surface-variant/40">Click save to persist your analysis notes</span>
                    <Button variant="default" size="sm" onClick={() => {
                      addToast({ type: "success", title: "Notes saved", message: "Analyst notes have been updated" });
                    }}>
                      Save Notes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-[600px]"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-dashed border-outline-variant/30 flex items-center justify-center">
                  <Bug className="w-8 h-8 text-on-surface-variant/20" />
                </div>
                <p className="text-sm text-on-surface-variant/60">Select a vulnerability to inspect</p>
                <p className="text-xs text-on-surface-variant/40 mt-1">Choose from the queue on the left</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
