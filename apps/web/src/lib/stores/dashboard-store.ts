import { create } from "zustand";
import type { KpiMetric, TimelineEvent } from "@/types";

interface DashboardState {
  kpis: KpiMetric[];
  timeline: TimelineEvent[];
  selectedTimelineEvent: string | null;
  setKpis: (kpis: KpiMetric[]) => void;
  setTimeline: (events: TimelineEvent[]) => void;
  selectTimelineEvent: (id: string | null) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  kpis: [],
  timeline: [],
  selectedTimelineEvent: null,
  setKpis: (kpis) => set({ kpis }),
  setTimeline: (events) => set({ timeline: events }),
  selectTimelineEvent: (id) => set({ selectedTimelineEvent: id }),
}));
