"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Database, Eye } from "lucide-react";

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
import { EmptyState } from "@/components/shared/EmptyState";
import { ADMIN_PAGE_HELP } from "@/constants/admin-page-help";
import { ROUTES } from "@/constants/routes";
import { listSurveyRespondentProfiles } from "@/services/survey-respondent-profile/survey-respondent-profile-api";
import { resolveTrackingParticipantId } from "@/lib/survey-respondent-tracking";
import { queryKeys } from "@/services/queries";
import { downloadCsv } from "@/utils/download-csv";

export default function SurveyRespondentsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.surveyRespondentProfiles.list({
      search: debouncedSearch,
      status,
      page,
      pageSize,
    }),
    queryFn: () =>
      listSurveyRespondentProfiles({
        page,
        pageSize,
        search: debouncedSearch || undefined,
        surveyStatus: status || undefined,
      }),
  });

  const items = data?.items ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleExport = () => {
    downloadCsv(
      `survey-respondents-${Date.now()}.csv`,
      ["Owner", "Survey", "Vendor", "Tracking id", "Token", "Status", "Created"],
      items.map((row) => [
        row.respondentOwnerType,
        row.panelSurvey?.surveyName ?? "",
        row.vendor?.companyName ?? "",
        resolveTrackingParticipantId(row),
        row.internalSessionToken,
        row.surveyStatus,
        row.createdAt ? format(new Date(row.createdAt), "yyyy-MM-dd HH:mm") : "",
      ])
    );
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Database className="h-7 w-7 text-brand-primary" />
            Survey Respondents
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Universal prescreen answers, tokens, and lifecycle for panel and vendor traffic.
          </p>
        </div>
        <PageHelp content={ADMIN_PAGE_HELP.surveyRespondents} />
      </div>

      <div className={adminTableWrapClass}>
        <AdminTableToolbar
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          searchPlaceholder="Survey name, code, project ID, tracking id, token…"
          onExport={handleExport}
          exportDisabled={items.length === 0}
          filters={
            <>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className={adminFilterSelectClass}
              >
                <option value="">All statuses</option>
                <option value="prescreen_pending">Prescreen pending</option>
                <option value="redirected">Redirected</option>
                <option value="complete">Complete</option>
                <option value="terminate">Terminate</option>
                <option value="quota_full">Quota full</option>
                <option value="quality_reject">Quality reject</option>
              </select>
              <Link
                href={ROUTES.admin.respondentExports}
                className="h-11 inline-flex items-center rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Export center
              </Link>
            </>
          }
        />

        {isLoading ? (
          <AdminTableSkeleton rows={8} />
        ) : items.length === 0 ? (
          <EmptyState icon={Database}>
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
              <table className="w-full min-w-[850px] text-xs text-slate-800">
                <thead className="bg-[#091428] text-white">
                  <tr className="text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-100">
                    <th className="px-3 py-2 whitespace-nowrap">Owner</th>
                    <th className="px-3 py-2 whitespace-nowrap">Vendor / Survey</th>
                    <th className="px-3 py-2 whitespace-nowrap">Tracking ID</th>
                    <th className="px-3 py-2 whitespace-nowrap">Platform Token</th>
                    <th className="px-3 py-2 whitespace-nowrap">Status</th>
                    <th className="px-3 py-2 whitespace-nowrap">Created</th>
                    <th className="px-3 py-2 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((row) => {
                    const trackingId = resolveTrackingParticipantId(row);
                    return (
                      <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="px-3 py-1.5 capitalize text-xs font-bold text-slate-900 whitespace-nowrap align-middle">
                          {row.respondentOwnerType}
                        </td>
                        <td className="px-3 py-1.5 max-w-[200px] align-middle">
                          <p
                            className="font-bold text-slate-900 truncate text-xs"
                            title={row.vendor?.companyName ?? row.panelSurvey?.surveyName}
                          >
                            {row.vendor?.companyName ?? row.panelSurvey?.surveyName}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {row.panelSurvey?.surveyCode}
                          </span>
                        </td>
                        <td className="px-3 py-1.5 font-mono text-xs font-bold text-blue-600 whitespace-nowrap align-middle">
                          {trackingId || "—"}
                        </td>
                        <td
                          className="px-3 py-1.5 font-mono text-xs text-slate-600 max-w-[180px] truncate whitespace-nowrap align-middle"
                          title={row.internalSessionToken}
                        >
                          {row.internalSessionToken}
                        </td>
                        <td className="px-3 py-1.5 text-xs font-bold capitalize text-slate-800 whitespace-nowrap align-middle">
                          {row.surveyStatus}
                        </td>
                        <td className="px-3 py-1.5 text-xs text-slate-500 whitespace-nowrap align-middle">
                          {row.createdAt ? format(new Date(row.createdAt), "MMM d, HH:mm") : "—"}
                        </td>
                        <td className="px-3 py-1.5 text-right align-middle whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1 flex-nowrap whitespace-nowrap shrink-0">
                            <Link
                              href={ROUTES.admin.surveyRespondent(row.id)}
                              className="h-7 px-2 inline-flex items-center gap-1 rounded-md bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700 shadow-sm shrink-0 transition-colors"
                            >
                              <span>Open</span>
                              <Eye className="w-3 h-3" />
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
