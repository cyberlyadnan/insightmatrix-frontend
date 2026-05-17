import {
  VENDOR_ALLOCATION_STATUS_LABELS,
  VENDOR_ALLOCATION_STATUS_STYLES,
  type VendorAllocationStatus,
} from "@/constants/vendor-allocation";

export function AllocationStatusBadge({ status }: { status: VendorAllocationStatus }) {
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${VENDOR_ALLOCATION_STATUS_STYLES[status]}`}
    >
      {VENDOR_ALLOCATION_STATUS_LABELS[status]}
    </span>
  );
}
