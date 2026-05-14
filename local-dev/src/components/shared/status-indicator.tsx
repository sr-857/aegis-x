"use client";

import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "active" | "idle" | "error" | "warning" | "secure";
  label?: string;
  pulse?: boolean;
}

export function StatusIndicator({
  status,
  label,
  pulse = true,
}: StatusIndicatorProps) {
  const colorMap = {
    active: "bg-primary data-point-glow",
    idle: "bg-on-surface-variant/40",
    error: "bg-destructive",
    warning: "bg-[#ffc551]",
    secure: "bg-green-400",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "w-2 h-2 rounded-full",
          colorMap[status],
          pulse && status === "active" && "animate-pulse"
        )}
      />
      {label && (
        <span className="font-label-md text-[#d4af37] uppercase tracking-widest">
          {label}
        </span>
      )}
    </div>
  );
}