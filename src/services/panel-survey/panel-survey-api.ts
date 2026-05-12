import { apiClient } from "@/services/api";
import type {
  PanelQuotaGroupStatus,
  PanelSurveyDeviceType,
  PanelSurveyGenderTarget,
  PanelSurveyStatus,
} from "@/constants/panel-survey";

export type PanelSurveyProviderSummary = {
  id: string;
  companyName: string;
  companyCode: string;
};

export type PanelSurveyQuotaGroup = {
  id: string;
  groupName: string;
  groupDescription: string;
  totalQuota: number;
  remainingQuota: number;
  status: PanelQuotaGroupStatus;
};

export type PanelSurvey = {
  id: string;
  surveyName: string;
  surveyCode: string;
  externalSurveyId: string;
  providerId: string;
  provider: PanelSurveyProviderSummary | null;
  surveyStatus: PanelSurveyStatus;
  externalSurveyUrl: string;
  trackingParameterName: string;
  targetCountries: string[];
  targetGender: PanelSurveyGenderTarget;
  targetAgeMin: number | null;
  targetAgeMax: number | null;
  targetProfessions: string[];
  targetIndustries: string[];
  targetCompanySizes: string[];
  targetDevices: PanelSurveyDeviceType[];
  targetLanguages: string[];
  incidenceRate: number | null;
  estimatedLOI: number | null;
  payoutToUser: number | null;
  revenuePerComplete: number | null;
  totalQuota: number;
  remainingQuota: number;
  dynamicQuotaGroups: PanelSurveyQuotaGroup[];
  surveyPriority: number;
  startDate: string | null;
  endDate: string | null;
  notes: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type PanelSurveyPublic = {
  id: string;
  surveyName: string;
  estimatedLOI: number | null;
  payoutToUser: number | null;
  targetCountries: string[];
  surveyStatus: PanelSurveyStatus;
  externalSurveyUrl: string;
  providerName: string | null;
  providerCode: string | null;
};

export type PanelSurveyPayload = {
  surveyName: string;
  surveyCode: string;
  externalSurveyId?: string;
  providerId: string;
  surveyStatus?: PanelSurveyStatus;
  externalSurveyUrl: string;
  trackingParameterName?: string;
  targetCountries?: string[];
  targetGender?: PanelSurveyGenderTarget;
  targetAgeMin?: number | null;
  targetAgeMax?: number | null;
  targetProfessions?: string[];
  targetIndustries?: string[];
  targetCompanySizes?: string[];
  targetDevices?: PanelSurveyDeviceType[];
  targetLanguages?: string[];
  incidenceRate?: number | null;
  estimatedLOI?: number | null;
  payoutToUser?: number | null;
  revenuePerComplete?: number | null;
  totalQuota?: number;
  remainingQuota?: number;
  dynamicQuotaGroups?: Array<{
    groupName: string;
    groupDescription?: string;
    totalQuota: number;
    remainingQuota: number;
    status?: PanelQuotaGroupStatus;
  }>;
  surveyPriority?: number;
  startDate?: string | null;
  endDate?: string | null;
  notes?: string;
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: { page: number; pageSize: number; total: number; totalPages: number };
};

export async function listPanelSurveys(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  providerId?: string;
  country?: string;
  surveyStatus?: PanelSurveyStatus | "";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  const { data } = await apiClient.get<ApiEnvelope<PanelSurvey[]>>("/panel-surveys", {
    params: {
      ...params,
      surveyStatus: params?.surveyStatus === "" ? undefined : params?.surveyStatus,
      providerId: params?.providerId || undefined,
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

export async function getPanelSurvey(id: string): Promise<PanelSurvey> {
  const { data } = await apiClient.get<ApiEnvelope<PanelSurvey>>(`/panel-surveys/${id}`);
  return data.data;
}

export async function getPublicPanelSurvey(id: string): Promise<PanelSurveyPublic> {
  const { data } = await apiClient.get<ApiEnvelope<PanelSurveyPublic>>(
    `/panel-surveys/public/${id}`
  );
  return data.data;
}

export async function createPanelSurvey(payload: PanelSurveyPayload): Promise<PanelSurvey> {
  const { data } = await apiClient.post<ApiEnvelope<PanelSurvey>>("/panel-surveys", payload);
  return data.data;
}

export async function updatePanelSurvey(
  id: string,
  payload: Partial<PanelSurveyPayload>
): Promise<PanelSurvey> {
  const { data } = await apiClient.patch<ApiEnvelope<PanelSurvey>>(`/panel-surveys/${id}`, payload);
  return data.data;
}

export async function patchPanelSurveyStatus(
  id: string,
  surveyStatus: PanelSurveyStatus
): Promise<PanelSurvey> {
  const { data } = await apiClient.patch<ApiEnvelope<PanelSurvey>>(`/panel-surveys/${id}/status`, {
    surveyStatus,
  });
  return data.data;
}

export async function deletePanelSurvey(id: string): Promise<void> {
  await apiClient.delete(`/panel-surveys/${id}`);
}
