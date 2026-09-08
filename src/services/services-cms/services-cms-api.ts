import { apiClient } from "@/services/api";
import type { ServiceRecord } from "@/constants/service-types";

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

export type ServiceCmsRecord = ServiceRecord & {
  _id?: string;
  status: "published" | "draft";
  order: number;
  icon: string;
  category: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type SiteSettingsRecord = {
  _id?: string;
  companyName: string;
  tagline: string;
  statement: string;
  shortDescription: string;
  longDescription: string[];
  email: string;
  salesEmail: string;
  supportEmail: string;
  phones: string[];
  businessHours: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    hqLabel: string;
  };
  socialLinks: {
    linkedin: string;
    instagram: string;
    twitter: string;
    facebook: string;
    youtube: string;
    website: string;
  };
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  seoKeywords: string[];
  copyrightText: string;
  updatedAt?: string;
};

export async function listPublicServices(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  featured?: boolean;
}) {
  const { data } = await apiClient.get<ApiEnvelope<ServiceCmsRecord[]>>("/services/public", {
    params: {
      page: params?.page,
      pageSize: params?.pageSize ?? 100,
      search: params?.search?.trim() || undefined,
      category: params?.category && params.category !== "all" ? params.category : undefined,
      featured: params?.featured,
    },
  });
  return {
    items: data.data,
    meta: data.meta ?? { page: 1, pageSize: 100, total: data.data.length, totalPages: 1 },
  };
}

export async function listAdminServices(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  status?: "published" | "draft" | "all";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  const { data } = await apiClient.get<ApiEnvelope<ServiceCmsRecord[]>>("/services/admin/list", {
    params: {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 50,
      search: params?.search?.trim() || undefined,
      category: params?.category && params.category !== "all" ? params.category : undefined,
      status: params?.status && params.status !== "all" ? params.status : undefined,
      sortBy: params?.sortBy ?? "order",
      sortOrder: params?.sortOrder ?? "asc",
    },
  });
  return {
    items: data.data,
    meta: data.meta ?? { page: 1, pageSize: 50, total: data.data.length, totalPages: 1 },
  };
}

export async function getServiceBySlugOrId(slugOrId: string): Promise<ServiceCmsRecord> {
  const { data } = await apiClient.get<ApiEnvelope<ServiceCmsRecord>>(
    `/services/detail/${encodeURIComponent(slugOrId)}`
  );
  return data.data;
}

export async function createService(payload: Partial<ServiceCmsRecord>): Promise<ServiceCmsRecord> {
  const { data } = await apiClient.post<ApiEnvelope<ServiceCmsRecord>>("/services", payload);
  return data.data;
}

export async function updateService(
  id: string,
  payload: Partial<ServiceCmsRecord>
): Promise<ServiceCmsRecord> {
  const { data } = await apiClient.put<ApiEnvelope<ServiceCmsRecord>>(`/services/${id}`, payload);
  return data.data;
}

export async function toggleServiceStatus(
  id: string,
  status: "published" | "draft"
): Promise<ServiceCmsRecord> {
  const { data } = await apiClient.patch<ApiEnvelope<ServiceCmsRecord>>(`/services/${id}/status`, {
    status,
  });
  return data.data;
}

export async function deleteService(id: string): Promise<void> {
  await apiClient.delete(`/services/${id}`);
}

export async function getSiteSettings(): Promise<SiteSettingsRecord> {
  const { data } = await apiClient.get<ApiEnvelope<SiteSettingsRecord>>("/settings/site-profile");
  return data.data;
}

export async function updateSiteSettings(
  payload: Partial<SiteSettingsRecord>
): Promise<SiteSettingsRecord> {
  const { data } = await apiClient.put<ApiEnvelope<SiteSettingsRecord>>(
    "/settings/site-profile",
    payload
  );
  return data.data;
}
