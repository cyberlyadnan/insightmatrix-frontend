export const VENDOR_ALLOCATION_STATUSES = ["active", "paused", "completed", "closed"] as const;
export type VendorAllocationStatus = (typeof VENDOR_ALLOCATION_STATUSES)[number];

export const VENDOR_ALLOCATION_STATUS_LABELS: Record<VendorAllocationStatus, string> = {
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  closed: "Closed",
};

export const VENDOR_ALLOCATION_STATUS_STYLES: Record<VendorAllocationStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  paused: "bg-amber-50 text-amber-700 border border-amber-200",
  completed: "bg-slate-100 text-slate-700 border border-slate-200",
  closed: "bg-rose-50 text-rose-700 border border-rose-200",
};

export const VENDOR_RESPONDENT_SESSION_STATUSES = [
  "started",
  "redirected",
  "complete",
  "terminate",
  "quota_full",
  "quality_reject",
] as const;
export type VendorRespondentSessionStatus = (typeof VENDOR_RESPONDENT_SESSION_STATUSES)[number];
