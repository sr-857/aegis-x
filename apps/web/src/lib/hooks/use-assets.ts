"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Asset } from "@/types";

export function useAssets() {
  return useQuery<Asset[]>({
    queryKey: ["assets"],
    queryFn: () => api.get<Asset[]>("/api/assets"),
    refetchInterval: 60000,
  });
}

export function useAsset(id: string) {
  return useQuery<Asset | undefined>({
    queryKey: ["assets", id],
    queryFn: () => api.get<Asset | undefined>(`/api/assets/${id}`),
    enabled: !!id,
  });
}
