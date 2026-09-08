import type { QueryClient } from "@tanstack/react-query";

import { fetchProfile } from "@/services/auth";
import { queryKeys } from "@/services/queries";
import type { AuthUser } from "@/types";

/**
 * Finish member login/register: confirm cookie-backed session, hydrate client
 * state, then hard-navigate so middleware/gates see a real session.
 *
 * Without the profile confirm step, a misconfigured API proxy can set cookies
 * for the wrong domain — login looks successful, then the dashboard 401-bounces
 * back to /login.
 */
export async function completeMemberLogin(
  qc: QueryClient,
  setUser: (user: AuthUser | null) => void,
  user: AuthUser,
  destination: string
): Promise<void> {
  setUser(user);
  qc.setQueryData(queryKeys.auth.profile, user);

  const profile = await fetchProfile();
  setUser(profile);
  qc.setQueryData(queryKeys.auth.profile, profile);

  window.location.replace(destination);
}
