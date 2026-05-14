"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/types";
import { CheckCircle2, Circle, Radio, Search, Target } from "lucide-react";

const typeConfig = {
  discovery: { icon: Search, color: "text-primary" },
  scan: { icon: Radio, color: "text-[#ffc551]" },
  vulnerability: { icon: Target, color: "text-destructive" },
  exploit: { icon: Circle, color: "text-red-400" },
};

const statusConfig = {
  completed: "border-primary bg-primary/10",
  in_progress: "border-[#ffc551] bg-[#ffc551]/10 animate-pulse",
  pending: "border-outline-variant bg-[#1a1a1a]",
};

interface TimelineNodeProps {
  event: TimelineEvent;
  isLast?: boolean;
}

export function TimelineNode({ event, isLast }: TimelineNodeProps) {
  const config = typeConfig[event.type];
  const Icon = config.icon;

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-8 h-8 rounded-full border-2 flex items-center justify-center",
            statusConfig[event.status]
          )}
        >
          <Icon className={cn("w-4 h-4", config.color)} />
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-gradient-to-b from-primary/20 to-transparent min-h-[3rem]" />
        )}
      </div>
      <div className="pb-6 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-on-surface">
            {event.label}
          </span>
          {event.status === "in_progress" && (
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[10px] text-[#ffc551] font-label-md uppercase"
            >
              In Progress
            </motion.span>
          )}
        </div>
        <p className="text-xs text-on-surface-variant/60">
          {event.asset}
        </p>
      </div>
    </div>
  );
}
