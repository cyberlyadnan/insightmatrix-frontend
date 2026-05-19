"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

import { postVendorRoutingStart, postCompleteRoutingPrescreen } from "@/lib/vendor-routing-api";
import { RoutingPrescreenForm } from "@/components/routing/RoutingPrescreenForm";
import type { PrescreenForm } from "@/types/prescreen";

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

export default function VendorStartPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const routingSlug =
    typeof params.routingSlug === "string" ? decodeURIComponent(params.routingSlug) : "";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [prescreenForm, setPrescreenForm] = useState<PrescreenForm | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(() => Date.now());

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
        if (cancelled) return;

        if (result.requiresPrescreen && result.prescreenForm && result.profileId) {
          setPrescreenForm(result.prescreenForm);
          setProfileId(result.profileId);
          setSessionToken(result.sessionToken);
          setLoading(false);
          return;
        }
        if (result.redirectUrl) {
          window.location.replace(result.redirectUrl);
          return;
        }
        setError("Unable to start survey");
        setLoading(false);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Unable to start survey");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [routingSlug, vendorRespondentToid, trafficSource]);

  const handlePrescreenSubmit = async (answers: Record<string, unknown>) => {
    if (!profileId || !sessionToken) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await postCompleteRoutingPrescreen({
        profileId,
        internalSessionToken: sessionToken,
        channel: "vendor",
        answers,
        durationMs: Date.now() - startedAt,
      });
      window.location.replace(result.redirectUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to submit prescreen");
      setSubmitting(false);
    }
  };

  if (!routingSlug) return <VendorStartError message="Invalid routing link." />;
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
        <p className="text-sm font-medium text-gray-500">Starting survey…</p>
      </div>
    );
  }
  if (error && !prescreenForm) return <VendorStartError message={error} />;
  if (prescreenForm) {
    return (
      <>
        {error ? (
          <p className="text-center text-sm text-rose-600 py-2 bg-rose-50">{error}</p>
        ) : null}
        <RoutingPrescreenForm
          form={prescreenForm}
          onSubmit={handlePrescreenSubmit}
          isSubmitting={submitting}
          title="Before you begin"
          subtitle="Answer a few questions, then you'll continue to the survey."
        />
      </>
    );
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
      <p className="text-sm font-medium text-gray-500">Redirecting…</p>
    </div>
  );
}
