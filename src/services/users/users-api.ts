import { apiClient } from "@/services/api";
import type { AuthUser, UserRole } from "@/types/user";

export type UserListMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: UserListMeta;
};

export type AdminUserListItem = AuthUser & {
  panelPrescreenCompletedAt?: string | null;
  panelPrescreenFormId?: string | null;
};

export type AdminPrescreenAnswerRow = {
  questionId: string;
  title: string;
  type: string;
  value: unknown;
  displayValue: string;
};

export type AdminUserDetail = AdminUserListItem & {
  needsPanelPrescreen?: boolean;
  panelPrescreenNotConfigured?: boolean;
  panelCompletedSurveys?: number;
  panelPrescreen: {
    formId: string | null;
    formTitle: string | null;
    needsCompletion: boolean;
    notConfigured: boolean;
    completedAt: string | null;
    answers: AdminPrescreenAnswerRow[];
    rawAnswers: Record<string, unknown> | null;
  };
  surveyHistory: {
    items: Array<{
      id: string;
      surveyName: string;
      surveyCode: string;
      outcome: string;
      outcomeLabel: string;
      pointsAwarded: number;
      startedAt: string | null;
      resolvedAt: string | null;
      providerName: string | null;
    }>;
    summary: {
      totalAttempts: number;
      completed: number;
      inProgress: number;
      notQualified: number;
      pointsFromSurveys: number;
    };
  };
};

export type ListUsersParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  role?: UserRole | "";
  verified?: "" | "true" | "false";
  prescreen?: "" | "complete" | "incomplete";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export async function listUsers(params?: ListUsersParams) {
  const { data } = await apiClient.get<ApiEnvelope<AdminUserListItem[]>>("/users", {
    params: {
      ...params,
      status: params?.status || undefined,
      role: params?.role || undefined,
      verified: params?.verified || undefined,
      prescreen: params?.prescreen || undefined,
    },
  });
  return {
    items: data.data ?? [],
    meta: data.meta ?? {
      page: 1,
      pageSize: 25,
      total: data.data?.length ?? 0,
      totalPages: 1,
    },
  };
}

export async function getUser(id: string): Promise<AdminUserDetail> {
  const { data } = await apiClient.get<ApiEnvelope<AdminUserDetail>>(`/users/${id}`);
  return data.data;
}

export async function updateUser(
  id: string,
  payload: { fullName?: string; role?: UserRole; status?: string }
): Promise<AuthUser> {
  const { data } = await apiClient.patch<ApiEnvelope<AuthUser>>(`/users/${id}`, payload);
  return data.data;
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}
