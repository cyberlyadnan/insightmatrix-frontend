import type { Metadata } from "next";

import { buildSiteUrl } from "@/lib/site-url";

/** Build path + query for link previews (Teams, Slack, WhatsApp, etc.). */
export function gatewayPathWithSearch(
  path: string,
  searchParams?: Record<string, string | string[] | undefined>
): string {
  if (!searchParams || Object.keys(searchParams).length === 0) {
    return path.startsWith("/") ? path : `/${path}`;
  }
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      for (const v of value) {
        if (v) qs.append(key, v);
      }
    } else if (value) {
      qs.set(key, value);
    }
  }
  const base = path.startsWith("/") ? path : `/${path}`;
  const query = qs.toString();
  return query ? `${base}?${query}` : base;
}

/**
 * Metadata for public routing entry URLs (internal share + vendor start).
 * Uses the link URL as the title so Teams/Slack previews show the URL, not marketing copy.
 */
export function routingGatewayMetadata(pathWithOptionalQuery: string, siteBase?: string): Metadata {
  const absolute = buildSiteUrl(pathWithOptionalQuery, siteBase);
  const display = absolute || pathWithOptionalQuery;

  return {
    title: display,
    description: display,
    openGraph: {
      title: display,
      description: display,
      url: absolute || undefined,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: display,
      description: display,
    },
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
  };
}
