import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-dashed border-outline-variant/30 flex items-center justify-center">
          <Shield className="w-10 h-10 text-on-surface-variant/30" />
        </div>
        <h1 className="text-display-lg text-on-surface font-semibold mb-2">404</h1>
        <p className="text-headline-sm text-on-surface-variant/60 mb-2">Sector Not Found</p>
        <p className="text-body-sm text-on-surface-variant/40 mb-8">
          The intelligence sector you are trying to access does not exist
          or has been classified.
        </p>
        <Link
          href="/executive"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-all duration-300 rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Command Center
        </Link>
      </div>
    </div>
  );
}
