import { apiClient } from "@/services/api";
import type { AuthUser } from "@/types";
import type { PrescreenForm } from "@/types/prescreen";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type PanelPrescreenBundle = {
  needsCompletion: boolean;
  notConfigured: boolean;
  form: PrescreenForm | null;
};

export async function getPanelPrescreenBundle(): Promise<PanelPrescreenBundle> {
  const { data } = await apiClient.get<ApiEnvelope<PanelPrescreenBundle>>("/users/panel-prescreen");
  return data.data;
}

export async function submitPanelPrescreenAnswers(
  answers: Record<string, unknown>,
  durationMs?: number
): Promise<AuthUser> {
  const { data } = await apiClient.post<ApiEnvelope<{ user: AuthUser }>>(
    "/users/panel-prescreen/submit",
    {
      answers,
      ...(durationMs != null && durationMs >= 0 ? { durationMs } : {}),
    }
  );
  return data.data.user;
}
