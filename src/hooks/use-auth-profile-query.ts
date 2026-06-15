import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { fetchProfile } from "@/services/auth";
import { queryKeys } from "@/services/queries";
import { useAuthStore } from "@/store/authStore";
import type { AuthUser } from "@/types";

const AUTH_PROFILE_STALE_MS = 10 * 60 * 1000;

async function fetchAuthProfilePreservingSession(): Promise<AuthUser | null> {
  try {
    return await fetchProfile();
  } catch {
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
