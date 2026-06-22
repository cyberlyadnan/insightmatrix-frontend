import { z } from "zod";
import {
  PANEL_QUOTA_GROUP_STATUSES,
  PANEL_SURVEY_DEVICE_TYPES,
  PANEL_SURVEY_GENDER_TARGETS,
  PANEL_SURVEY_STATUSES,
} from "@/constants/panel-survey";
import type { PanelSurvey } from "@/services/panel-survey";

/** Non-negative integers from `<input type="number">` (RHF often stores strings until submit). */
const zCoercedNonNegInt = z.coerce
  .number()
  .refine((n) => Number.isFinite(n) && !Number.isNaN(n), { message: "Enter a valid whole number" })
  .transform((n) => Math.trunc(n))
  .refine((n) => n >= 0, { message: "Must be 0 or greater" });

/** Any finite integer (e.g. survey priority). */
const zCoercedInt = z.coerce
  .number()
  .refine((n) => Number.isFinite(n) && !Number.isNaN(n), { message: "Enter a valid whole number" })
  .transform((n) => Math.trunc(n));

const zCoercedMaxAttempts = z.coerce
  .number()
  .refine((n) => Number.isFinite(n) && !Number.isNaN(n), { message: "Enter a number from 1 to 10" })
  .transform((n) => Math.trunc(n))
  .refine((n) => n >= 1 && n <= 10, { message: "Must be between 1 and 10" });

const quotaRowSchema = z.object({
  groupName: z.string().min(1, "Group name required").max(200),
  groupDescription: z.string().max(2000),
  totalQuota: zCoercedNonNegInt,
  remainingQuota: zCoercedNonNegInt,
  status: z.enum(PANEL_QUOTA_GROUP_STATUSES),
});

const panelSurveyFormSchemaBase = z.object({
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
  totalQuota: zCoercedNonNegInt,
  remainingQuota: zCoercedNonNegInt,
  quotaGroups: z.array(quotaRowSchema),
  surveyPriority: zCoercedInt,
  maxMemberAttempts: zCoercedMaxAttempts,
  startDate: z.string(),
  endDate: z.string(),
  notes: z.string().max(16000),
  /** Supplier fee in money (USD) — drives B2B invoice line; separate from member points. */
  companyBillingAmount: z.string(),
  companyBillingTaxPercent: z.string(),
});

export const panelSurveyFormSchema = panelSurveyFormSchemaBase.superRefine((data, ctx) => {
  const taxRaw = data.companyBillingTaxPercent.trim();
  const tax = taxRaw === "" ? 0 : Number.parseFloat(taxRaw);
  if (!Number.isFinite(tax) || tax < 0 || tax > 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Tax % must be between 0 and 100.",
      path: ["companyBillingTaxPercent"],
    });
  }
  const amtRaw = data.companyBillingAmount.trim();
  const amt = amtRaw === "" ? 0 : Number.parseFloat(amtRaw);
  if (!Number.isFinite(amt) || amt < 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Amount must be zero or greater.",
      path: ["companyBillingAmount"],
    });
  }
});

export type PanelSurveyFormValues = z.infer<typeof panelSurveyFormSchemaBase>;

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
  surveyStatus: "active",
  externalSurveyUrl: "",
  supplierProjectPid: "",
  trackingParameterName: "toid",
  participantQueryParam: "toid",
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
  companyBillingAmount: "0",
  companyBillingTaxPercent: "0",
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
    companyBillingAmount:
      s.companyBillingAmount != null && !Number.isNaN(s.companyBillingAmount)
        ? String(s.companyBillingAmount)
        : "0",
    companyBillingTaxPercent:
      s.companyBillingTaxPercent != null && !Number.isNaN(s.companyBillingTaxPercent)
        ? String(s.companyBillingTaxPercent)
        : "0",
  };
}

export function splitLines(input: string): string[] {
  return input
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function asFiniteInt(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number.parseInt(value.trim(), 10);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
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
    totalQuota: asFiniteInt(values.totalQuota, 0),
    remainingQuota: asFiniteInt(values.remainingQuota, 0),
    dynamicQuotaGroups: values.quotaGroups.map((g) => ({
      groupName: g.groupName.trim(),
      groupDescription: g.groupDescription.trim(),
      totalQuota: asFiniteInt(g.totalQuota, 0),
      remainingQuota: asFiniteInt(g.remainingQuota, 0),
      status: g.status,
    })),
    surveyPriority: asFiniteInt(values.surveyPriority, 0),
    maxMemberAttempts: Math.min(10, Math.max(1, asFiniteInt(values.maxMemberAttempts, 2))),
    startDate: values.startDate.trim() ? new Date(values.startDate).toISOString() : null,
    endDate: values.endDate.trim() ? new Date(values.endDate).toISOString() : null,
    notes: values.notes.trim(),
    companyBillingAmount:
      values.companyBillingAmount.trim() === ""
        ? 0
        : Math.round(Math.max(0, Number.parseFloat(values.companyBillingAmount)) * 100) / 100,
    companyBillingTaxPercent:
      values.companyBillingTaxPercent.trim() === ""
        ? 0
        : Math.min(100, Math.max(0, Number.parseFloat(values.companyBillingTaxPercent))),
  };
}
