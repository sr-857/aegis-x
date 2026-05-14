"use client";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function HomePage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return <Navigate to={isAuthenticated ? "/executive" : "/login"} replace />;
}