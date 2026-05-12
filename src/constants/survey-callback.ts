import type { PanelRoutingEventType } from "@/constants/panel-survey-routing";

/** URL segment under /survey/callback/:outcome — matches public callback landing pages */
export const SURVEY_CALLBACK_SLUGS = [
  "complete",
  "quota-full",
  "terminate",
  "quality",
] as const;

export type SurveyCallbackSlug = (typeof SURVEY_CALLBACK_SLUGS)[number];

type SlugConfig = {
  slug: SurveyCallbackSlug;
  label: string;
  shortLabel: string;
  eventType: PanelRoutingEventType;
  description: string;
};

export const SURVEY_CALLBACK_CONFIG: SlugConfig[] = [
  {
    slug: "complete",
    label: "Complete URL",
    shortLabel: "Complete",
    eventType: "complete",
    description: "Supplier redirects when the participant finishes successfully.",
  },
  {
    slug: "quota-full",
    label: "Quota full URL",
    shortLabel: "Quota full",
    eventType: "quota_full",
    description: "Target cell or study quota is full.",
  },
  {
    slug: "terminate",
    label: "Terminate URL",
    shortLabel: "Terminate",
    eventType: "terminate",
    description: "Overquota, client stop, or other hard stop (non-quality).",
  },
  {
    slug: "quality",
    label: "Quality check URL",
    shortLabel: "Quality",
    eventType: "quality_reject",
    description: "Speeder, straight-liner, or other quality fail.",
  },
];

export const SURVEY_CALLBACK_SLUG_SET = new Set<string>(SURVEY_CALLBACK_SLUGS);

export function getCallbackConfig(slug: string): SlugConfig | undefined {
  return SURVEY_CALLBACK_CONFIG.find((c) => c.slug === slug);
}
