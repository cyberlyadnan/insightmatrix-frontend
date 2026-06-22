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

export type PanelShareStartResult = {
  attemptToken: string;
  surveyId: string;
  supplierProjectPid: string;
  externalParticipantRef?: string;
  participantQueryParam?: string;
  startPath: string;
};

export async function postSharedPanelSurveyAttempt(
  surveyId: string,
  options?: { externalParticipantRef?: string; attemptToken?: string }
): Promise<PanelShareStartResult> {
  const res = await fetch(buildPublicApiUrl("/public/routing/panel-share-start"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      surveyId,
      ...(options?.externalParticipantRef
        ? { externalParticipantRef: options.externalParticipantRef }
        : {}),
      ...(options?.attemptToken ? { attemptToken: options.attemptToken } : {}),
    }),
  });

  const text = await res.text();
  let data: { data?: PanelShareStartResult; message?: string } = {};
  try {
    data = text ? (JSON.parse(text) as typeof data) : {};
  } catch {
    /* ignore malformed JSON */
  }

  if (!res.ok) {
    throw new Error(data.message || "Unable to prepare survey session");
  }

  if (!data.data?.attemptToken) {
    throw new Error(data.message || "Unable to prepare survey session");
  }

  return data.data;
}

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
