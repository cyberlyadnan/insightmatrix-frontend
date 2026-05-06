import axios, { isAxiosError } from "axios";
import { env } from "@/config";

const jsonHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;

/** Clears orphaned httpOnly cookies (e.g. expired access + missing refresh) — skip interceptor */
async function clearServerAuthCookies(): Promise<void> {
  try {
    await axios.post(
      `${env.apiUrl}/auth/logout`,
      {},
      { withCredentials: true, headers: { ...jsonHeaders } }
    );
  } catch {
    /* ignore */
  }
}

/** Avoid importing `apiClient` here (interceptor cycle). Same-origin cookies via rewrite. */
export async function refreshSession(): Promise<boolean> {
  try {
    await axios.post(
      `${env.apiUrl}/auth/refresh-token`,
      {},
      { withCredentials: true, headers: { ...jsonHeaders } }
    );
    return true;
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 401) {
      await clearServerAuthCookies();
    }
    return false;
  }
}
