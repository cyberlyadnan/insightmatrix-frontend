import { headers } from "next/headers";

import { getConfiguredSiteUrl, normalizeSiteUrl } from "@/lib/site-url";

/**
 * Server-only: infer site URL from env or reverse-proxy headers.
 */
export async function getRequestSiteUrl(): Promise<string> {
  const configured = getConfiguredSiteUrl();
  if (configured) return configured;

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${normalizeSiteUrl(vercel)}`;

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = (h.get("x-forwarded-proto") ?? "https").split(",")[0]?.trim() ?? "https";
  if (host) return `${proto}://${host.split(",")[0]?.trim()}`;

  return "";
}
