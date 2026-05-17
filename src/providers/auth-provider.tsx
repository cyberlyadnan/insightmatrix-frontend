"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { env } from "@/config";
import { isVendorRoute } from "@/constants/routes";
import { fetchProfileOptional } from "@/services/auth";
import { queryKeys } from "@/services/queries";
import { useAuthStore } from "@/store/authStore";

/** Hydrates Zustand user from `/users/profile` using session cookies */
export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const setUser = useAuthStore((s) => s.setUser);
  const clearSession = useAuthStore((s) => s.clearSession);
  const skipMemberHydration = isVendorRoute(pathname);

  const { data: profile, isFetched } = useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: fetchProfileOptional,
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: env.isProd,
    enabled: !skipMemberHydration,
  });

  useEffect(() => {
    if (skipMemberHydration || !isFetched) return;
    if (profile) setUser(profile);
    else clearSession();
  }, [profile, isFetched, setUser, clearSession, skipMemberHydration]);

  return children;
}
