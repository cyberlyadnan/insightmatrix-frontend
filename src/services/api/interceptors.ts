import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { env } from "@/config";
import { COOKIE_KEYS } from "@/constants";
import { getCookie } from "@/utils/cookies";

/** Single-flight refresh placeholder — wire to `/auth/refresh` when backend is ready */
let refreshFlow: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshFlow) {
    refreshFlow = (async () => {
      try {
        // await apiClient.post('/auth/refresh', ...) — avoid importing apiClient here (cycle).
        return null;
      } finally {
        refreshFlow = null;
      }
    })();
  }
  return refreshFlow;
}

function attachAuthHeader(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  if (typeof window === "undefined") return config;
  const token = getCookie(COOKIE_KEYS.accessToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

export function attachInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use(
    (config) => attachAuthHeader(config),
    (error: AxiosError) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (env.authDisabled) {
        return Promise.reject(error);
      }

      if (error.response?.status !== 401 || originalRequest._retry || !originalRequest) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      const nextToken = await refreshAccessToken();
      if (nextToken) {
        originalRequest.headers.Authorization = `Bearer ${nextToken}`;
        return instance(originalRequest);
      }

      if (typeof window !== "undefined") {
        const onAuthRoute = window.location.pathname.startsWith("/login");
        if (!onAuthRoute) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
      }

      return Promise.reject(error);
    }
  );
}
