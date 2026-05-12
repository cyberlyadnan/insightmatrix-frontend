/**
 * Typed accessors for public env vars used by the browser bundle.
 * Server-only secrets belong in server modules without NEXT_PUBLIC_.
 */
export const env = {
  /** Site root for display/copy (e.g. https://survey.enevna.in). Falls back to current origin in browser. */
  publicSiteUrl: (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, ""),
  /** Proxied API base path (see next.config rewrites) */
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "/api/v1",
  enableRouteGuard: process.env.NEXT_PUBLIC_ENABLE_ROUTE_GUARD === "true",
  authDisabled: process.env.NEXT_PUBLIC_AUTH_DISABLED === "true",
  nodeEnv: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
} as const;
