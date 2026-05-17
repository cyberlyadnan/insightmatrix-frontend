import type { PanelRoutingEventType } from "@/constants/panel-survey-routing";

/** URL segment under /survey/callback/:outcome — matches public callback landing pages */
export const SURVEY_CALLBACK_SLUGS = ["complete", "quota-full", "terminate", "quality"] as const;

export type SurveyCallbackSlug = (typeof SURVEY_CALLBACK_SLUGS)[number];

type SlugConfig = {
  slug: SurveyCallbackSlug;
  label: string;
  shortLabel: string;
  eventType: PanelRoutingEventType;
  description: string;
  /** Participant-facing headline on the callback landing page */
  headline: string;
  /** Short supportive line shown under the status message */
  supportiveLine: string;
};

export const SURVEY_CALLBACK_CONFIG: SlugConfig[] = [
  {
    slug: "complete",
    label: "Complete URL",
    shortLabel: "Complete",
    eventType: "complete",
    description: "Supplier redirects when the participant finishes successfully.",
    headline: "Thank you for completing the survey",
    supportiveLine: "Your responses help brands and researchers make smarter decisions worldwide.",
  },
  {
    slug: "quota-full",
    label: "Quota full URL",
    shortLabel: "Quota full",
    eventType: "quota_full",
    description: "Target cell or study quota is full.",
    headline: "This survey quota is now full",
    supportiveLine:
      "We appreciate your time — this study has reached its target number of completes.",
  },
  {
    slug: "terminate",
    label: "Terminate URL",
    shortLabel: "Terminate",
    eventType: "terminate",
    description: "Overquota, client stop, or other hard stop (non-quality).",
    headline: "Your session has ended",
    supportiveLine:
      "You may not qualify for this study, or the client has closed the survey. Thank you for trying.",
  },
  {
    slug: "quality",
    label: "Quality check URL",
    shortLabel: "Quality",
    eventType: "quality_reject",
    description: "Speeder, straight-liner, or other quality fail.",
    headline: "Session could not be validated",
    supportiveLine: "Responses are reviewed for quality so researchers receive trustworthy data.",
  },
];

export const SURVEY_CALLBACK_SLUG_SET = new Set<string>(SURVEY_CALLBACK_SLUGS);

export function getCallbackConfig(slug: string): SlugConfig | undefined {
  return SURVEY_CALLBACK_CONFIG.find((c) => c.slug === slug);
}
