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
  /** True when a published “required for panel” prescreen exists and this member has not completed it */
  needsPanelPrescreen?: boolean;
  /** True when no required panel prescreen is configured (admins should seed/publish one) */
  panelPrescreenNotConfigured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
