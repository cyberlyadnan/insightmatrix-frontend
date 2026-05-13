import { z } from "zod";
import {
  PANEL_QUOTA_GROUP_STATUSES,
  PANEL_SURVEY_DEVICE_TYPES,
  PANEL_SURVEY_GENDER_TARGETS,
  PANEL_SURVEY_STATUSES,
} from "@/constants/panel-survey";
import type { PanelSurvey } from "@/services/panel-survey";

const quotaRowSchema = z.object({
  groupName: z.string().min(1, "Group name required").max(200),
  groupDescription: z.string().max(2000),
  totalQuota: z.number().int().min(0),
  remainingQuota: z.number().int().min(0),
  status: z.enum(PANEL_QUOTA_GROUP_STATUSES),
});

export const panelSurveyFormSchema = z.object({
  surveyName: z.string().min(2).max(300),
  surveyCode: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/, "Use letters, numbers, hyphen or underscore"),
  externalSurveyId: z.string().max(200),
  providerId: z.string().min(1, "Select a provider"),
  surveyStatus: z.enum(PANEL_SURVEY_STATUSES),
  externalSurveyUrl: z.string().trim().min(1, "URL required").max(4000),
  supplierProjectPid: z.string().max(200),
  trackingParameterName: z.string().max(80),
  participantQueryParam: z
    .string()
    .max(80)
    .refine(
      (s) => {
        const t = s.trim();
        return !t || /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(t);
      },
      { message: "Use a letter first; then letters, numbers, hyphen, or underscore" }
    ),
  countriesLine: z.string(),
  targetGender: z.enum(PANEL_SURVEY_GENDER_TARGETS),
  targetAgeMin: z.string(),
  targetAgeMax: z.string(),
  professionsLine: z.string(),
  industriesLine: z.string(),
  companySizesLine: z.string(),
  devices: z.array(z.enum(PANEL_SURVEY_DEVICE_TYPES)),
  languagesLine: z.string(),
  incidenceRate: z.string(),
  estimatedLOI: z.string(),
  payoutToUser: z.string(),
  revenuePerComplete: z.string(),
  totalQuota: z.number().int().min(0),
  remainingQuota: z.number().int().min(0),
  quotaGroups: z.array(quotaRowSchema),
  surveyPriority: z.number().int(),
  maxMemberAttempts: z.number().int().min(1).max(10),
  startDate: z.string(),
  endDate: z.string(),
  notes: z.string().max(16000),
});

export type PanelSurveyFormValues = z.infer<typeof panelSurveyFormSchema>;

function isoToDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const emptyPanelSurveyFormValues: PanelSurveyFormValues = {
  surveyName: "",
  surveyCode: "",
  externalSurveyId: "",
  providerId: "",
  surveyStatus: "draft",
  externalSurveyUrl: "",
  supplierProjectPid: "",
  trackingParameterName: "toid",
  participantQueryParam: "pid",
  countriesLine: "",
  targetGender: "all",
  targetAgeMin: "",
  targetAgeMax: "",
  professionsLine: "",
  industriesLine: "",
  companySizesLine: "",
  devices: [],
  languagesLine: "",
  incidenceRate: "",
  estimatedLOI: "",
  payoutToUser: "",
  revenuePerComplete: "",
  totalQuota: 0,
  remainingQuota: 0,
  quotaGroups: [],
  surveyPriority: 0,
  maxMemberAttempts: 2,
  startDate: "",
  endDate: "",
  notes: "",
};

export function panelSurveyToFormValues(s: PanelSurvey): PanelSurveyFormValues {
  return {
    surveyName: s.surveyName,
    surveyCode: s.surveyCode,
    externalSurveyId: s.externalSurveyId ?? "",
    providerId: s.providerId,
    surveyStatus: s.surveyStatus,
    externalSurveyUrl: s.externalSurveyUrl,
    supplierProjectPid: s.supplierProjectPid?.trim() ?? "",
    trackingParameterName: s.trackingParameterName || "toid",
    participantQueryParam: s.participantQueryParam?.trim() || "pid",
    countriesLine: (s.targetCountries ?? []).join(", "),
    targetGender: s.targetGender,
    targetAgeMin: s.targetAgeMin != null ? String(s.targetAgeMin) : "",
    targetAgeMax: s.targetAgeMax != null ? String(s.targetAgeMax) : "",
    professionsLine: (s.targetProfessions ?? []).join(", "),
    industriesLine: (s.targetIndustries ?? []).join(", "),
    companySizesLine: (s.targetCompanySizes ?? []).join(", "),
    devices: [...(s.targetDevices ?? [])] as PanelSurveyFormValues["devices"],
    languagesLine: (s.targetLanguages ?? []).join(", "),
    incidenceRate:
      s.incidenceRate != null && !Number.isNaN(s.incidenceRate) ? String(s.incidenceRate) : "",
    estimatedLOI:
      s.estimatedLOI != null && !Number.isNaN(s.estimatedLOI) ? String(s.estimatedLOI) : "",
    payoutToUser:
      s.payoutToUser != null && !Number.isNaN(s.payoutToUser) ? String(s.payoutToUser) : "",
    revenuePerComplete:
      s.revenuePerComplete != null && !Number.isNaN(s.revenuePerComplete)
        ? String(s.revenuePerComplete)
        : "",
    totalQuota: s.totalQuota ?? 0,
    remainingQuota: s.remainingQuota ?? 0,
    quotaGroups:
      s.dynamicQuotaGroups?.map((g) => ({
        groupName: g.groupName,
        groupDescription: g.groupDescription ?? "",
        totalQuota: g.totalQuota,
        remainingQuota: g.remainingQuota,
        status: g.status,
      })) ?? [],
    surveyPriority: s.surveyPriority ?? 0,
    maxMemberAttempts: s.maxMemberAttempts ?? 2,
    startDate: s.startDate ? isoToDatetimeLocal(s.startDate) : "",
    endDate: s.endDate ? isoToDatetimeLocal(s.endDate) : "",
    notes: s.notes ?? "",
  };
}

export function splitLines(input: string): string[] {
  return input
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Maps validated form values to API payload */
export function panelSurveyFormToPayload(values: PanelSurveyFormValues) {
  const parseOptInt = (s: string) => {
    const t = s.trim();
    if (!t) return null;
    const n = Number.parseInt(t, 10);
    return Number.isFinite(n) ? n : null;
  };
  const parseOptFloat = (s: string) => {
    const t = s.trim();
    if (!t) return null;
    const n = Number.parseFloat(t);
    return Number.isFinite(n) ? n : null;
  };

  return {
    surveyName: values.surveyName.trim(),
    surveyCode: values.surveyCode.trim().toUpperCase(),
    externalSurveyId: values.externalSurveyId.trim() || undefined,
    providerId: values.providerId,
    surveyStatus: values.surveyStatus,
    externalSurveyUrl: values.externalSurveyUrl.trim(),
    supplierProjectPid: values.supplierProjectPid.trim(),
    trackingParameterName: values.trackingParameterName.trim() || "toid",
    participantQueryParam: values.participantQueryParam.trim() || "pid",
    targetCountries: splitLines(values.countriesLine).map((c) => c.toUpperCase()),
    targetGender: values.targetGender,
    targetAgeMin: parseOptInt(values.targetAgeMin),
    targetAgeMax: parseOptInt(values.targetAgeMax),
    targetProfessions: splitLines(values.professionsLine),
    targetIndustries: splitLines(values.industriesLine),
    targetCompanySizes: splitLines(values.companySizesLine),
    targetDevices: values.devices,
    targetLanguages: splitLines(values.languagesLine).map((l) => l.toLowerCase()),
    incidenceRate: parseOptFloat(values.incidenceRate),
    estimatedLOI: parseOptFloat(values.estimatedLOI),
    payoutToUser: parseOptFloat(values.payoutToUser),
    revenuePerComplete: parseOptFloat(values.revenuePerComplete),
    totalQuota: values.totalQuota,
    remainingQuota: values.remainingQuota,
    dynamicQuotaGroups: values.quotaGroups.map((g) => ({
      groupName: g.groupName.trim(),
      groupDescription: g.groupDescription.trim(),
      totalQuota: g.totalQuota,
      remainingQuota: g.remainingQuota,
      status: g.status,
    })),
    surveyPriority: values.surveyPriority,
    maxMemberAttempts: values.maxMemberAttempts,
    startDate: values.startDate.trim() ? new Date(values.startDate).toISOString() : null,
    endDate: values.endDate.trim() ? new Date(values.endDate).toISOString() : null,
    notes: values.notes.trim(),
  };
}
