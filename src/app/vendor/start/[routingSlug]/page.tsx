"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

import { postVendorRoutingStart } from "@/lib/vendor-routing-api";

function VendorStartError({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-10 w-10 text-amber-500 mb-4" />
        <h1 className="text-lg font-black text-gray-900 mb-2">Survey unavailable</h1>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </div>
  );
}

/**
 * Public vendor entry: /vendor/start/ALC7X9K2P4?toid=VENUSER123
 * Vendor's toid is stored; supplier receives our internal IMX token only.
 */
export default function VendorStartPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const routingSlug =
    typeof params.routingSlug === "string" ? decodeURIComponent(params.routingSlug) : "";
  const [error, setError] = useState<string | null>(null);

  const vendorRespondentToid =
    searchParams.get("toid") ?? searchParams.get("vrid") ?? searchParams.get("rid") ?? undefined;
  const trafficSource = searchParams.get("source") ?? searchParams.get("utm_source") ?? undefined;

  useEffect(() => {
    if (!routingSlug) return;

    let cancelled = false;

    (async () => {
      try {
        const result = await postVendorRoutingStart({
          routingSlug,
          vendorRespondentToid,
          trafficSource,
        });
        if (!cancelled && result.redirectUrl) {
          window.location.replace(result.redirectUrl);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Unable to start survey");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [routingSlug, vendorRespondentToid, trafficSource]);

  if (!routingSlug) {
    return <VendorStartError message="Invalid routing link." />;
  }

  if (error) {
    return <VendorStartError message={error} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
      <p className="text-sm font-medium text-gray-500">Starting survey…</p>
    </div>
  );
}
