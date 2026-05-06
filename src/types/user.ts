export type UserRole = "panelist" | "researcher" | "admin" | "super_admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}
