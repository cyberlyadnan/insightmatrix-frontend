"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { postVendorRoutingStart, postCompleteRoutingPrescreen } from "@/lib/vendor-routing-api";
import { RoutingPrescreenForm } from "@/components/routing/RoutingPrescreenForm";
import { GatewayCaptcha } from "@/components/routing/GatewayCaptcha";
import { SecurityBlockedScreen } from "@/components/routing/SecurityBlockedScreen";
import type { PrescreenForm } from "@/types/prescreen";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

export default function VendorStartPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const routingSlug =
    typeof params.routingSlug === "string" ? decodeURIComponent(params.routingSlug) : "";

  const [captchaToken, setCaptchaToken] = useState<string | null>(RECAPTCHA_SITE_KEY ? null : "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!RECAPTCHA_SITE_KEY);
  const [prescreenForm, setPrescreenForm] = useState<PrescreenForm | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(() => Date.now());

  const vendorRespondentToid =
    searchParams.get("toid") ?? searchParams.get("vrid") ?? searchParams.get("rid") ?? undefined;
  const trafficSource = searchParams.get("source") ?? searchParams.get("utm_source") ?? undefined;

  useEffect(() => {
    if (!routingSlug || captchaToken === null) return;

    let cancelled = false;

    (async () => {
      try {
        const result = await postVendorRoutingStart({
          routingSlug,
          vendorRespondentToid,
          trafficSource,
          captchaToken: captchaToken || undefined,
        });
        if (cancelled) return;

        if (result.requiresCaptcha && RECAPTCHA_SITE_KEY) {
          setCaptchaToken(null);
          setLoading(false);
          return;
        }

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
  }, [routingSlug, vendorRespondentToid, trafficSource, captchaToken]);

  const handlePrescreenSubmit = async (answers: Record<string, unknown>) => {
    if (!profileId || !sessionToken) return;
    setSubmitting(true);
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

  if (!routingSlug) {
    return <SecurityBlockedScreen message="Invalid routing link." />;
  }

  if (RECAPTCHA_SITE_KEY && captchaToken === null) {
    return (
      <GatewayCaptcha
        siteKey={RECAPTCHA_SITE_KEY}
        onToken={(token) => {
          setError(null);
          setCaptchaToken(token);
          setLoading(true);
        }}
      />
    );
  }

  if (error && !prescreenForm) {
    return (
      <SecurityBlockedScreen
        message={error}
        onRetry={() => {
          setError(null);
          setLoading(!RECAPTCHA_SITE_KEY);
          setCaptchaToken(RECAPTCHA_SITE_KEY ? null : "");
        }}
      />
    );
  }

  if (loading && !prescreenForm) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
        <p className="text-sm text-gray-500">Starting survey…</p>
      </div>
    );
  }

  if (prescreenForm) {
    return (
      <RoutingPrescreenForm
        form={prescreenForm}
        onSubmit={handlePrescreenSubmit}
        isSubmitting={submitting}
        title="Before you begin"
        subtitle="Answer a few questions, then you'll continue to the survey."
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
      <p className="text-sm text-gray-500">Redirecting…</p>
    </div>
  );
}
