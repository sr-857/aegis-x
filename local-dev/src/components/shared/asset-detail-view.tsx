"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/clipboard";
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import type { Asset } from "@/types";
import {
  ArrowLeft,
  Cpu,
  Globe,
  Activity,
  Hash,
  Server,
  Shield,
  HardDrive,
} from "lucide-react";

const radarData = [
  { metric: "Exposure", value: 85 },
  { metric: "Attack Surface", value: 72 },
  { metric: "Vulnerability", value: 90 },
  { metric: "Criticality", value: 78 },
  { metric: "Complexity", value: 65 },
  { metric: "Remediation", value: 45 },
];

export function AssetDetailView({ asset, onBack, variant = "explorer" }: {
  asset: Asset;
  onBack: () => void;
  variant?: "explorer" | "assets";
}) {
  const isAssets = variant === "assets";

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-on-surface-variant/60 hover:text-primary transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to {isAssets ? "assets" : "explorer"}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-primary" />
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle>{asset.hostname}</CardTitle>
                    <CopyButton text={asset.hostname} id={`host-${asset.id}`} />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-on-surface-variant/60 mt-0.5 font-mono">{asset.ip}</p>
                    <CopyButton text={asset.ip} id={`detail-ip-${asset.id}`} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-on-surface-variant/40 uppercase tracking-wider">Risk</span>
                  <div className="relative flex items-center justify-center">
                    <svg width="56" height="56" className="-rotate-90">
                      <circle cx="28" cy="28" r="24" stroke="#2a2a2a" strokeWidth="5" fill="none" />
                      <motion.circle
                        cx="28" cy="28" r="24"
                        stroke={asset.riskScore > 80 ? "#ffb4ab" : asset.riskScore > 60 ? "#ffc551" : "#f2ca50"}
                        strokeWidth="5" fill="none" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 24}
                        initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 24 * (1 - asset.riskScore / 100) }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </svg>
                    <span className="absolute text-sm font-bold text-on-surface">{asset.riskScore}</span>
                  </div>
                </div>
                <Badge variant={asset.riskScore > 80 ? "destructive" : asset.riskScore > 60 ? "warning" : "success"} size="lg">
                  {asset.riskScore > 80 ? "Critical Risk" : asset.riskScore > 60 ? "Elevated Risk" : "Stable"}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              <Shield className="w-4 h-4 text-primary" />
              Security Posture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#2a2a2a" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "#99907c", fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="value" stroke="#f2ca50" fill="#f2ca50" fillOpacity={0.15} strokeWidth={1.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <HardDrive className="w-4 h-4 text-primary" />
                Technology Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {asset.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" size="lg" className="text-xs px-3 py-1.5">{tech}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Activity className="w-4 h-4 text-primary" />
                Ports & Services
              </CardTitle>
              <Badge variant="default" size="sm">{asset.ports.length} total</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {asset.ports.map((port) => (
                  <div key={port.port} className="flex items-center justify-between px-4 py-3 bg-[#0e0e0e] border border-outline-variant/20 rounded-lg hover:border-primary/20 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${port.state === "open" ? "bg-green-400 data-point-glow" : "bg-[#ffc551]"}`} />
                      <span className="text-sm font-mono text-on-surface">{port.port}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-on-surface-variant/60">{port.service}</span>
                      <Badge variant={port.state === "open" ? "success" : "warning"} size="sm">{port.state}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Globe className="w-4 h-4 text-primary" />
                DNS Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {asset.dnsRecords.map((record, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-[#0e0e0e] border border-outline-variant/10 rounded-lg">
                    <Badge variant="outline" size="sm" className="shrink-0">{record.type}</Badge>
                    <span className="text-xs font-mono text-on-surface-variant/60 break-all">{record.value}</span>
                    <CopyButton text={record.value} id={`dns-${asset.id}-${i}`} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Hash className="w-4 h-4 text-primary" />
                HTTP Headers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {asset.headers.length > 0 ? asset.headers.map((header, i) => (
                  <div key={i} className="p-2.5 bg-[#0e0e0e] border border-outline-variant/10 rounded-lg text-xs">
                    <span className="text-primary/80 break-all">{header.name}:</span>{" "}
                    <span className="text-on-surface-variant/60 font-mono break-all">{header.value}</span>
                  </div>
                )) : (
                  <p className="text-xs text-on-surface-variant/40 italic">No HTTP headers recorded</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}