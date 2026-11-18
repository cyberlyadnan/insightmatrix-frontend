import { vendorApiClient } from "@/services/api/vendor-client";
import type {
  VendorAllocationAnalytics,
  VendorAllocationListMeta,
  VendorPortalAllocation,
} from "@/types/vendor-allocation";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: VendorAllocationListMeta;
};

export async function listVendorPortalSurveys(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  vendorResponseStatus?: string;
}) {
  const { data } = await vendorApiClient.get<ApiEnvelope<VendorPortalAllocation[]>>(
    "/vendor-portal/surveys",
    { params }
  );
  return { items: data.data, meta: data.meta };
}

export async function getVendorPortalSurvey(allocationId: string) {
  const { data } = await vendorApiClient.get<
    ApiEnvelope<{ allocation: VendorPortalAllocation; analytics: VendorAllocationAnalytics }>
  >(`/vendor-portal/surveys/${allocationId}`);
  return data.data;
}

export async function acceptVendorPortalSurvey(allocationId: string) {
  const { data } = await vendorApiClient.post<ApiEnvelope<VendorPortalAllocation>>(
    `/vendor-portal/surveys/${allocationId}/accept`
  );
  return data.data;
}

export async function rejectVendorPortalSurvey(allocationId: string) {
  const { data } = await vendorApiClient.post<ApiEnvelope<VendorPortalAllocation>>(
    `/vendor-portal/surveys/${allocationId}/reject`
  );
  return data.data;
}
