import { create } from "zustand";
import type { ScanEvent, WorkerTelemetry } from "@/types";

interface ScanState {
  events: ScanEvent[];
  telemetry: WorkerTelemetry[];
  isStreaming: boolean;
  addEvent: (event: ScanEvent) => void;
  addEvents: (events: ScanEvent[]) => void;
  updateTelemetry: (telemetry: WorkerTelemetry[]) => void;
  setStreaming: (streaming: boolean) => void;
  clearEvents: () => void;
}

export const useScanStore = create<ScanState>((set) => ({
  events: [],
  telemetry: [],
  isStreaming: false,
  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event].slice(-200),
    })),
  addEvents: (events) =>
    set((state) => ({
      events: [...state.events, ...events].slice(-200),
    })),
  updateTelemetry: (telemetry) => set({ telemetry }),
  setStreaming: (streaming) => set({ isStreaming: streaming }),
  clearEvents: () => set({ events: [] }),
}));
