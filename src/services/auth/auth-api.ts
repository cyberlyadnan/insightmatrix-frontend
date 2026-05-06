import { apiClient } from "@/services/api";
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
  const { data } = await apiClient.get<ApiEnvelope<AuthUser>>("/users/profile");
  return data.data;
}

export async function fetchProfileOptional(): Promise<AuthUser | null> {
  try {
    return await fetchProfile();
  } catch {
    return null;
  }
}
