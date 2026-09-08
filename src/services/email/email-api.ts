import { apiClient } from "@/services/api";
import type { AuthAxiosRequestConfig } from "@/services/api/auth-request-config";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type EmailDeliveryStatus = {
  configured: boolean;
  verified: boolean;
  verifyError: string | null;
  host: string | null;
  port: number;
  secure: boolean;
  user: string | null;
  from: string | null;
  replyTo: string | null;
  clientUrl: string;
  apiPublicUrl: string;
  guidance: string[];
  inboxTips?: {
    fromAligned: boolean;
    clientUrlHttps: boolean;
    recommendation: string;
  };
};

export type TestEmailResult = {
  messageId: string;
  accepted: string[];
  rejected: string[];
  response: string;
  to: string;
  smtp: {
    host: string | null;
    port: number;
    from: string | null;
    verified: boolean;
  };
};

/** skipAuthRedirect: SMTP diagnostics must never force a global logout on 401. */
export async function getEmailDeliveryStatus() {
  const { data } = await apiClient.get<ApiEnvelope<EmailDeliveryStatus>>("/email/status", {
    skipAuthRedirect: true,
  } as AuthAxiosRequestConfig);
  return data.data;
}

export async function sendAdminTestEmail(to: string) {
  const { data } = await apiClient.post<ApiEnvelope<TestEmailResult>>("/email/test", { to }, {
    skipAuthRedirect: true,
  } as AuthAxiosRequestConfig);
  return data;
}
