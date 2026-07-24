"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Check,
  ClipboardList,
  Copy,
  Eye,
  MoreHorizontal,
  Pencil,
  Pause,
  Play,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/crm/confirm-dialog";
import { PageHeader } from "@/components/crm/page-help";
import { EmptyState } from "@/components/shared/EmptyState";
import { ADMIN_PAGE_HELP } from "@/constants/admin-page-help";
import { PANEL_SURVEY_STATUS_LABELS, type PanelSurveyStatus } from "@/constants/panel-survey";
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
      className="inline-flex items-center gap-1 font-black uppercase tracking-wider text-[10px] text-gray-500 hover:text-gray-900"
    >
      {label}
      {active ? (
        sortOrder === "asc" ? (
          <ArrowUp className="w-3 h-3 text-brand-primary" />
        ) : (
          <ArrowDown className="w-3 h-3 text-brand-primary" />
        )
      ) : (
        <MoreHorizontal className="w-3 h-3 opacity-40" />
      )}
    </button>
  );
}

function StatusBadge({ status }: { status: PanelSurveyStatus }) {
  const styles: Record<PanelSurveyStatus, string> = {
    draft: "bg-gray-100 text-gray-700",
    active: "bg-emerald-50 text-emerald-700",
    paused: "bg-amber-50 text-amber-700",
    completed: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status]}`}
    >
      {PANEL_SURVEY_STATUS_LABELS[status]}
    </span>
  );
}

export default function AdminPanelSurveysPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [providerId, setProviderId] = useState("");
  const [country, setCountry] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | PanelSurveyStatus>("");
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
      country: country.trim().toUpperCase() || undefined,
      surveyStatus: statusFilter || undefined,
      page,
      pageSize,
      sortBy,
      sortOrder,
    }),
    [deferredSearch, providerId, country, statusFilter, page, pageSize, sortBy, sortOrder]
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

  return (
    <div className="space-y-8 text-gray-900">
      <PageHeader
        title="Surveys"
        description="Configure external routing surveys, quotas, and targeting for your panel."
        help={ADMIN_PAGE_HELP.surveys}
        actions={
          <Link
            href={ROUTES.admin.surveysCreate}
            className="h-11 px-5 rounded-xl bg-gray-900 text-white inline-flex items-center justify-center gap-2 font-bold hover:bg-black shrink-0"
          >
            <Plus className="w-4 h-4" />
            Create survey
          </Link>
        }
      />

      <div className="rounded-[2rem] border border-gray-200 bg-white p-5 md:p-6 shadow-sm text-gray-900">
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-6 mb-6">
          <div className="relative xl:col-span-2">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search name, code, external ID…"
              className="w-full h-11 pl-10 pr-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <select
            value={providerId}
            onChange={(e) => {
              setProviderId(e.target.value);
              setPage(1);
            }}
            className="h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-900 bg-white"
          >
            <option value="">All providers</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.companyName}
              </option>
            ))}
          </select>
          <input
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setPage(1);
            }}
            placeholder="Country (e.g. MX)"
            className="h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-900 placeholder:text-gray-400 uppercase"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "" | PanelSurveyStatus);
              setPage(1);
            }}
            className="h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-900 bg-white"
          >
            <option value="">All statuses</option>
            {(Object.keys(PANEL_SURVEY_STATUS_LABELS) as PanelSurveyStatus[]).map((s) => (
              <option key={s} value={s}>
                {PANEL_SURVEY_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-900 bg-white"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No surveys yet"
            description="Create a routing survey linked to a provider with external URL and quota segments."
          >
            <Link
              href={ROUTES.admin.surveysCreate}
              className="inline-flex h-11 px-5 rounded-xl bg-gray-900 text-white items-center justify-center font-bold hover:bg-black"
            >
              Create survey
            </Link>
          </EmptyState>
        ) : (
          <>
            <div className="hidden xl:block overflow-x-auto -mx-2">
              <table className="w-full min-w-[900px] text-left text-sm text-gray-900">
                <thead>
                  <tr className="border-b border-gray-200 text-[10px] text-gray-600">
                    <th className="pb-3 pl-2 pr-2">
                      <SortButton
                        label="Survey"
                        field="surveyName"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="pb-3 px-2 font-black uppercase tracking-wider text-gray-600">
                      Countries
                    </th>
                    <th className="pb-3 px-2">
                      <SortButton
                        label="IR %"
                        field="incidenceRate"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="pb-3 px-2">
                      <SortButton
                        label="LOI"
                        field="estimatedLOI"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="pb-3 px-2">
                      <SortButton
                        label="Rem. quota"
                        field="remainingQuota"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="pb-3 px-2">
                      <SortButton
                        label="Status"
                        field="surveyStatus"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="pb-3 px-2">
                      <SortButton
                        label="Created"
                        field="createdAt"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="pb-3 pr-2 pl-2 text-right font-black uppercase tracking-wider text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/80">
                      <td className="py-3 pl-2 pr-2 max-w-[220px]">
                        <p className="font-bold text-gray-900 truncate">{row.surveyName}</p>
                      </td>
                      <td className="py-3 px-2 text-xs text-gray-600 max-w-[140px] truncate">
                        {(row.targetCountries ?? []).join(", ") || "—"}
                      </td>
                      <td className="py-3 px-2 text-gray-700">
                        {row.incidenceRate != null ? `${row.incidenceRate}%` : "—"}
                      </td>
                      <td className="py-3 px-2 text-gray-700">
                        {row.estimatedLOI != null ? `${row.estimatedLOI}m` : "—"}
                      </td>
                      <td className="py-3 px-2 font-mono text-xs text-gray-900 tabular-nums">
                        {row.remainingQuota ?? 0}
                      </td>
                      <td className="py-3 px-2">
                        <StatusBadge status={row.surveyStatus} />
                      </td>
                      <td className="py-3 px-2 text-gray-600 whitespace-nowrap text-xs">
                        {row.createdAt ? format(new Date(row.createdAt), "MMM d, yyyy") : "—"}
                      </td>
                      <td className="py-3 pr-2 pl-2 text-right">
                        <div className="inline-flex flex-wrap justify-end gap-1">
                          <Link
                            href={ROUTES.admin.survey(row.id)}
                            className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 hover:text-gray-900"
                            title="View"
                          >
                            <Eye className="w-4 h-4" aria-hidden />
                          </Link>
                          <Link
                            href={ROUTES.admin.surveyAnalytics(row.id)}
                            className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 hover:text-gray-900"
                            title="Analytics"
                          >
                            <BarChart3 className="w-4 h-4" aria-hidden />
                          </Link>
                          <Link
                            href={ROUTES.admin.surveyEdit(row.id)}
                            className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 hover:text-gray-900"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" aria-hidden />
                          </Link>
                          <button
                            type="button"
                            title="Copy share link"
                            aria-label="Copy share link"
                            className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 hover:text-gray-900"
                            onClick={() => copySurveyLink(row)}
                          >
                            {copiedSurveyId === row.id ? (
                              <Check className="w-4 h-4 text-emerald-600" aria-hidden />
                            ) : (
                              <Copy className="w-4 h-4" aria-hidden />
                            )}
                          </button>
                          {row.surveyStatus === "active" ? (
                            <button
                              type="button"
                              title="Pause"
                              className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-amber-200 bg-white text-amber-700 hover:bg-amber-50"
                              onClick={() =>
                                pauseResumeMutation.mutate({ id: row.id, next: "paused" })
                              }
                              disabled={pauseResumeMutation.isPending}
                            >
                              <Pause className="w-4 h-4" />
                            </button>
                          ) : row.surveyStatus === "paused" ? (
                            <button
                              type="button"
                              title="Resume"
                              className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                              onClick={() =>
                                pauseResumeMutation.mutate({ id: row.id, next: "active" })
                              }
                              disabled={pauseResumeMutation.isPending}
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          ) : null}
                          <button
                            type="button"
                            title="Delete"
                            className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
                            onClick={() => setDeleteTarget(row)}
                          >
                            <Trash2 className="w-4 h-4" aria-hidden />
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
                  <div className="flex justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-black text-gray-900 truncate">{row.surveyName}</p>
                    </div>
                    <StatusBadge status={row.surveyStatus} />
                  </div>
                  <p className="text-xs text-gray-600 truncate">
                    <span className="font-black text-gray-400 uppercase mr-2">Countries</span>
                    {(row.targetCountries ?? []).join(", ") || "—"}
                  </p>
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

            {meta && totalPages > 1 ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Page {meta.page} of {totalPages}
                  <span className="text-gray-400">
                    {" "}
                    ({meta.total} {meta.total === 1 ? "survey" : "surveys"})
                  </span>
                  {isFetching ? (
                    <span className="ml-2 text-xs font-bold text-brand-primary">Updating…</span>
                  ) : null}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-900 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-900 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
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
