"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ScanEvent } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LiveFeedProps {
  events: ScanEvent[];
  className?: string;
}

export function LiveFeed({ events, className }: LiveFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events.length]);

  const severityColor = {
    INFO: "text-primary/70",
    WARN: "text-[#ffc551]/80",
    ERROR: "text-destructive/80",
    CRITICAL: "text-red-400",
  };

  return (
    <ScrollArea className={cn("h-full", className)}>
      <div ref={scrollRef} className="space-y-0.5 font-mono text-xs">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex gap-3 px-3 py-1.5 hover:bg-white/[0.02] rounded group"
            >
              <span className="text-on-surface-variant/40 w-20 shrink-0">
                {event.timestamp.split("T")[1]?.split(".")[0] || event.timestamp}
              </span>
              <span className={cn("w-14 shrink-0", severityColor[event.type])}>
                [{event.type}]
              </span>
              <span className="text-primary/60 w-28 shrink-0 truncate">
                {event.source}
              </span>
              <span className="text-on-surface/70 truncate">
                {event.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
}