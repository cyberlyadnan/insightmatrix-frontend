"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, Loader2 } from "lucide-react";

import { CopyRoutingLinkButton } from "@/components/vendor/copy-routing-link-button";
import {
  VENDOR_ALLOCATION_STATUS_LABELS,
  VENDOR_ALLOCATION_STATUS_STYLES,
  type VendorAllocationStatus,
} from "@/constants/vendor-allocation";
import { ROUTES } from "@/constants/routes";
import { getVendorPortalSurvey } from "@/services/vendor-portal/vendor-surveys-api";
import { queryKeys } from "@/services/queries";

function StatusBadge({ status }: { status: VendorAllocationStatus }) {
  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${VENDOR_ALLOCATION_STATUS_STYLES[status]}`}
    >
      {VENDOR_ALLOCATION_STATUS_LABELS[status]}
    </span>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-xl font-black text-gray-900">{value}</p>
    </div>
  );
}

export default function VendorSurveyDetailPage() {
  const params = useParams();
  const allocationId = typeof params.allocationId === "string" ? params.allocationId : "";

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.vendorPortalSurveys.detail(allocationId),
    queryFn: () => getVendorPortalSurvey(allocationId),
    enabled: Boolean(allocationId),
  });

  const allocation = data?.allocation;
  const analytics = data?.analytics;

  if (!allocationId) {
    return <p className="text-gray-500">Invalid allocation.</p>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (isError || !allocation) {
    return <p className="text-rose-600 text-sm">Survey allocation not found.</p>;
  }

  const pct =
    allocation.allocatedQuota > 0
      ? Math.min(100, Math.round((allocation.completedCount / allocation.allocatedQuota) * 100))
      : 0;

  return (
    <div className="space-y-8">
      <Link
        href={ROUTES.vendor.surveys}
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-brand-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to surveys
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {allocation.allocationCode}
          </p>
          <h1 className="text-2xl font-black text-brand-accent1">{allocation.surveyName}</h1>
          <p className="text-sm text-muted-foreground">{allocation.surveyCode}</p>
        </div>
        <StatusBadge status={allocation.status} />
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 space-y-4">
        <p className="text-sm font-semibold text-gray-700">Routing link</p>
        <p className="text-xs text-gray-500">
          Append your respondent id: <code className="font-mono">?toid=USER_ID</code>
        </p>
        <p className="text-xs font-mono text-gray-600 break-all bg-slate-50 rounded-lg p-3">
          {allocation.routingLink}?toid=RESPONDENT_ID
        </p>
        <CopyRoutingLinkButton routingLink={`${allocation.routingLink}?toid=RESPONDENT_ID`} />
      </div>

      <div>
        <div className="flex justify-between text-xs font-bold text-muted-foreground mb-2">
          <span>Quota progress</span>
          <span>
            {allocation.completedCount} / {allocation.allocatedQuota} completes ·{" "}
            {allocation.liveRemainingQuota} remaining
          </span>
        </div>
        <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full bg-brand-primary rounded-full" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Starts" value={allocation.startedCount} />
        <MetricCard label="Completes" value={allocation.completedCount} />
        <MetricCard label="Terminates" value={allocation.terminateCount} />
        <MetricCard label="Quality rejects" value={allocation.qualityRejectCount} />
        <MetricCard label="Quota full" value={allocation.quotaFullCount} />
        <MetricCard label="Conversion rate" value={`${allocation.conversionRate}%`} />
        <MetricCard label="Incidence rate" value={`${allocation.incidenceRate}%`} />
        <MetricCard label="Vendor CPI" value={`$${allocation.vendorCpi}`} />
      </div>

      {analytics && (
        <p className="text-xs text-muted-foreground">
          Redirects recorded: {analytics.redirectCount}
        </p>
      )}

      {(allocation.startDate || allocation.endDate) && (
        <p className="text-sm text-muted-foreground">
          Active window: {allocation.startDate ? format(new Date(allocation.startDate), "PP") : "—"}
          {" – "}
          {allocation.endDate ? format(new Date(allocation.endDate), "PP") : "—"}
        </p>
      )}
    </div>
  );
}
