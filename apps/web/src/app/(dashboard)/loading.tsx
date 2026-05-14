import { Loader2, Shield } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <Shield className="w-6 h-6 text-primary/60 absolute inset-0 m-auto" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-on-surface">Loading intelligence data</p>
          <p className="text-xs text-on-surface-variant/40 mt-1">Synchronizing reconnaissance feeds</p>
        </div>
      </div>
    </div>
  );
}
