"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAssets } from "@/lib/hooks/use-assets";
import { useVulnerabilities } from "@/lib/hooks/use-vulnerabilities";
import { cn } from "@/lib/utils";
import { Search, Server, AlertTriangle, ArrowRight, X, Command } from "lucide-react";

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

export function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: assets } = useAssets();
  const { data: vulnerabilities } = useVulnerabilities();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const results = [
    ...(assets || [])
      .filter(
        (a) =>
          a.hostname.toLowerCase().includes(query.toLowerCase()) ||
          a.ip.includes(query)
      )
      .map((a) => ({
        id: a.id,
        type: "asset" as const,
        label: a.hostname,
        subtitle: a.ip,
        href: "/explorer",
        icon: Server,
      })),
    ...(vulnerabilities || [])
      .filter(
        (v) =>
          v.title.toLowerCase().includes(query.toLowerCase()) ||
          v.asset.toLowerCase().includes(query)
      )
      .map((v) => ({
        id: v.id,
        type: "vulnerability" as const,
        label: v.title,
        subtitle: `${v.severity} · ${v.asset}`,
        href: "/vulnerabilities",
        icon: AlertTriangle,
      })),
  ];

  const navigate = useCallback(
    (index: number) => {
      if (results[index]) {
        onClose();
        router.push(results[index].href);
      }
    },
    [results, onClose, router]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        navigate(selectedIndex);
      }
    };
    if (open) {
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  }, [open, results, selectedIndex, navigate]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-[15%] z-50 w-full max-w-xl -translate-x-1/2"
          >
            <div className="bg-[#1a1a1a] border border-outline-variant/40 rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant/20">
                <Search className="w-4 h-4 text-primary/60 shrink-0" />
                <input
                  ref={inputRef}
                  placeholder="Search assets, vulnerabilities..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-on-surface-variant/40 hover:text-primary">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-on-surface-variant/30 border border-outline-variant/10 rounded">
                  <Command className="w-3 h-3" />K
                </kbd>
              </div>

              <div className="max-h-80 overflow-y-auto p-2 space-y-0.5">
                {results.length === 0 && query && (
                  <p className="text-sm text-on-surface-variant/40 text-center py-8">
                    No results for &ldquo;{query}&rdquo;
                  </p>
                )}
                {results.length === 0 && !query && (
                  <p className="text-sm text-on-surface-variant/40 text-center py-8">
                    Start typing to search across all intelligence data
                  </p>
                )}
                {results.map((result, i) => {
                  const Icon = result.icon;
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => navigate(i)}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group",
                        selectedIndex === i
                          ? "bg-primary/10 text-primary"
                          : "text-on-surface-variant hover:text-on-surface hover:bg-white/[0.02]"
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <div className="flex-1 text-left min-w-0">
                        <p className="truncate">{result.label}</p>
                        <p className="text-xs text-on-surface-variant/40 truncate">
                          {result.subtitle}
                        </p>
                      </div>
                      <span className="text-[10px] text-on-surface-variant/30 uppercase tracking-wider">
                        {result.type}
                      </span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 px-4 py-2.5 border-t border-outline-variant/20 bg-[#0e0e0e]/50">
                <div className="flex items-center gap-2 text-[10px] text-on-surface-variant/30">
                  <kbd className="px-1.5 py-0.5 border border-outline-variant/10 rounded text-[9px]">↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-on-surface-variant/30">
                  <kbd className="px-1.5 py-0.5 border border-outline-variant/10 rounded text-[9px]">↵</kbd>
                  <span>Open</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-on-surface-variant/30">
                  <kbd className="px-1.5 py-0.5 border border-outline-variant/10 rounded text-[9px]">Esc</kbd>
                  <span>Close</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
