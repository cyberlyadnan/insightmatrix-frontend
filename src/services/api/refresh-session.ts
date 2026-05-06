import axios from "axios";
import { env } from "@/config";

/** Avoid importing `apiClient` here (interceptor cycle). Same-origin cookies via rewrite. */
export async function refreshSession(): Promise<boolean> {
  try {
    await axios.post(
      `${env.apiUrl}/auth/refresh-token`,
      {},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      }
    );
    return true;
  } catch {
    return false;
  }
}
