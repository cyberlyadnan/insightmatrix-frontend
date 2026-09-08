/** Align with backend `panel-survey.ts` */
export const PANEL_SURVEY_STATUSES = ["draft", "active", "paused", "completed"] as const;
export type PanelSurveyStatus = (typeof PANEL_SURVEY_STATUSES)[number];

export const PANEL_SURVEY_AUDIENCES = ["public", "internal", "private"] as const;
export type PanelSurveyAudience = (typeof PANEL_SURVEY_AUDIENCES)[number];

export const PANEL_SURVEY_AUDIENCE_LABELS: Record<PanelSurveyAudience, string> = {
  public: "Public (User Panel)",
  internal: "Internal / Private",
  private: "Internal / Private",
};

export const PANEL_SURVEY_GENDER_TARGETS = ["all", "male", "female", "other"] as const;
export type PanelSurveyGenderTarget = (typeof PANEL_SURVEY_GENDER_TARGETS)[number];

export const PANEL_SURVEY_DEVICE_TYPES = ["desktop", "mobile", "tablet"] as const;
export type PanelSurveyDeviceType = (typeof PANEL_SURVEY_DEVICE_TYPES)[number];

export const PANEL_QUOTA_GROUP_STATUSES = ["active", "paused", "filled"] as const;
export type PanelQuotaGroupStatus = (typeof PANEL_QUOTA_GROUP_STATUSES)[number];

export const PANEL_SURVEY_STATUS_LABELS: Record<PanelSurveyStatus, string> = {
  draft: "Draft",
  active: "Active",
  paused: "Paused",
  completed: "Completed",
};

export const PANEL_QUOTA_GROUP_STATUS_LABELS: Record<PanelQuotaGroupStatus, string> = {
  active: "Active",
  paused: "Paused",
  filled: "Filled",
};

export const PANEL_GENDER_LABELS: Record<PanelSurveyGenderTarget, string> = {
  all: "All",
  male: "Male",
  female: "Female",
  other: "Other",
};
