"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Check, Copy, Eye, Link2, Plus, Share2 } from "lucide-react";
import { toast } from "sonner";

import {
  AdminPagination,
  AdminTableSkeleton,
  AdminTableToolbar,
  adminFilterSelectClass,
  adminTableHeadClass,
  adminTableRowClass,
  adminTableWrapClass,
} from "@/components/crm/admin-table";
import { PageHelp } from "@/components/crm/page-help";
import { ADMIN_PAGE_HELP } from "@/constants/admin-page-help";
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
import { downloadCsv } from "@/utils/download-csv";
import { formatCurrency, formatNumber, formatPercent } from "@/utils/format";

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
  const [copiedAllocationId, setCopiedAllocationId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const copyRoutingLink = async (routingLink: string, allocationId: string) => {
    const link = `${routingLink}?toid=RESPONDENT_ID`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedAllocationId(allocationId);
      toast.success("Vendor routing link copied");
      setTimeout(() => setCopiedAllocationId(null), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const filters = useMemo(
    () => ({
      search: deferredSearch,
      status: status || undefined,
      panelSurveyId: surveyId || undefined,
      vendorId: vendorId || undefined,
      page,
      pageSize,
    }),
    [deferredSearch, status, surveyId, vendorId, page, pageSize]
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
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleExport = () => {
    downloadCsv(
      `vendor-allocations-${Date.now()}.csv`,
      [
        "Code",
        "Survey",
        "Vendor",
        "Status",
        "Completes",
        "Allocated",
        "Vendor CPI",
        "Client CPI",
        "Revenue",
        "Cost",
        "Conversion %",
      ],
      items.map((row) => {
        const revenue = (row.completedCount ?? 0) * (row.clientCpi ?? 0);
        const cost = (row.completedCount ?? 0) * (row.vendorCpi ?? 0);
        return [
          row.allocationCode,
          row.panelSurvey?.surveyName ?? "",
          row.vendor?.companyName ?? "",
          row.status,
          row.completedCount,
          row.allocatedQuota,
          row.vendorCpi ?? 0,
          row.clientCpi ?? 0,
          revenue,
          cost,
          row.conversionRate,
        ];
      })
    );
  };

  return (
    <div className="space-y-8 text-gray-900">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
            Survey distribution
          </p>
          <h1 className="text-2xl font-black tracking-tight">Vendor Allocations</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">
            Assign panel surveys to vendor partners, distribute quota, and manage routing links.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PageHelp content={ADMIN_PAGE_HELP.vendorAllocations} />
          <Link href={ROUTES.admin.vendorAllocationsCreate} className={primaryBtn}>
            <Plus className="h-4 w-4" />
            New allocation
          </Link>
        </div>
      </div>

      <div className={adminTableWrapClass}>
        <AdminTableToolbar
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          searchPlaceholder="Search by code or notes…"
          onExport={handleExport}
          exportDisabled={items.length === 0}
          filters={
            <>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as VendorAllocationStatus | "");
                  setPage(1);
                }}
                className={adminFilterSelectClass}
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
                onChange={(e) => {
                  setSurveyId(e.target.value);
                  setPage(1);
                }}
                className={`${adminFilterSelectClass} max-w-[200px] truncate`}
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
                onChange={(e) => {
                  setVendorId(e.target.value);
                  setPage(1);
                }}
                className={adminFilterSelectClass}
              >
                <option value="">All vendors</option>
                {(vendorsData?.items ?? []).map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.vendorCode}
                  </option>
                ))}
              </select>
            </>
          }
        />

        {isLoading ? (
          <AdminTableSkeleton rows={6} />
        ) : items.length === 0 ? (
          <EmptyState icon={Share2}>
            <Link href={ROUTES.admin.vendorAllocationsCreate} className={primaryBtn}>
              <Plus className="h-4 w-4" />
              Create New
            </Link>
          </EmptyState>
        ) : (
          <>
            <div className="overflow-x-auto custom-scrollbar rounded-xl border border-slate-200/90 bg-white shadow-sm">
              <table className="w-full min-w-[750px] text-xs text-slate-800">
                <thead className="bg-[#091428] text-white">
                  <tr className="text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-100">
                    <th className="px-3 py-2 whitespace-nowrap">Ref</th>
                    <th className="px-3 py-2 whitespace-nowrap">Survey</th>
                    <th className="px-3 py-2 whitespace-nowrap">Vendor</th>
                    <th className="px-3 py-2 whitespace-nowrap">Status</th>
                    <th className="px-3 py-2 whitespace-nowrap">Progress</th>
                    <th className="px-3 py-2 whitespace-nowrap">Revenue</th>
                    <th className="px-3 py-2 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((row) => {
                    const revenue = (row.completedCount ?? 0) * (row.clientCpi ?? 0);
                    return (
                      <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                        <td
                          className="px-3 py-1.5 font-mono text-xs font-bold whitespace-nowrap align-middle"
                          title={row.routingSlug}
                        >
                          <Link
                            href={ROUTES.admin.vendorAllocation(row.id)}
                            className="text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            {row.allocationCode}
                          </Link>
                        </td>
                        <td className="px-3 py-1.5 max-w-[200px] align-middle">
                          <p
                            className="font-bold text-slate-900 truncate text-xs"
                            title={row.panelSurvey?.surveyName}
                          >
                            {row.panelSurvey?.surveyName ?? "—"}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {row.panelSurvey?.surveyCode}
                          </span>
                        </td>
                        <td className="px-3 py-1.5 max-w-[160px] align-middle">
                          <p
                            className="font-bold text-slate-900 truncate text-xs"
                            title={row.vendor?.companyName}
                          >
                            {row.vendor?.companyName ?? "—"}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {row.vendor?.vendorCode}
                          </span>
                        </td>
                        <td className="px-3 py-1.5 whitespace-nowrap align-middle">
                          <AllocationStatusBadge status={row.status} />
                        </td>
                        <td className="px-3 py-1.5 whitespace-nowrap align-middle">
                          <AllocationQuotaBar
                            completed={row.completedCount}
                            allocated={row.allocatedQuota}
                          />
                        </td>
                        <td className="px-3 py-1.5 text-xs font-bold tabular-nums text-emerald-700 whitespace-nowrap align-middle">
                          {formatCurrency(revenue)}
                        </td>
                        <td className="px-3 py-1.5 text-right align-middle whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1 flex-nowrap whitespace-nowrap shrink-0">
                            <Link
                              href={ROUTES.admin.vendorAllocation(row.id)}
                              className="h-7 px-2 inline-flex items-center gap-1 rounded-md bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700 shadow-sm shrink-0 transition-colors"
                              title="Open Allocation"
                            >
                              <span>Open</span>
                              <Eye className="h-3 w-3" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => copyRoutingLink(row.routingLink, row.id)}
                              className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shrink-0 transition-colors"
                              title="Copy vendor routing link"
                              aria-label="Copy vendor routing link"
                            >
                              {copiedAllocationId === row.id ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <a
                              href={row.routingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shrink-0 transition-colors"
                              title="Test routing link (needs toid)"
                            >
                              <Link2 className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <AdminPagination
              page={page}
              totalPages={totalPages}
              total={meta?.total}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(n) => {
                setPageSize(n);
                setPage(1);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
