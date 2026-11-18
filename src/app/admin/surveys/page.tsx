"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Check,
  ChevronDown,
  ClipboardList,
  Copy,
  Download,
  Eye,
  Globe,
  MoreHorizontal,
  Pencil,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/crm/confirm-dialog";
import {
  AdminPagination,
  AdminProgressBar,
  AdminTableSkeleton,
} from "@/components/crm/admin-table";
import { PageHeader } from "@/components/crm/page-help";
import { EmptyState } from "@/components/shared/EmptyState";
import { ADMIN_PAGE_HELP } from "@/constants/admin-page-help";
import { COUNTRY_SELECT_OPTIONS, formatCountryName } from "@/constants/country-iso-codes";
import {
  PANEL_SURVEY_AUDIENCE_LABELS,
  PANEL_SURVEY_STATUS_LABELS,
  type PanelSurveyAudience,
  type PanelSurveyStatus,
} from "@/constants/panel-survey";
import { ROUTES } from "@/constants/routes";
import { buildPanelSurveyShareLinkExample } from "@/lib/panel-survey-share-link";
import { crmToast } from "@/lib/crm-toast";
import { parseApiError } from "@/services/api/errors";
import {
  deletePanelSurvey,
  listPanelSurveys,
  patchPanelSurveyStatus,
  type PanelSurvey,
} from "@/services/panel-survey";
import { listSurveyCompanies } from "@/services/survey-company";
import { queryKeys } from "@/services/queries";
import { downloadCsv } from "@/utils/download-csv";
import { formatNumber, formatPercent } from "@/utils/format";
import { CustomDropdown } from "@/components/ui/custom-dropdown";

function surveyProgressPercent(row: PanelSurvey): number {
  const total = row.totalQuota ?? 0;
  if (total <= 0) return 0;
  const completes = row.liveCompletes ?? Math.max(0, total - (row.remainingQuota ?? 0));
  return Math.min(100, (completes / total) * 100);
}

type SortField =
  | "surveyName"
  | "createdAt"
  | "surveyStatus"
  | "incidenceRate"
  | "estimatedLOI"
  | "remainingQuota"
  | "totalQuota";

function SortButton({
  label,
  field,
  sortBy,
  sortOrder,
  onSort,
}: {
  label: string;
  field: SortField;
  sortBy: SortField;
  sortOrder: "asc" | "desc";
  onSort: (field: SortField) => void;
}) {
  const active = sortBy === field;
  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className="inline-flex items-center gap-1 font-extrabold uppercase tracking-wider text-[10px] text-slate-200 hover:text-white transition-colors"
    >
      <span>{label}</span>
      {active ? (
        sortOrder === "asc" ? (
          <ArrowUp className="w-3 h-3 text-blue-400" />
        ) : (
          <ArrowDown className="w-3 h-3 text-blue-400" />
        )
      ) : (
        <MoreHorizontal className="w-3 h-3 opacity-40 hover:opacity-100" />
      )}
    </button>
  );
}

function StatusBadge({ status }: { status: PanelSurveyStatus }) {
  const styles: Record<PanelSurveyStatus, string> = {
    draft: "bg-rose-50 text-rose-700 border-rose-200",
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    paused: "bg-amber-50 text-amber-700 border-amber-200",
    completed: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border leading-none ${styles[status]}`}
    >
      {PANEL_SURVEY_STATUS_LABELS[status]}
    </span>
  );
}

function AudienceBadge({ audience }: { audience?: PanelSurveyAudience }) {
  const isPublic = !audience || audience === "public";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border leading-none ${
        isPublic
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-violet-50 text-violet-700 border-violet-200"
      }`}
    >
      {isPublic ? "Public" : "Internal"}
    </span>
  );
}

export default function AdminPanelSurveysPage() {
  const qc = useQueryClient();
  const [filterOpen, setFilterOpen] = useState(true);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [providerId, setProviderId] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | "sherpa" | "other">("all");
  const [country, setCountry] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | PanelSurveyStatus>("");
  const [audienceFilter, setAudienceFilter] = useState<"" | PanelSurveyAudience>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [deleteTarget, setDeleteTarget] = useState<PanelSurvey | null>(null);
  const [copiedSurveyId, setCopiedSurveyId] = useState<string | null>(null);

  const copySurveyLink = async (row: PanelSurvey) => {
    const link =
      row.panelShareLinkExample ??
      buildPanelSurveyShareLinkExample(row.id, row.participantQueryParam ?? "toid");
    try {
      await navigator.clipboard.writeText(link);
      setCopiedSurveyId(row.id);
      toast.success("Survey link copied");
      setTimeout(() => setCopiedSurveyId(null), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const { data: providersData } = useQuery({
    queryKey: queryKeys.surveyCompanies.list({ page: 1, pageSize: 500 }),
    queryFn: () => listSurveyCompanies({ page: 1, pageSize: 500 }),
  });
  const providers = providersData?.items ?? [];

  const filters = useMemo(
    () => ({
      search: deferredSearch.trim() || undefined,
      providerId: providerId || undefined,
      source: sourceFilter !== "all" ? sourceFilter : undefined,
      country: country.trim().toUpperCase() || undefined,
      surveyStatus: statusFilter || undefined,
      surveyAudience: audienceFilter || undefined,
      page,
      pageSize,
      sortBy,
      sortOrder,
    }),
    [
      deferredSearch,
      providerId,
      sourceFilter,
      country,
      statusFilter,
      audienceFilter,
      page,
      pageSize,
      sortBy,
      sortOrder,
    ]
  );

  const handleResetFilters = () => {
    setSearch("");
    setProviderId("");
    setSourceFilter("all");
    setCountry("");
    setStatusFilter("");
    setAudienceFilter("");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search || providerId || sourceFilter !== "all" || country || statusFilter || audienceFilter
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.panelSurveys.list(filters),
    queryFn: () => listPanelSurveys(filters),
    placeholderData: (prev) => prev,
  });

  const items = data?.items ?? [];
  const meta = data?.meta;

  const refresh = async () => {
    await qc.invalidateQueries({ queryKey: queryKeys.panelSurveys.all });
  };

  const toggleSort = (field: SortField) => {
    setPage(1);
    if (sortBy === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder(field === "createdAt" ? "desc" : "asc");
    }
  };

  const pauseResumeMutation = useMutation({
    mutationFn: ({ id, next }: { id: string; next: PanelSurveyStatus }) =>
      patchPanelSurveyStatus(id, next),
    onSuccess: async (_, v) => {
      toast.success(v.next === "paused" ? "Survey paused" : "Survey resumed");
      await refresh();
    },
    onError: (e) => toast.error(parseApiError(e, "Could not update status")),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePanelSurvey,
    onSuccess: async () => {
      crmToast.deleted();
      setDeleteTarget(null);
      await refresh();
    },
    onError: (e) => toast.error(parseApiError(e, "Could not delete survey")),
  });

  const totalPages = meta?.totalPages ?? 1;

  const handleExport = () => {
    downloadCsv(
      `surveys-${Date.now()}.csv`,
      [
        "Survey",
        "Code",
        "Audience",
        "Country",
        "Vendor Count",
        "Live Completes",
        "Progress %",
        "IR %",
        "LOI",
        "Remaining Quota",
        "Status",
        "Created",
      ],
      items.map((row) => [
        row.surveyName,
        row.surveyCode,
        row.surveyAudience === "internal" || row.surveyAudience === "private"
          ? "Internal"
          : "Public",
        (row.targetCountries ?? []).join("; "),
        row.vendorCount ?? 0,
        row.liveCompletes ?? 0,
        surveyProgressPercent(row).toFixed(1),
        row.incidenceRate ?? "",
        row.estimatedLOI ?? "",
        row.remainingQuota ?? 0,
        row.surveyStatus,
        row.createdAt ? format(new Date(row.createdAt), "yyyy-MM-dd") : "",
      ])
    );
  };

  return (
    <div className="space-y-8 text-gray-900">
      <PageHeader
        title="Surveys"
        description="Configure external routing surveys, quotas, audience visibility, and targeting for your panel."
        help={ADMIN_PAGE_HELP.surveys}
        actions={
          <Link
            href={ROUTES.admin.surveysCreate}
            className="inline-flex h-11 px-5 rounded-2xl bg-brand-primary text-white items-center gap-2 font-bold hover:opacity-95 shadow-lg shadow-brand-primary/25 text-sm"
          >
            <Plus size={18} />
            Create Survey
          </Link>
        }
      />

      {/* Collapsible SEARCH PROJECT Filter Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setFilterOpen((prev) => !prev)}
          className="w-full px-5 py-3.5 border-b border-slate-100 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors"
        >
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-[0.12em] text-indigo-600">
            <Search className="h-4 w-4" />
            SEARCH PROJECT LIST
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-extrabold text-indigo-700 normal-case tracking-normal">
                Filtered
              </span>
            )}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-indigo-500 transition-transform duration-200 ${
              filterOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {filterOpen && (
          <div className="p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Project Country (Important) */}
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
                <CustomDropdown
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setPage(1);
                  }}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
                >
                  <option value="">Select Country (All Markets)</option>
                  {COUNTRY_SELECT_OPTIONS.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </CustomDropdown>
              </div>

              {/* Project Title / Code */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Project Title / Code / PID
                </label>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search survey name, code, PID, or ext ID…"
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
                />
              </div>

              {/* Project Status */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Project Status</label>
                <CustomDropdown
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as "" | PanelSurveyStatus);
                    setPage(1);
                  }}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
                >
                  <option value="">All Project Statuses</option>
                  {(Object.keys(PANEL_SURVEY_STATUS_LABELS) as PanelSurveyStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {PANEL_SURVEY_STATUS_LABELS[s]}
                    </option>
                  ))}
                </CustomDropdown>
              </div>

              {/* Survey Source (Sherpa Filter) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Survey Source</label>
                <CustomDropdown
                  value={sourceFilter}
                  onChange={(e) => {
                    setSourceFilter(e.target.value as "all" | "sherpa" | "other");
                    setPage(1);
                  }}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
                >
                  <option value="all">All Sources</option>
                  <option value="sherpa">SurveySherpa Only</option>
                  <option value="other">Direct / Other Providers</option>
                </CustomDropdown>
              </div>

              {/* Provider */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Provider</label>
                <CustomDropdown
                  value={providerId}
                  onChange={(e) => {
                    setProviderId(e.target.value);
                    setPage(1);
                  }}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
                >
                  <option value="">All providers</option>
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.companyName}
                    </option>
                  ))}
                </CustomDropdown>
              </div>

              {/* Audience */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Audience</label>
                <CustomDropdown
                  value={audienceFilter}
                  onChange={(e) => {
                    setAudienceFilter(e.target.value as "" | PanelSurveyAudience);
                    setPage(1);
                  }}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
                >
                  <option value="">All audiences</option>
                  <option value="public">Public (User Panel)</option>
                  <option value="internal">Internal / Private</option>
                </CustomDropdown>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="h-9 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 inline-flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset Filters
                  </button>
                )}
              </div>
              <button
                type="button"
                disabled={items.length === 0}
                onClick={handleExport}
                className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-2xs"
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 md:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
        {isLoading ? (
          <AdminTableSkeleton rows={8} />
        ) : items.length === 0 ? (
          <EmptyState icon={ClipboardList}>
            <Link
              href={ROUTES.admin.surveysCreate}
              className="inline-flex h-11 px-5 rounded-xl bg-gray-900 text-white items-center justify-center font-bold hover:bg-black"
            >
              Create New
            </Link>
          </EmptyState>
        ) : (
          <>
            <div className="overflow-x-auto custom-scrollbar rounded-xl border border-slate-200/90 bg-white shadow-sm">
              <table className="w-full min-w-[700px] text-left text-xs text-slate-800">
                <thead className="bg-[#091428] text-white">
                  <tr className="text-[10px] font-extrabold uppercase tracking-wider text-slate-100">
                    <th className="py-2 px-3">
                      <SortButton
                        label="Survey"
                        field="surveyName"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="py-2 px-2.5 font-extrabold uppercase tracking-wider text-amber-300 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        Country
                      </span>
                    </th>
                    <th className="py-2 px-2.5 font-extrabold uppercase tracking-wider text-slate-100 whitespace-nowrap">
                      Audience
                    </th>
                    <th className="py-2 px-2.5 font-extrabold uppercase tracking-wider text-slate-100 whitespace-nowrap">
                      Completes
                    </th>
                    <th className="py-2 px-2.5 whitespace-nowrap">
                      <SortButton
                        label="Rem. Quota"
                        field="remainingQuota"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="py-2 px-2.5 whitespace-nowrap">
                      <SortButton
                        label="Status"
                        field="surveyStatus"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="py-2 px-2.5 whitespace-nowrap">
                      <SortButton
                        label="Created"
                        field="createdAt"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="py-2 px-3 text-right font-extrabold uppercase tracking-wider text-slate-100 whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((row) => (
                    <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-1.5 px-3 max-w-[220px]">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={ROUTES.admin.survey(row.id)}
                            className="font-bold text-blue-600 hover:text-blue-700 hover:underline truncate text-xs"
                            title={row.surveyName}
                          >
                            {row.surveyName}
                          </Link>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            ({row.surveyCode})
                          </span>
                        </div>
                      </td>
                      <td className="py-1.5 px-2.5 whitespace-nowrap align-middle">
                        {row.targetCountries && row.targetCountries.length > 0 ? (
                          <div
                            className="flex flex-wrap items-center gap-1 max-w-[180px]"
                            title={row.targetCountries
                              .map((c) => `${formatCountryName(c)} (${c})`)
                              .join(", ")}
                          >
                            {row.targetCountries.slice(0, 2).map((code) => (
                              <span
                                key={code}
                                className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-1.5 py-0.5 text-[10px] font-bold text-blue-900"
                              >
                                <Globe className="h-2.5 w-2.5 text-blue-600 shrink-0" />
                                <span>{formatCountryName(code)}</span>
                                <span className="font-mono text-[9px] text-blue-600">
                                  ({code.toUpperCase()})
                                </span>
                              </span>
                            ))}
                            {row.targetCountries.length > 2 && (
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                                +{row.targetCountries.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                            <Globe className="h-2.5 w-2.5 text-amber-600" />
                            Not Set
                          </span>
                        )}
                      </td>
                      <td className="py-1.5 px-2.5 whitespace-nowrap align-middle">
                        <AudienceBadge audience={row.surveyAudience} />
                      </td>
                      <td className="py-1.5 px-2.5 font-mono text-xs tabular-nums text-slate-900 font-semibold whitespace-nowrap align-middle">
                        {formatNumber(row.liveCompletes ?? 0)}
                      </td>
                      <td className="py-1.5 px-2.5 font-mono text-xs text-slate-900 tabular-nums font-bold whitespace-nowrap align-middle">
                        {formatNumber(row.remainingQuota ?? 0)}
                      </td>
                      <td className="py-1.5 px-2.5 whitespace-nowrap align-middle">
                        <StatusBadge status={row.surveyStatus} />
                      </td>
                      <td className="py-1.5 px-2.5 text-slate-600 whitespace-nowrap text-xs align-middle">
                        {row.createdAt ? format(new Date(row.createdAt), "MMM d, yyyy") : "—"}
                      </td>
                      <td className="py-1.5 px-3 text-right align-middle whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1 flex-nowrap whitespace-nowrap shrink-0">
                          <Link
                            href={ROUTES.admin.survey(row.id)}
                            className="h-7 px-2 inline-flex items-center gap-1 rounded-md bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700 shadow-sm shrink-0 transition-colors"
                            title="Open Survey"
                          >
                            <span>Open</span>
                            <Eye className="w-3 h-3" aria-hidden />
                          </Link>
                          <Link
                            href={ROUTES.admin.surveyAnalytics(row.id)}
                            className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 shrink-0 transition-colors"
                            title="Analytics"
                          >
                            <BarChart3 className="w-3.5 h-3.5" aria-hidden />
                          </Link>
                          <Link
                            href={ROUTES.admin.surveyEdit(row.id)}
                            className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 shrink-0 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" aria-hidden />
                          </Link>
                          <button
                            type="button"
                            title="Copy share link"
                            aria-label="Copy share link"
                            className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shrink-0 transition-colors"
                            onClick={() => copySurveyLink(row)}
                          >
                            {copiedSurveyId === row.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden />
                            ) : (
                              <Copy className="w-3.5 h-3.5" aria-hidden />
                            )}
                          </button>
                          {row.surveyStatus === "active" ? (
                            <button
                              type="button"
                              title="Pause"
                              className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 shrink-0 transition-colors"
                              onClick={() =>
                                pauseResumeMutation.mutate({ id: row.id, next: "paused" })
                              }
                              disabled={pauseResumeMutation.isPending}
                            >
                              <Pause className="w-3.5 h-3.5" />
                            </button>
                          ) : row.surveyStatus === "paused" ? (
                            <button
                              type="button"
                              title="Resume"
                              className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 shrink-0 transition-colors"
                              onClick={() =>
                                pauseResumeMutation.mutate({ id: row.id, next: "active" })
                              }
                              disabled={pauseResumeMutation.isPending}
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 shrink-0 transition-colors"
                            onClick={() => setDeleteTarget(row)}
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="xl:hidden space-y-4">
              {items.map((row) => (
                <div
                  key={row.id}
                  className="rounded-2xl border border-gray-200 bg-gray-50/80 p-4 space-y-3 text-gray-900"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="font-black text-gray-900 truncate">{row.surveyName}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <AudienceBadge audience={row.surveyAudience} />
                      <StatusBadge status={row.surveyStatus} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 truncate">
                    <span className="font-black text-gray-400 uppercase mr-2">Country</span>
                    {(row.targetCountries ?? []).join(", ") || "—"}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <p>
                      <span className="font-black text-gray-400 uppercase mr-1">Vendors</span>
                      {formatNumber(row.vendorCount ?? 0)}
                    </p>
                    <p>
                      <span className="font-black text-gray-400 uppercase mr-1">Completes</span>
                      {formatNumber(row.liveCompletes ?? 0)}
                    </p>
                  </div>
                  <AdminProgressBar percent={surveyProgressPercent(row)} />
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link
                      href={ROUTES.admin.survey(row.id)}
                      className="flex-1 min-w-[90px] h-10 rounded-xl border border-gray-200 bg-white text-gray-900 text-center text-xs font-black uppercase tracking-widest leading-10"
                    >
                      View
                    </Link>
                    <Link
                      href={ROUTES.admin.surveyAnalytics(row.id)}
                      className="flex-1 min-w-[90px] h-10 rounded-xl border border-gray-200 bg-white text-gray-900 text-center text-xs font-black uppercase tracking-widest leading-10"
                    >
                      Analytics
                    </Link>
                    <Link
                      href={ROUTES.admin.surveyEdit(row.id)}
                      className="flex-1 min-w-[90px] h-10 rounded-xl border border-gray-200 bg-white text-gray-900 text-center text-xs font-black uppercase tracking-widest leading-10"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="flex-1 min-w-[90px] h-10 rounded-xl border border-gray-200 bg-white text-gray-900 text-xs font-black uppercase tracking-widest inline-flex items-center justify-center gap-1.5"
                      onClick={() => copySurveyLink(row)}
                    >
                      {copiedSurveyId === row.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden />
                      ) : (
                        <Copy className="w-3.5 h-3.5" aria-hidden />
                      )}
                      {copiedSurveyId === row.id ? "Copied" : "Copy link"}
                    </button>
                    {row.surveyStatus === "active" ? (
                      <button
                        type="button"
                        className="flex-1 min-w-[90px] h-10 rounded-xl border border-amber-200 text-amber-800 text-xs font-black uppercase"
                        onClick={() => pauseResumeMutation.mutate({ id: row.id, next: "paused" })}
                        disabled={pauseResumeMutation.isPending}
                      >
                        Pause
                      </button>
                    ) : row.surveyStatus === "paused" ? (
                      <button
                        type="button"
                        className="flex-1 min-w-[90px] h-10 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-black uppercase"
                        onClick={() => pauseResumeMutation.mutate({ id: row.id, next: "active" })}
                        disabled={pauseResumeMutation.isPending}
                      >
                        Resume
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="flex-1 min-w-[90px] h-10 rounded-xl border border-rose-200 text-rose-600 text-xs font-black uppercase"
                      onClick={() => setDeleteTarget(row)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
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
            {isFetching ? (
              <p className="text-xs font-bold text-brand-primary mt-2">Updating…</p>
            ) : null}
          </>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        description={
          deleteTarget
            ? `Remove “${deleteTarget.surveyName}” (${deleteTarget.surveyCode}). This action cannot be undone.`
            : "This action cannot be undone."
        }
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      >
        <p className="text-sm text-gray-600">
          Distribution and tracking features will reference this configuration later. Only delete if
          the study is obsolete.
        </p>
      </ConfirmDialog>
    </div>
  );
}
