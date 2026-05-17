/** Align with backend `vendor-callback.ts` and panel routing outcomes. */
export const VENDOR_CALLBACK_OUTCOMES = [
  "complete",
  "terminate",
  "quota_full",
  "quality_reject",
] as const;

export type VendorCallbackOutcome = (typeof VENDOR_CALLBACK_OUTCOMES)[number];

export type VendorCallbackUrls = Record<VendorCallbackOutcome, string>;

export type VendorCallbackOutcomeStatus = "not_configured" | "configured" | "untested";

export type VendorCallbackConfigurationStatus = Record<
  VendorCallbackOutcome,
  VendorCallbackOutcomeStatus
>;

export const VENDOR_CALLBACK_OUTCOME_LABELS: Record<VendorCallbackOutcome, string> = {
  complete: "Complete",
  terminate: "Terminate",
  quota_full: "Quota full",
  quality_reject: "Quality reject",
};

export const VENDOR_CALLBACK_OUTCOME_CONFIG: Record<
  VendorCallbackOutcome,
  { label: string; description: string; placeholder: string }
> = {
  complete: {
    label: "Complete callback URL",
    description: "Called when a respondent successfully completes the survey.",
    placeholder: "https://vendor.example.com/callbacks/complete",
  },
  terminate: {
    label: "Terminate callback URL",
    description: "Called when a session is terminated (screen-out, client stop, etc.).",
    placeholder: "https://vendor.example.com/callbacks/terminate",
  },
  quota_full: {
    label: "Quota full callback URL",
    description: "Called when the study or cell quota is full.",
    placeholder: "https://vendor.example.com/callbacks/quota-full",
  },
  quality_reject: {
    label: "Quality reject callback URL",
    description: "Called when a respondent fails quality checks.",
    placeholder: "https://vendor.example.com/callbacks/quality",
  },
};

export const VENDOR_CALLBACK_RELAY_EXPLANATION =
  "These callback URLs are used later for routing outcome forwarding to the vendor platform after survey completion or termination. When a supplier redirects to InsightMatrix, we record the outcome and will forward it to the matching URL below.";

export function emptyVendorCallbackUrls(): VendorCallbackUrls {
  return {
    complete: "",
    terminate: "",
    quota_full: "",
    quality_reject: "",
  };
}
