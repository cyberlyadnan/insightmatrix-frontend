import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { env } from "@/config";
import { isAuthProbeRequest } from "./auth-request-config";
import { clearServerAuthCookies, refreshSession } from "./refresh-session";
import { clearAuthCookies } from "@/utils/cookies";

let lastRefreshSuccessTime = 0;
let isRedirectingToLogin = false;

function shouldSkipRefresh(config?: InternalAxiosRequestConfig) {
  const url = config?.url ?? "";
  return (
    url.includes("/auth/refresh-token") ||
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/logout")
  );
}

export function attachInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const { data, method } = config;
    const m = (method || "get").toLowerCase();

    if (typeof FormData !== "undefined" && data instanceof FormData) {
      config.headers.delete("Content-Type");
      return config;
    }

    if (
      data != null &&
      m !== "get" &&
      m !== "head" &&
      typeof data === "object" &&
      !(typeof URLSearchParams !== "undefined" && data instanceof URLSearchParams) &&
      !(typeof Blob !== "undefined" && data instanceof Blob)
    ) {
      config.headers.set("Content-Type", "application/json");
    }

    return config;
  });

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (env.authDisabled) {
        return Promise.reject(error);
      }

      if (
        error.response?.status !== 401 ||
        originalRequest?._retry ||
        !originalRequest ||
        shouldSkipRefresh(originalRequest)
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // Reuse a very recent successful refresh (parallel 401 storm after one rotation)
      let ok = Date.now() - lastRefreshSuccessTime < 3000;
      if (!ok) {
        ok = await refreshSession();
        if (ok) lastRefreshSuccessTime = Date.now();
      }

      if (ok) {
        return instance(originalRequest);
      }

      const isProbe = isAuthProbeRequest(originalRequest);

      // Diagnostic / probe requests must not nuke an otherwise-valid admin session.
      // Show the page error instead of hard-logging the user out.
      if (isProbe) {
        return Promise.reject(error);
      }

      clearAuthCookies();
      void clearServerAuthCookies();
      try {
        const { useAuthStore } = await import("@/store/authStore");
        useAuthStore.getState().clearSession();
      } catch {
        // Ignore store import error
      }

      if (typeof window !== "undefined" && !isRedirectingToLogin) {
        const path = window.location.pathname;
        const onAuthRoute =
          path.startsWith("/login") ||
          path.startsWith("/register") ||
          path.startsWith("/forgot-password") ||
          path.startsWith("/reset-password") ||
          path.startsWith("/verify-email");
        const onVendorRoute = path.startsWith("/vendor");
        if (!onAuthRoute && !onVendorRoute) {
          isRedirectingToLogin = true;
          const target = `/login?redirect=${encodeURIComponent(path)}`;
          window.location.href = target;
          setTimeout(() => {
            isRedirectingToLogin = false;
          }, 3000);
        }
      }

      return Promise.reject(error);
    }
  );
}
