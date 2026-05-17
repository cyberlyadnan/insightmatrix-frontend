import { buildPublicApiUrl } from "@/lib/site-url";

export type VendorRoutingStartPayload = {
  allocationCode: string;
  vendorRespondentId?: string;
  trafficSource?: string;
};

export type VendorRoutingStartResult = {
  sessionToken: string;
  redirectUrl: string;
  allocationCode: string;
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

  if (!res.ok || !data.data?.redirectUrl) {
    throw new Error(data.message || "Unable to start survey session");
  }

  return data.data;
}
