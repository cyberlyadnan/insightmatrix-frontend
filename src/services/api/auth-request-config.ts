import type { InternalAxiosRequestConfig } from "axios";

/** Axios config flag for profile/me probes that must not trigger login redirects on 401. */
export type AuthAxiosRequestConfig = InternalAxiosRequestConfig & {
  skipAuthRedirect?: boolean;
};

export function isAuthProbeRequest(config: InternalAxiosRequestConfig): boolean {
  return Boolean((config as AuthAxiosRequestConfig).skipAuthRedirect);
}
