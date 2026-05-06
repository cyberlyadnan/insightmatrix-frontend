import type { UserRole } from "@/types";

const ADMIN_ROLES: UserRole[] = ["admin", "super_admin"];

/** Extend when RBAC matrix arrives from the backend */
export function canAccessAdminRoute(role: UserRole | undefined | null): boolean {
  if (!role) return false;
  return ADMIN_ROLES.includes(role);
}

export function canAccessPanelRoute(role: UserRole | undefined | null): boolean {
  if (!role) return true;
  return true;
}
