"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Command, Keyboard, X } from "lucide-react";

const shortcuts = [
  { key: "⌘K", action: "Command palette" },
  { key: "/", action: "Quick search" },
  { key: "H", action: "Go to Dashboard" },
  { key: "B", action: "Toggle sidebar" },
  { key: "G D", action: "Go to Dashboard" },
  { key: "N", action: "New scan" },
  { key: "G E", action: "Go to Explorer" },
  { key: "G V", action: "Go to Vulnerabilities" },
  { key: "G O", action: "Go to Operations" },
  { key: "G A", action: "Go to Assets" },
  { key: "G S", action: "Go to Settings" },
  { key: "G N", action: "Go to Notifications" },
  { key: "↑↓", action: "Navigate items" },
  { key: "Enter", action: "Select item" },
  { key: "Esc", action: "Close panel / Back" },
  { key: "R", action: "Refresh data" },
  { key: "?", action: "Toggle shortcuts" },
];

const routeMap: Record<string, string> = {
  d: "/executive",
  e: "/explorer",
  v: "/vulnerabilities",
  o: "/operations",
  a: "/assets",
  s: "/settings",
  n: "/notifications",
};

export function useKeyboardShortcuts() {
  const [helpOpen, setHelpOpen] = useState(false);
  const router = useRouter();
  const gPressedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "?") {
        e.preventDefault();
        setHelpOpen((p) => !p);
        return;
      }

      if (e.key === "h" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        router.push("/executive");
        return;
      }

      if (e.key === "b" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("action:toggle-sidebar"));
        return;
      }

      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("action:search"));
        return;
      }

      if (e.key === "g" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        gPressedRef.current = true;
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          gPressedRef.current = false;
        }, 500);
        return;
      }

      if (gPressedRef.current && routeMap[e.key]) {
        e.preventDefault();
        gPressedRef.current = false;
        clearTimeout(timerRef.current);
        router.push(routeMap[e.key]);
        return;
      }

      if (e.key === "n" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("action:new-scan"));
        return;
      }

      if (e.key === "r" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("action:refresh"));
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      clearTimeout(timerRef.current);
    };
  }, [router]);

  return { helpOpen, setHelpOpen };
}

export function ShortcutsHelp({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
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
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="bg-[#1a1a1a] border border-outline-variant/40 rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <Keyboard className="w-5 h-5 text-primary" />
                  <h2 className="text-sm font-medium text-on-surface">
                    Keyboard Shortcuts
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-on-surface-variant/40 hover:text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-1 max-h-80 overflow-y-auto">
                {shortcuts.map((s) => (
                  <div
                    key={s.key}
                    className="flex items-center justify-between py-2 px-1 rounded hover:bg-white/[0.02]"
                  >
                    <span className="text-sm text-on-surface-variant/80">
                      {s.action}
                    </span>
                    <kbd className="text-xs font-mono text-primary/80 bg-primary/5 px-2.5 py-1 rounded border border-primary/20">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-outline-variant/20 bg-[#0e0e0e]/50">
                <p className="text-[10px] text-center text-on-surface-variant/30">
                  Press <kbd className="text-primary/60">?</kbd> to toggle this
                  panel at any time
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}