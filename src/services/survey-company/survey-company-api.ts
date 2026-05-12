import { apiClient } from "@/services/api";
import type { SurveyProviderType } from "@/constants/survey-company";

export type SurveyCompanyStatus = "active" | "inactive";

export type SurveyCompany = {
  id: string;
  companyName: string;
  companyCode: string;
  contactPersonName: string;
  companyEmail: string;
  companyPhone: string;
  websiteUrl: string;
  providerType: SurveyProviderType;
  status: SurveyCompanyStatus;
  notes: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type SurveyCompanyListMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: SurveyCompanyListMeta;
};

export type SurveyCompanyPayload = {
  companyName: string;
  companyCode: string;
  contactPersonName?: string;
  companyEmail?: string;
  companyPhone?: string;
  websiteUrl?: string;
  providerType: SurveyProviderType;
  status?: SurveyCompanyStatus;
  notes?: string;
};

export async function listSurveyCompanies(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: SurveyCompanyStatus | "";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  const { data } = await apiClient.get<ApiEnvelope<SurveyCompany[]>>("/survey-companies", {
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

export async function getSurveyCompany(id: string): Promise<SurveyCompany> {
  const { data } = await apiClient.get<ApiEnvelope<SurveyCompany>>(`/survey-companies/${id}`);
  return data.data;
}

export async function createSurveyCompany(payload: SurveyCompanyPayload): Promise<SurveyCompany> {
  const { data } = await apiClient.post<ApiEnvelope<SurveyCompany>>("/survey-companies", payload);
  return data.data;
}

export async function updateSurveyCompany(
  id: string,
  payload: Partial<SurveyCompanyPayload>
): Promise<SurveyCompany> {
  const { data } = await apiClient.patch<ApiEnvelope<SurveyCompany>>(
    `/survey-companies/${id}`,
    payload
  );
  return data.data;
}

export async function patchSurveyCompanyStatus(
  id: string,
  status: SurveyCompanyStatus
): Promise<SurveyCompany> {
  const { data } = await apiClient.patch<ApiEnvelope<SurveyCompany>>(
    `/survey-companies/${id}/status`,
    { status }
  );
  return data.data;
}

export async function deleteSurveyCompany(id: string): Promise<void> {
  await apiClient.delete(`/survey-companies/${id}`);
}
