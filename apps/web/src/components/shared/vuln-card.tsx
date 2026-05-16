"use client";

import { cn } from "@/lib/utils";
import type { Vulnerability } from "@/types";
import { Badge } from "@/components/ui/badge";

interface VulnCardProps {
  vulnerability: Vulnerability;
  selected?: boolean;
  onSelect?: () => void;
}

const severityConfig = {
  CRITICAL: { variant: "destructive" as const, label: "CRITICAL" },
  HIGH: { variant: "warning" as const, label: "HIGH" },
  MEDIUM: { variant: "default" as const, label: "MEDIUM" },
  LOW: { variant: "secondary" as const, label: "LOW" },
};

const statusConfig = {
  OPEN: { variant: "destructive" as const, label: "Open" },
  IN_PROGRESS: { variant: "warning" as const, label: "In Progress" },
  RESOLVED: { variant: "success" as const, label: "Resolved" },
};

export function VulnCard({
  vulnerability,
  selected,
  onSelect,
}: VulnCardProps) {
  const sev = severityConfig[vulnerability.severity];
  const stat = statusConfig[vulnerability.status];

  return (
    <div
      onClick={onSelect}
      className={cn(
        "w-full bg-[#121212] border rounded-lg p-4 transition-all duration-300 group hover:border-primary/30",
        selected
          ? "border-primary/50 bg-primary/5"
          : "border-outline-variant"
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-2">
        <h4 className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors line-clamp-1">
          {vulnerability.title}
        </h4>
        <Badge variant={sev.variant} size="sm">
          {sev.label}
        </Badge>
      </div>

      <div className="flex items-center gap-3 text-xs text-on-surface-variant/60">
        <span className="font-mono">CVSS {vulnerability.cvss}</span>
        <span className="w-1 h-1 rounded-full bg-outline-variant" />
        <span className="truncate">{vulnerability.asset}</span>
        <span className="w-1 h-1 rounded-full bg-outline-variant" />
        <Badge variant={stat.variant} size="sm">
          {stat.label}
        </Badge>
      </div>
    </div>
  );
}
