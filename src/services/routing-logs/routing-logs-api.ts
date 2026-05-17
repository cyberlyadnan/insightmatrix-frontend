import { apiClient } from "@/services/api";

export type WebhookDeliveryLog = {
  id: string;
  vendorId: string;
  vendorCode: string | null;
  vendorCompanyName: string | null;
  panelSurveyId: string;
  surveyName: string | null;
  surveyCode: string | null;
  allocationId: string | null;
  sessionId: string | null;
  callbackType: string;
  destinationUrl: string;
  responseStatus: number | null;
  deliveryStatus: "success" | "failed";
  errorMessage: string;
  attemptedAt: string | null;
  createdAt: string | null;
};

export type GatewayRoutingLog = {
  id: string;
  channel: "panel" | "vendor";
  action: string;
  success: boolean;
  panelSurveyId: string | null;
  vendorId: string | null;
  allocationId: string | null;
  sessionToken: string;
  failureReason: string;
  sourceIp: string;
  createdAt: string | null;
};

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  meta?: { page: number; pageSize: number; total: number; totalPages: number };
};

export async function listWebhookDeliveryLogs(params?: {
  page?: number;
  pageSize?: number;
  vendorId?: string;
  panelSurveyId?: string;
  deliveryStatus?: string;
}) {
  const { data } = await apiClient.get<ApiEnvelope<WebhookDeliveryLog[]>>(
    "/routing-logs/webhooks",
    {
      params,
    }
  );
  return { items: data.data, meta: data.meta };
}

export async function listGatewayRoutingLogs(params?: {
  page?: number;
  pageSize?: number;
  channel?: string;
  success?: boolean;
  panelSurveyId?: string;
}) {
  const { data } = await apiClient.get<ApiEnvelope<GatewayRoutingLog[]>>("/routing-logs/gateway", {
    params,
  });
  return { items: data.data, meta: data.meta };
}
