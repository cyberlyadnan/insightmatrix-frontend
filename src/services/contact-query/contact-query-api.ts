import { apiClient } from "@/services/api";

export type ContactQuery = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "pending" | "in_progress" | "resolved" | "completed" | "unread" | "read";
  starred: boolean;
  archived: boolean;
  labels: string[];
  source: string;
  createdAt?: string;
  updatedAt?: string;
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: { page: number; pageSize: number; total: number; totalPages: number };
};

export async function listContactSubjects(): Promise<string[]> {
  const { data } = await apiClient.get<ApiEnvelope<string[]>>("/contact-queries/subjects");
  return data.data;
}

export async function submitContactQuery(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<ContactQuery> {
  const { data } = await apiClient.post<ApiEnvelope<ContactQuery>>("/contact-queries", payload);
  return data.data;
}

export async function listContactQueries(params?: {
  status?: string;
  search?: string;
  subject?: string;
  label?: string;
  starred?: boolean;
  archived?: boolean;
  page?: number;
  pageSize?: number;
}) {
  const { data } = await apiClient.get<ApiEnvelope<ContactQuery[]>>("/contact-queries", { params });
  return { items: data.data, meta: data.meta };
}

export async function updateContactQueryStatus(id: string, status: ContactQuery["status"]) {
  const { data } = await apiClient.patch<ApiEnvelope<ContactQuery>>(
    `/contact-queries/${id}/status`,
    { status }
  );
  return data.data;
}

export async function updateContactQuery(
  id: string,
  payload: Partial<Pick<ContactQuery, "starred" | "archived" | "labels">>
) {
  const { data } = await apiClient.patch<ApiEnvelope<ContactQuery>>(
    `/contact-queries/${id}`,
    payload
  );
  return data.data;
}

export async function deleteContactQuery(id: string) {
  await apiClient.delete(`/contact-queries/${id}`);
}
