"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/lib/stores/sidebar-store";
import { useNotificationStore } from "@/lib/stores/notification-store";
import { useDashboardKpis } from "@/lib/hooks/use-dashboard";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Search,
  AlertTriangle,
  Activity,
  Cpu,
  Shield,
  Settings,
  Bell,
  HeadphonesIcon,
  X,
  Plus,
  Keyboard,
} from "lucide-react";
const navItems = [
  { label: "Dashboard", href: "/executive", icon: LayoutDashboard },
  { label: "Intelligence Explorer", href: "/explorer", icon: Search },
  { label: "Vulnerability Triage", href: "/vulnerabilities", icon: AlertTriangle },
  { label: "Live Operations", href: "/operations", icon: Activity },
  { label: "Asset Intelligence", href: "/assets", icon: Cpu },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  onNewScan?: () => void;
}

export function Sidebar({ onNewScan }: SidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, isMobileOpen, setMobileOpen } = useSidebarStore();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const { data: kpis } = useDashboardKpis();

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-[#0e0e0e] border-r border-outline-variant/30 flex flex-col transition-all duration-300",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-outline-variant/20">
          <Link href="/executive" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border border-primary/50 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-sm text-on-surface tracking-wider">
                AEGIS
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-on-surface-variant hover:text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            const isNotifications = item.href === "/notifications";
            const link = (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-label={`Navigate to ${item.label}`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all duration-300 group relative",
                  isActive
                    ? "text-primary bg-primary/5 border-r-2 border-primary"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-white/[0.02]"
                )}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 shrink-0" />
                  {isNotifications && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary data-point-glow" />
                  )}
                </div>
                {!isCollapsed && (
                  <span className="flex-1">{item.label}</span>
                )}
                {!isCollapsed && isNotifications && unreadCount > 0 && (
                  <span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                    {unreadCount}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }
            return link;
          })}
        </nav>

        {!isCollapsed && (
          <div className="px-4 py-4">
            <button
              onClick={onNewScan}
              className="w-full flex items-center justify-center gap-2 h-10 bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-all duration-300 rounded group"
              aria-label="Initiate new reconnaissance scan"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span>New Scan</span>
            </button>
          </div>
        )}

        {!isCollapsed && (
          <div className="px-5 py-3 border-t border-outline-variant/10">
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="bg-[#0e0e0e] rounded p-2 border border-outline-variant/10">
                <span className="text-on-surface-variant/40">Assets</span>
                <p className="text-primary text-xs mt-0.5 font-medium">{kpis?.[0]?.value || "—"}</p>
              </div>
              <div className="bg-[#0e0e0e] rounded p-2 border border-outline-variant/10">
                <span className="text-on-surface-variant/40">Critical</span>
                <p className="text-destructive text-xs mt-0.5 font-medium">{kpis?.[2]?.value || "—"}</p>
              </div>
              <div className="bg-[#0e0e0e] rounded p-2 border border-outline-variant/10">
                <span className="text-on-surface-variant/40">Threats</span>
                <p className="text-[#ffc551] text-xs mt-0.5 font-medium">{kpis?.[4]?.value || "—"}</p>
              </div>
              <div className="bg-[#0e0e0e] rounded p-2 border border-outline-variant/10">
                <span className="text-on-surface-variant/40">Coverage</span>
                <p className="text-green-400 text-xs mt-0.5 font-medium">{kpis?.[3]?.value || "—"}</p>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-outline-variant/20 px-4 py-4 space-y-1">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded text-sm transition-all duration-300",
              pathname === "/settings"
                ? "text-primary bg-primary/5"
                : "text-on-surface-variant hover:text-on-surface hover:bg-white/[0.02]"
            )}
          >
            <Settings className="w-4 h-4" />
            {!isCollapsed && <span>Settings</span>}
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded text-sm text-on-surface-variant hover:text-on-surface hover:bg-white/[0.02] transition-all duration-300"
          >
            <HeadphonesIcon className="w-4 h-4" />
            {!isCollapsed && <span>Support</span>}
          </Link>
        </div>

        {!isCollapsed && (
          <div className="px-4 py-3 border-t border-outline-variant/10">
            <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant/30">
              <Keyboard className="w-3 h-3" />
              <span>
                <kbd className="text-primary/50 px-1 rounded border border-outline-variant/10">⌘K</kbd>
                <span className="mx-1">·</span>
                <kbd className="text-primary/50 px-1 rounded border border-outline-variant/10">N</kbd>
                <span className="mx-1">·</span>
                <kbd className="text-primary/50 px-1 rounded border border-outline-variant/10">H</kbd>
                <span className="ml-1">home</span>
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
