"use client";
import { DemoBadge } from "@/components/demo-badge";
import { usePageTitle } from "@/lib/hooks/use-page-title";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Shield,
  Eye,
  Terminal,
  Database,
  Webhook,
} from "lucide-react";

export default function SettingsPage() {
  usePageTitle("Settings");
  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-headline-lg text-on-surface">Settings</h1>
        <p className="text-body-sm text-on-surface-variant/60 mt-1">
          Configure platform preferences and system parameters
        </p>
      </div>
      <DemoBadge />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-primary" />
                  <CardTitle>Display Preferences</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-on-surface">Dark Mode</p>
                    <p className="text-xs text-on-surface-variant/60">System dark mode is always enabled</p>
                  </div>
                  <Switch defaultChecked disabled />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-on-surface">Reduced Motion</p>
                    <p className="text-xs text-on-surface-variant/60">Minimize animations and transitions</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-on-surface">Ambient Glow</p>
                    <p className="text-xs text-on-surface-variant/60">Background glow effects on panels</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-on-surface">Compact Mode</p>
                    <p className="text-xs text-on-surface-variant/60">Reduce spacing for denser information</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <CardTitle>Notifications</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-on-surface">Critical Alerts</p>
                    <p className="text-xs text-on-surface-variant/60">Critical vulnerability and threat alerts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-on-surface">Scan Completion</p>
                    <p className="text-xs text-on-surface-variant/60">When reconnaissance scans complete</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-on-surface">New Asset Discovery</p>
                    <p className="text-xs text-on-surface-variant/60">When new assets are identified</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-on-surface">Worker Status</p>
                    <p className="text-xs text-on-surface-variant/60">Telemetry worker state changes</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-primary" />
                  <CardTitle>Scan Engine</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-on-surface">Max Concurrent Scans</p>
                    <p className="text-xs text-on-surface-variant/60">Maximum parallel scan operations</p>
                  </div>
                  <Select defaultValue="5">
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 5, 10, 20].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-on-surface">Rate Limit (req/s)</p>
                    <p className="text-xs text-on-surface-variant/60">Requests per second per target</p>
                  </div>
                  <Select defaultValue="50">
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 25, 50, 100, 250, 500].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-on-surface">Stealth Mode</p>
                    <p className="text-xs text-on-surface-variant/60">Evade detection by spreading requests</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <CardTitle>Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Session Timeout", value: "30 minutes" },
                  { label: "MFA Status", value: "Enabled", color: "text-green-400" },
                  { label: "API Key", value: "••••••••••••••••" },
                  { label: "Last Password Change", value: "12 days ago" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-on-surface-variant/60">{item.label}</span>
                    <span className={cn("font-mono text-xs", (item as any).color || "text-on-surface")}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-primary" />
                  <CardTitle>Data Sources</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Shodan", status: "Connected" },
                  { label: "Censys", status: "Connected" },
                  { label: "VirusTotal", status: "Connected" },
                  { label: "SecurityTrails", status: "Disconnected" },
                ].map((source) => (
                  <div key={source.label} className="flex items-center justify-between">
                    <span className="text-sm text-on-surface">{source.label}</span>
                    <Badge variant={source.status === "Connected" ? "success" : "secondary"} size="sm">
                      {source.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Webhook className="w-5 h-5 text-primary" />
                  <CardTitle>Integrations</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Slack", status: "Configured" },
                  { label: "PagerDuty", status: "Not configured" },
                  { label: "Jira", status: "Configured" },
                  { label: "Splunk", status: "Not configured" },
                ].map((int) => (
                  <div key={int.label} className="flex items-center justify-between">
                    <span className="text-sm text-on-surface">{int.label}</span>
                    <Badge variant={int.status === "Configured" ? "success" : "secondary"} size="sm">
                      {int.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
