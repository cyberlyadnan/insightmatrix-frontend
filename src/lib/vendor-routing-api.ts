import { buildPublicApiUrl } from "@/lib/site-url";
import type { PrescreenForm } from "@/types/prescreen";

export type VendorRoutingStartPayload = {
  routingSlug: string;
  vendorRespondentToid?: string;
  vendorRespondentId?: string;
  trafficSource?: string;
  captchaToken?: string;
};

export type VendorRoutingStartResult = {
  sessionToken: string;
  redirectUrl?: string;
  requiresPrescreen: boolean;
  requiresCaptcha?: boolean;
  captchaSiteKey?: string;
  profileId?: string;
  prescreenForm?: PrescreenForm | null;
};

export type CompleteRoutingPrescreenPayload = {
  profileId: string;
  internalSessionToken: string;
  channel: "vendor" | "panel";
  answers: Record<string, unknown>;
  durationMs?: number;
};

export type CompleteRoutingPrescreenResult = {
  sessionToken: string;
  redirectUrl: string;
  channel: string;
  profileId: string;
};

export async function postVendorRoutingStart(
  payload: VendorRoutingStartPayload
): Promise<VendorRoutingStartResult> {
  const res = await fetch(buildPublicApiUrl("/public/vendor-routing/start"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let data: { data?: VendorRoutingStartResult; message?: string } = {};
  try {
    data = text ? (JSON.parse(text) as typeof data) : {};
  } catch {
    /* ignore */
  }

  if (!res.ok || !data.data?.sessionToken) {
    throw new Error(data.message || "Unable to start survey session");
  }

  return data.data;
}

export async function postCompleteRoutingPrescreen(
  payload: CompleteRoutingPrescreenPayload
): Promise<CompleteRoutingPrescreenResult> {
  const res = await fetch(buildPublicApiUrl("/public/routing/complete-prescreen"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let data: { data?: CompleteRoutingPrescreenResult; message?: string } = {};
  try {
    data = text ? (JSON.parse(text) as typeof data) : {};
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    throw new Error(data.message || "Unable to complete prescreen");
  }
  if (!data.data?.redirectUrl) {
    throw new Error(
      data.message || "Prescreen saved but survey redirect URL is missing. Contact support."
    );
  }

  return data.data;
}
