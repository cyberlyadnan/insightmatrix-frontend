export type UserRole = "admin" | "user" | "survey_manager";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  avatar: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}
