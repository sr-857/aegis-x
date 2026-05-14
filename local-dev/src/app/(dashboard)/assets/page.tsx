import { usePageTitle } from "@/lib/hooks/use-page-title";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAssets } from "@/lib/hooks/use-assets";
import { AssetDetailView } from "@/components/shared/asset-detail-view";
import { downloadJSON } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { TableSkeleton } from "@/components/ui/skeleton";
import type { Asset } from "@/types";
import {
  Search,
  X,
  RefreshCw,
  Download,
  Server,
  Shield,
  ChevronRight,
} from "lucide-react";



export default function AssetsPage() {
  usePageTitle("Asset Intelligence");
  const { data: assets, isLoading, refetch } = useAssets();
  const [selected, setSelected] = useState<Asset | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!assets) return [];
    if (!search) return assets;
    const q = search.toLowerCase();
    return assets.filter(
      (a) => a.hostname.toLowerCase().includes(q) || a.ip.includes(q)
    );
  }, [assets, search]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in">
        <div className="h-8 w-72 bg-[#1a1a1a] rounded animate-pulse" />
        <div className="h-4 w-56 bg-[#1a1a1a] rounded animate-pulse" />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  if (selected) {
    return <AssetDetailView asset={selected} onBack={() => setSelected(null)} variant="assets" />;
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg text-on-surface">Asset Intelligence Workspace</h1>
          <p className="text-body-sm text-on-surface-variant/60 mt-1">
            Deep-dive asset analysis and reconnaissance data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Sync
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            const exportData = filtered.map((a) => ({
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

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
        <Input
          placeholder="Search by hostname or IP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-10 max-w-md"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((asset, i) => (
          <motion.button
            key={asset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => setSelected(asset)}
            className="text-left bg-[#121212] border border-outline-variant rounded-lg p-6 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Server className="w-5 h-5 text-primary" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors truncate">{asset.hostname}</h3>
                  <p className="text-xs font-mono text-on-surface-variant/60">{asset.ip}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-3 h-3 text-on-surface-variant/40" />
                <div className="flex-1 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${asset.riskScore > 80 ? "bg-destructive" : asset.riskScore > 60 ? "bg-[#ffc551]" : "bg-primary"}`}
                    style={{ width: `${asset.riskScore}%` }} />
                </div>
                <span className={`text-xs font-mono ${asset.riskScore > 80 ? "text-destructive" : asset.riskScore > 60 ? "text-[#ffc551]" : "text-green-400"}`}>
                  {asset.riskScore}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {asset.ports.slice(0, 3).map((p) => (
                    <Badge key={p.port} variant={p.state === "open" ? "success" : "warning"} size="sm">
                      {p.port}/{p.service.substring(0, 4)}
                    </Badge>
                  ))}
                  {asset.ports.length > 3 && (
                    <span className="text-xs text-on-surface-variant/40 leading-5">+{asset.ports.length - 3}</span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-on-surface-variant/30 group-hover:text-primary transition-colors" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <Search className="w-12 h-12 text-on-surface-variant/20 mb-4" />
          <p className="text-sm text-on-surface-variant/40">No assets found</p>
        </div>
      )}
    </div>
  );
}