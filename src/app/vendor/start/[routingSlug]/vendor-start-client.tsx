"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { postVendorRoutingStart, postCompleteRoutingPrescreen } from "@/lib/vendor-routing-api";
import { normalizePrescreenForm } from "@/lib/normalize-prescreen-form";
import { safeDecodeURIComponent } from "@/lib/safe-decode-uri";
import {
  getGatewayCaptchaSiteKey,
  isGatewayCaptchaActive,
  shouldShowRoutingCaptcha,
} from "@/lib/gateway-security";
import { RoutingPrescreenForm } from "@/components/routing/RoutingPrescreenForm";
import { GatewayCaptcha } from "@/components/routing/GatewayCaptcha";
import { SecurityBlockedScreen } from "@/components/routing/SecurityBlockedScreen";
import type { PrescreenForm } from "@/types/prescreen";

const REDIRECT_TIMEOUT_MS = 12_000;

function navigateToSurvey(url: string): boolean {
  try {
    const target = new URL(url);
    window.location.replace(target.toString());
    return true;
  } catch {
    return false;
  }
}

export function VendorStartClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const routingSlug =
    typeof params.routingSlug === "string" ? safeDecodeURIComponent(params.routingSlug).trim() : "";

  const initialSiteKey = getGatewayCaptchaSiteKey();
  const [captchaSiteKey, setCaptchaSiteKey] = useState(initialSiteKey);
  const [captchaRequired, setCaptchaRequired] = useState(() =>
    isGatewayCaptchaActive(initialSiteKey)
  );
  const [captchaToken, setCaptchaToken] = useState<string | null>(() =>
    shouldShowRoutingCaptcha(initialSiteKey, false) ? null : ""
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(() => !shouldShowRoutingCaptcha(initialSiteKey, false));
  const [prescreenForm, setPrescreenForm] = useState<PrescreenForm | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [redirectingTo, setRedirectingTo] = useState<string | null>(null);
  const [startedAt] = useState(() => Date.now());

  const vendorRespondentToid =
    searchParams.get("toid") ?? searchParams.get("vrid") ?? searchParams.get("rid") ?? undefined;
  const trafficSource = searchParams.get("source") ?? searchParams.get("utm_source") ?? undefined;

  useEffect(() => {
    if (!redirectingTo) return;

    const timer = window.setTimeout(() => {
      setError(
        "We could not open the survey page. Please try again or contact support if this continues."
      );
      setRedirectingTo(null);
      setLoading(false);
    }, REDIRECT_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [redirectingTo]);

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

        if (result.requiresCaptcha) {
          const nextSiteKey = getGatewayCaptchaSiteKey(result.captchaSiteKey);
          if (!nextSiteKey) {
            setError(
              "Security verification is required but is not configured. Please contact support."
            );
            setLoading(false);
            return;
          }
          setCaptchaRequired(true);
          setCaptchaSiteKey(nextSiteKey);
          setCaptchaToken(null);
          setLoading(false);
          return;
        }

        setCaptchaRequired(false);

        if (
          result.requiresPrescreen &&
          result.prescreenForm &&
          result.profileId &&
          result.sessionToken
        ) {
          const normalized = normalizePrescreenForm(result.prescreenForm);
          if (!normalized || normalized.questions.length === 0) {
            setError("Prescreen form is not configured correctly. Please contact support.");
            setLoading(false);
            return;
          }
          setPrescreenForm(normalized);
          setProfileId(result.profileId);
          setSessionToken(result.sessionToken);
          setLoading(false);
          return;
        }

        if (result.requiresPrescreen) {
          setError("Prescreen is required but could not be loaded. Please contact support.");
          setLoading(false);
          return;
        }

        if (result.redirectUrl) {
          setLoading(false);
          setRedirectingTo(result.redirectUrl);
          if (!navigateToSurvey(result.redirectUrl)) {
            setRedirectingTo(null);
            setError("Survey redirect URL is invalid. Please contact support.");
          }
          return;
        }

        setError("Unable to start survey — no redirect URL was returned.");
        setLoading(false);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Unable to start survey");
          setLoading(false);
          setRedirectingTo(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [routingSlug, vendorRespondentToid, trafficSource, captchaToken]);

  const handlePrescreenSubmit = async (answers: Record<string, unknown>) => {
    if (!profileId || !sessionToken) {
      const msg = "Session expired. Please refresh the page and try again.";
      setSubmitError(msg);
      toast.error(msg);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await postCompleteRoutingPrescreen({
        profileId,
        internalSessionToken: sessionToken,
        channel: "vendor",
        answers,
        durationMs: Date.now() - startedAt,
      });
      setRedirectingTo(result.redirectUrl);
      if (!navigateToSurvey(result.redirectUrl)) {
        setRedirectingTo(null);
        setSubmitError("Survey redirect URL is invalid. Please contact support.");
        setSubmitting(false);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unable to submit prescreen";
      setSubmitError(msg);
      toast.error(msg);
      setSubmitting(false);
    }
  };

  const resetStart = () => {
    setError(null);
    setRedirectingTo(null);
    const siteKey = getGatewayCaptchaSiteKey();
    setCaptchaSiteKey(siteKey);
    const needsCaptcha = isGatewayCaptchaActive(siteKey);
    setCaptchaRequired(needsCaptcha);
    setLoading(!needsCaptcha);
    setCaptchaToken(needsCaptcha ? null : "");
  };

  if (!routingSlug) {
    return <SecurityBlockedScreen message="Invalid routing link." />;
  }

  if (shouldShowRoutingCaptcha(captchaSiteKey, captchaRequired) && captchaToken === null) {
    return (
      <GatewayCaptcha
        siteKey={captchaSiteKey}
        onToken={(token) => {
          setError(null);
          setRedirectingTo(null);
          setCaptchaToken(token);
          setLoading(true);
        }}
      />
    );
  }

  if (error && !prescreenForm) {
    return <SecurityBlockedScreen message={error} onRetry={resetStart} />;
  }

  if ((loading || redirectingTo) && !prescreenForm) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
        <p className="text-sm text-gray-500">
          {redirectingTo ? "Redirecting…" : "Starting survey…"}
        </p>
      </div>
    );
  }

  if (prescreenForm) {
    return (
      <RoutingPrescreenForm
        form={prescreenForm}
        onSubmit={handlePrescreenSubmit}
        isSubmitting={submitting}
        submitError={submitError}
        title="Before you begin"
        subtitle="Answer a few questions, then you'll continue to the survey."
      />
    );
  }

  return (
    <SecurityBlockedScreen
      message="Unable to start the survey. Please try again."
      onRetry={resetStart}
    />
  );
}
