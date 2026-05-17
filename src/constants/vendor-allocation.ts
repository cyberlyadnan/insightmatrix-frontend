export const VENDOR_ALLOCATION_STATUSES = ["active", "paused", "completed", "closed"] as const;
export type VendorAllocationStatus = (typeof VENDOR_ALLOCATION_STATUSES)[number];

export const VENDOR_ALLOCATION_STATUS_LABELS: Record<VendorAllocationStatus, string> = {
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  closed: "Closed",
};

export const VENDOR_ALLOCATION_STATUS_STYLES: Record<VendorAllocationStatus, string> = {
  active: "bg-emerald-50 text-emerald-700",
  paused: "bg-amber-50 text-amber-700",
  completed: "bg-slate-100 text-slate-600",
  closed: "bg-gray-100 text-gray-600",
};
