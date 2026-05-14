import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Providers } from "@/components/providers";
import { AppShell } from "@/components/navigation/app-shell";
import { ErrorBoundary } from "@/components/error-boundary";
import { RouteTransition } from "@/components/route-transitions";
import { ConnectionStatus } from "@/components/connection-status";
import { lazy, Suspense } from "react";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

function GuestGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/executive" replace />;
  }
  return <>{children}</>;
}

const ExecutivePage = lazy(() => import("@/app/(dashboard)/executive/page").then(m => ({ default: m.default })));
const ExplorerPage = lazy(() => import("@/app/(dashboard)/explorer/page").then(m => ({ default: m.default })));
const VulnerabilitiesPage = lazy(() => import("@/app/(dashboard)/vulnerabilities/page").then(m => ({ default: m.default })));
const OperationsPage = lazy(() => import("@/app/(dashboard)/operations/page").then(m => ({ default: m.default })));
const AssetsPage = lazy(() => import("@/app/(dashboard)/assets/page").then(m => ({ default: m.default })));
const SettingsPage = lazy(() => import("@/app/(dashboard)/settings/page").then(m => ({ default: m.default })));
const NotificationsPage = lazy(() => import("@/app/(dashboard)/notifications/page").then(m => ({ default: m.default })));
const LoginPage = lazy(() => import("@/app/(auth)/login/page").then(m => ({ default: m.default })));
const NotFoundPage = lazy(() => import("@/app/(dashboard)/not-found/page").then(m => ({ default: m.default })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <Routes>
          <Route
            path="/login"
            element={
              <GuestGuard>
                <RouteTransition>
                  <Suspense fallback={<PageLoader />}><LoginPage /></Suspense>
                </RouteTransition>
              </GuestGuard>
            }
          />
          <Route
            path="/"
            element={
              <AuthGuard>
                <AppShell />
              </AuthGuard>
            }
          >
            <Route index element={<Navigate to="/executive" replace />} />
            <Route
              path="executive"
              element={<Suspense fallback={<PageLoader />}><ExecutivePage /></Suspense>}
            />
            <Route
              path="explorer"
              element={<Suspense fallback={<PageLoader />}><ExplorerPage /></Suspense>}
            />
            <Route
              path="vulnerabilities"
              element={<Suspense fallback={<PageLoader />}><VulnerabilitiesPage /></Suspense>}
            />
            <Route
              path="operations"
              element={<Suspense fallback={<PageLoader />}><OperationsPage /></Suspense>}
            />
            <Route
              path="assets"
              element={<Suspense fallback={<PageLoader />}><AssetsPage /></Suspense>}
            />
            <Route
              path="settings"
              element={<Suspense fallback={<PageLoader />}><SettingsPage /></Suspense>}
            />
            <Route
              path="notifications"
              element={<Suspense fallback={<PageLoader />}><NotificationsPage /></Suspense>}
            />
          </Route>
          <Route
            path="/not-found"
            element={
              <AuthGuard>
                <Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense>
              </AuthGuard>
            }
          />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
        <ConnectionStatus />
      </Providers>
    </ErrorBoundary>
  );
}