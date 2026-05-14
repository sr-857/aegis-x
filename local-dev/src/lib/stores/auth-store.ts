import { create } from "zustand";
import type { UserSession } from "@/types";
import { persist } from "zustand/middleware";

interface AuthState extends UserSession {
  login: (operatorId: string, clearance: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      operatorId: "",
      clearance: "",
      token: null,
      login: (operatorId, clearance) =>
        set({
          isAuthenticated: true,
          operatorId,
          clearance,
          token: `mock-token-${Date.now()}`,
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          operatorId: "",
          clearance: "",
          token: null,
        }),
    }),
    { name: "auth-storage" }
  )
);
