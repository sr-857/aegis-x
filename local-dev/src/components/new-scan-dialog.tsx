"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/toast";
import { useScanStore } from "@/lib/stores/scan-store";
import { generateScanEvent } from "@/lib/api/mock-data";
import { Shield, Globe, Target, Zap, X, Loader2 } from "lucide-react";

interface NewScanDialogProps {
  open: boolean;
  onClose: () => void;
}

const scanTypeLabels: Record<string, string> = {
  full: "Full Recon",
  port: "Port Scan",
  vuln: "Vulnerability",
  discovery: "Discovery",
};

export function NewScanDialog({ open, onClose }: NewScanDialogProps) {
  const { addToast } = useToast();
  const addEvent = useScanStore((s) => s.addEvent);
  const [target, setTarget] = useState("");
  const [scanType, setScanType] = useState("full");
  const [stealth, setStealth] = useState("standard");
  const [scanning, setScanning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setTarget("");
      setScanType("full");
      setStealth("standard");
      setScanning(false);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [open]);

  const stopScan = () => {
    setScanning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    addToast({
      type: "success",
      title: "Scan completed",
      message: `${scanTypeLabels[scanType]} of ${target} finished`,
    });
    setTarget("");
    onClose();
  };

  const validateTarget = (t: string): string | null => {
    const trimmed = t.trim();
    if (!trimmed) return "Please enter a scan target.";
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
    const hostnamePattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;
    const cidrPattern = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
    if (ipPattern.test(trimmed) || hostnamePattern.test(trimmed) || cidrPattern.test(trimmed)) {
      return null;
    }
    return "Invalid target format. Expected IP, hostname, or CIDR.";
  };

  const handleStart = () => {
    const validationError = validateTarget(target);
    if (validationError) {
      addToast({ type: "warning", title: "Invalid target", message: validationError });
      return;
    }

    const targetName = target.trim();
    addEvent({
      id: `scan-init-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "INFO",
      source: "scanner.node",
      message: `${scanTypeLabels[scanType]} initiated on ${targetName}`,
    });

    addToast({
      type: "info",
      title: "Scan initiated",
      message: `${scanTypeLabels[scanType]} queued for ${targetName}`,
    });

    setScanning(true);

    const sources = ["scanner.port", "enricher.dns", "detector.vuln", "recon.subdomain", "analyzer.header"];
    const messages = [
      `Scanning ${targetName}: port 80 open`,
      `Enumerating DNS records for ${targetName}`,
      `Testing common CVEs against ${targetName}`,
      `Discovering subdomains of ${targetName}`,
      `Analyzing HTTP headers on ${targetName}`,
      `WebSocket connection to ${targetName}:9443`,
      `SSL/TLS certificate check on ${targetName}`,
    ];

    let count = 0;
    intervalRef.current = setInterval(() => {
      count++;
      const source = sources[Math.floor(Math.random() * sources.length)];
      const message = messages[Math.floor(Math.random() * messages.length)];
      const type = count % 5 === 0 ? "WARN" : count % 10 === 0 ? "ERROR" : "INFO";
      addEvent({
        id: `scan-${Date.now()}-${count}`,
        timestamp: new Date().toISOString(),
        type: type as "INFO" | "WARN" | "ERROR" | "CRITICAL",
        source,
        message,
      });

      if (count >= 20) {
        stopScan();
      }
    }, 800);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={scanning ? undefined : onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2"
          >
            <div className="bg-[#1a1a1a] border border-outline-variant/40 rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <Shield className={`w-5 h-5 ${scanning ? "text-[#ffc551] animate-pulse" : "text-primary"}`} />
                  <h2 className="text-sm font-medium text-on-surface">
                    {scanning ? "Scan in Progress..." : "New Reconnaissance Scan"}
                  </h2>
                </div>
                {!scanning && (
                  <button onClick={onClose} className="text-on-surface-variant/40 hover:text-primary transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {scanning ? (
                <div className="px-6 py-10 text-center space-y-4">
                  <Loader2 className="w-10 h-10 text-primary mx-auto animate-spin" />
                  <div>
                    <p className="text-sm text-on-surface font-medium">{scanTypeLabels[scanType]}</p>
                    <p className="text-xs text-on-surface-variant/60 mt-1">{target}</p>
                  </div>
                  <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 16, ease: "linear" }}
                    />
                  </div>
                  <p className="text-[10px] text-on-surface-variant/30">Scanning target • 20 probes remaining</p>
                </div>
              ) : (
                <div className="px-6 py-5 space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant/80 mb-2 uppercase tracking-wider">
                      Target Hostname / IP / CIDR
                    </label>
                    <Input
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      placeholder="e.g. corp.internal or 10.0.1.0/24"
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-on-surface-variant/80 mb-2 uppercase tracking-wider">
                        Scan Type
                      </label>
                      <Select value={scanType} onValueChange={setScanType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Full Recon</SelectItem>
                          <SelectItem value="port">Port Scan</SelectItem>
                          <SelectItem value="vuln">Vulnerability</SelectItem>
                          <SelectItem value="discovery">Discovery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-on-surface-variant/80 mb-2 uppercase tracking-wider">
                        Stealth Level
                      </label>
                      <Select value={stealth} onValueChange={setStealth}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stealth">Maximum Stealth</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="aggressive">Aggressive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {[
                      { icon: Globe, label: "Subdomains", enabled: true },
                      { icon: Target, label: "Ports", enabled: true },
                      { icon: Zap, label: "Exploits", enabled: scanType === "full" },
                    ].map((opt) => (
                      <div
                        key={opt.label}
                        className={`flex items-center gap-2 p-3 rounded-lg border text-xs ${
                          opt.enabled
                            ? "border-primary/30 bg-primary/5 text-primary"
                            : "border-outline-variant/20 text-on-surface-variant/40 opacity-50"
                        }`}
                      >
                        <opt.icon className="w-4 h-4" />
                        <span>{opt.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant/20 bg-[#0e0e0e]/50">
                {scanning ? (
                  <span className="text-xs text-on-surface-variant/40 animate-pulse">Scanning...</span>
                ) : (
                  <>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button variant="default" onClick={handleStart}>
                      <Zap className="w-4 h-4 mr-1" />
                      Start Scan
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
