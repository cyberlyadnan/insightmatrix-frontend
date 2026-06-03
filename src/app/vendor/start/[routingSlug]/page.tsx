import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { VendorStartClient } from "./vendor-start-client";

function VendorStartFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
      <p className="text-sm text-gray-500">Loading survey…</p>
    </div>
  );
}

/** Vendor public entry — must wrap useSearchParams() in Suspense (Next.js production requirement). */
export default function VendorStartPage() {
  return (
    <Suspense fallback={<VendorStartFallback />}>
      <VendorStartClient />
    </Suspense>
  );
}
