import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { env } from "@/config";
import { ROUTES } from "@/constants/routes";
import { isAuthProbeRequest } from "./auth-request-config";
import { refreshVendorSession } from "./vendor-refresh-session";

let isRefreshingVendor = false;
let vendorRefreshSubscribers: Array<(ok: boolean) => void> = [];
let lastVendorRefreshSuccessTime = 0;

function subscribeVendorTokenRefresh(cb: (ok: boolean) => void) {
  vendorRefreshSubscribers.push(cb);
}

function onVendorRefreshed(ok: boolean) {
  vendorRefreshSubscribers.forEach((cb) => cb(ok));
  vendorRefreshSubscribers = [];
}

async function handleVendorRefreshSession(): Promise<boolean> {
  if (isRefreshingVendor) {
    return new Promise((resolve) => {
      subscribeVendorTokenRefresh(resolve);
    });
  }

  if (Date.now() - lastVendorRefreshSuccessTime < 3000) {
    return true;
  }

  isRefreshingVendor = true;
  try {
    const ok = await refreshVendorSession();
    if (ok) {
      lastVendorRefreshSuccessTime = Date.now();
    }
    onVendorRefreshed(ok);
    return ok;
  } catch {
    onVendorRefreshed(false);
    return false;
  } finally {
    isRefreshingVendor = false;
  }
}

function shouldSkipRefresh(config?: InternalAxiosRequestConfig) {
  const url = config?.url ?? "";
  return (
    url.includes("/vendor-auth/refresh-token") ||
    url.includes("/vendor-auth/login") ||
    url.includes("/vendor-auth/logout")
  );
}

export function attachVendorInterceptors(instance: AxiosInstance) {
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
      const ok = await handleVendorRefreshSession();
      if (ok) {
        return instance(originalRequest);
      }

      if (typeof window !== "undefined" && !isAuthProbeRequest(originalRequest)) {
        const path = window.location.pathname;
        const onVendorAuth = path.startsWith(ROUTES.vendor.login);
        if (!onVendorAuth && path.startsWith("/vendor")) {
          window.location.href = `${ROUTES.vendor.login}?redirect=${encodeURIComponent(path)}`;
        }
      }

      return Promise.reject(error);
    }
  );
}
