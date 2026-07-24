"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Users } from "lucide-react";

import {
  AdminPagination,
  AdminTableSkeleton,
  AdminTableToolbar,
  adminFilterSelectClass,
  adminTableHeadClass,
  adminTableRowClass,
  adminTableWrapClass,
} from "@/components/crm/admin-table";
import { EmptyState } from "@/components/shared/EmptyState";
import { ROUTES } from "@/constants/routes";
import { listVendorRespondentSessions } from "@/services/vendor-respondent-tracking/vendor-respondent-tracking-api";
import { queryKeys } from "@/services/queries";
import { VENDOR_RESPONDENT_SESSION_STATUSES } from "@/constants/vendor-allocation";
import { downloadCsv } from "@/utils/download-csv";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    started: "bg-slate-100 text-slate-600",
    redirected: "bg-blue-50 text-blue-700",
    complete: "bg-emerald-50 text-emerald-700",
    terminate: "bg-amber-50 text-amber-800",
    quota_full: "bg-orange-50 text-orange-800",
    quality_reject: "bg-rose-50 text-rose-700",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
        styles[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default function VendorRespondentTrackingPage() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [status, setStatus] = useState("");
  const [callbackForwarded, setCallbackForwarded] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const filters = useMemo(
    () => ({
      search: deferredSearch,
      status,
      callbackForwarded,
      page,
      pageSize,
    }),
    [deferredSearch, status, callbackForwarded, page, pageSize]
  );

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.vendorRespondentSessions.list(filters),
    queryFn: () =>
      listVendorRespondentSessions({
        page,
        pageSize,
        search: deferredSearch || undefined,
        status: status || undefined,
        callbackForwarded: callbackForwarded || undefined,
      }),
  });

  const items = data?.items ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleExport = () => {
    downloadCsv(
      `vendor-respondent-tracking-${Date.now()}.csv`,
      ["Vendor", "Survey", "toid", "Token", "Status", "Callback", "Started", "Completed"],
      items.map((row) => [
        row.vendor?.companyName ?? "",
        row.panelSurvey?.surveyName ?? "",
        row.vendorRespondentToid,
        row.internalSessionToken,
        row.status,
        row.callbackForwarded ? "Yes" : "No",
        row.startedAt ? format(new Date(row.startedAt), "yyyy-MM-dd HH:mm") : "",
        row.completedAt ? format(new Date(row.completedAt), "yyyy-MM-dd HH:mm") : "",
      ])
    );
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Users className="h-7 w-7 text-brand-primary" />
          Vendor respondent tracking
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Vendor toid ↔ internal token mapping, callback status, and session lifecycle.
        </p>
      </div>

      <div className={adminTableWrapClass}>
        <AdminTableToolbar
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          searchPlaceholder="Vendor toid, internal token, supplier pid…"
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
                {VENDOR_RESPONDENT_SESSION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                value={callbackForwarded}
                onChange={(e) => {
                  setCallbackForwarded(e.target.value as "" | "true" | "false");
                  setPage(1);
                }}
                className={adminFilterSelectClass}
              >
                <option value="">Callback: any</option>
                <option value="true">Forwarded</option>
                <option value="false">Not forwarded</option>
              </select>
            </>
          }
        />

        {isLoading ? (
          <AdminTableSkeleton rows={8} />
        ) : items.length === 0 ? (
          <EmptyState icon={Users}>
            <Link
              href={ROUTES.admin.vendorAllocationsCreate}
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
                    <th className="px-4 py-3">Vendor</th>
                    <th className="px-4 py-3">Survey</th>
                    <th className="px-4 py-3">Vendor toid</th>
                    <th className="px-4 py-3">Internal token</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Callback</th>
                    <th className="px-4 py-3">Started</th>
                    <th className="px-4 py-3">Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row) => (
                    <tr key={row.id} className={adminTableRowClass}>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-gray-900">{row.vendor?.companyName}</p>
                        <p className="text-xs text-gray-500">{row.vendor?.vendorCode}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium line-clamp-1">{row.panelSurvey?.surveyName}</p>
                        <p className="text-xs text-gray-500 font-mono">
                          {row.allocation?.routingSlug}
                        </p>
                      </td>
                      <td className="px-4 py-4 font-mono text-xs font-bold text-brand-primary">
                        {row.vendorRespondentToid || "—"}
                      </td>
                      <td className="px-4 py-4 font-mono text-xs">{row.internalSessionToken}</td>
                      <td className="px-4 py-4">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-4 py-4">
                        {row.callbackForwarded ? (
                          <span className="text-xs font-semibold text-emerald-700">Yes</span>
                        ) : (
                          <span className="text-xs text-gray-400">No</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-500 whitespace-nowrap">
                        {row.startedAt ? format(new Date(row.startedAt), "MMM d, HH:mm") : "—"}
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-500 whitespace-nowrap">
                        {row.completedAt ? format(new Date(row.completedAt), "MMM d, HH:mm") : "—"}
                      </td>
                    </tr>
                  ))}
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
