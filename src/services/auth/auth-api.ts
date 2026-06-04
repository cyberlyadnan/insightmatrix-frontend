import { apiClient } from "@/services/api";
import type { AuthAxiosRequestConfig } from "@/services/api/auth-request-config";
import type { AuthUser } from "@/types";

export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export async function loginRequest(payload: { email: string; password: string }) {
  const { data } = await apiClient.post<ApiEnvelope<{ user: AuthUser }>>("/auth/login", payload);
  return data.data.user;
}

export async function registerRequest(payload: {
  fullName: string;
  email: string;
  password: string;
}) {
  const { data } = await apiClient.post<ApiEnvelope<{ user: AuthUser }>>("/auth/register", payload);
  return data.data.user;
}

export async function logoutRequest() {
  await apiClient.post("/auth/logout", {});
}

export async function forgotPasswordRequest(email: string) {
  await apiClient.post("/auth/forgot-password", { email });
}

export async function resetPasswordRequest(payload: { token: string; password: string }) {
  await apiClient.post("/auth/reset-password", payload);
}

export async function resendVerificationRequest(email: string) {
  await apiClient.post("/auth/resend-verification", { email });
}

export async function fetchProfile(): Promise<AuthUser> {
  const { data } = await apiClient.get<ApiEnvelope<AuthUser>>("/users/profile", {
    skipAuthRedirect: true,
  } as AuthAxiosRequestConfig);
  return data.data;
}

export async function fetchProfileOptional(): Promise<AuthUser | null> {
  try {
    return await fetchProfile();
  } catch {
    return null;
  }
}

export async function updateProfileRequest(payload: {
  fullName?: string;
  email?: string;
  avatar?: string | null;
}): Promise<AuthUser> {
  const { data } = await apiClient.patch<ApiEnvelope<AuthUser>>("/users/profile", payload);
  return data.data;
}

export async function uploadAvatarRequest(file: File): Promise<AuthUser> {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await apiClient.post<ApiEnvelope<AuthUser>>("/users/profile/avatar", formData);
  return data.data;
}

export async function changePasswordRequest(payload: {
  currentPassword: string;
  newPassword: string;
}) {
  await apiClient.post("/users/profile/change-password", payload);
}

export async function requestAccountDeletion(payload: { reason?: string }): Promise<AuthUser> {
  const { data } = await apiClient.post<ApiEnvelope<AuthUser>>(
    "/users/profile/deletion-request",
    payload
  );
  return data.data;
}

export async function cancelAccountDeletionRequest(): Promise<AuthUser> {
  const { data } = await apiClient.delete<ApiEnvelope<AuthUser>>("/users/profile/deletion-request");
  return data.data;
}

export async function listDeletionRequests(): Promise<AuthUser[]> {
  const { data } = await apiClient.get<ApiEnvelope<AuthUser[]>>("/users/deletion-requests");
  return data.data;
}

export async function approveDeletionRequest(userId: string): Promise<AuthUser> {
  const { data } = await apiClient.patch<ApiEnvelope<AuthUser>>(
    `/users/${userId}/approve-deletion`
  );
  return data.data;
}
