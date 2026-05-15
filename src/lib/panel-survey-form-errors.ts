import type { FieldErrors } from "react-hook-form";

import type { PanelSurveyFormValues } from "@/validations/panel-survey.schema";

export const PANEL_SURVEY_SECTION_IDS = {
  basic: "panel-survey-section-basic",
  provider: "panel-survey-section-provider",
  url: "panel-survey-section-url",
  targeting: "panel-survey-section-targeting",
  metrics: "panel-survey-section-metrics",
  billing: "panel-survey-section-billing",
  quotas: "panel-survey-section-quotas",
  settings: "panel-survey-section-settings",
  notes: "panel-survey-section-notes",
} as const;

const META = new Set(["message", "type", "ref", "types"]);

function isLeafFieldError(node: unknown): node is { message: string } {
  if (!node || typeof node !== "object" || Array.isArray(node)) return false;
  const o = node as Record<string, unknown>;
  if (typeof o.message !== "string" || !o.message) return false;
  const other = Object.keys(o).filter((k) => !META.has(k));
  return other.length === 0;
}

/** Depth-first list of RHF/Zod field errors (path + message). */
export function flattenPanelSurveyFieldErrors(
  node: FieldErrors<PanelSurveyFormValues> | unknown,
  prefix = ""
): { path: string; message: string }[] {
  if (node == null) return [];
  if (Array.isArray(node)) {
    return node.flatMap((item, i) =>
      flattenPanelSurveyFieldErrors(item, prefix ? `${prefix}.${i}` : String(i))
    );
  }
  if (isLeafFieldError(node)) {
    return prefix ? [{ path: prefix, message: node.message }] : [];
  }
  if (typeof node !== "object") return [];
  return Object.keys(node as object).flatMap((key) => {
    if (META.has(key)) return [];
    const value = (node as Record<string, unknown>)[key];
    const path = prefix ? `${prefix}.${key}` : key;
    return flattenPanelSurveyFieldErrors(value, path);
  });
}

const QUOTA_SUB: Record<string, string> = {
  groupName: "Group name",
  groupDescription: "Description",
  totalQuota: "Total quota",
  remainingQuota: "Remaining quota",
  status: "Status",
};

const TOP_FIELD_LABELS: Record<string, string> = {
  surveyName: "Survey name",
  surveyCode: "Survey code",
  externalSurveyId: "External survey ID",
  surveyStatus: "Status",
  providerId: "Survey provider",
  externalSurveyUrl: "Provider survey URL",
  supplierProjectPid: "Partner project ID (pid)",
  trackingParameterName: "Tracking parameter name",
  participantQueryParam: "Participant query parameter",
  countriesLine: "Countries",
  targetGender: "Target gender",
  targetAgeMin: "Minimum age",
  targetAgeMax: "Maximum age",
  professionsLine: "Professions",
  industriesLine: "Industries",
  companySizesLine: "Company sizes",
  devices: "Devices",
  languagesLine: "Languages",
  incidenceRate: "Incidence rate",
  estimatedLOI: "Estimated LOI",
  payoutToUser: "Payout to user",
  revenuePerComplete: "Revenue per complete",
  totalQuota: "Total quota",
  remainingQuota: "Remaining quota",
  quotaGroups: "Quota groups",
  surveyPriority: "Survey priority",
  maxMemberAttempts: "Max member attempts",
  startDate: "Start date",
  endDate: "End date",
  notes: "Notes",
  companyBillingAmount: "Company billing amount",
  companyBillingTaxPercent: "Company billing tax %",
};

export function humanizePanelSurveyFieldPath(path: string): string {
  const q = /^quotaGroups\.(\d+)\.(.+)$/.exec(path);
  if (q) {
    const idx = Number(q[1]) + 1;
    const sub = QUOTA_SUB[q[2]] ?? q[2];
    return `Quota group ${idx} — ${sub}`;
  }
  const root = path.split(".")[0] ?? path;
  const label = TOP_FIELD_LABELS[root];
  if (label) {
    const rest = path.includes(".") ? path.slice(path.indexOf(".") + 1) : "";
    if (!rest) return label;
    return `${label} (${rest})`;
  }
  return path;
}

/** Scroll target for the first invalid field path. */
export function panelSurveyFieldPathToSectionId(path: string): string {
  const root = path.split(".")[0] ?? "";
  if (["surveyName", "surveyCode", "externalSurveyId", "surveyStatus"].includes(root)) {
    return PANEL_SURVEY_SECTION_IDS.basic;
  }
  if (root === "providerId") return PANEL_SURVEY_SECTION_IDS.provider;
  if (
    [
      "externalSurveyUrl",
      "supplierProjectPid",
      "trackingParameterName",
      "participantQueryParam",
    ].includes(root)
  ) {
    return PANEL_SURVEY_SECTION_IDS.url;
  }
  if (
    [
      "countriesLine",
      "targetGender",
      "targetAgeMin",
      "targetAgeMax",
      "professionsLine",
      "industriesLine",
      "companySizesLine",
      "devices",
      "languagesLine",
    ].includes(root)
  ) {
    return PANEL_SURVEY_SECTION_IDS.targeting;
  }
  if (["incidenceRate", "estimatedLOI", "payoutToUser", "revenuePerComplete"].includes(root)) {
    return PANEL_SURVEY_SECTION_IDS.metrics;
  }
  if (root === "companyBillingAmount" || root === "companyBillingTaxPercent") {
    return PANEL_SURVEY_SECTION_IDS.billing;
  }
  if (["totalQuota", "remainingQuota", "quotaGroups"].includes(root)) {
    return PANEL_SURVEY_SECTION_IDS.quotas;
  }
  if (["surveyPriority", "maxMemberAttempts", "startDate", "endDate"].includes(root)) {
    return PANEL_SURVEY_SECTION_IDS.settings;
  }
  if (root === "notes") return PANEL_SURVEY_SECTION_IDS.notes;
  return PANEL_SURVEY_SECTION_IDS.basic;
}
