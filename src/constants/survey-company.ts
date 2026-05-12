/** Must stay aligned with `survey-platform-backend/src/constants/survey-company.ts` */
export const SURVEY_PROVIDER_TYPES = [
  "sample_exchange",
  "router",
  "panel_network",
  "full_service",
  "api_partner",
  "other",
] as const;

export type SurveyProviderType = (typeof SURVEY_PROVIDER_TYPES)[number];

export const SURVEY_PROVIDER_LABELS: Record<SurveyProviderType, string> = {
  sample_exchange: "Sample exchange",
  router: "Router",
  panel_network: "Panel network",
  full_service: "Full-service provider",
  api_partner: "API partner",
  other: "Other",
};
