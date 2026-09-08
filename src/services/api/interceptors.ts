import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { env } from "@/config";
import { isAuthProbeRequest } from "./auth-request-config";
import { refreshSession } from "./refresh-session";

let isRefreshing = false;
let refreshSubscribers: Array<(ok: boolean) => void> = [];
let lastRefreshSuccessTime = 0;

function subscribeTokenRefresh(cb: (ok: boolean) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(ok: boolean) {
  refreshSubscribers.forEach((cb) => cb(ok));
  refreshSubscribers = [];
}

async function handleRefreshSession(): Promise<boolean> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh(resolve);
    });
  }

  // If a refresh succeeded very recently (< 3 seconds), reuse the success
  if (Date.now() - lastRefreshSuccessTime < 3000) {
    return true;
  }

  isRefreshing = true;
  try {
    const ok = await refreshSession();
    if (ok) {
      lastRefreshSuccessTime = Date.now();
    }
    onRefreshed(ok);
    return ok;
  } catch {
    onRefreshed(false);
    return false;
  } finally {
    isRefreshing = false;
  }
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
        originalRequest?._retry ||
        !originalRequest ||
        shouldSkipRefresh(originalRequest)
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      const ok = await handleRefreshSession();
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
