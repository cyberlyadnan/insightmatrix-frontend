import type { UserRole } from "@/types";

const ADMIN_ROLES: UserRole[] = ["admin"];

/** Extend when RBAC matrix arrives from the backend */
export function canAccessAdminRoute(role: UserRole | undefined | null): boolean {
  if (!role) return false;
  return ADMIN_ROLES.includes(role);
}

/** Member `/dashboard` — admins use `/admin` only */
export function canAccessMemberDashboard(role: UserRole | undefined | null): boolean {
  if (!role) return false;
  return !ADMIN_ROLES.includes(role);
}

export function canAccessPanelRoute(role: UserRole | undefined | null): boolean {
  if (!role) return true;
  return true;
}
