export type SurveyRespondentProfile = {
  id: string;
  panelSurveyId: string;
  allocationId: string | null;
  vendorId: string | null;
  respondentOwnerType: string;
  /** Vendor toid or internal share-link id (pid, gid, toid, etc.) */
  trackingParticipantId: string;
  vendorRespondentToid: string;
  internalSessionToken: string;
  prescreenAnswers: Record<string, unknown> | null;
  prescreenCompletedAt: string | null;
  surveyStatus: string;
  lifecycleHistory: { status: string; note: string; at: string }[];
  completedAt: string | null;
  createdAt: string | null;
  vendor: { id: string; vendorCode: string; companyName: string } | null;
  panelSurvey: { id: string; surveyName: string; surveyCode: string } | null;
  allocation: { id: string; allocationCode: string; routingSlug: string } | null;
};

export type RespondentAnalyticsSummary = {
  total: number;
  completes: number;
  terminates: number;
  quotaFull: number;
  qualityRejects: number;
  redirected: number;
  prescreenPending: number;
  conversionRate: number;
  byStatus: Record<string, number>;
};
