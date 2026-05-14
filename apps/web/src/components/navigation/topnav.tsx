"use client";

import { useState } from "react";
import Link from "next/link";
import { useSidebarStore } from "@/lib/stores/sidebar-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useNotificationStore } from "@/lib/stores/notification-store";
import { Input } from "@/components/ui/input";
import { ConnectionStatus } from "@/components/connection-status";
import {
  Menu,
  Search,
  Bell,
  Keyboard,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

interface TopNavProps {
  onSearchClick?: () => void;
}

export function TopNav({ onSearchClick }: TopNavProps) {
  const { toggle, isCollapsed } = useSidebarStore();
  const { operatorId, logout } = useAuthStore();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-[#0e0e0e]/80 backdrop-blur-xl border-b border-outline-variant/20 flex items-center justify-between px-6 transition-all duration-300 ${
        isCollapsed ? "left-20" : "left-64"
      } max-md:left-0`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="hidden md:flex items-center justify-center w-9 h-9 rounded text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all duration-300"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button
          onClick={() => useSidebarStore.getState().setMobileOpen(true)}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded text-on-surface-variant hover:text-primary"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onSearchClick}
          className="relative w-72 max-md:hidden group cursor-pointer"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50 group-hover:text-primary transition-colors" />
          <div className="flex items-center h-9 w-full bg-[#0e0e0e] border border-outline-variant/30 rounded px-10 text-sm text-on-surface-variant/40 text-left group-hover:border-primary/30 transition-colors">
            Search assets, vulnerabilities...
          </div>
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-[10px] font-mono text-on-surface-variant/30">
            <Keyboard className="w-3 h-3" />
            <span>/</span>
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <ConnectionStatus />
        <Link
          href="/notifications"
          className="relative w-9 h-9 rounded flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all duration-300"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-[9px] font-mono text-[#0e0e0e] font-bold rounded-full flex items-center justify-center data-point-glow">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-white/[0.02] transition-all duration-300 group"
          >
            <div className="w-7 h-7 rounded-full border border-primary/30 flex items-center justify-center bg-primary/5">
              <User className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-sm text-on-surface-variant group-hover:text-on-surface max-md:hidden">
              {operatorId || "Operator"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant/50 max-md:hidden" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-outline-variant/30 rounded-lg overflow-hidden z-50 shadow-xl">
                <div className="px-4 py-3 border-b border-outline-variant/20">
                  <p className="text-sm text-on-surface font-medium">{operatorId || "Guest Operator"}</p>
                  <p className="text-xs text-on-surface-variant/60 mt-0.5">Security Operator • Level 3</p>
                </div>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:text-on-surface hover:bg-white/[0.02] transition-all"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User className="w-4 h-4" />
                  Profile & Settings
                </Link>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-all border-t border-outline-variant/10"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </button>
              </div>
            </>
          )}
        </div>

        <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono text-on-surface-variant/30 border border-outline-variant/10 rounded">
          <Keyboard className="w-3 h-3" />
          <span>⌘K</span>
        </button>
      </div>
    </header>
  );
}
