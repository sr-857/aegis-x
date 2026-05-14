import { usePageTitle } from "@/lib/hooks/use-page-title";

import { useState, useMemo, useCallback, useEffect } from "react";
import { CopyButton } from "@/components/clipboard";
import { AssetDetailView } from "@/components/shared/asset-detail-view";
import { motion, AnimatePresence } from "framer-motion";
import { useAssets } from "@/lib/hooks/use-assets";
import { downloadCSV, downloadJSON } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { TableSkeleton, ListSkeleton } from "@/components/ui/skeleton";
import type { Asset } from "@/types";

import {
  Search,
  Server,
  Activity,
  ChevronRight,
  Filter,
  X,
  SlidersHorizontal,
  Download,
  RefreshCw,
  SortAsc,
  Shield,
} from "lucide-react";

const technologies = ["Nginx", "Node.js", "Redis", "PostgreSQL", "Docker", "Jenkins", "Java", "Ubuntu", "Tomcat"];
const portStates = ["open", "filtered"];

const sortOptions = [
  { value: "risk-desc", label: "Risk Score (High)" },
  { value: "risk-asc", label: "Risk Score (Low)" },
  { value: "name-asc", label: "Hostname (A-Z)" },
  { value: "name-desc", label: "Hostname (Z-A)" },
];

export default function ExplorerPage() {
  usePageTitle("Intelligence Explorer");
  const { data: assets, isLoading, refetch } = useAssets();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("risk-desc");
  const [portFilter, setPortFilter] = useState("all");
  const [techFilter, setTechFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredAssets = useMemo(() => {
    if (!assets) return [];
    let result = [...assets];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.hostname.toLowerCase().includes(q) ||
          a.ip.includes(q) ||
          a.technologies.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (techFilter !== "all") {
      result = result.filter((a) =>
        a.technologies.some((t) => t.toLowerCase().includes(techFilter.toLowerCase()))
      );
    }

    if (portFilter !== "all") {
      result = result.filter((a) =>
        a.ports.some((p) => p.state === portFilter)
      );
    }

    result.sort((a, b) => {
      switch (sort) {
        case "risk-desc": return b.riskScore - a.riskScore;
        case "risk-asc": return a.riskScore - b.riskScore;
        case "name-asc": return a.hostname.localeCompare(b.hostname);
        case "name-desc": return b.hostname.localeCompare(a.hostname);
        default: return 0;
      }
    });

    return result;
  }, [assets, search, sort, portFilter, techFilter]);

  const stats = useMemo(() => {
    if (!assets) return { total: 0, openPorts: 0, avgRisk: 0 };
    const total = assets.length;
    const openPorts = assets.reduce((s, a) => s + a.ports.filter((p) => p.state === "open").length, 0);
    const avgRisk = Math.round(assets.reduce((s, a) => s + a.riskScore, 0) / total);
    return { total, openPorts, avgRisk };
  }, [assets]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in">
        <div className="h-8 w-64 bg-[#1a1a1a] rounded animate-pulse" />
        <div className="h-4 w-48 bg-[#1a1a1a] rounded animate-pulse" />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  if (selectedAsset) {
    return <AssetDetailView asset={selectedAsset} onBack={() => setSelectedAsset(null)} variant="explorer" />;
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg text-on-surface">Intelligence Explorer</h1>
          <p className="text-body-sm text-on-surface-variant/60 mt-1">
            Deep-dive reconnaissance data and asset intelligence
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Sync
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            const exportData = filteredAssets.map((a) => ({
              hostname: a.hostname,
              ip: a.ip,
              riskScore: a.riskScore,
              technologies: a.technologies.join("; "),
              openPorts: a.ports.filter((p) => p.state === "open").length,
            }));
            downloadJSON(exportData, `aegis-assets-${Date.now()}.json`);
          }}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Assets", value: stats.total, icon: Server },
          { label: "Open Ports", value: stats.openPorts, icon: Activity },
          { label: "Avg Risk Score", value: stats.avgRisk, icon: Shield, 
            color: stats.avgRisk > 80 ? "text-destructive" : stats.avgRisk > 60 ? "text-[#ffc551]" : "text-green-400" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-[#121212] border border-outline-variant rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-primary/60" />
                <span className="text-xs text-on-surface-variant/60 uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className={`text-2xl font-semibold mt-2 ${(stat as any).color || "text-on-surface"}`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
          <Input
            placeholder="Search by hostname, IP, or technology..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-40">
              <SortAsc className="w-4 h-4 mr-2 text-on-surface-variant/40" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={showFilters ? "default" : "ghost"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-1" />
            Filters
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-4 p-4 bg-[#0e0e0e] border border-outline-variant/20 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-xs text-on-surface-variant/60">Technology:</span>
                <Select value={techFilter} onValueChange={setTechFilter}>
                  <SelectTrigger className="w-36 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {technologies.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-on-surface-variant/60">Port State:</span>
                <Select value={portFilter} onValueChange={setPortFilter}>
                  <SelectTrigger className="w-28 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {portStates.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTechFilter("all");
                  setPortFilter("all");
                }}
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 text-xs text-on-surface-variant/40">
        <Filter className="w-3 h-3" />
        <span>{filteredAssets.length} of {assets?.length || 0} assets</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredAssets.map((asset, i) => (
            <motion.button
              key={asset.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.03, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelectedAsset(asset)}
              className="text-left bg-[#121212] border border-outline-variant rounded-lg p-5 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <Server className="w-5 h-5 text-primary" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors truncate">
                      {asset.hostname}
                    </h3>
                    <p className="text-xs font-mono text-on-surface-variant/60">{asset.ip}</p>
                    <CopyButton text={asset.ip} id={`ip-${asset.id}`} />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-3 h-3 text-on-surface-variant/40" />
                  <div className="flex-1 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        asset.riskScore > 80 ? "bg-destructive" : asset.riskScore > 60 ? "bg-[#ffc551]" : "bg-primary"
                      }`}
                      style={{ width: `${asset.riskScore}%` }}
                    />
                  </div>
                  <span className={`text-xs font-mono ${
                    asset.riskScore > 80 ? "text-destructive" : asset.riskScore > 60 ? "text-[#ffc551]" : "text-green-400"
                  }`}>
                    {asset.riskScore}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {asset.ports.slice(0, 3).map((p) => (
                      <Badge key={p.port} variant={p.state === "open" ? "success" : "warning"} size="sm">
                        {p.port}
                      </Badge>
                    ))}
                    {asset.ports.length > 3 && (
                      <span className="text-xs text-on-surface-variant/40 leading-6">+{asset.ports.length - 3}</span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-on-surface-variant/30 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {filteredAssets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <Search className="w-12 h-12 text-on-surface-variant/20 mb-4" />
          <p className="text-sm text-on-surface-variant/40">No assets match your search</p>
        </div>
      )}
    </div>
  );
}