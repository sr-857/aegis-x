"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { KpiMetric, ScanEvent, TimelineEvent } from "@/types";

export function useDashboardKpis() {
  return useQuery<KpiMetric[]>({
    queryKey: ["dashboard", "kpis"],
    queryFn: () => api.get<KpiMetric[]>("/api/kpis"),
    refetchInterval: 30000,
  });
}

export function useDashboardTimeline() {
  return useQuery<TimelineEvent[]>({
    queryKey: ["dashboard", "timeline"],
    queryFn: () => api.get<TimelineEvent[]>("/api/timeline"),
    refetchInterval: 15000,
  });
}

export function useDashboardSummary() {
  return useQuery<{
    kpis: KpiMetric[];
    timeline: TimelineEvent[];
    recentEvents: ScanEvent[];
  }>({
    queryKey: ["dashboard", "summary"],
    queryFn: () => api.get("/api/dashboard"),
    refetchInterval: 30000,
  });
}
