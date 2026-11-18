"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Check,
  CheckCheck,
  ChevronDown,
  ClipboardList,
  Copy,
  Download,
  Eye,
  Globe,
  ListFilter,
  Loader2,
  Lock,
  RotateCcw,
  Search,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  AdminPagination,
  AdminProgressBar,
  AdminTableSkeleton,
  adminTableContainerClass,
} from "@/components/crm/admin-table";
import { ConfirmDialog } from "@/components/crm/confirm-dialog";
import {
  AllocationStatusBadge,
  VendorResponseStatusBadge,
} from "@/components/admin/vendor-allocations/allocation-status-badge";
import { COUNTRY_SELECT_OPTIONS, formatCountryName } from "@/constants/country-iso-codes";
import {
  VENDOR_ALLOCATION_RESPONSE_LABELS,
  VENDOR_ALLOCATION_RESPONSE_STATUSES,
  VENDOR_ALLOCATION_STATUS_LABELS,
  VENDOR_ALLOCATION_STATUSES,
  type VendorAllocationResponseStatus,
  type VendorAllocationStatus,
} from "@/constants/vendor-allocation";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
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

function resolveCategory(item: VendorPortalAllocation): string {
  if (item.targetIndustries?.length) return item.targetIndustries[0];
  if (item.targetProfessions?.length) return item.targetProfessions[0];
  if (item.targetCompanySizes?.length) return "B2B";
  return "General";
}

function resolveLanguage(item: VendorPortalAllocation): string {
  if (!item.targetLanguages?.length) return "Any";
  const first = item.targetLanguages[0];
  const lower = first.toLowerCase();
  if (lower.startsWith("en")) return "English";
  if (lower.startsWith("es")) return "Spanish";
  if (lower.startsWith("fr")) return "French";
  if (lower.startsWith("de")) return "German";
  if (lower.startsWith("pt")) return "Portuguese";
  if (lower.startsWith("hi")) return "Hindi";
  return first;
}

type FilterFormState = {
  country: string;
  category: string;
  status: "" | VendorAllocationStatus;
  title: string;
  isAccepted: "" | VendorAllocationResponseStatus;
};

const EMPTY_FILTERS: FilterFormState = {
  country: "",
  category: "",
  status: "",
  title: "",
  isAccepted: "",
};

export default function VendorSurveysPage() {
  const qc = useQueryClient();

  // Draft & applied filter state so users can either hit Search or reset cleanly
  const [filterOpen, setFilterOpen] = useState(true);
  const [draftFilters, setDraftFilters] = useState<FilterFormState>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FilterFormState>(EMPTY_FILTERS);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<VendorPortalAllocation | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
    onSuccess: async (_, allocationId) => {
      toast.success("Project accepted! Survey routing link is now unlocked.");
      setSelectedIds((prev) => prev.filter((id) => id !== allocationId));
      await invalidateVendorSurveys();
    },
    onError: (err) => toast.error(parseApiError(err, "Could not accept project allocation")),
    onSettled: () => setPendingActionId(null),
  });

  const bulkAcceptMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      let succeeded = 0;
      for (const id of ids) {
        await acceptVendorPortalSurvey(id);
        succeeded += 1;
      }
      return succeeded;
    },
    onSuccess: async (count) => {
      toast.success(`Accepted ${count} project${count === 1 ? "" : "s"}! Routing links unlocked.`);
      setSelectedIds([]);
      await invalidateVendorSurveys();
    },
    onError: (err) => toast.error(parseApiError(err, "Some allocations could not be accepted")),
  });

  const rejectMutation = useMutation({
    mutationFn: (allocationId: string) => {
      setPendingActionId(allocationId);
      return rejectVendorPortalSurvey(allocationId);
    },
    onSuccess: async (_, allocationId) => {
      toast.success("Project allocation rejected.");
      setRejectTarget(null);
      setSelectedIds((prev) => prev.filter((id) => id !== allocationId));
      await invalidateVendorSurveys();
    },
    onError: (err) => toast.error(parseApiError(err, "Could not reject project allocation")),
    onSettled: () => setPendingActionId(null),
  });

  // Country dropdown options: prioritize countries present in allotted projects, plus full ISO list
  const countryOptions = useMemo(() => {
    const presentCodes = new Set<string>();
    for (const item of items) {
      for (const c of item.targetCountries ?? []) {
        if (c) presentCodes.add(c.trim().toUpperCase());
      }
    }
    const presentList = Array.from(presentCodes)
      .map((code) => ({ code, name: formatCountryName(code) }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const otherList = COUNTRY_SELECT_OPTIONS.filter((c) => !presentCodes.has(c.code));
    return { presentList, otherList };
  }, [items]);

  // Dynamic categories from allotted projects
  const categoryOptions = useMemo(() => {
    const set = new Set<string>(["B2B", "General"]);
    for (const item of items) {
      set.add(resolveCategory(item));
    }
    return Array.from(set).sort();
  }, [items]);

  // Apply filters
  const filteredItems = useMemo(() => {
    const q = appliedFilters.title.trim().toLowerCase();
    return items.filter((item) => {
      if (appliedFilters.status && item.status !== appliedFilters.status) return false;
      if (appliedFilters.isAccepted && item.vendorResponseStatus !== appliedFilters.isAccepted) {
        return false;
      }
      if (appliedFilters.country) {
        const target = appliedFilters.country.toUpperCase();
        const matchesCountry = (item.targetCountries ?? []).some(
          (c) => c.trim().toUpperCase() === target
        );
        if (!matchesCountry) return false;
      }
      if (appliedFilters.category) {
        if (resolveCategory(item).toLowerCase() !== appliedFilters.category.toLowerCase()) {
          return false;
        }
      }
      if (!q) return true;

      const countryNames = (item.targetCountries ?? [])
        .map((c) => `${c} ${formatCountryName(c)}`)
        .join(" ")
        .toLowerCase();

      return (
        item.surveyName.toLowerCase().includes(q) ||
        item.surveyCode.toLowerCase().includes(q) ||
        item.allocationCode.toLowerCase().includes(q) ||
        countryNames.includes(q)
      );
    });
  }, [items, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, safePage, pageSize]);

  // Eligible pending rows on current filtered list (for checkboxes & Accept All)
  const pendingFilteredIds = useMemo(
    () =>
      filteredItems
        .filter(
          (i) =>
            i.vendorResponseStatus === "pending" &&
            i.status !== "closed" &&
            i.status !== "completed"
        )
        .map((i) => i.id),
    [filteredItems]
  );

  const pendingPageIds = useMemo(
    () =>
      paginatedItems
        .filter(
          (i) =>
            i.vendorResponseStatus === "pending" &&
            i.status !== "closed" &&
            i.status !== "completed"
        )
        .map((i) => i.id),
    [paginatedItems]
  );

  const allPagePendingSelected =
    pendingPageIds.length > 0 && pendingPageIds.every((id) => selectedIds.includes(id));

  const toggleSelectAllPage = () => {
    if (allPagePendingSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pendingPageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pendingPageIds])));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkAccept = () => {
    const targetIds = selectedIds.length > 0 ? selectedIds : pendingFilteredIds;
    if (targetIds.length === 0) return;
    bulkAcceptMutation.mutate(targetIds);
  };

  const handleApplySearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setAppliedFilters(draftFilters);
    setPage(1);
  };

  const handleResetFilters = () => {
    setDraftFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setPage(1);
  };

  // Top 4 KPI counts (matching Screenshot: Total Projects, Active, InActive, Complete)
  const totalProjects = items.length;
  const activeCount = items.filter((i) => i.status === "active").length;
  const inactiveCount = items.filter((i) => i.status === "paused" || i.status === "closed").length;
  const completedProjectsCount = items.filter((i) => i.status === "completed").length;

  const hasActiveFilters = Boolean(
    appliedFilters.country ||
    appliedFilters.category ||
    appliedFilters.status ||
    appliedFilters.title ||
    appliedFilters.isAccepted
  );

  const copyRoutingLink = async (item: VendorPortalAllocation) => {
    if (item.vendorResponseStatus !== "accepted" || !item.routingLink) return;
    const link = `${item.routingLink}?toid=RESPONDENT_ID`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(item.id);
      toast.success("Survey routing link copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const handleExport = () => {
    downloadCsv(
      `allocated-projects-${Date.now()}.csv`,
      [
        "S.N",
        "Allocation Ref",
        "Project Title",
        "Survey Code",
        "Country",
        "Language",
        "Category",
        "Currency",
        "LOI (min)",
        "IR (%)",
        "CPI ($)",
        "Quota",
        "Remaining Quota",
        "Status",
        "Is Accepted",
        "Start Date",
        "Routing Link",
      ],
      filteredItems.map((row, idx) => [
        idx + 1,
        row.allocationCode,
        row.surveyName,
        row.surveyCode,
        row.targetCountries?.length
          ? row.targetCountries.map((c) => `${formatCountryName(c)} (${c})`).join(", ")
          : "Global",
        resolveLanguage(row),
        resolveCategory(row),
        "USD",
        row.estimatedLOI ?? "",
        row.surveyIncidenceRate ?? row.incidenceRate ?? "",
        row.vendorCpi ?? 0,
        row.allocatedQuota,
        row.liveRemainingQuota,
        row.status,
        row.vendorResponseStatus,
        row.startDate
          ? format(new Date(row.startDate), "dd-MM-yyyy")
          : row.createdAt
            ? format(new Date(row.createdAt), "dd-MM-yyyy")
            : "",
        row.vendorResponseStatus === "accepted" && row.routingLink
          ? `${row.routingLink}?toid=RESPONDENT_ID`
          : "Locked until accepted",
      ])
    );
  };

  const selectFieldClass =
    "w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-colors";

  return (
    <div className="space-y-6 pb-10 text-slate-900">
      {/* Top 4 KPI Summary Cards (Matches Screenshot aesthetic) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#e0e4ff] via-[#e8ebff] to-[#f1f3ff] border border-indigo-200/70 px-5 py-5 text-center shadow-sm">
          <p className="text-3xl font-black tracking-tight text-slate-900 tabular-nums">
            {formatNumber(totalProjects)}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-700">Total Projects</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-[#ffd6e0] via-[#ffe0e8] to-[#fff0f4] border border-rose-200/70 px-5 py-5 text-center shadow-sm">
          <p className="text-3xl font-black tracking-tight text-slate-900 tabular-nums">
            {formatNumber(activeCount)}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-700">Active</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-[#bff7f0] via-[#d2faf5] to-[#e6fcf9] border border-teal-200/70 px-5 py-5 text-center shadow-sm">
          <p className="text-3xl font-black tracking-tight text-slate-900 tabular-nums">
            {formatNumber(inactiveCount)}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-700">Inactive / Paused</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-[#c7ecff] via-[#daf3ff] to-[#edfaff] border border-sky-200/70 px-5 py-5 text-center shadow-sm">
          <p className="text-3xl font-black tracking-tight text-slate-900 tabular-nums">
            {formatNumber(completedProjectsCount)}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-700">Complete</p>
        </div>
      </div>

      {/* Collapsible SEARCH ALLOCATE PROJECT Filter Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setFilterOpen((prev) => !prev)}
          className="w-full px-5 py-3.5 border-b border-slate-100 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors"
        >
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-[0.12em] text-indigo-600">
            <Search className="h-4 w-4" />
            SEARCH ALLOCATE PROJECT
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-extrabold text-indigo-700 normal-case tracking-normal">
                Filtered
              </span>
            )}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-indigo-500 transition-transform duration-200",
              filterOpen && "rotate-180"
            )}
          />
        </button>

        {filterOpen && (
          <form onSubmit={handleApplySearch} className="p-5 space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Project Country (Highlighted as Important) */}
              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="inline-flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-indigo-600" />
                    Project Country
                  </span>
                  <span className="rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-amber-800">
                    Important
                  </span>
                </label>
                <select
                  value={draftFilters.country}
                  onChange={(e) => {
                    const next = { ...draftFilters, country: e.target.value };
                    setDraftFilters(next);
                    setAppliedFilters(next);
                    setPage(1);
                  }}
                  className={selectFieldClass}
                >
                  <option value="">Select Country (All Markets)</option>
                  {countryOptions.presentList.length > 0 && (
                    <optgroup label="Your Allotted Survey Countries">
                      {countryOptions.presentList.map((c) => (
                        <option key={`p-${c.code}`} value={c.code}>
                          {c.name} ({c.code})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="All Countries">
                    {countryOptions.otherList.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Project Category */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Project Category</label>
                <select
                  value={draftFilters.category}
                  onChange={(e) => {
                    const next = { ...draftFilters, category: e.target.value };
                    setDraftFilters(next);
                    setAppliedFilters(next);
                    setPage(1);
                  }}
                  className={selectFieldClass}
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Status */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Project Status</label>
                <select
                  value={draftFilters.status}
                  onChange={(e) => {
                    const next = {
                      ...draftFilters,
                      status: e.target.value as "" | VendorAllocationStatus,
                    };
                    setDraftFilters(next);
                    setAppliedFilters(next);
                    setPage(1);
                  }}
                  className={selectFieldClass}
                >
                  <option value="">All Project Statuses</option>
                  {VENDOR_ALLOCATION_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {VENDOR_ALLOCATION_STATUS_LABELS[st]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Project Title</label>
                <input
                  type="text"
                  value={draftFilters.title}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter project title, code, or ref…"
                  className={selectFieldClass}
                />
              </div>

              {/* Is Accepted */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Is Accepted</label>
                <select
                  value={draftFilters.isAccepted}
                  onChange={(e) => {
                    const next = {
                      ...draftFilters,
                      isAccepted: e.target.value as "" | VendorAllocationResponseStatus,
                    };
                    setDraftFilters(next);
                    setAppliedFilters(next);
                    setPage(1);
                  }}
                  className={selectFieldClass}
                >
                  <option value="">Select Is Accepted</option>
                  {VENDOR_ALLOCATION_RESPONSE_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {VENDOR_ALLOCATION_RESPONSE_LABELS[st]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Centered Search & Reset Buttons */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                type="submit"
                className="h-9 px-6 rounded-xl border border-indigo-400 bg-indigo-50/70 text-indigo-700 text-xs font-bold hover:bg-indigo-600 hover:text-white transition-colors shadow-2xs inline-flex items-center gap-1.5"
              >
                <Search className="h-3.5 w-3.5" />
                Search
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="h-9 px-6 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ALLOCATE PROJECT LIST Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        {/* Card Header Bar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ListFilter className="h-4 w-4 text-indigo-600" />
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-[0.12em] text-indigo-600">
              ALLOCATE PROJECT LIST
            </h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
              {filteredItems.length} {filteredItems.length === 1 ? "project" : "projects"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={filteredItems.length === 0}
              onClick={handleExport}
              className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 disabled:opacity-50 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>

            {pendingFilteredIds.length > 0 && (
              <button
                type="button"
                disabled={bulkAcceptMutation.isPending}
                onClick={handleBulkAccept}
                className="h-9 px-4 rounded-xl border border-indigo-400 bg-white text-indigo-700 hover:bg-indigo-600 hover:text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-2xs disabled:opacity-50"
              >
                {bulkAcceptMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CheckCheck className="h-3.5 w-3.5" />
                )}
                {selectedIds.length > 0
                  ? `Accept Selected (${selectedIds.length})`
                  : `Accept All (${pendingFilteredIds.length})`}
              </button>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {isLoading ? (
            <AdminTableSkeleton rows={6} />
          ) : isError ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-6 text-center text-sm text-rose-700 font-medium">
              Could not load projects. Please try refreshing the page.
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/40 p-12 text-center">
              <ClipboardList className="mx-auto h-10 w-10 text-slate-300 mb-3" />
              <p className="font-bold text-sm text-slate-800">No matching projects found</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {hasActiveFilters
                  ? "Try clearing your search filters or choosing a different country."
                  : "No project allocations are currently assigned to your vendor account."}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className={adminTableContainerClass}>
                <table className="w-full min-w-[1260px] text-left text-xs text-slate-800">
                  <thead className="bg-[#091428] text-white">
                    <tr className="text-[10px] font-extrabold uppercase tracking-wider text-slate-100">
                      <th className="px-3 py-2.5 whitespace-nowrap">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <span>S.N</span>
                          <input
                            type="checkbox"
                            checked={allPagePendingSelected}
                            disabled={pendingPageIds.length === 0}
                            onChange={toggleSelectAllPage}
                            className="h-3.5 w-3.5 rounded border-slate-400 accent-indigo-500 cursor-pointer"
                            aria-label="Select all pending projects on page"
                          />
                        </label>
                      </th>
                      <th className="px-3 py-2.5 whitespace-nowrap">Action</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">Status</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">Project Title</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-amber-300">
                          <Globe className="h-3 w-3" />
                          Country
                        </span>
                      </th>
                      <th className="px-3 py-2.5 whitespace-nowrap">Language</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">Category</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">Currency</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">LOI</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">IR</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">CPI</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">Quota</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">Remaining Quota</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">Start Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedItems.map((row, idx) => {
                      const sn = (safePage - 1) * pageSize + idx + 1;
                      const pct =
                        row.allocatedQuota > 0
                          ? Math.min(100, (row.completedCount / row.allocatedQuota) * 100)
                          : 0;
                      const isAccepted = row.vendorResponseStatus === "accepted";
                      const isPending = row.vendorResponseStatus === "pending";
                      const canRespond =
                        isPending && row.status !== "closed" && row.status !== "completed";
                      const isRowMutating = pendingActionId === row.id;
                      const irValue =
                        row.surveyIncidenceRate != null
                          ? row.surveyIncidenceRate
                          : row.incidenceRate;
                      const dateSource = row.startDate || row.createdAt;

                      return (
                        <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                          {/* S.N + Checkbox */}
                          <td className="px-3 py-2.5 align-middle whitespace-nowrap font-mono text-xs font-bold text-slate-600">
                            <div className="inline-flex items-center gap-2">
                              <span className="w-5">{sn}</span>
                              {canRespond ? (
                                <input
                                  type="checkbox"
                                  checked={selectedIds.includes(row.id)}
                                  onChange={() => toggleSelectRow(row.id)}
                                  className="h-3.5 w-3.5 rounded border-slate-300 accent-indigo-600 cursor-pointer"
                                  aria-label={`Select ${row.surveyName}`}
                                />
                              ) : (
                                <span className="w-3.5 inline-block" />
                              )}
                            </div>
                          </td>

                          {/* ACTION (Accept / Reject / Copy Link when accepted / View Eye) */}
                          <td className="px-3 py-2.5 align-middle whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              {canRespond && (
                                <>
                                  <button
                                    type="button"
                                    disabled={isRowMutating}
                                    onClick={() => acceptMutation.mutate(row.id)}
                                    className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors disabled:opacity-50"
                                    title="Accept project & unlock survey link"
                                  >
                                    {isRowMutating && acceptMutation.isPending ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isRowMutating}
                                    onClick={() => setRejectTarget(row)}
                                    className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-rose-400 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors disabled:opacity-50"
                                    title="Reject project"
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                  </button>
                                </>
                              )}

                              {isAccepted && row.routingLink && (
                                <button
                                  type="button"
                                  onClick={() => copyRoutingLink(row)}
                                  className="h-7 px-2 inline-flex items-center gap-1 rounded-lg border border-emerald-400 bg-emerald-50 text-emerald-800 font-bold text-[11px] hover:bg-emerald-600 hover:text-white transition-colors"
                                  title="Copy live survey routing link"
                                >
                                  {copiedId === row.id ? (
                                    <Check className="h-3 w-3" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                  <span>{copiedId === row.id ? "Copied" : "Link"}</span>
                                </button>
                              )}

                              <Link
                                href={ROUTES.vendor.survey(row.id)}
                                className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-indigo-400 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-colors"
                                title="View full project details"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </td>

                          {/* STATUS + Vendor Acceptance */}
                          <td className="px-3 py-2.5 align-middle whitespace-nowrap">
                            <div className="flex flex-col items-start gap-1">
                              <AllocationStatusBadge status={row.status} />
                              <div className="flex items-center gap-1">
                                <VendorResponseStatusBadge status={row.vendorResponseStatus} />
                                {!isAccepted && (
                                  <span title="Survey link hidden until accepted">
                                    <Lock className="h-3 w-3 text-slate-400" />
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* PROJECT TITLE */}
                          <td className="px-3 py-2.5 align-middle max-w-[230px]">
                            <Link
                              href={ROUTES.vendor.survey(row.id)}
                              className="font-bold text-slate-900 hover:text-indigo-600 truncate block text-xs"
                              title={row.surveyName}
                            >
                              {row.surveyName}
                            </Link>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-mono text-slate-400">
                              <span className="text-indigo-600 font-bold">
                                {row.allocationCode}
                              </span>
                              <span>·</span>
                              <span>{row.surveyCode || "—"}</span>
                            </div>
                          </td>

                          {/* COUNTRY (Prominent with Full Name + Code) */}
                          <td className="px-3 py-2.5 align-middle whitespace-nowrap">
                            {row.targetCountries && row.targetCountries.length > 0 ? (
                              <div
                                className="flex flex-wrap items-center gap-1 max-w-[200px]"
                                title={row.targetCountries
                                  .map((c) => `${formatCountryName(c)} (${c})`)
                                  .join(", ")}
                              >
                                {row.targetCountries.slice(0, 2).map((code) => (
                                  <span
                                    key={code}
                                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 border border-blue-200 px-2 py-0.5 text-[11px] font-bold text-blue-900"
                                  >
                                    <Globe className="h-3 w-3 text-blue-600 shrink-0" />
                                    <span>{formatCountryName(code)}</span>
                                    <span className="font-mono text-[10px] text-blue-600">
                                      ({code.toUpperCase()})
                                    </span>
                                  </span>
                                ))}
                                {row.targetCountries.length > 2 && (
                                  <span className="rounded-md bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                                    +{row.targetCountries.length - 2}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                                <Globe className="h-3 w-3 text-amber-600" />
                                Global / All
                              </span>
                            )}
                          </td>

                          {/* LANGUAGE */}
                          <td className="px-3 py-2.5 align-middle whitespace-nowrap text-slate-700 font-medium">
                            {resolveLanguage(row)}
                          </td>

                          {/* CATEGORY */}
                          <td className="px-3 py-2.5 align-middle whitespace-nowrap">
                            <span className="inline-flex rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                              {resolveCategory(row)}
                            </span>
                          </td>

                          {/* CURRENCY */}
                          <td className="px-3 py-2.5 align-middle whitespace-nowrap font-mono text-xs font-bold text-slate-600">
                            USD
                          </td>

                          {/* LOI */}
                          <td className="px-3 py-2.5 align-middle whitespace-nowrap font-semibold text-slate-800 tabular-nums">
                            {row.estimatedLOI != null ? `${row.estimatedLOI} min` : "—"}
                          </td>

                          {/* IR */}
                          <td className="px-3 py-2.5 align-middle whitespace-nowrap font-semibold text-indigo-700 tabular-nums">
                            {irValue != null ? `${irValue}%` : "—"}
                          </td>

                          {/* CPI */}
                          <td className="px-3 py-2.5 align-middle whitespace-nowrap font-extrabold text-emerald-700 tabular-nums">
                            {formatCurrency(row.vendorCpi ?? 0)}
                          </td>

                          {/* QUOTA */}
                          <td className="px-3 py-2.5 align-middle whitespace-nowrap font-bold text-slate-900 tabular-nums">
                            {formatNumber(row.allocatedQuota)}
                          </td>

                          {/* REMAINING QUOTA */}
                          <td className="px-3 py-2.5 align-middle whitespace-nowrap min-w-[130px]">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 mb-1 tabular-nums">
                              <span>{formatNumber(row.liveRemainingQuota)}</span>
                              <span className="text-[10px] font-medium text-slate-400">
                                {formatNumber(row.completedCount)} done
                              </span>
                            </div>
                            <AdminProgressBar percent={pct} />
                          </td>

                          {/* START DATE */}
                          <td className="px-3 py-2.5 align-middle whitespace-nowrap font-mono text-xs text-slate-600">
                            {dateSource ? format(new Date(dateSource), "dd-MM-yyyy") : "—"}
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
      </div>

      {/* Confirm Reject Dialog */}
      <ConfirmDialog
        open={Boolean(rejectTarget)}
        onOpenChange={(open) => {
          if (!open) setRejectTarget(null);
        }}
        title="Reject project allocation?"
        description={
          rejectTarget
            ? `Are you sure you want to reject "${rejectTarget.surveyName}" (${rejectTarget.allocationCode})? The survey routing link will remain locked and unavailable.`
            : ""
        }
        confirmLabel="Reject project"
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
