"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { WorkerTelemetry } from "@/types";

export function useTelemetry() {
  return useQuery<WorkerTelemetry[]>({
    queryKey: ["telemetry"],
    queryFn: () => api.get<WorkerTelemetry[]>("/api/telemetry"),
    refetchInterval: 5000,
  });
}