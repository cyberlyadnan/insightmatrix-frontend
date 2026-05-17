import axios, { isAxiosError } from "axios";
import { env } from "@/config";

const jsonHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;

async function clearVendorAuthCookies(): Promise<void> {
  try {
    await axios.post(
      `${env.apiUrl}/vendor-auth/logout`,
      {},
      { withCredentials: true, headers: { ...jsonHeaders } }
    );
  } catch {
    /* ignore */
  }
}

export async function refreshVendorSession(): Promise<boolean> {
  try {
    await axios.post(
      `${env.apiUrl}/vendor-auth/refresh-token`,
      {},
      { withCredentials: true, headers: { ...jsonHeaders } }
    );
    return true;
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 401) {
      await clearVendorAuthCookies();
    }
    return false;
  }
}
