"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowRight, ClipboardList, Loader2 } from "lucide-react";

import { CopyRoutingLinkButton } from "@/components/vendor/copy-routing-link-button";
import {
  VENDOR_ALLOCATION_STATUS_LABELS,
  VENDOR_ALLOCATION_STATUS_STYLES,
  type VendorAllocationStatus,
} from "@/constants/vendor-allocation";
import { ROUTES } from "@/constants/routes";
import { listVendorPortalSurveys } from "@/services/vendor-portal/vendor-surveys-api";
import { queryKeys } from "@/services/queries";

function QuotaProgress({ completed, allocated }: { completed: number; allocated: number }) {
  const pct = allocated > 0 ? Math.min(100, Math.round((completed / allocated) * 100)) : 0;
  return (
    <div className="mt-3">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
        <span>Completes</span>
        <span>
          {completed} / {allocated}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-brand-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: VendorAllocationStatus }) {
  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${VENDOR_ALLOCATION_STATUS_STYLES[status]}`}
    >
      {VENDOR_ALLOCATION_STATUS_LABELS[status]}
    </span>
  );
}

export default function VendorSurveysPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.vendorPortalSurveys.list({}),
    queryFn: () => listVendorPortalSurveys({ pageSize: 50 }),
  });

  const items = data?.items ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-brand-accent1">Assigned surveys</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Use your routing links to send traffic — supplier URLs are never shown here.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      ) : isError ? (
        <p className="text-sm text-rose-600">Could not load surveys.</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <ClipboardList className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="font-semibold text-gray-700">No surveys assigned yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Contact your account manager for allocations.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-border bg-white p-5 shadow-sm flex flex-col"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {item.allocationCode}
                  </p>
                  <h2 className="font-bold text-gray-900 mt-0.5">{item.surveyName}</h2>
                  <p className="text-xs text-muted-foreground">{item.surveyCode}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>

              <QuotaProgress completed={item.completedCount} allocated={item.allocatedQuota} />

              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <dt className="text-[10px] font-bold uppercase text-muted-foreground">IR</dt>
                  <dd className="text-sm font-black text-gray-900">{item.incidenceRate}%</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase text-muted-foreground">CR</dt>
                  <dd className="text-sm font-black text-gray-900">{item.conversionRate}%</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase text-muted-foreground">CPI</dt>
                  <dd className="text-sm font-black text-gray-900">${item.vendorCpi}</dd>
                </div>
              </dl>

              {(item.startDate || item.endDate) && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {item.startDate ? format(new Date(item.startDate), "MMM d, yyyy") : "—"}
                  {" → "}
                  {item.endDate ? format(new Date(item.endDate), "MMM d, yyyy") : "—"}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <CopyRoutingLinkButton
                  routingLink={item.routingLink}
                  className="flex-1 min-w-[140px]"
                />
                <Link
                  href={ROUTES.vendor.survey(item.id)}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
