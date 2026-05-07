export type UserRole = "admin" | "user" | "survey_manager";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  avatar: string | null;
  status: string;
  isActive?: boolean;
  deletionRequested?: boolean;
  deletionRequestedAt?: string | null;
  deletionRequestReason?: string | null;
  deactivatedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
