import { Suspense } from "react";
import type { Metadata } from "next";
import { Loader2 } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { gatewayPathWithSearch, routingGatewayMetadata } from "@/lib/routing-link-metadata";

import { VendorStartClient } from "./vendor-start-client";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ routingSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { routingSlug } = await params;
  const sp = await searchParams;
  const path = gatewayPathWithSearch(ROUTES.vendor.start(routingSlug), sp);
  return routingGatewayMetadata(path);
}

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
