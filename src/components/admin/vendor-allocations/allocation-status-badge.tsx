import {
  VENDOR_ALLOCATION_STATUS_LABELS,
  VENDOR_ALLOCATION_STATUS_STYLES,
  type VendorAllocationStatus,
} from "@/constants/vendor-allocation";

export function AllocationStatusBadge({ status }: { status: VendorAllocationStatus }) {
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border leading-none ${VENDOR_ALLOCATION_STATUS_STYLES[status]}`}
    >
      {VENDOR_ALLOCATION_STATUS_LABELS[status]}
    </span>
  );
}
