import { apiClient } from "@/services/api";
import type {
  VendorAllocationAnalytics,
  VendorAllocationListMeta,
  VendorSurveyAllocation,
} from "@/types/vendor-allocation";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: VendorAllocationListMeta;
};

export type CreateVendorAllocationPayload = {
  panelSurveyId: string;
  vendorId: string;
  allocatedQuota: number;
  vendorCpi?: number;
  clientCpi?: number;
  startDate?: string | null;
  endDate?: string | null;
  notes?: string;
};

export async function listVendorAllocations(params?: {
  page?: number;
  pageSize?: number;
  panelSurveyId?: string;
  vendorId?: string;
  status?: string;
  search?: string;
}) {
  const { data } = await apiClient.get<ApiEnvelope<VendorSurveyAllocation[]>>(
    "/vendor-allocations",
    {
      params,
    }
  );
  return { items: data.data, meta: data.meta };
}

export async function listPanelSurveyVendorAllocations(
  surveyId: string,
  params?: { page?: number; pageSize?: number }
) {
  const { data } = await apiClient.get<ApiEnvelope<VendorSurveyAllocation[]>>(
    `/panel-surveys/${surveyId}/vendor-allocations`,
    { params }
  );
  return { items: data.data, meta: data.meta };
}

export async function createVendorAllocation(payload: CreateVendorAllocationPayload) {
  const { data } = await apiClient.post<ApiEnvelope<VendorSurveyAllocation>>(
    "/vendor-allocations",
    payload
  );
  return data.data;
}

export async function updateVendorAllocation(
  id: string,
  payload: Partial<CreateVendorAllocationPayload>
) {
  const { data } = await apiClient.patch<ApiEnvelope<VendorSurveyAllocation>>(
    `/vendor-allocations/${id}`,
    payload
  );
  return data.data;
}

export async function pauseVendorAllocation(id: string) {
  const { data } = await apiClient.post<ApiEnvelope<VendorSurveyAllocation>>(
    `/vendor-allocations/${id}/pause`
  );
  return data.data;
}

export async function resumeVendorAllocation(id: string) {
  const { data } = await apiClient.post<ApiEnvelope<VendorSurveyAllocation>>(
    `/vendor-allocations/${id}/resume`
  );
  return data.data;
}

export async function closeVendorAllocation(id: string) {
  const { data } = await apiClient.post<ApiEnvelope<VendorSurveyAllocation>>(
    `/vendor-allocations/${id}/close`
  );
  return data.data;
}

export async function deleteVendorAllocation(id: string) {
  await apiClient.delete(`/vendor-allocations/${id}`);
}

export async function getVendorAllocationAnalytics(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<VendorAllocationAnalytics>>(
    `/vendor-allocations/${id}/analytics`
  );
  return data.data;
}
