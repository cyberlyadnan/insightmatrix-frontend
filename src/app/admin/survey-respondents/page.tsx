"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Database } from "lucide-react";

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
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className={adminTableHeadClass}>
                    <th className="px-4 py-3">Owner</th>
                    <th className="px-4 py-3">Vendor / Survey</th>
                    <th className="px-4 py-3">Tracking id</th>
                    <th className="px-4 py-3">Platform token</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3 text-right">View</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row) => {
                    const trackingId = resolveTrackingParticipantId(row);
                    return (
                      <tr key={row.id} className={adminTableRowClass}>
                        <td className="px-4 py-4 capitalize text-xs font-bold">
                          {row.respondentOwnerType}
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium">
                            {row.vendor?.companyName ?? row.panelSurvey?.surveyName}
                          </p>
                          <p className="text-xs text-gray-500">{row.panelSurvey?.surveyCode}</p>
                        </td>
                        <td className="px-4 py-4 font-mono text-xs font-bold text-brand-primary">
                          {trackingId || "—"}
                        </td>
                        <td className="px-4 py-4 font-mono text-xs">{row.internalSessionToken}</td>
                        <td className="px-4 py-4 text-xs font-semibold">{row.surveyStatus}</td>
                        <td className="px-4 py-4 text-xs text-gray-500">
                          {row.createdAt ? format(new Date(row.createdAt), "MMM d, HH:mm") : "—"}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Link
                            href={ROUTES.admin.surveyRespondent(row.id)}
                            className="text-sm font-semibold text-brand-primary"
                          >
                            Details
                          </Link>
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
