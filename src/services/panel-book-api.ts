import { apiClient } from "@/services/api";
import type { PanelBookOrgType } from "@/constants/panel-book";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: { page: number; pageSize: number; total: number; totalPages: number };
};

export type PanelBookLeadPayload = {
  firstName: string;
  lastName: string;
  workEmail: string;
  companyName: string;
  organizationType: PanelBookOrgType;
  jobTitle: string;
  country: string;
  acceptedTerms: boolean;
};

export async function submitPanelBookLead(payload: PanelBookLeadPayload): Promise<{
  id: string;
  downloadAvailable: boolean;
}> {
  const { data } = await apiClient.post<ApiEnvelope<{ id: string; downloadAvailable: boolean }>>(
    "/panel-book/leads",
    payload
  );
  return data.data;
}

export async function downloadPanelBookPdf(): Promise<void> {
  const res = await apiClient.get("/panel-book/document", { responseType: "blob" });
  const blob = res.data as Blob;
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "InsightMatrix-Panel-Book.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export type PanelBookLeadRow = {
  id: string;
  firstName: string;
  lastName: string;
  workEmail: string;
  companyName: string;
  organizationType: PanelBookOrgType;
  jobTitle: string;
  country: string;
  acceptedTerms: boolean;
  createdAt: string | null;
};

export async function listPanelBookLeads(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  const { data } = await apiClient.get<ApiEnvelope<PanelBookLeadRow[]>>("/panel-book/admin/leads", {
    params: {
      page: params?.page,
      pageSize: params?.pageSize,
      search: params?.search?.trim() || undefined,
    },
  });
  return {
    items: data.data,
    meta: data.meta ?? { page: 1, pageSize: 20, total: 0, totalPages: 1 },
  };
}

export type PanelBookAssetInfo = {
  hasFile: boolean;
  fileSizeBytes: number;
  originalFileName: string | null;
  updatedAt: string | null;
};

export async function getPanelBookAssetAdmin(): Promise<PanelBookAssetInfo> {
  const { data } = await apiClient.get<ApiEnvelope<PanelBookAssetInfo>>("/panel-book/admin/asset");
  return data.data;
}

export async function uploadPanelBookPdf(file: File): Promise<PanelBookAssetInfo> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiClient.post<ApiEnvelope<PanelBookAssetInfo>>(
    "/panel-book/admin/upload",
    form,
    {
      timeout: 120_000,
    }
  );
  return data.data;
}
