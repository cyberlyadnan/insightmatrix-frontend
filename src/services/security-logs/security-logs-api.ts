import { apiClient } from "@/services/api";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  meta?: { page: number; pageSize: number; total: number; totalPages: number };
};

export type SecurityLogRow = {
  _id: string;
  channel: string;
  ipAddress: string;
  country: string;
  validationDecision: string;
  reasonCode: string;
  blockedReason: string;
  captchaPassed: boolean | null;
  botDetected: boolean;
  vpnDetected: boolean;
  userAgent: string;
  createdAt: string;
  vendorId?: { vendorCode: string; companyName: string };
  panelSurveyId?: { surveyName: string; surveyCode: string };
};

export type SecurityAnalytics = {
  total: number;
  blocked: number;
  blockRate: number;
  captchaFailureRate: number;
  botTrafficRate: number;
  vpnTrafficRate: number;
  countryDistribution: { country: string; count: number }[];
};

export async function listSecurityLogs(params?: Record<string, unknown>) {
  const { data } = await apiClient.get<ApiEnvelope<SecurityLogRow[]>>("/security-logs", {
    params,
  });
  return { items: data.data, meta: data.meta };
}

export async function getSecurityAnalytics(params?: Record<string, unknown>) {
  const { data } = await apiClient.get<ApiEnvelope<SecurityAnalytics>>("/security-logs/analytics", {
    params,
  });
  return data.data;
}
