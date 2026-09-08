"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { isVendorRoute } from "@/constants/routes";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthProfileQuery } from "@/hooks/use-auth-profile-query";
import { useAuthStore } from "@/store/authStore";

import { refreshSession } from "@/services/api/refresh-session";

/** Hydrates Zustand user from `/users/profile` using session cookies and maintains session heartbeat */
export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const skipMemberHydration = isVendorRoute(pathname);

  const {
    data: profile,
    isFetched,
    isFetching,
  } = useAuthProfileQuery({
    enabled: hydrated && !skipMemberHydration,
  });

  useEffect(() => {
    if (skipMemberHydration || !hydrated || isFetching || !isFetched) return;
    // Only sync when we have a confirmed profile. Clearing on null races with
    // login hard-nav and is already handled by the profile query on 401/403.
    if (profile) {
      setUser(profile);
    }
  }, [profile, isFetched, isFetching, setUser, skipMemberHydration, hydrated]);

  // Proactive token refresh heartbeat every 10 minutes when logged in
  useEffect(() => {
    if (skipMemberHydration || !user) return;

    const interval = setInterval(
      () => {
        if (document.visibilityState === "visible") {
          void refreshSession();
        }
      },
      10 * 60 * 1000
    );

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refreshSession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user, skipMemberHydration]);

  return children;
}
