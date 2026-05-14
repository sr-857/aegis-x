"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useScanStore } from "@/lib/stores/scan-store";
import type { ScanEvent } from "@/types";

export function useScanEvents() {
  const { addEvent, addEvents, isStreaming, setStreaming } = useScanStore();

  const { data: initialEvents } = useQuery<ScanEvent[]>({
    queryKey: ["scan-events"],
    queryFn: () => api.get<ScanEvent[]>("/api/scan-events"),
    enabled: isStreaming,
  });

  useEffect(() => {
    if (initialEvents) {
      addEvents(initialEvents);
    }
  }, [initialEvents, addEvents]);

  useEffect(() => {
    setStreaming(true);
    const unsubscribe = api.subscribeToEvents((event) => {
      addEvent(event as ScanEvent);
    });
    return () => {
      unsubscribe();
      setStreaming(false);
    };
  }, [addEvent, setStreaming]);

  return useScanStore();
}
