import { buildPublicApiUrl } from "@/lib/site-url";
import type { PrescreenForm } from "@/types/prescreen";
import {
  postCompleteRoutingPrescreen,
  type CompleteRoutingPrescreenResult,
} from "@/lib/vendor-routing-api";

export type { CompleteRoutingPrescreenResult };

export type PanelGatewayRedirectResult = {
  sessionToken: string;
  redirectUrl?: string;
  channel: "panel" | "vendor";
  requiresPrescreen?: boolean;
  profileId?: string;
  prescreenForm?: PrescreenForm | null;
};

export async function postPanelGatewayRedirect(payload: {
  surveyId: string;
  attemptToken: string;
}): Promise<PanelGatewayRedirectResult> {
  const res = await fetch(buildPublicApiUrl("/public/routing/gateway/panel-redirect"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let data: { data?: PanelGatewayRedirectResult; message?: string } = {};
  try {
    data = text ? (JSON.parse(text) as typeof data) : {};
  } catch {
    /* ignore */
  }

  if (!res.ok || !data.data?.sessionToken) {
    throw new Error(data.message || "Unable to start survey through gateway");
  }

  return data.data;
}

export { postCompleteRoutingPrescreen };
