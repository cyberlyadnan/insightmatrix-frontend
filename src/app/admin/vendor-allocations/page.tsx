"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Eye, Link2, Plus, Search } from "lucide-react";

import { AllocationQuotaBar } from "@/components/admin/vendor-allocations/allocation-quota-bar";
import { AllocationStatusBadge } from "@/components/admin/vendor-allocations/allocation-status-badge";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  VENDOR_ALLOCATION_STATUSES,
  type VendorAllocationStatus,
} from "@/constants/vendor-allocation";
import { ROUTES } from "@/constants/routes";
import { listVendorAllocations } from "@/services/vendor-allocation/vendor-allocation-api";
import { listVendors } from "@/services/vendor/vendor-api";
import { listPanelSurveys } from "@/services/panel-survey";
import { queryKeys } from "@/services/queries";

const primaryBtn =
  "h-11 px-5 rounded-xl bg-gray-900 text-white inline-flex items-center justify-center gap-2 font-bold hover:bg-black shrink-0";

export default function AdminVendorAllocationsPage() {
  const searchParams = useSearchParams();
  const surveyFromUrl = searchParams.get("survey") ?? "";

  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [status, setStatus] = useState<VendorAllocationStatus | "">("");
  const [surveyId, setSurveyId] = useState(() => surveyFromUrl);
  const [vendorId, setVendorId] = useState("");

  const filters = useMemo(
    () => ({
      search: deferredSearch,
      status: status || undefined,
      panelSurveyId: surveyId || undefined,
      vendorId: vendorId || undefined,
      page: 1,
      pageSize: 50,
    }),
    [deferredSearch, status, surveyId, vendorId]
  );

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.vendorAllocations.list(filters),
    queryFn: () => listVendorAllocations(filters),
  });

  const { data: surveysData } = useQuery({
    queryKey: queryKeys.panelSurveys.list({ pageSize: 100, surveyStatus: "active" }),
    queryFn: () => listPanelSurveys({ pageSize: 100, surveyStatus: "active" }),
  });

  const { data: vendorsData } = useQuery({
    queryKey: queryKeys.vendors.list({ pageSize: 100 }),
    queryFn: () => listVendors({ pageSize: 100 }),
  });

  const items = data?.items ?? [];

  return (
    <div className="space-y-8 text-gray-900">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
            Survey distribution
          </p>
          <h1 className="text-2xl font-black tracking-tight">Vendor allocations</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">
            Assign panel surveys to vendor partners, distribute quota, and manage routing links.
          </p>
        </div>
        <Link href={ROUTES.admin.vendorAllocationsCreate} className={primaryBtn}>
          <Plus className="h-4 w-4" />
          New allocation
        </Link>
      </div>

      <div className="flex flex-col xl:flex-row gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search by code or notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as VendorAllocationStatus | "")}
          className="h-11 rounded-xl border border-gray-200 px-3 bg-white text-sm font-medium min-w-[140px]"
        >
          <option value="">All statuses</option>
          {VENDOR_ALLOCATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={surveyId}
          onChange={(e) => setSurveyId(e.target.value)}
          className="h-11 rounded-xl border border-gray-200 px-3 bg-white text-sm font-medium min-w-[180px]"
        >
          <option value="">All surveys</option>
          {(surveysData?.items ?? []).map((s) => (
            <option key={s.id} value={s.id}>
              {s.surveyCode} — {s.surveyName}
            </option>
          ))}
        </select>
        <select
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
          className="h-11 rounded-xl border border-gray-200 px-3 bg-white text-sm font-medium min-w-[160px]"
        >
          <option value="">All vendors</option>
          {(vendorsData?.items ?? []).map((v) => (
            <option key={v.id} value={v.id}>
              {v.vendorCode}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500 py-12 text-center">Loading allocations…</p>
      ) : items.length === 0 ? (
        <EmptyState
          title="No allocations yet"
          description="Assign a survey to a vendor partner to generate routing links and track performance."
        >
          <Link href={ROUTES.admin.vendorAllocationsCreate} className={primaryBtn}>
            <Plus className="h-4 w-4" />
            Create allocation
          </Link>
        </EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-[10px] font-black uppercase tracking-widest text-gray-500">
                <th className="px-4 py-3">Ref</th>
                <th className="px-4 py-3">Survey</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Metrics</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                  <td className="px-4 py-4 font-mono text-xs font-bold" title={row.routingSlug}>
                    {row.allocationCode}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-gray-900 line-clamp-1">
                      {row.panelSurvey?.surveyName ?? "—"}
                    </p>
                    <p className="text-xs text-gray-500">{row.panelSurvey?.surveyCode}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{row.vendor?.companyName ?? "—"}</p>
                    <p className="text-xs text-gray-500 font-mono">{row.vendor?.vendorCode}</p>
                  </td>
                  <td className="px-4 py-4">
                    <AllocationStatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-4">
                    <AllocationQuotaBar
                      completed={row.completedCount}
                      allocated={row.allocatedQuota}
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      {row.liveRemainingQuota} remaining
                    </p>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-600">
                    <p>
                      CR {row.conversionRate}% · IR {row.incidenceRate}%
                    </p>
                    <p>
                      S {row.startedCount} · C {row.completedCount} · T {row.terminateCount}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={ROUTES.admin.vendorAllocation(row.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <a
                        href={row.routingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-brand-subtle text-brand-primary"
                        title="Open routing link"
                      >
                        <Link2 className="h-4 w-4" />
                      </a>
                    </div>
                    {row.updatedAt ? (
                      <p className="text-[10px] text-gray-400 text-right mt-1">
                        {format(new Date(row.updatedAt), "MMM d, yyyy")}
                      </p>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
