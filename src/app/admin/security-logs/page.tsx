"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Shield } from "lucide-react";

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
import { getSecurityAnalytics, listSecurityLogs } from "@/services/security-logs/security-logs-api";
import { downloadCsv } from "@/utils/download-csv";
import { formatNumber, formatPercent } from "@/utils/format";

export default function AdminSecurityLogsPage() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [decision, setDecision] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const filters = useMemo(
    () => ({
      page,
      pageSize,
      search: deferredSearch.trim() || undefined,
      validationDecision: decision || undefined,
    }),
    [page, pageSize, deferredSearch, decision]
  );

  const logsQuery = useQuery({
    queryKey: ["security-logs", filters],
    queryFn: () =>
      listSecurityLogs({
        page,
        pageSize,
        validationDecision: decision || undefined,
        // Map free-text search onto supported query fields only
        ...(deferredSearch.trim()
          ? /^\d{1,3}(\.\d{1,3}){3}/.test(deferredSearch.trim())
            ? { ipAddress: deferredSearch.trim() }
            : deferredSearch.trim().length <= 3
              ? { country: deferredSearch.trim().toUpperCase() }
              : { reasonCode: deferredSearch.trim() }
          : {}),
      }),
  });

  const analyticsQuery = useQuery({
    queryKey: ["security-analytics", {}],
    queryFn: () => getSecurityAnalytics({}),
  });

  const stats = analyticsQuery.data;
  const items = logsQuery.data?.items ?? [];
  const meta = logsQuery.data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleExport = () => {
    downloadCsv(
      `security-logs-${Date.now()}.csv`,
      ["Time", "Channel", "IP", "Country", "Decision", "Reason", "Flags"],
      items.map((row) => [
        row.createdAt ? format(new Date(row.createdAt), "yyyy-MM-dd HH:mm") : "",
        row.channel,
        row.ipAddress,
        row.country || "",
        row.validationDecision,
        row.blockedReason || row.reasonCode || "",
        [
          row.botDetected ? "bot" : "",
          row.vpnDetected ? "vpn" : "",
          row.captchaPassed === false ? "captcha" : "",
        ]
          .filter(Boolean)
          .join(" "),
      ])
    );
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-2">
            <Shield className="h-7 w-7 text-brand-primary" />
            Security Logs
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Blocked traffic, captcha failures, geo mismatches, and bot signals.
          </p>
        </div>
        <PageHelp content={ADMIN_PAGE_HELP.securityLogs} />
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Total checks", formatNumber(stats.total)],
            ["Blocked", formatNumber(stats.blocked)],
            ["Block rate %", formatPercent(stats.blockRate)],
            ["Captcha fail %", formatPercent(stats.captchaFailureRate)],
            ["Bot signals %", formatPercent(stats.botTrafficRate)],
          ].map(([label, val]) => (
            <div
              key={String(label)}
              className="rounded-[1.5rem] border border-gray-100 bg-white p-4 shadow-sm"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                {label}
              </p>
              <p className="text-xl font-black mt-1 tabular-nums">{val}</p>
            </div>
          ))}
        </div>
      )}

      <div className={adminTableWrapClass}>
        <AdminTableToolbar
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          searchPlaceholder="Search IP, country, reason…"
          onExport={handleExport}
          exportDisabled={items.length === 0}
          filters={
            <select
              value={decision}
              onChange={(e) => {
                setDecision(e.target.value);
                setPage(1);
              }}
              className={adminFilterSelectClass}
            >
              <option value="">All decisions</option>
              <option value="allow">Allow</option>
              <option value="block">Block</option>
              <option value="review">Review</option>
            </select>
          }
        />

        {logsQuery.isLoading ? (
          <AdminTableSkeleton rows={8} />
        ) : items.length === 0 ? (
          <EmptyState icon={Shield} />
        ) : (
          <>
            <div className="overflow-x-auto custom-scrollbar rounded-xl border border-slate-200/90 bg-white shadow-sm">
              <table className="w-full min-w-[850px] text-xs text-slate-800">
                <thead className="bg-[#091428] text-white">
                  <tr className="text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-100">
                    <th className="px-3 py-2 whitespace-nowrap">Time</th>
                    <th className="px-3 py-2 whitespace-nowrap">Channel</th>
                    <th className="px-3 py-2 whitespace-nowrap">IP Address</th>
                    <th className="px-3 py-2 whitespace-nowrap">Country</th>
                    <th className="px-3 py-2 whitespace-nowrap">Decision</th>
                    <th className="px-3 py-2 whitespace-nowrap">Reason</th>
                    <th className="px-3 py-2 whitespace-nowrap">Flags</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((row) => (
                    <tr key={row._id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-3 py-1.5 text-xs text-slate-500 whitespace-nowrap align-middle">
                        {row.createdAt ? format(new Date(row.createdAt), "MMM d HH:mm") : "—"}
                      </td>
                      <td className="px-3 py-1.5 font-bold text-slate-900 capitalize whitespace-nowrap align-middle">
                        {row.channel}
                      </td>
                      <td className="px-3 py-1.5 font-mono text-xs font-bold text-blue-600 whitespace-nowrap align-middle">
                        {row.ipAddress}
                      </td>
                      <td className="px-3 py-1.5 text-xs text-slate-700 whitespace-nowrap align-middle">
                        {row.country || "—"}
                      </td>
                      <td className="px-3 py-1.5 whitespace-nowrap align-middle">
                        <span
                          className={`inline-flex px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full border leading-none ${
                            row.validationDecision === "allow"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : row.validationDecision === "block"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {row.validationDecision}
                        </span>
                      </td>
                      <td
                        className="px-3 py-1.5 text-xs text-slate-600 max-w-[200px] truncate whitespace-nowrap align-middle"
                        title={row.blockedReason || row.reasonCode || ""}
                      >
                        {row.blockedReason || row.reasonCode || "—"}
                      </td>
                      <td className="px-3 py-1.5 text-xs font-mono text-slate-600 whitespace-nowrap align-middle">
                        {row.botDetected ? (
                          <span className="text-rose-600 font-bold mr-1">BOT</span>
                        ) : null}
                        {row.vpnDetected ? (
                          <span className="text-amber-600 font-bold mr-1">VPN</span>
                        ) : null}
                        {row.captchaPassed === false ? (
                          <span className="text-rose-600 font-bold">CAPTCHA-FAIL</span>
                        ) : null}
                        {!row.botDetected && !row.vpnDetected && row.captchaPassed !== false
                          ? "—"
                          : null}
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
