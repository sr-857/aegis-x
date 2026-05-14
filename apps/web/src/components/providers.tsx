"use client";

import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider, useToast } from "@/components/toast";
import { CommandPalette } from "@/components/ui/command-palette";
import { LoadingBar } from "@/components/loading-bar";
import { useKeyboardShortcuts, ShortcutsHelp } from "@/components/keyboard-shortcuts";
import { useNotificationSimulator } from "@/lib/hooks/use-notification-simulator";

function GlobalActionListener({ children }: { children: ReactNode }) {
  const { addToast } = useToast();
  const { helpOpen, setHelpOpen } = useKeyboardShortcuts();
  useNotificationSimulator();

  useEffect(() => {
    const handleNewScan = () => {
      addToast({
        type: "info",
        title: "Scan initiated",
        message: "Reconnaissance scan queued for execution",
      });
    };
    const handleRefresh = () => {
      addToast({
        type: "success",
        title: "Data refreshed",
        message: "All intelligence data synchronized",
      });
    };

    window.addEventListener("action:new-scan", handleNewScan);
    window.addEventListener("action:refresh", handleRefresh);
    return () => {
      window.removeEventListener("action:new-scan", handleNewScan);
      window.removeEventListener("action:refresh", handleRefresh);
    };
  }, [addToast]);

  return (
    <>
      <LoadingBar />
      <CommandPalette />
      <ShortcutsHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
      {children}
    </>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30000,
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={200}>
        <ToastProvider>
          <GlobalActionListener>{children}</GlobalActionListener>
        </ToastProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
