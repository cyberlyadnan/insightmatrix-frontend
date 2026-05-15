import type { PanelRoutingEventType } from "@/constants/panel-survey-routing";
import { buildPublicApiUrl } from "@/lib/site-url";

export type PublicRoutingCallbackPayload = {
  supplierProjectPid: string;
  eventType: PanelRoutingEventType;
  quotaGroupId?: string | null;
  quotaGroupName?: string | null;
  supplierParticipantRef?: string | null;
  meta?: { query: Record<string, string> } | null;
};

function publicCallbackRequestUrl(): string {
  return buildPublicApiUrl("/public/panel-routing-callback");
}

/**
 * Records a routing outcome. No auth — used from callback landing pages (and can be used
 * server-to-server with the same JSON body later).
 */
export async function postPublicRoutingCallback(
  payload: PublicRoutingCallbackPayload
): Promise<{ id: string }> {
  const res = await fetch(publicCallbackRequestUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let data: { data?: { id: string }; message?: string } = {};
  try {
    data = text ? (JSON.parse(text) as typeof data) : {};
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    throw new Error(data.message || (text ? text.slice(0, 200) : `Request failed (${res.status})`));
  }

  return { id: data.data?.id ?? "" };
}

export function searchParamsToObject(params: URLSearchParams): Record<string, string> {
  const o: Record<string, string> = {};
  params.forEach((v, k) => {
    o[k] = v;
  });
  return o;
}

/** Match supplier query keys for respondent / transaction id (toid, uid, etc.) */
export function pickSupplierParticipantRef(params: URLSearchParams): string {
  const keys = [
    "im_attempt",
    "toid",
    "uid",
    "RID",
    "rid",
    "txn",
    "transaction_id",
    "subid",
    "token",
  ];
  for (const k of keys) {
    const v = params.get(k)?.trim();
    if (v) return v;
  }
  return "";
}
