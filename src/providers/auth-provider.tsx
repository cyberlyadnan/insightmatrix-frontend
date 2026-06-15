"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { isVendorRoute } from "@/constants/routes";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthProfileQuery } from "@/hooks/use-auth-profile-query";
import { useAuthStore } from "@/store/authStore";

/** Hydrates Zustand user from `/users/profile` using session cookies */
export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hydrated = useAuthHydrated();
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
    if (profile) setUser(profile);
  }, [profile, isFetched, isFetching, setUser, skipMemberHydration, hydrated]);

  return children;
}
