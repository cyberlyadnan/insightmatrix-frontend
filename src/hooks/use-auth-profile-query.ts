import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { fetchProfile } from "@/services/auth";
import { queryKeys } from "@/services/queries";
import { useAuthStore } from "@/store/authStore";
import { clearAuthCookies } from "@/utils/cookies";
import type { AuthUser } from "@/types";

const AUTH_PROFILE_STALE_MS = 10 * 60 * 1000;

async function fetchAuthProfilePreservingSession(): Promise<AuthUser | null> {
  try {
    const profile = await fetchProfile();
    if (profile) {
      useAuthStore.getState().setUser(profile);
    }
    return profile;
  } catch (err) {
    // Only treat true auth failure as logout. 403 means "forbidden for this
    // resource", not "session is dead" — clearing here bounced admins to login.
    if (isAxiosError(err) && err.response?.status === 401) {
      useAuthStore.getState().clearSession();
      clearAuthCookies();
      return null;
    }
    const cached = useAuthStore.getState().user;
    return cached ?? null;
  }
}

type Options = Pick<UseQueryOptions<AuthUser | null>, "enabled">;

/**
 * Shared profile query — keeps last known user on transient failures (tab switch, token refresh).
 */
export function useAuthProfileQuery(options?: Options) {
  const storeUser = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: fetchAuthProfilePreservingSession,
    enabled: options?.enabled ?? true,
    initialData: () => storeUser ?? undefined,
    staleTime: AUTH_PROFILE_STALE_MS,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
    placeholderData: (previous) => previous ?? storeUser ?? undefined,
  });
}
