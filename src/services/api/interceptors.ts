import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { env } from "@/config";
import { isAuthProbeRequest } from "./auth-request-config";
import { refreshSession } from "./refresh-session";

let refreshFlow: Promise<boolean> | null = null;

async function refreshOnce(): Promise<boolean> {
  if (!refreshFlow) {
    refreshFlow = refreshSession().finally(() => {
      refreshFlow = null;
    });
  }
  return refreshFlow;
}

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
        originalRequest._retry ||
        !originalRequest ||
        shouldSkipRefresh(originalRequest)
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      const ok = await refreshOnce();
      if (ok) {
        return instance(originalRequest);
      }

      if (typeof window !== "undefined" && !isAuthProbeRequest(originalRequest)) {
        const path = window.location.pathname;
        const onAuthRoute =
          path.startsWith("/login") ||
          path.startsWith("/register") ||
          path.startsWith("/forgot-password") ||
          path.startsWith("/reset-password") ||
          path.startsWith("/verify-email");
        const onVendorRoute = path.startsWith("/vendor");
        if (!onAuthRoute && !onVendorRoute) {
          window.location.href = `/login?redirect=${encodeURIComponent(path)}`;
        }
      }

      return Promise.reject(error);
    }
  );
}
