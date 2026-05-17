import { apiClient } from "@/services/api";
import type { VendorCallbackUrls } from "@/constants/vendor-callback";
import type { Vendor, VendorAnalyticsSummary, VendorStatus } from "@/types/vendor";

export type { VendorStatus };

export type VendorListMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: VendorListMeta;
};

export type CreateVendorPayload = {
  companyName: string;
  contactPerson?: string;
  email: string;
  password: string;
  phone?: string;
  website?: string;
  callbackUrls?: VendorCallbackUrls;
  allowedIps?: string[];
  allowedCountries?: string[];
  notes?: string;
  status?: VendorStatus;
};

export type UpdateVendorPayload = Partial<
  Omit<CreateVendorPayload, "email"> & { email?: string; status?: VendorStatus; password?: string }
>;

export async function listVendors(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: VendorStatus | "";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  const { data } = await apiClient.get<ApiEnvelope<Vendor[]>>("/vendors", {
    params: {
      ...params,
      status: params?.status === "" ? undefined : params?.status,
    },
  });
  return {
    items: data.data,
    meta: data.meta ?? {
      page: 1,
      pageSize: 20,
      total: data.data?.length ?? 0,
      totalPages: 1,
    },
  };
}

export async function getVendor(id: string): Promise<Vendor> {
  const { data } = await apiClient.get<ApiEnvelope<Vendor>>(`/vendors/${id}`);
  return data.data;
}

export async function getVendorAnalytics(id: string): Promise<VendorAnalyticsSummary> {
  const { data } = await apiClient.get<ApiEnvelope<VendorAnalyticsSummary>>(
    `/vendors/${id}/analytics`
  );
  return data.data;
}

export async function createVendor(payload: CreateVendorPayload): Promise<Vendor> {
  const { data } = await apiClient.post<ApiEnvelope<Vendor>>("/vendors", payload);
  return data.data;
}

export async function updateVendor(id: string, payload: UpdateVendorPayload): Promise<Vendor> {
  const { data } = await apiClient.patch<ApiEnvelope<Vendor>>(`/vendors/${id}`, payload);
  return data.data;
}

export async function patchVendorStatus(id: string, status: VendorStatus): Promise<Vendor> {
  const { data } = await apiClient.patch<ApiEnvelope<Vendor>>(`/vendors/${id}/status`, { status });
  return data.data;
}

export async function deleteVendor(id: string): Promise<void> {
  await apiClient.delete(`/vendors/${id}`);
}
