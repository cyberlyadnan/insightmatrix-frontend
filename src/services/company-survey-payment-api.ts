import { apiClient } from "@/services/api";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: { page: number; pageSize: number; total: number; totalPages: number };
};

export type CompanyPaymentStatus = "pending" | "paid" | "cancelled";
export type CompanyPaymentSource = "auto_survey_create" | "manual";

export type CompanySurveyPaymentRow = {
  _id: string;
  invoiceNumber: string;
  surveyCompanyId:
    | string
    | { _id?: string; companyName?: string; companyCode?: string; companyEmail?: string };
  panelSurveyId:
    | string
    | { _id?: string; surveyName?: string; surveyCode?: string; surveyStatus?: string };
  source: CompanyPaymentSource;
  currency: string;
  subtotalAmount: number;
  taxPercent: number;
  taxAmount: number;
  totalAmount: number;
  lineDescription?: string;
  status: CompanyPaymentStatus;
  paidAt: string | null;
  notes?: string;
  createdAt?: string;
};

export async function listCompanySurveyPayments(params?: {
  page?: number;
  pageSize?: number;
  surveyCompanyId?: string;
  panelSurveyId?: string;
  status?: CompanyPaymentStatus;
}) {
  const { data } = await apiClient.get<ApiEnvelope<CompanySurveyPaymentRow[]>>(
    "/company-payments",
    {
      params: {
        ...params,
        surveyCompanyId: params?.surveyCompanyId || undefined,
        panelSurveyId: params?.panelSurveyId || undefined,
        status: params?.status || undefined,
      },
    }
  );
  return {
    items: data.data,
    meta: data.meta ?? { page: 1, pageSize: 20, total: 0, totalPages: 1 },
  };
}

export async function createCompanySurveyPayment(payload: {
  surveyCompanyId: string;
  panelSurveyId: string;
  subtotalAmount: number;
  taxPercent: number;
  currency?: string;
  notes?: string;
}): Promise<{ id: string; invoiceNumber: string }> {
  const { data } = await apiClient.post<ApiEnvelope<{ id: string; invoiceNumber: string }>>(
    "/company-payments",
    payload
  );
  return data.data;
}

export async function patchCompanySurveyPaymentStatus(
  id: string,
  payload: { status: CompanyPaymentStatus; paidAt?: string | null }
): Promise<void> {
  await apiClient.patch(`/company-payments/${id}/status`, payload);
}

export async function downloadCompanyPaymentInvoicePdf(paymentId: string, invoiceNumber: string) {
  const res = await apiClient.get(`/company-payments/${paymentId}/invoice`, {
    responseType: "blob",
  });
  const blob = res.data as Blob;
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${invoiceNumber}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
