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
