"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Check,
  CheckCircle2,
  ClipboardList,
  Copy,
  Eye,
  Globe,
  Layers,
  Loader2,
  Lock,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  AdminPagination,
  AdminProgressBar,
  AdminTableSkeleton,
  AdminTableToolbar,
  adminFilterSelectClass,
  adminTableContainerClass,
  adminTableWrapClass,
} from "@/components/crm/admin-table";
import { ConfirmDialog } from "@/components/crm/confirm-dialog";
import {
  AllocationStatusBadge,
  VendorResponseStatusBadge,
} from "@/components/admin/vendor-allocations/allocation-status-badge";
import {
  VENDOR_ALLOCATION_RESPONSE_LABELS,
  VENDOR_ALLOCATION_RESPONSE_STATUSES,
  VENDOR_ALLOCATION_STATUS_LABELS,
  VENDOR_ALLOCATION_STATUSES,
  type VendorAllocationResponseStatus,
  type VendorAllocationStatus,
} from "@/constants/vendor-allocation";
import { ROUTES } from "@/constants/routes";
import { parseApiError } from "@/services/api/errors";
import {
  acceptVendorPortalSurvey,
  listVendorPortalSurveys,
  rejectVendorPortalSurvey,
} from "@/services/vendor-portal/vendor-surveys-api";
import { queryKeys } from "@/services/queries";
import type { VendorPortalAllocation } from "@/types/vendor-allocation";
import { downloadCsv } from "@/utils/download-csv";
import { formatCurrency, formatNumber } from "@/utils/format";

function formatAgeRange(min: number | null, max: number | null): string | null {
  if (min != null && max != null) return `Age ${min}–${max}`;
  if (min != null) return `Age ${min}+`;
  if (max != null) return `Age ≤${max}`;
  return null;
}

function formatTargetingSnippet(item: VendorPortalAllocation): string {
  const parts: string[] = [];
  if (item.targetGender && item.targetGender !== "all") {
    parts.push(item.targetGender.charAt(0).toUpperCase() + item.targetGender.slice(1));
  }
  const age = formatAgeRange(item.targetAgeMin, item.targetAgeMax);
  if (age) parts.push(age);
  if (item.targetDevices?.length) {
    parts.push(item.targetDevices.join("/"));
  }
  if (item.targetLanguages?.length) {
    parts.push(item.targetLanguages.slice(0, 2).join(", "));
  }
  return parts.join(" · ");
}

export default function VendorSurveysPage() {
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | VendorAllocationStatus>("");
  const [responseFilter, setResponseFilter] = useState<"" | VendorAllocationResponseStatus>("");
  const [countryFilter, setCountryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<VendorPortalAllocation | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.vendorPortalSurveys.list({ pageSize: 100 }),
    queryFn: () => listVendorPortalSurveys({ pageSize: 100 }),
  });

  const items = useMemo(() => data?.items ?? [], [data?.items]);

  const invalidateVendorSurveys = async () => {
    await qc.invalidateQueries({ queryKey: queryKeys.vendorPortalSurveys.all });
    await qc.invalidateQueries({ queryKey: queryKeys.vendorAuth.dashboard });
  };

  const acceptMutation = useMutation({
    mutationFn: (allocationId: string) => {
      setPendingActionId(allocationId);
      return acceptVendorPortalSurvey(allocationId);
    },
    onSuccess: async () => {
      toast.success("Survey allocation accepted! Routing link is now unlocked.");
      await invalidateVendorSurveys();
    },
    onError: (err) => toast.error(parseApiError(err, "Could not accept survey allocation")),
    onSettled: () => setPendingActionId(null),
  });

  const rejectMutation = useMutation({
    mutationFn: (allocationId: string) => {
      setPendingActionId(allocationId);
      return rejectVendorPortalSurvey(allocationId);
    },
    onSuccess: async () => {
      toast.success("Survey allocation rejected.");
      setRejectTarget(null);
      await invalidateVendorSurveys();
    },
    onError: (err) => toast.error(parseApiError(err, "Could not reject survey allocation")),
    onSettled: () => setPendingActionId(null),
  });

  // Collect all unique countries from allotted surveys for dropdown filter
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      for (const c of item.targetCountries ?? []) {
        if (c) set.add(c.toUpperCase());
      }
    }
    return Array.from(set).sort();
  }, [items]);

  // Filter items client-side
  const filteredItems = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter && item.status !== statusFilter) return false;
      if (responseFilter && item.vendorResponseStatus !== responseFilter) return false;
      if (
        countryFilter &&
        !(item.targetCountries ?? []).some((c) => c.toUpperCase() === countryFilter)
      ) {
        return false;
      }
      if (!q) return true;

      return (
        item.surveyName.toLowerCase().includes(q) ||
        item.surveyCode.toLowerCase().includes(q) ||
        item.allocationCode.toLowerCase().includes(q) ||
        (item.targetCountries ?? []).some((c) => c.toLowerCase().includes(q)) ||
        (item.targetLanguages ?? []).some((l) => l.toLowerCase().includes(q)) ||
        (item.targetProfessions ?? []).some((p) => p.toLowerCase().includes(q)) ||
        (item.targetIndustries ?? []).some((i) => i.toLowerCase().includes(q))
      );
    });
  }, [items, searchTerm, statusFilter, responseFilter, countryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, safePage, pageSize]);

  // Aggregate summary counts
  const pendingCount = items.filter((i) => i.vendorResponseStatus === "pending").length;
  const acceptedCount = items.filter((i) => i.vendorResponseStatus === "accepted").length;
  const rejectedCount = items.filter((i) => i.vendorResponseStatus === "rejected").length;
  const totalAllocated = items.reduce((acc, curr) => acc + (curr.allocatedQuota || 0), 0);
  const totalCompleted = items.reduce((acc, curr) => acc + (curr.completedCount || 0), 0);

  const copyRoutingLink = async (item: VendorPortalAllocation) => {
    if (item.vendorResponseStatus !== "accepted" || !item.routingLink) return;
    const link = `${item.routingLink}?toid=RESPONDENT_ID`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(item.id);
      toast.success("Routing link copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const handleExport = () => {
    downloadCsv(
      `vendor-surveys-${Date.now()}.csv`,
      [
        "Allocation Ref",
        "Survey Code",
        "Survey Name",
        "Countries",
        "Languages",
        "Gender",
        "Age Min",
        "Age Max",
        "Devices",
        "LOI (min)",
        "IR (%)",
        "Vendor CPI ($)",
        "Allocated Quota",
        "Completed",
        "Remaining Quota",
        "Survey Total Quota",
        "Survey Remaining Quota",
        "Allocation Status",
        "Response Status",
        "Routing Link",
      ],
      filteredItems.map((row) => [
        row.allocationCode,
        row.surveyCode,
        row.surveyName,
        row.targetCountries?.length ? row.targetCountries.join(", ") : "Global",
        row.targetLanguages?.join(", ") ?? "",
        row.targetGender || "all",
        row.targetAgeMin ?? "",
        row.targetAgeMax ?? "",
        row.targetDevices?.join(", ") ?? "",
        row.estimatedLOI ?? "",
        row.surveyIncidenceRate ?? row.incidenceRate ?? "",
        row.vendorCpi ?? 0,
        row.allocatedQuota,
        row.completedCount,
        row.liveRemainingQuota,
        row.surveyTotalQuota,
        row.surveyRemainingQuota,
        row.status,
        row.vendorResponseStatus,
        row.vendorResponseStatus === "accepted" && row.routingLink
          ? `${row.routingLink}?toid=RESPONDENT_ID`
          : "Locked until accepted",
      ])
    );
  };

  const hasActiveFilters = Boolean(searchTerm || statusFilter || responseFilter || countryFilter);

  return (
    <div className="space-y-6 pb-10 text-gray-900">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand-primary">
            <Layers className="h-3.5 w-3.5" />
            Campaign Inventory
          </span>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-900">
            Assigned Surveys
          </h1>
          <p className="mt-1 text-sm text-gray-500 max-w-2xl">
            Review full survey specifications (country, targeting, LOI, IR, and quota). Accept an
            allocation to unlock its live routing link, or reject studies that do not match your
            panel.
          </p>
        </div>

        {/* Summary Pill Strip */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-sm">
            <span className="text-slate-400 font-medium">Allotted: </span>
            <span className="font-extrabold text-slate-900">{items.length}</span>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-1.5 text-xs shadow-sm">
            <span className="text-amber-700 font-medium">Pending: </span>
            <span className="font-extrabold text-amber-900">{pendingCount}</span>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs shadow-sm">
            <span className="text-emerald-700 font-medium">Accepted: </span>
            <span className="font-extrabold text-emerald-900">{acceptedCount}</span>
          </div>
          {rejectedCount > 0 && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 px-3 py-1.5 text-xs shadow-sm">
              <span className="text-rose-700 font-medium">Rejected: </span>
              <span className="font-extrabold text-rose-900">{rejectedCount}</span>
            </div>
          )}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs shadow-sm">
            <span className="text-indigo-700 font-medium">Delivered: </span>
            <span className="font-extrabold text-indigo-900 tabular-nums">
              {formatNumber(totalCompleted)} / {formatNumber(totalAllocated)}
            </span>
          </div>
        </div>
      </div>

      {/* Table Card (matches Admin CRM table styling across the website) */}
      <div className={adminTableWrapClass}>
        <AdminTableToolbar
          search={searchTerm}
          onSearchChange={(v) => {
            setSearchTerm(v);
            setPage(1);
          }}
          searchPlaceholder="Search survey name, code, ref, country, language…"
          onExport={handleExport}
          exportDisabled={filteredItems.length === 0}
          filters={
            <>
              <select
                value={responseFilter}
                onChange={(e) => {
                  setResponseFilter(e.target.value as "" | VendorAllocationResponseStatus);
                  setPage(1);
                }}
                className={adminFilterSelectClass}
                aria-label="Filter by response status"
              >
                <option value="">All responses</option>
                {VENDOR_ALLOCATION_RESPONSE_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {VENDOR_ALLOCATION_RESPONSE_LABELS[st]}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as "" | VendorAllocationStatus);
                  setPage(1);
                }}
                className={adminFilterSelectClass}
                aria-label="Filter by allocation status"
              >
                <option value="">All statuses</option>
                {VENDOR_ALLOCATION_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {VENDOR_ALLOCATION_STATUS_LABELS[st]}
                  </option>
                ))}
              </select>

              {availableCountries.length > 0 && (
                <select
                  value={countryFilter}
                  onChange={(e) => {
                    setCountryFilter(e.target.value);
                    setPage(1);
                  }}
                  className={adminFilterSelectClass}
                  aria-label="Filter by country"
                >
                  <option value="">All countries</option>
                  {availableCountries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}
            </>
          }
        />

        {isLoading ? (
          <AdminTableSkeleton rows={6} />
        ) : isError ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-6 text-center text-sm text-rose-700 font-medium">
            Could not load surveys. Please try refreshing the page.
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/40 p-12 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <p className="font-bold text-sm text-slate-800">No matching surveys found</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {hasActiveFilters
                ? "Try clearing your search query or adjusting the active filters."
                : "No survey allocations are currently assigned to your vendor account."}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setResponseFilter("");
                  setCountryFilter("");
                  setPage(1);
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className={adminTableContainerClass}>
              <table className="w-full min-w-[1040px] text-left text-xs text-slate-800">
                <thead className="bg-[#091428] text-white">
                  <tr className="text-[10px] font-extrabold uppercase tracking-wider text-slate-100">
                    <th className="px-3 py-2.5 whitespace-nowrap">Ref / Code</th>
                    <th className="px-3 py-2.5 whitespace-nowrap">Survey & Targeting</th>
                    <th className="px-3 py-2.5 whitespace-nowrap">Country</th>
                    <th className="px-3 py-2.5 whitespace-nowrap">LOI / IR</th>
                    <th className="px-3 py-2.5 whitespace-nowrap">CPI</th>
                    <th className="px-3 py-2.5 whitespace-nowrap">Quota & Progress</th>
                    <th className="px-3 py-2.5 whitespace-nowrap">Status</th>
                    <th className="px-3 py-2.5 whitespace-nowrap">Response</th>
                    <th className="px-3 py-2.5 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedItems.map((row) => {
                    const pct =
                      row.allocatedQuota > 0
                        ? Math.min(100, (row.completedCount / row.allocatedQuota) * 100)
                        : 0;
                    const targeting = formatTargetingSnippet(row);
                    const irValue =
                      row.surveyIncidenceRate != null ? row.surveyIncidenceRate : row.incidenceRate;
                    const isAccepted = row.vendorResponseStatus === "accepted";
                    const isPending = row.vendorResponseStatus === "pending";
                    const canRespond =
                      isPending && row.status !== "closed" && row.status !== "completed";
                    const isRowMutating = pendingActionId === row.id;

                    return (
                      <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                        {/* Ref / Code */}
                        <td className="px-3 py-2.5 align-middle whitespace-nowrap">
                          <Link
                            href={ROUTES.vendor.survey(row.id)}
                            className="font-mono text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline block"
                          >
                            {row.allocationCode}
                          </Link>
                          <span className="text-[10px] font-mono text-slate-400">
                            {row.surveyCode || "—"}
                          </span>
                        </td>

                        {/* Survey & Targeting */}
                        <td className="px-3 py-2.5 align-middle max-w-[260px]">
                          <Link
                            href={ROUTES.vendor.survey(row.id)}
                            className="font-bold text-slate-900 hover:text-blue-600 truncate block text-xs"
                            title={row.surveyName}
                          >
                            {row.surveyName}
                          </Link>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[10px] text-slate-500">
                            {targeting ? (
                              <span className="truncate max-w-[240px]" title={targeting}>
                                {targeting}
                              </span>
                            ) : (
                              <span>General targeting</span>
                            )}
                          </div>
                          {(row.startDate || row.endDate) && (
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {row.startDate ? format(new Date(row.startDate), "MMM d") : "Open"}
                              {" → "}
                              {row.endDate ? format(new Date(row.endDate), "MMM d, yyyy") : "Open"}
                            </p>
                          )}
                        </td>

                        {/* Countries */}
                        <td className="px-3 py-2.5 align-middle whitespace-nowrap">
                          {row.targetCountries && row.targetCountries.length > 0 ? (
                            <div
                              className="flex flex-wrap items-center gap-1 max-w-[140px]"
                              title={row.targetCountries.join(", ")}
                            >
                              {row.targetCountries.slice(0, 3).map((country) => (
                                <span
                                  key={country}
                                  className="inline-flex items-center gap-0.5 rounded bg-slate-100 border border-slate-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700"
                                >
                                  <Globe className="h-2.5 w-2.5 text-slate-400" />
                                  {country}
                                </span>
                              ))}
                              {row.targetCountries.length > 3 && (
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                                  +{row.targetCountries.length - 3}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded bg-slate-50 border border-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                              <Globe className="h-2.5 w-2.5 text-slate-400" />
                              Global
                            </span>
                          )}
                        </td>

                        {/* LOI / IR */}
                        <td className="px-3 py-2.5 align-middle whitespace-nowrap">
                          <div className="font-semibold text-slate-800 tabular-nums">
                            {row.estimatedLOI != null ? `${row.estimatedLOI} min` : "—"}
                          </div>
                          <div className="text-[10px] text-indigo-600 font-semibold tabular-nums">
                            IR: {irValue != null ? `${irValue}%` : "—"}
                          </div>
                        </td>

                        {/* CPI */}
                        <td className="px-3 py-2.5 align-middle whitespace-nowrap">
                          <span className="font-bold text-emerald-700 tabular-nums text-xs">
                            {formatCurrency(row.vendorCpi ?? 0)}
                          </span>
                        </td>

                        {/* Quota & Progress */}
                        <td className="px-3 py-2.5 align-middle whitespace-nowrap min-w-[155px]">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1 tabular-nums">
                            <span>
                              {formatNumber(row.completedCount)} /{" "}
                              {formatNumber(row.allocatedQuota)}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {formatNumber(row.liveRemainingQuota)} left
                            </span>
                          </div>
                          <AdminProgressBar percent={pct} />
                          {row.surveyTotalQuota > 0 && (
                            <p className="text-[10px] text-slate-400 mt-0.5 tabular-nums">
                              Survey quota: {formatNumber(row.surveyRemainingQuota)} rem /{" "}
                              {formatNumber(row.surveyTotalQuota)}
                            </p>
                          )}
                        </td>

                        {/* Allocation Status */}
                        <td className="px-3 py-2.5 align-middle whitespace-nowrap">
                          <AllocationStatusBadge status={row.status} />
                        </td>

                        {/* Vendor Response Status */}
                        <td className="px-3 py-2.5 align-middle whitespace-nowrap">
                          <VendorResponseStatusBadge status={row.vendorResponseStatus} />
                          {!isAccepted && (
                            <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-slate-400 block">
                              <Lock className="h-2.5 w-2.5 inline" /> Link hidden
                            </p>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-2.5 text-right align-middle whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1 flex-nowrap whitespace-nowrap shrink-0">
                            {canRespond && (
                              <>
                                <button
                                  type="button"
                                  disabled={isRowMutating}
                                  onClick={() => acceptMutation.mutate(row.id)}
                                  className="h-7 px-2.5 inline-flex items-center gap-1 rounded-md bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 shadow-sm shrink-0 transition-colors disabled:opacity-50"
                                  title="Accept allocation and unlock survey link"
                                >
                                  {isRowMutating && acceptMutation.isPending ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="h-3 w-3" />
                                  )}
                                  <span>Accept</span>
                                </button>
                                <button
                                  type="button"
                                  disabled={isRowMutating}
                                  onClick={() => setRejectTarget(row)}
                                  className="h-7 px-2 inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 text-rose-700 font-bold text-[11px] hover:bg-rose-100 shrink-0 transition-colors disabled:opacity-50"
                                  title="Reject allocation"
                                >
                                  <XCircle className="h-3 w-3" />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}

                            {isAccepted && row.routingLink && (
                              <button
                                type="button"
                                onClick={() => copyRoutingLink(row)}
                                className="h-7 px-2 inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-800 font-bold text-[11px] hover:bg-emerald-100 shrink-0 transition-colors"
                                title="Copy survey routing link"
                              >
                                {copiedId === row.id ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                                <span>{copiedId === row.id ? "Copied" : "Copy Link"}</span>
                              </button>
                            )}

                            <Link
                              href={ROUTES.vendor.survey(row.id)}
                              className="h-7 px-2 inline-flex items-center gap-1 rounded-md bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700 shadow-sm shrink-0 transition-colors"
                              title="View full survey details"
                            >
                              <span>Details</span>
                              <Eye className="h-3 w-3" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <AdminPagination
              page={safePage}
              totalPages={totalPages}
              total={filteredItems.length}
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

      {/* Confirm Reject Dialog */}
      <ConfirmDialog
        open={Boolean(rejectTarget)}
        onOpenChange={(open) => {
          if (!open) setRejectTarget(null);
        }}
        title="Reject survey allocation?"
        description={
          rejectTarget
            ? `Are you sure you want to reject "${rejectTarget.surveyName}" (${rejectTarget.allocationCode})? The survey routing link will remain locked and unavailable.`
            : ""
        }
        confirmLabel="Reject allocation"
        destructive
        loading={rejectMutation.isPending}
        onConfirm={() => {
          if (rejectTarget) {
            rejectMutation.mutate(rejectTarget.id);
          }
        }}
      />
    </div>
  );
}
