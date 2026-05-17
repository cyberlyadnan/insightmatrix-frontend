export type {
  VendorCallbackOutcome,
  VendorCallbackUrls,
  VendorCallbackOutcomeStatus,
  VendorCallbackConfigurationStatus,
} from "@/constants/vendor-callback";

/** Future webhook log row — UI placeholder only. */
export type VendorCallbackWebhookLogStatus =
  | "pending"
  | "success"
  | "failed"
  | "retrying"
  | "cancelled";

export type VendorCallbackWebhookLogEntry = {
  id: string;
  vendorId: string;
  outcome: import("@/constants/vendor-callback").VendorCallbackOutcome;
  targetUrl: string;
  status: VendorCallbackWebhookLogStatus;
  attempt: number;
  httpStatus: number | null;
  createdAt: string;
};
