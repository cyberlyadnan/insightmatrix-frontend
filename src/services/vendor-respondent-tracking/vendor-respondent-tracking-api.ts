import { apiClient } from "@/services/api";
import type {
  VendorRespondentTracking,
  VendorRespondentTrackingListMeta,
} from "@/types/vendor-respondent-tracking";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: VendorRespondentTrackingListMeta;
};

export async function listVendorRespondentSessions(params?: {
  page?: number;
  pageSize?: number;
  vendorId?: string;
  panelSurveyId?: string;
  allocationId?: string;
  status?: string;
  callbackForwarded?: "true" | "false";
  search?: string;
  supplierProjectPid?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  const { data } = await apiClient.get<ApiEnvelope<VendorRespondentTracking[]>>(
    "/vendor-respondent-sessions",
    { params }
  );
  return { items: data.data, meta: data.meta };
}

export async function getVendorRespondentSession(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<VendorRespondentTracking>>(
    `/vendor-respondent-sessions/${id}`
  );
  return data.data;
}
