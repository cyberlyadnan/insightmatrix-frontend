import axios, { isAxiosError } from "axios";
import { env } from "@/config";

const jsonHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;

/**
 * Single-flight refresh lock.
 * Refresh tokens rotate on use — parallel refresh calls revoke each other and
 * previously wiped healthy sessions (seen when opening Admin → Email Delivery
 * after the access token expired).
 */
let refreshInFlight: Promise<boolean> | null = null;

/** Avoid importing `apiClient` here (interceptor cycle). Same-origin cookies via rewrite. */
export async function refreshSession(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        await axios.post(
          `${env.apiUrl}/auth/refresh-token`,
          {},
          { withCredentials: true, headers: { ...jsonHeaders } }
        );
        return true;
      } catch {
        // Do NOT clear cookies here. Callers decide if the session is dead.
        return false;
      }
    })().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}

/** Explicit logout cookie clear — only when ending a confirmed-dead session */
export async function clearServerAuthCookies(): Promise<void> {
  try {
    await axios.post(
      `${env.apiUrl}/auth/logout`,
      {},
      { withCredentials: true, headers: { ...jsonHeaders } }
    );
  } catch (e) {
    if (!isAxiosError(e)) return;
  }
}
