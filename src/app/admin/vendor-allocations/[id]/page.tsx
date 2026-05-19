"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, ExternalLink, Loader2, Pause, Play, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { AllocationQuotaBar } from "@/components/admin/vendor-allocations/allocation-quota-bar";
import { AllocationStatusBadge } from "@/components/admin/vendor-allocations/allocation-status-badge";
import { CopyRoutingLinkButton } from "@/components/vendor/copy-routing-link-button";
import { ROUTES } from "@/constants/routes";
import { parseApiError } from "@/services/api/errors";
import {
  closeVendorAllocation,
  deleteVendorAllocation,
  getVendorAllocation,
  getVendorAllocationAnalytics,
  pauseVendorAllocation,
  resumeVendorAllocation,
  updateVendorAllocation,
} from "@/services/vendor-allocation/vendor-allocation-api";
import { queryKeys } from "@/services/queries";

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
      <p className="mt-1 text-xl font-black text-gray-900">{value}</p>
    </div>
  );
}

export default function VendorAllocationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const qc = useQueryClient();
  const id = typeof params.id === "string" ? params.id : "";
  const [quotaEdit, setQuotaEdit] = useState<number | null>(null);

  const {
    data: allocation,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.vendorAllocations.detail(id),
    queryFn: () => getVendorAllocation(id),
    enabled: Boolean(id),
  });

  const { data: analytics } = useQuery({
    queryKey: queryKeys.vendorAllocations.analytics(id),
    queryFn: () => getVendorAllocationAnalytics(id),
    enabled: Boolean(id),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: queryKeys.vendorAllocations.detail(id) });
    qc.invalidateQueries({ queryKey: queryKeys.vendorAllocations.analytics(id) });
    qc.invalidateQueries({ queryKey: queryKeys.vendorAllocations.all });
  };

  const pauseMut = useMutation({
    mutationFn: () => pauseVendorAllocation(id),
    onSuccess: () => {
      toast.success("Paused");
      invalidate();
    },
    onError: (e) => toast.error(parseApiError(e)),
  });

  const resumeMut = useMutation({
    mutationFn: () => resumeVendorAllocation(id),
    onSuccess: () => {
      toast.success("Resumed");
      invalidate();
    },
    onError: (e) => toast.error(parseApiError(e)),
  });

  const closeMut = useMutation({
    mutationFn: () => closeVendorAllocation(id),
    onSuccess: () => {
      toast.success("Closed");
      invalidate();
    },
    onError: (e) => toast.error(parseApiError(e)),
  });

  const deleteMut = useMutation({
    mutationFn: () => deleteVendorAllocation(id),
    onSuccess: () => {
      toast.success("Removed");
      router.push(ROUTES.admin.vendorAllocations);
    },
    onError: (e) => toast.error(parseApiError(e)),
  });

  const quotaMut = useMutation({
    mutationFn: (q: number) => updateVendorAllocation(id, { allocatedQuota: q }),
    onSuccess: () => {
      toast.success("Quota updated");
      setQuotaEdit(null);
      invalidate();
    },
    onError: (e) => toast.error(parseApiError(e)),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (isError || !allocation) {
    return <p className="text-rose-600">Allocation not found.</p>;
  }

  const surveyRemaining = allocation.panelSurvey?.remainingQuota ?? 0;

  return (
    <div className="space-y-8 max-w-4xl text-gray-900">
      <Link
        href={ROUTES.admin.vendorAllocations}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        All allocations
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm font-bold text-brand-primary">
            Ref {allocation.allocationCode}
          </p>
          <h1 className="text-2xl font-black mt-1">{allocation.panelSurvey?.surveyName}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Vendor: {allocation.vendor?.companyName} ({allocation.vendor?.vendorCode})
          </p>
        </div>
        <AllocationStatusBadge status={allocation.status} />
      </div>

      <div className="flex flex-wrap gap-2">
        {allocation.status === "active" && (
          <button
            type="button"
            onClick={() => pauseMut.mutate()}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800"
          >
            <Pause className="h-4 w-4" />
            Pause
          </button>
        )}
        {allocation.status === "paused" && (
          <button
            type="button"
            onClick={() => resumeMut.mutate()}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800"
          >
            <Play className="h-4 w-4" />
            Resume
          </button>
        )}
        {allocation.status !== "closed" && (
          <button
            type="button"
            onClick={() => closeMut.mutate()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <XCircle className="h-4 w-4" />
            Close
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (confirm("Remove allocation? Only allowed with zero sessions.")) deleteMut.mutate();
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"
        >
          <Trash2 className="h-4 w-4" />
          Remove
        </button>
        {allocation.panelSurvey?.id || allocation.panelSurveyId ? (
          <Link
            href={ROUTES.admin.survey(allocation.panelSurvey?.id ?? allocation.panelSurveyId)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <ExternalLink className="h-4 w-4" />
            View survey
          </Link>
        ) : null}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-900">Routing link (vendor-facing)</h2>
        <p className="text-xs text-gray-500">
          Vendors append their respondent id:{" "}
          <code className="font-mono bg-slate-100 px-1 rounded">?toid=THEIR_USER_ID</code>
        </p>
        <p className="text-xs font-mono text-gray-600 break-all bg-slate-50 rounded-lg p-3">
          {allocation.routingLink}?toid=RESPONDENT_ID
        </p>
        <CopyRoutingLinkButton routingLink={`${allocation.routingLink}?toid=RESPONDENT_ID`} />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <AllocationQuotaBar
          completed={allocation.completedCount}
          allocated={allocation.allocatedQuota}
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {quotaEdit === null ? (
            <button
              type="button"
              onClick={() => setQuotaEdit(allocation.allocatedQuota)}
              className="text-sm font-semibold text-brand-primary"
            >
              Edit allocated quota
            </button>
          ) : (
            <>
              <input
                type="number"
                min={1}
                max={surveyRemaining + allocation.allocatedQuota}
                className="w-28 rounded-lg border px-3 py-2 text-sm"
                value={quotaEdit}
                onChange={(e) => setQuotaEdit(Number(e.target.value))}
              />
              <button
                type="button"
                onClick={() => quotaMut.mutate(quotaEdit)}
                className="text-sm font-bold text-gray-900"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setQuotaEdit(null)}
                className="text-sm text-gray-500"
              >
                Cancel
              </button>
            </>
          )}
          <span className="text-xs text-gray-500">
            {allocation.liveRemainingQuota} completes remaining · Survey pool {surveyRemaining}
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Starts" value={allocation.startedCount} />
        <MetricCard label="Completes" value={allocation.completedCount} />
        <MetricCard label="Conversion rate" value={`${allocation.conversionRate}%`} />
        <MetricCard label="Incidence rate" value={`${allocation.incidenceRate}%`} />
        <MetricCard label="Terminates" value={allocation.terminateCount} />
        <MetricCard label="Quota full" value={allocation.quotaFullCount} />
        <MetricCard label="Quality reject" value={allocation.qualityRejectCount} />
        <MetricCard label="Vendor CPI" value={`$${allocation.vendorCpi}`} />
        {analytics ? <MetricCard label="Redirects" value={analytics.redirectCount} /> : null}
      </div>

      {(allocation.startDate || allocation.endDate || allocation.notes) && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm space-y-2">
          {allocation.startDate || allocation.endDate ? (
            <p>
              <span className="font-semibold text-gray-700">Window: </span>
              {allocation.startDate ? format(new Date(allocation.startDate), "PP") : "—"}
              {" – "}
              {allocation.endDate ? format(new Date(allocation.endDate), "PP") : "—"}
            </p>
          ) : null}
          {allocation.notes ? (
            <p className="text-gray-600 whitespace-pre-wrap">{allocation.notes}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
