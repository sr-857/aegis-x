"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Shield } from "lucide-react";

const routeLabels: Record<string, string> = {
  executive: "Executive Dashboard",
  explorer: "Intelligence Explorer",
  vulnerabilities: "Vulnerability Triage",
  operations: "Live Operations",
  assets: "Asset Intelligence",
  settings: "Settings",
  notifications: "Notifications",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-xs">
        <li>
          <Link
            href="/executive"
            className="flex items-center gap-1 text-on-surface-variant/40 hover:text-primary transition-colors"
          >
            <Shield className="w-3 h-3" />
            <span>AEGIS</span>
          </Link>
        </li>
        {segments.map((seg, i) => {
          const label = routeLabels[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);
          const href = "/" + segments.slice(0, i + 1).join("/");
          const isLast = i === segments.length - 1;
          return (
            <li key={seg} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-on-surface-variant/20" />
              {isLast ? (
                <span className="text-on-surface-variant/60 font-medium">{label}</span>
              ) : (
                <Link href={href} className="text-on-surface-variant/40 hover:text-primary transition-colors">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
