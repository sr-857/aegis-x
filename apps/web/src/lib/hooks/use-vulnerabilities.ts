"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Vulnerability } from "@/types";

export function useVulnerabilities() {
  return useQuery<Vulnerability[]>({
    queryKey: ["vulnerabilities"],
    queryFn: () => api.get<Vulnerability[]>("/api/vulnerabilities"),
    refetchInterval: 30000,
  });
}

export function useVulnerability(id: string) {
  return useQuery<Vulnerability | undefined>({
    queryKey: ["vulnerabilities", id],
    queryFn: () => api.get<Vulnerability | undefined>(`/api/vulnerabilities/${id}`),
    enabled: !!id,
  });
}
