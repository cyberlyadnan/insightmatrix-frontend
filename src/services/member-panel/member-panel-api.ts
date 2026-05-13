import { apiClient } from "@/services/api";
import type { PanelSurvey } from "@/services/panel-survey";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type MemberSurveyParticipation = {
  status: "available" | "completed" | "no_attempts_left";
  attemptsUsed: number;
  maxAttempts: number;
};

export type MatchedPanelSurvey = PanelSurvey & {
  pointsReward: number;
  matchReason: string;
  memberParticipation: MemberSurveyParticipation;
};

export type AvailablePanelSurveysResponse = {
  surveys: MatchedPanelSurvey[];
  profileComplete: boolean;
};

export async function getAvailablePanelSurveys(): Promise<AvailablePanelSurveysResponse> {
  const { data } = await apiClient.get<ApiEnvelope<AvailablePanelSurveysResponse>>(
    "/users/panel/available-surveys"
  );
  return data.data;
}

export type StartPanelAttemptResponse = {
  attemptToken: string;
  supplierProjectPid: string;
  surveyId: string;
  participantQueryParam: string;
  pointsReward: number;
  surveyName: string;
  startPath: string;
};

export async function startPanelSurveyAttempt(
  surveyId: string
): Promise<StartPanelAttemptResponse> {
  const { data } = await apiClient.post<ApiEnvelope<StartPanelAttemptResponse>>(
    `/users/panel/surveys/${surveyId}/start-attempt`,
    {}
  );
  return data.data;
}

export type WalletLedgerEntry = {
  id: string;
  type: string;
  points: number;
  balanceAfter: number;
  panelSurveyId: string | null;
  attemptToken: string | null;
  description: string;
  createdAt: string | null;
};

export type PanelWalletResponse = {
  balance: number;
  lifetimeEarned: number;
  entries: WalletLedgerEntry[];
};

export async function getPanelWallet(): Promise<PanelWalletResponse> {
  const { data } = await apiClient.get<ApiEnvelope<PanelWalletResponse>>("/users/panel/wallet");
  return data.data;
}
