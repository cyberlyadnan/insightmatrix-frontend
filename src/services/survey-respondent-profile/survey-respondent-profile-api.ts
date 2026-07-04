import { apiClient } from "@/services/api";
import type {
  RespondentAnalyticsSummary,
  SurveyRespondentProfile,
} from "@/types/survey-respondent-profile";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: { page: number; pageSize: number; total: number; totalPages: number };
};

export async function listSurveyRespondentProfiles(params?: Record<string, unknown>) {
  const { data } = await apiClient.get<ApiEnvelope<SurveyRespondentProfile[]>>(
    "/survey-respondent-profiles",
    { params }
  );
  return { items: data.data, meta: data.meta };
}

export async function getSurveyRespondentProfile(id: string) {
  const { data } = await apiClient.get<
    ApiEnvelope<{ profile: SurveyRespondentProfile; webhookLogs: unknown[] }>
  >(`/survey-respondent-profiles/${id}`);
  return data.data;
}

export async function getRespondentAnalyticsSummary(params?: Record<string, unknown>) {
  const { data } = await apiClient.get<ApiEnvelope<RespondentAnalyticsSummary>>(
    "/survey-respondent-profiles/analytics/summary",
    { params }
  );
  return data.data;
}

export async function exportSurveyRespondents(body: {
  format: "csv" | "xlsx" | "pdf";
  vendorId?: string;
  panelSurveyId?: string;
  allocationId?: string;
  surveyStatus?: string;
  respondentOwnerType?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  const res = await apiClient.post("/survey-respondent-profiles/export", body, {
    responseType: "blob",
  });
  return res.data as Blob;
}
