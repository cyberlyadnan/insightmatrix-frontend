import { env } from "@/config";
import { ROUTES } from "@/constants/routes";
import type { SurveyCallbackSlug } from "@/constants/survey-callback";

/** Strip trailing slashes from an origin or base URL. */
export function normalizeSiteUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

/** Value from `NEXT_PUBLIC_APP_URL` (set in production for stable partner-facing links). */
export function getConfiguredSiteUrl(): string {
  return env.publicSiteUrl;
}

/** Current browser origin — empty during SSR. */
export function getBrowserOrigin(): string {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

/**
 * Best public site root for links copied in admin (callbacks, docs).
 * Prefers env; falls back to the page origin in the browser.
 */
export function resolvePublicSiteUrl(): string {
  const configured = getConfiguredSiteUrl();
  if (configured) return configured;
  return getBrowserOrigin();
}

/** Absolute URL on the public site (path must start with `/`). */
export function buildSiteUrl(path: string, siteBase?: string): string {
  const base = normalizeSiteUrl(siteBase ?? resolvePublicSiteUrl());
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!base) return normalizedPath;
  return `${base}${normalizedPath}`;
}

/** Supplier redirect landing page (complete, quota-full, terminate, quality). */
export function buildSurveyCallbackUrl(
  slug: SurveyCallbackSlug,
  query?: Record<string, string | undefined>
): string {
  const path = ROUTES.surveyCallback(slug);
  const base = resolvePublicSiteUrl();
  if (!base) {
    const qs = query
      ? `?${new URLSearchParams(
          Object.fromEntries(
            Object.entries(query).filter(([, v]) => v != null && v !== "") as [string, string][]
          )
        ).toString()}`
      : "";
    return `${path}${qs}`;
  }
  const url = new URL(buildSiteUrl(path, base));
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value != null && value !== "") url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

/**
 * Public API endpoint (browser or copy). Uses `NEXT_PUBLIC_API_URL` when absolute,
 * otherwise `${site origin}${api path}`.
 */
export function buildPublicApiUrl(apiPath: string): string {
  const path = apiPath.startsWith("/") ? apiPath : `/${apiPath}`;
  const apiBase = env.apiUrl.replace(/\/$/, "");

  if (apiBase.startsWith("http://") || apiBase.startsWith("https://")) {
    return `${apiBase}${path}`;
  }

  const site = resolvePublicSiteUrl();
  if (site) return `${site}${apiBase}${path}`;

  if (typeof window !== "undefined") {
    return `${window.location.origin}${apiBase}${path}`;
  }

  return `${apiBase}${path}`;
}

/** Whether production should set `NEXT_PUBLIC_APP_URL` (warn in admin UI). */
export function shouldWarnMissingPublicSiteUrl(): boolean {
  return env.isProd && !getConfiguredSiteUrl();
}
