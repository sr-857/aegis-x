"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Globe,
  AlertTriangle,
  ShieldOff,
  Radar,
  Shield,
  Zap,
} from "lucide-react";
import type { KpiMetric } from "@/types";

const iconMap: Record<string, React.ElementType> = {
  dns: Globe,
  warning: AlertTriangle,
  dangerous: ShieldOff,
  radar: Radar,
  shield: Shield,
  bolt: Zap,
};

interface MetricCardProps {
  metric: KpiMetric;
  delay?: number;
}

export function MetricCard({ metric, delay = 0 }: MetricCardProps) {
  const Icon = iconMap[metric.icon] || Globe;
  const isPositive = metric.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: delay * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="bg-[#121212] border border-outline-variant rounded-lg p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-300"
    >
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-body-sm text-on-surface-variant font-medium uppercase tracking-wider">
            {metric.label}
          </span>
          <Icon className="w-4 h-4 text-primary/60" />
        </div>

        <div className="flex items-end gap-3">
          <span className="text-display-lg text-on-surface font-semibold tracking-tight">
            {metric.value}
          </span>
          <div
            className={cn(
              "flex items-center gap-1 mb-2",
              isPositive ? "text-green-400" : "text-destructive"
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span className="text-xs font-medium">
              {Math.abs(metric.change)}%
            </span>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant/60 mt-1">
          {metric.changeLabel}
        </p>
      </div>
    </motion.div>
  );
}