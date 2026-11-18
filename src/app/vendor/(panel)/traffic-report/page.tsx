"use client";

import React, { useDeferredValue, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Copy,
  DollarSign,
  FileSpreadsheet,
  Globe,
  Laptop,
  Loader2,
  Percent,
  RefreshCw,
  Search,
  Smartphone,
  Tablet,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  AdminPagination,
  AdminTableSkeleton,
  adminTableContainerClass,
} from "@/components/crm/admin-table";
import {
  DateRangeFilter,
  createDateRangeValue,
  type DateRangeValue,
} from "@/components/shared/DateRangeFilter";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { COUNTRY_SELECT_OPTIONS, formatCountryName } from "@/constants/country-iso-codes";
import { cn } from "@/lib/utils";
import { queryKeys } from "@/services/queries";
import {
  getVendorApiTrafficReport,
  type VendorApiTrafficRow,
} from "@/services/vendor-portal/vendor-portal-api";
import { downloadCsv } from "@/utils/download-csv";
import { formatCurrency, formatNumber } from "@/utils/format";

function formatTimestamp(iso: string | null): string {
  if (!iso) return "—";
  try {
    return format(new Date(iso), "yyyy-MM-dd HH:mm:ss");
  } catch {
    return "—";
  }
}

function StatusPill({ status, rawStatus }: { status: string; rawStatus: string }) {
  const styles: Record<string, string> = {
    complete: "bg-emerald-50 text-emerald-700 border-emerald-200",
    terminate: "bg-amber-50 text-amber-800 border-amber-200",
    quota_full: "bg-sky-50 text-sky-700 border-sky-200",
    quality_reject: "bg-rose-50 text-rose-700 border-rose-200",
  };
  const cls =
    status === "Survey Inactive"
      ? "bg-slate-100 text-slate-600 border-slate-200"
      : styles[rawStatus] || "bg-orange-50 text-orange-700 border-orange-200";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap",
        cls
      )}
    >
      {status}
    </span>
  );
}

function DeviceBadge({ device }: { device: VendorApiTrafficRow["device"] }) {
  const Icon = device === "mobile" ? Smartphone : device === "tablet" ? Tablet : Laptop;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 capitalize">
      <Icon className="h-3.5 w-3.5 text-slate-400" />
      <span>{device}</span>
    </span>
  );
}

export default function VendorApiTrafficReportPage() {
  const [dateRange, setDateRange] = useState<DateRangeValue>(() => createDateRangeValue("today"));
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const queryParams = useMemo(
    () => ({
      dateFrom: dateRange.dateFrom,
      dateTo: dateRange.dateTo,
      country: country || undefined,
      status: status !== "all" ? status : undefined,
      search: deferredSearch.trim() || undefined,
      page,
      pageSize,
    }),
    [dateRange.dateFrom, dateRange.dateTo, country, status, deferredSearch, page, pageSize]
  );

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: queryKeys.vendorPortalReports.traffic(queryParams),
    queryFn: () => getVendorApiTrafficReport(queryParams),
    placeholderData: (prev) => prev,
  });

  const items = useMemo(() => data?.items ?? [], [data?.items]);
  const meta = data?.meta;
  const summary = data?.summary;

  const countryOptions = useMemo(() => {
    const present = new Set((data?.availableCountries ?? []).map((c) => c.toUpperCase()));
    const presentList = Array.from(present)
      .map((code) => ({ code, name: formatCountryName(code) }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const otherList = COUNTRY_SELECT_OPTIONS.filter((c) => !present.has(c.code));
    return { presentList, otherList };
  }, [data?.availableCountries]);

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  const handleExportExcel = () => {
    if (items.length === 0) return;
    downloadCsv(
      `api-traffic-report-${Date.now()}.csv`,
      [
        "Respondent ID",
        "Survey ID",
        "Project Name",
        "Market",
        "Entry Time",
        "Exit Time",
        "Status",
        "CPI",
        "Revenue",
        "Redirect Status",
        "Device",
        "Country",
        "Entry URL",
        "Exit URL",
      ],
      items.map((row) => {
        const countryLabel =
          row.countryCode === "GLOBAL" ? "Global" : formatCountryName(row.countryCode);
        return [
          row.respondentId,
          row.surveyId,
          row.projectName,
          countryLabel,
          formatTimestamp(row.entryTime),
          formatTimestamp(row.exitTime),
          row.status,
          row.cpi.toFixed(2),
          row.revenue.toFixed(2),
          row.redirectStatus,
          row.device,
          countryLabel,
          row.entryUrl || "—",
          row.exitUrl || "—",
        ];
      })
    );
  };

  return (
    <div className="space-y-6 pb-10 text-slate-900">
      {/* Executive KPI Strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/80 via-white to-white p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Activity className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-indigo-100/80 border border-indigo-200 px-2 py-0.5 text-[10px] font-bold text-indigo-800">
              {dateRange.label}
            </span>
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">Total Attempts</p>
          <p className="mt-0.5 text-2xl font-black text-slate-900 tabular-nums">
            {formatNumber(summary?.totalAttempts ?? 0)}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 via-white to-white p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              {(summary?.conversionRate ?? 0).toFixed(1)}% CR
            </span>
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">Completes</p>
          <p className="mt-0.5 text-2xl font-black text-emerald-700 tabular-nums">
            {formatNumber(summary?.completes ?? 0)}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 via-white to-white p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <XCircle className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-amber-100/80 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-900">
              {formatNumber(summary?.terminates ?? 0)} Term · {formatNumber(summary?.dropOuts ?? 0)}{" "}
              Drop
            </span>
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">Drop Outs & Non-Completes</p>
          <p className="mt-0.5 text-2xl font-black text-slate-900 tabular-nums">
            {formatNumber(
              (summary?.dropOuts ?? 0) +
                (summary?.terminates ?? 0) +
                (summary?.quotaFull ?? 0) +
                (summary?.qualityRejects ?? 0)
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-purple-200/80 bg-gradient-to-br from-purple-50/80 via-white to-white p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <DollarSign className="h-5 w-5" />
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100/80 border border-purple-200 px-2 py-0.5 text-[10px] font-bold text-purple-800">
              <Percent className="h-2.5 w-2.5" />
              Earned
            </span>
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">Total Revenue</p>
          <p className="mt-0.5 text-2xl font-black text-slate-900 tabular-nums">
            {formatCurrency(summary?.totalRevenue ?? 0)}
          </p>
        </div>
      </div>

      {/* Main API Traffic Report Card (Matches Screenshots 1 & 2) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        {/* Card Header Bar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h1 className="inline-flex items-center gap-2 text-base font-black uppercase tracking-[0.1em] text-indigo-600">
              <BarChart3 className="h-4.5 w-4.5" />
              API TRAFFIC REPORT
            </h1>
            <p className="text-xs text-slate-500">
              Detailed respondent-level API traffic data across your routed survey attempts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Country Dropdown */}
            <CustomDropdown
              value={country}
              onValueChange={(val) => {
                setCountry(val);
                setPage(1);
              }}
              leftIcon={<Globe className="h-3.5 w-3.5 text-indigo-500" />}
              searchPlaceholder="Search country…"
              className="min-w-[148px] max-w-[175px]"
              aria-label="Filter by country"
            >
              <option value="">All Countries</option>
              {countryOptions.presentList.length > 0 && (
                <optgroup label="Active Traffic Markets">
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
            </CustomDropdown>

            {/* Status Dropdown */}
            <CustomDropdown
              value={status}
              onValueChange={(val) => {
                setStatus(val);
                setPage(1);
              }}
              searchable={false}
              className="min-w-[130px]"
              aria-label="Filter by status"
            >
              <option value="all">All Statuses</option>
              <option value="complete">Complete</option>
              <option value="drop_out">Drop Out</option>
              <option value="terminate">Terminate</option>
              <option value="quota_full">Quota Full</option>
              <option value="quality_reject">Quality Reject</option>
            </CustomDropdown>

            {/* Date Range Picker */}
            <DateRangeFilter
              value={dateRange}
              onChange={(next) => {
                setDateRange(next);
                setPage(1);
              }}
              className="[&>button]:min-w-[148px]"
            />

            {/* Refresh */}
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs transition-colors disabled:opacity-50 shrink-0"
              title="Refresh traffic report"
              aria-label="Refresh traffic report"
            >
              <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
            </button>

            {/* Green Excel Export Button */}
            <button
              type="button"
              onClick={handleExportExcel}
              disabled={items.length === 0}
              className="h-10 px-3.5 rounded-xl bg-[#198754] hover:bg-[#157347] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-colors disabled:opacity-50 shrink-0"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Excel</span>
            </button>
          </div>
        </div>

        {/* Search Strip */}
        <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search Respondent ID, Survey ID, or Project Name…"
              className="w-full h-9 pl-9 pr-8 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-500">
            Showing{" "}
            <span className="font-extrabold text-slate-800">{formatNumber(items.length)}</span> of{" "}
            <span className="font-extrabold text-slate-800">
              {formatNumber(meta?.total ?? items.length)}
            </span>{" "}
            traffic records
          </p>
        </div>

        {/* Table Body */}
        <div className="p-4 sm:p-5">
          {isLoading ? (
            <AdminTableSkeleton rows={8} />
          ) : isError ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-6 text-center text-sm font-medium text-rose-700">
              Could not load API traffic report. Please try refreshing.
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 py-14 text-center">
              <Activity className="mx-auto h-10 w-10 text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-700">
                No API traffic recorded for this period
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Switch the date range to <strong>All Time</strong> or <strong>Last Month</strong> to
                view historical respondent attempts, or send traffic through your accepted survey
                routing links.
              </p>
              {dateRange.preset !== "all" && (
                <button
                  type="button"
                  onClick={() => {
                    setDateRange(createDateRangeValue("all"));
                    setPage(1);
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm"
                >
                  View All Time Traffic
                </button>
              )}
            </div>
          ) : (
            <>
              <div className={adminTableContainerClass}>
                <table className="w-full min-w-[1480px] text-left text-xs text-slate-800">
                  <thead className="bg-[#091428] text-white">
                    <tr className="text-[10px] font-extrabold uppercase tracking-wider text-slate-100">
                      <th className="px-3.5 py-2.5 whitespace-nowrap">Respondent ID</th>
                      <th className="px-3.5 py-2.5 whitespace-nowrap">Survey ID</th>
                      <th className="px-3.5 py-2.5 whitespace-nowrap">Project Name</th>
                      <th className="px-3.5 py-2.5 whitespace-nowrap">Market</th>
                      <th className="px-3.5 py-2.5 whitespace-nowrap">Entry Time</th>
                      <th className="px-3.5 py-2.5 whitespace-nowrap">Exit Time</th>
                      <th className="px-3.5 py-2.5 whitespace-nowrap">Status</th>
                      <th className="px-3.5 py-2.5 text-right whitespace-nowrap">CPI</th>
                      <th className="px-3.5 py-2.5 text-right whitespace-nowrap">Revenue</th>
                      <th className="px-3.5 py-2.5 whitespace-nowrap">Redirect Status</th>
                      <th className="px-3.5 py-2.5 whitespace-nowrap">Device</th>
                      <th className="px-3.5 py-2.5 whitespace-nowrap">Country</th>
                      <th className="px-3.5 py-2.5 whitespace-nowrap">Entry URL</th>
                      <th className="px-3.5 py-2.5 whitespace-nowrap">Exit URL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((row) => {
                      const countryName =
                        row.countryCode === "GLOBAL"
                          ? "Global"
                          : formatCountryName(row.countryCode);

                      return (
                        <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                          {/* Respondent ID */}
                          <td className="px-3.5 py-2.5 whitespace-nowrap font-mono font-bold text-slate-900">
                            <span title={row.internalSessionToken}>{row.respondentId || "—"}</span>
                          </td>

                          {/* Survey ID */}
                          <td className="px-3.5 py-2.5 whitespace-nowrap font-mono text-xs font-semibold text-indigo-700">
                            {row.surveyId}
                          </td>

                          {/* Project Name */}
                          <td
                            className="px-3.5 py-2.5 max-w-[210px] truncate font-semibold text-slate-800"
                            title={row.projectName}
                          >
                            {row.projectName}
                          </td>

                          {/* Market */}
                          <td className="px-3.5 py-2.5 whitespace-nowrap font-medium text-slate-700">
                            {countryName}
                          </td>

                          {/* Entry Time */}
                          <td className="px-3.5 py-2.5 whitespace-nowrap font-mono text-[11px] text-slate-600 tabular-nums">
                            {formatTimestamp(row.entryTime)}
                          </td>

                          {/* Exit Time */}
                          <td className="px-3.5 py-2.5 whitespace-nowrap font-mono text-[11px] text-slate-600 tabular-nums">
                            {formatTimestamp(row.exitTime)}
                          </td>

                          {/* Status */}
                          <td className="px-3.5 py-2.5 whitespace-nowrap">
                            <StatusPill status={row.status} rawStatus={row.rawStatus} />
                          </td>

                          {/* CPI */}
                          <td className="px-3.5 py-2.5 text-right whitespace-nowrap font-bold tabular-nums text-slate-900">
                            {row.cpi.toFixed(2)}
                          </td>

                          {/* Revenue */}
                          <td
                            className={cn(
                              "px-3.5 py-2.5 text-right whitespace-nowrap font-extrabold tabular-nums",
                              row.revenue > 0 ? "text-emerald-700" : "text-slate-400"
                            )}
                          >
                            {row.revenue.toFixed(2)}
                          </td>

                          {/* Redirect Status */}
                          <td className="px-3.5 py-2.5 whitespace-nowrap text-slate-600 font-medium">
                            {row.redirectStatus}
                          </td>

                          {/* Device */}
                          <td className="px-3.5 py-2.5 whitespace-nowrap">
                            <DeviceBadge device={row.device} />
                          </td>

                          {/* Country */}
                          <td className="px-3.5 py-2.5 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[11px] font-bold text-blue-900">
                              <Globe className="h-3 w-3 text-blue-600" />
                              {countryName}
                            </span>
                          </td>

                          {/* Entry URL */}
                          <td className="px-3.5 py-2.5 whitespace-nowrap max-w-[180px]">
                            {row.entryUrl ? (
                              <button
                                type="button"
                                onClick={() => copyText(row.entryUrl!, "Entry URL")}
                                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-blue-600 hover:text-blue-800 max-w-[165px]"
                                title={row.entryUrl}
                              >
                                <span className="truncate">{row.entryUrl}</span>
                                <Copy className="h-3 w-3 shrink-0" />
                              </button>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          {/* Exit URL */}
                          <td className="px-3.5 py-2.5 whitespace-nowrap max-w-[180px]">
                            {row.exitUrl ? (
                              <button
                                type="button"
                                onClick={() => copyText(row.exitUrl!, "Exit URL")}
                                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 hover:text-emerald-900 max-w-[165px]"
                                title={row.exitUrl}
                              >
                                <span className="truncate">{row.exitUrl}</span>
                                <Copy className="h-3 w-3 shrink-0" />
                              </button>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <AdminPagination
                page={page}
                totalPages={meta?.totalPages ?? 1}
                total={meta?.total ?? items.length}
                pageSize={pageSize}
                pageSizeOptions={[20, 50, 100, 200]}
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

      {isFetching && !isLoading && (
        <div className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#091428] px-3.5 py-2 text-xs font-bold text-white shadow-xl">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
          Updating traffic data…
        </div>
      )}
    </div>
  );
}
