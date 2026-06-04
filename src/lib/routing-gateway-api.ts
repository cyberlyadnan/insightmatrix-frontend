import { buildPublicApiUrl } from "@/lib/site-url";
import { parseGatewayApiResponse } from "@/lib/parse-gateway-api-response";
import type { PrescreenForm } from "@/types/prescreen";
import {
  postCompleteRoutingPrescreen,
  type CompleteRoutingPrescreenResult,
} from "@/lib/vendor-routing-api";

export type { CompleteRoutingPrescreenResult };

export type PanelGatewayRedirectResult = {
  sessionToken?: string;
  redirectUrl?: string;
  channel: "panel" | "vendor";
  requiresPrescreen?: boolean;
  requiresCaptcha?: boolean;
  captchaSiteKey?: string;
  profileId?: string;
  prescreenForm?: PrescreenForm | null;
};

export async function postPanelGatewayRedirect(payload: {
  surveyId: string;
  attemptToken: string;
  captchaToken?: string;
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
  return parseGatewayApiResponse<PanelGatewayRedirectResult>(
    res,
    text,
    "Unable to start survey through gateway"
  );
}

export { postCompleteRoutingPrescreen };
