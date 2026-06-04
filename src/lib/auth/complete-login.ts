import type { QueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/services/queries";
import type { AuthUser } from "@/types";

/**
 * Finish member login/register: hydrate client state, then hard-navigate so
 * cookies and middleware see the new session without router/auth races.
 */
export function completeMemberLogin(
  qc: QueryClient,
  setUser: (user: AuthUser | null) => void,
  user: AuthUser,
  destination: string
): void {
  setUser(user);
  qc.setQueryData(queryKeys.auth.profile, user);
  void qc.invalidateQueries({ queryKey: queryKeys.auth.profile });
  window.location.replace(destination);
}
