import { ROUTES } from "@/constants/routes";
import type { AuthUser } from "@/types";

/** Blocks open redirects (`//evil.com`, protocol-relative URLs, etc.) */
export function sanitizeRedirectPath(raw: string | null | undefined): string | null {
  if (!raw || typeof raw !== "string") return null;
  const t = raw.trim();
  if (!t.startsWith("/") || t.startsWith("//")) return null;
  if (t.includes(":")) return null;
  return t;
}

/**
 * After login/register: honor safe `redirect` when it matches the user’s role.
 * Admins never land on `/dashboard`; members never land on `/admin` via redirect tricks.
 */
export function getPostLoginDestination(
  user: AuthUser,
  redirectParam: string | null | undefined
): string {
  const safe = sanitizeRedirectPath(redirectParam);

  if (user.role === "admin") {
    if (safe?.startsWith(ROUTES.admin.root)) return safe;
    return ROUTES.admin.root;
  }

  if (safe?.startsWith(ROUTES.admin.root)) {
    return ROUTES.dashboard.root;
  }

  if (safe && safe !== ROUTES.login && safe !== ROUTES.register) {
    return safe;
  }

  return ROUTES.dashboard.root;
}
