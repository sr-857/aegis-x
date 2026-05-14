import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/navigation/sidebar";
import { TopNav } from "@/components/navigation/topnav";
import { RouteTransition } from "@/components/route-transitions";
import { ErrorBoundary } from "@/components/error-boundary";
import { NewScanDialog } from "@/components/new-scan-dialog";
import { GlobalSearch } from "@/components/global-search";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { StatusBar } from "@/components/status-bar";
import { BackToTop } from "@/components/back-to-top";
import { useSidebarStore } from "@/lib/stores/sidebar-store";

export function AppShell() {
  const { isCollapsed } = useSidebarStore();
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleSidebar = useSidebarStore((s) => s.toggle);

  useEffect(() => {
    const handler = () => setScanDialogOpen(true);
    const searchHandler = () => setSearchOpen(true);
    const toggleHandler = () => toggleSidebar();
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "n" && !e.metaKey && !e.ctrlKey && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setScanDialogOpen(true);
      }
    };
    window.addEventListener("action:new-scan", handler);
    window.addEventListener("action:search", searchHandler);
    window.addEventListener("action:toggle-sidebar", toggleHandler);
    window.addEventListener("keydown", keyHandler);
    return () => {
      window.removeEventListener("action:new-scan", handler);
      window.removeEventListener("action:search", searchHandler);
      window.removeEventListener("action:toggle-sidebar", toggleHandler);
      window.removeEventListener("keydown", keyHandler);
    };
  }, [toggleSidebar]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex flex-1">
        <Sidebar onNewScan={() => setScanDialogOpen(true)} />
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isCollapsed ? "md:ml-20" : "md:ml-64"
          }`}
        >
          <TopNav onSearchClick={() => setSearchOpen(true)} />
          <main className="flex-1 pt-16">
            <div className="ambient-glow fixed inset-0 pointer-events-none z-0" />
            <div className="relative z-10 p-6 md:p-8 min-h-[calc(100vh-8rem)]">
              <ErrorBoundary>
                <RouteTransition>
                  <Breadcrumbs />
                  <Outlet />
                </RouteTransition>
              </ErrorBoundary>
            </div>
          </main>
          <StatusBar />
        </div>
      </div>

      <BackToTop />

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

      <NewScanDialog
        open={scanDialogOpen}
        onClose={() => setScanDialogOpen(false)}
      />
    </div>
  );
}