"use client";

import { Zap } from "lucide-react";

export function DemoBadge() {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-[#ffc551]/20 bg-[#ffc551]/5 text-[10px] font-mono text-[#ffc551]/70 uppercase tracking-wider">
      <Zap className="w-2.5 h-2.5" />
      <span>Demo</span>
    </div>
  );
}
