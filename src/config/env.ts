/**
 * Typed accessors for public env vars used by the browser bundle.
 * Server-only secrets belong in server modules without NEXT_PUBLIC_.
 */
export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  /** When false (default), middleware does not redirect unauthenticated users */
  enableRouteGuard: process.env.NEXT_PUBLIC_ENABLE_ROUTE_GUARD === "true",
  /** Useful until backend auth exists — disables bearer injection expectations */
  authDisabled: process.env.NEXT_PUBLIC_AUTH_DISABLED === "true",
  nodeEnv: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
} as const;
