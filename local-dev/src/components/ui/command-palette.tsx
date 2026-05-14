"use client";

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Search,
  AlertTriangle,
  Activity,
  Cpu,
  Settings,
  Bell,
  Shield,
  Command,
  ArrowRight,
  FileText,
  Globe,
  Terminal,
} from "lucide-react";

const commands = [
  { id: "1", label: "Go to Executive Dashboard", href: "/executive", icon: LayoutDashboard, category: "Navigation" },
  { id: "2", label: "Open Intelligence Explorer", href: "/explorer", icon: Search, category: "Navigation" },
  { id: "3", label: "View Vulnerability Triage", href: "/vulnerabilities", icon: AlertTriangle, category: "Navigation" },
  { id: "4", label: "Open Live Operations", href: "/operations", icon: Activity, category: "Navigation" },
  { id: "5", label: "View Asset Intelligence", href: "/assets", icon: Cpu, category: "Navigation" },
  { id: "6", label: "Open Settings", href: "/settings", icon: Settings, category: "Navigation" },
  { id: "7", label: "View Notifications", href: "/notifications", icon: Bell, category: "Navigation" },
  { id: "8", label: "New Scan", action: "scan:new", icon: Globe, category: "Actions" },
  { id: "9", label: "Generate Report", action: "report:generate", icon: FileText, category: "Actions" },
  { id: "10", label: "Open Terminal", action: "terminal:toggle", icon: Terminal, category: "Actions" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  const execute = useCallback(
    (command: (typeof commands)[0]) => {
      setOpen(false);
      setQuery("");
      if (command.href) {
        navigate(command.href);
      } else if (command.action === "terminal:toggle") {
        window.dispatchEvent(new CustomEvent("toggle-terminal"));
      } else if (command.action === "scan:new") {
        alert("New Scan initiated");
      } else if (command.action === "report:generate") {
        alert("Report generation started");
      }
    },
    [router]
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        execute(filtered[selectedIndex]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, filtered, selectedIndex, execute]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2"
          >
            <div className="bg-[#1a1a1a] border border-outline-variant/40 rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant/20">
                <Command className="w-4 h-4 text-primary/60 shrink-0" />
                <input
                  autoFocus
                  placeholder="Type a command or search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none"
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-on-surface-variant/40 border border-outline-variant/20 rounded">
                  <Command className="w-3 h-3" />K
                </kbd>
              </div>

              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {filtered.length === 0 && (
                  <p className="text-sm text-on-surface-variant/40 text-center py-8">
                    No results found
                  </p>
                )}
                {filtered.map((command, i) => {
                  const Icon = command.icon;
                  return (
                    <button
                      key={command.id}
                      onClick={() => execute(command)}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group",
                        selectedIndex === i
                          ? "bg-primary/10 text-primary"
                          : "text-on-surface-variant hover:text-on-surface hover:bg-white/[0.02]"
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1 text-left">{command.label}</span>
                      <span className="text-[10px] text-on-surface-variant/30 uppercase tracking-wider">
                        {command.category}
                      </span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 px-4 py-2.5 border-t border-outline-variant/20 bg-[#0e0e0e]/50">
                <div className="flex items-center gap-2 text-[10px] text-on-surface-variant/30">
                  <kbd className="px-1.5 py-0.5 border border-outline-variant/20 rounded text-[9px]">↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-on-surface-variant/30">
                  <kbd className="px-1.5 py-0.5 border border-outline-variant/20 rounded text-[9px]">↵</kbd>
                  <span>Open</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-on-surface-variant/30">
                  <kbd className="px-1.5 py-0.5 border border-outline-variant/20 rounded text-[9px]">Esc</kbd>
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