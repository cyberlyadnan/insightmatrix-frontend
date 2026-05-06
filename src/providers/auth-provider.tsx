"use client";

import { useEffect, type ReactNode } from "react";
import { COOKIE_KEYS } from "@/constants";
import { useAuthStore } from "@/store/authStore";
import { getCookie } from "@/utils/cookies";

/**
 * Hydrates client-side tokens into Zustand from readable cookies.
 * Swap for secure session hydration via `/api/auth/session` once SSR login flows ship.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const access = getCookie(COOKIE_KEYS.accessToken);
    const refresh = getCookie(COOKIE_KEYS.refreshToken);
    const patch: Partial<{ accessToken: string; refreshToken: string }> = {};
    if (access) patch.accessToken = access;
    if (refresh) patch.refreshToken = refresh;
    if (Object.keys(patch).length > 0) {
      useAuthStore.getState().setSession(patch);
    }
  }, []);

  return children;
}
