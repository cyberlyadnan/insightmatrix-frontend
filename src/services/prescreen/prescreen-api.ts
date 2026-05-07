import { apiClient } from "@/services/api";
import type { PrescreenCategory, PrescreenForm, PrescreenQuestion } from "@/types/prescreen";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type PrescreenListQuery = {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
  category?: string;
};

export async function listPrescreens(query: PrescreenListQuery = {}) {
  const { data } = await apiClient.get<ApiEnvelope<PrescreenForm[]>>("/prescreens", {
    params: query,
  });
  return { items: data.data, meta: data.meta };
}

export async function getPrescreen(id: string): Promise<PrescreenForm> {
  const { data } = await apiClient.get<ApiEnvelope<PrescreenForm>>(`/prescreens/${id}`);
  return data.data;
}

export async function createPrescreen(payload: Partial<PrescreenForm>): Promise<PrescreenForm> {
  const { data } = await apiClient.post<ApiEnvelope<PrescreenForm>>("/prescreens", payload);
  return data.data;
}

export async function updatePrescreen(
  id: string,
  payload: Partial<PrescreenForm>
): Promise<PrescreenForm> {
  const { data } = await apiClient.patch<ApiEnvelope<PrescreenForm>>(`/prescreens/${id}`, payload);
  return data.data;
}

export async function deletePrescreen(id: string) {
  await apiClient.delete(`/prescreens/${id}`);
}

export async function publishPrescreen(id: string): Promise<PrescreenForm> {
  const { data } = await apiClient.patch<ApiEnvelope<PrescreenForm>>(`/prescreens/${id}/publish`);
  return data.data;
}

export async function unpublishPrescreen(id: string): Promise<PrescreenForm> {
  const { data } = await apiClient.patch<ApiEnvelope<PrescreenForm>>(`/prescreens/${id}/unpublish`);
  return data.data;
}

export async function duplicatePrescreen(id: string): Promise<PrescreenForm> {
  const { data } = await apiClient.post<ApiEnvelope<PrescreenForm>>(`/prescreens/${id}/duplicate`);
  return data.data;
}

export async function reorderPrescreenQuestions(id: string, questions: PrescreenQuestion[]) {
  const questionIds = [...questions].sort((a, b) => a.order - b.order).map((q) => q.id);
  const { data } = await apiClient.patch<ApiEnvelope<PrescreenForm>>(
    `/prescreens/${id}/reorder-questions`,
    {
      questionIds,
    }
  );
  return data.data;
}

export async function listPrescreenCategories(): Promise<PrescreenCategory[]> {
  const { data } = await apiClient.get<ApiEnvelope<PrescreenCategory[]>>("/prescreens/categories");
  return data.data;
}
