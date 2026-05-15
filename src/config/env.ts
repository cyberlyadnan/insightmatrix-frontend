/**
 * Typed accessors for public env vars used by the browser bundle.
 * Server-only secrets belong in server modules without NEXT_PUBLIC_.
 *
 * Production checklist:
 * - NEXT_PUBLIC_APP_URL — public site (callback redirect URLs, admin copy links)
 * - BACKEND_URL — server-only; Next.js rewrite target (see next.config.ts)
 * - NEXT_PUBLIC_API_URL — usually `/api/v1` when API is proxied on the same domain
 */
export const env = {
  /** Public website origin, no trailing slash (e.g. https://app.insightmatrix.com). */
  publicSiteUrl: (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/+$/, ""),
  /** Proxied API base path or absolute API origin (see next.config rewrites). */
  apiUrl: (process.env.NEXT_PUBLIC_API_URL ?? "/api/v1").replace(/\/+$/, ""),
  enableRouteGuard: process.env.NEXT_PUBLIC_ENABLE_ROUTE_GUARD === "true",
  authDisabled: process.env.NEXT_PUBLIC_AUTH_DISABLED === "true",
  nodeEnv: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
} as const;
