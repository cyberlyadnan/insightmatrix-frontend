"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Banknote,
  BarChart3,
  CheckCircle2,
  Clock,
  DollarSign,
  FileSpreadsheet,
  Filter,
  Globe,
  Layers,
  Loader2,
  Percent,
  RefreshCw,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import {
  DateRangeFilter,
  createDateRangeValue,
  type DateRangeValue,
} from "@/components/shared/DateRangeFilter";
import { adminFilterSelectClass } from "@/components/crm/admin-table";
import { cn } from "@/lib/utils";
import { queryKeys } from "@/services/queries";
import {
  getVendorHourlyReport,
  type VendorHourlyCellMetrics,
} from "@/services/vendor-portal/vendor-portal-api";
import { downloadCsv } from "@/utils/download-csv";
import { formatCurrency, formatNumber } from "@/utils/format";

type ReportTab = "hourly" | "market" | "revenue" | "conversion";

type SortState = {
  column: string | null; // YYYY-MM-DD or "total" or null (chronological)
  direction: "desc" | "asc";
};

function formatColumnDate(dateKey: string): string {
  try {
    return format(parseISO(dateKey), "dd MMM yyyy");
  } catch {
    return dateKey;
  }
}

function formatShortDate(dateKey: string): string {
  try {
    return format(parseISO(dateKey), "dd MMM");
  } catch {
    return dateKey;
  }
}

function getMetricValue(cell: VendorHourlyCellMetrics | undefined, tab: ReportTab): number {
  if (!cell) return 0;
  if (tab === "revenue") return cell.revenue;
  if (tab === "conversion") return cell.conversionRate;
  return cell.starts;
}

function formatCellDisplay(cell: VendorHourlyCellMetrics | undefined, tab: ReportTab): string {
  if (!cell) {
    if (tab === "revenue") return "$0.00";
    if (tab === "conversion") return "0%";
    return "0";
  }
  if (tab === "revenue") {
    return cell.revenue > 0 ? `$${cell.revenue.toFixed(2)}` : "$0.00";
  }
  if (tab === "conversion") {
    return cell.starts > 0 ? `${cell.conversionRate.toFixed(1)}%` : "0%";
  }
  return formatNumber(cell.starts);
}

function getCellTooltip(
  cell: VendorHourlyCellMetrics | undefined,
  rowLabel: string,
  dateLabel: string
): string {
  if (!cell || cell.starts === 0) {
    return `${rowLabel} · ${dateLabel}\nNo traffic recorded`;
  }
  return [
    `${rowLabel} · ${dateLabel}`,
    `Traffic / Starts: ${cell.starts.toLocaleString()}`,
    `Completes: ${cell.completes.toLocaleString()}`,
    `Terminates: ${cell.terminates.toLocaleString()}`,
    `Quota Full: ${cell.quotaFull.toLocaleString()}`,
    `Quality Reject: ${cell.qualityRejects.toLocaleString()}`,
    `Conversion Rate: ${cell.conversionRate.toFixed(1)}%`,
    `Revenue: $${cell.revenue.toFixed(2)}`,
  ].join("\n");
}

function getHeatClass(val: number, maxVal: number, tab: ReportTab): string {
  if (val <= 0 || maxVal <= 0) return "text-slate-400 font-normal";
  const ratio = val / maxVal;

  if (tab === "revenue") {
    if (ratio >= 0.7) return "bg-emerald-100/90 text-emerald-950 font-extrabold";
    if (ratio >= 0.35) return "bg-emerald-50/90 text-emerald-900 font-bold";
    return "bg-emerald-50/40 text-emerald-800 font-semibold";
  }
  if (tab === "conversion") {
    if (val >= 35) return "bg-violet-100/90 text-violet-950 font-extrabold";
    if (val >= 15) return "bg-indigo-50/90 text-indigo-900 font-bold";
    return "bg-slate-50 text-slate-800 font-semibold";
  }
  if (ratio >= 0.7) return "bg-blue-100/80 text-blue-950 font-extrabold";
  if (ratio >= 0.35) return "bg-sky-50/90 text-blue-900 font-bold";
  return "bg-sky-50/40 text-slate-800 font-semibold";
}

function ChartTooltip({
  active,
  payload,
  label,
  tab,
}: {
  active?: boolean;
  payload?: Array<{ value?: number; name?: string; color?: string }>;
  label?: string;
  tab: ReportTab;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-xl shadow-slate-900/10 text-xs">
      <p className="font-bold text-slate-500 mb-1">{label}</p>
      {payload.map((entry) => {
        const val = Number(entry.value ?? 0);
        const formatted =
          tab === "revenue"
            ? `$${val.toFixed(2)}`
            : tab === "conversion"
              ? `${val.toFixed(1)}%`
              : formatNumber(val);
        return (
          <p key={entry.name} className="font-extrabold text-slate-900 flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full inline-block"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.name}:</span>
            <span className="tabular-nums">{formatted}</span>
          </p>
        );
      })}
    </div>
  );
}

export default function VendorHourlyReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>("hourly");
  const [dateRange, setDateRange] = useState<DateRangeValue>(() =>
    createDateRangeValue("last_week")
  );
  const [showFilters, setShowFilters] = useState(false);
  const [showChart, setShowChart] = useState(true);
  const [allocationId, setAllocationId] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<SortState>({ column: null, direction: "desc" });

  // Minutes EAST of UTC (getTimezoneOffset returns WEST of UTC, so negate it)
  const tzOffsetMinutes = useMemo(() => -new Date().getTimezoneOffset(), []);

  const queryParams = useMemo(
    () => ({
      dateFrom: dateRange.dateFrom,
      dateTo: dateRange.dateTo,
      allocationId: allocationId || undefined,
      country: country || undefined,
      status: status !== "all" ? status : undefined,
      tzOffsetMinutes,
    }),
    [dateRange.dateFrom, dateRange.dateTo, allocationId, country, status, tzOffsetMinutes]
  );

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: queryKeys.vendorPortalReports.hourly(queryParams),
    queryFn: () => getVendorHourlyReport(queryParams),
    placeholderData: (prev) => prev,
  });

  const dates = useMemo(() => data?.dates ?? [], [data?.dates]);
  const hourlyRows = useMemo(() => data?.hourlyRows ?? [], [data?.hourlyRows]);
  const marketRows = useMemo(() => data?.marketRows ?? [], [data?.marketRows]);
  const dailyTotals = useMemo(() => data?.dailyTotals ?? {}, [data?.dailyTotals]);
  const summary = data?.summary;

  const activeFilterCount = (allocationId ? 1 : 0) + (country ? 1 : 0) + (status !== "all" ? 1 : 0);

  const handleSortColumn = (col: string) => {
    setSort((prev) => {
      if (prev.column !== col) return { column: col, direction: "desc" };
      if (prev.direction === "desc") return { column: col, direction: "asc" };
      return { column: null, direction: "desc" };
    });
  };

  // Build rows for current tab & apply column sort
  const tableRows = useMemo(() => {
    const base =
      activeTab === "market"
        ? marketRows.map((r) => ({
            key: r.market,
            label: r.market,
            cells: r.cells,
            total: r.total,
          }))
        : hourlyRows.map((r) => ({
            key: String(r.hour),
            label: r.label,
            cells: r.cells,
            total: r.total,
          }));

    if (!sort.column) return base;

    const col = sort.column;
    const dir = sort.direction === "desc" ? -1 : 1;
    return [...base].sort((a, b) => {
      const aVal =
        col === "total"
          ? getMetricValue(a.total, activeTab)
          : getMetricValue(a.cells[col], activeTab);
      const bVal =
        col === "total"
          ? getMetricValue(b.total, activeTab)
          : getMetricValue(b.cells[col], activeTab);
      return (aVal - bVal) * dir;
    });
  }, [activeTab, marketRows, hourlyRows, sort]);

  // Max value across matrix cells for heat-map tint intensity
  const maxCellValue = useMemo(() => {
    let max = 0;
    for (const row of tableRows) {
      for (const d of dates) {
        const val = getMetricValue(row.cells[d], activeTab);
        if (val > max) max = val;
      }
    }
    return max;
  }, [tableRows, dates, activeTab]);

  // Grand total summary cell
  const grandTotalCell: VendorHourlyCellMetrics = useMemo(
    () => ({
      starts: summary?.totalStarts ?? 0,
      completes: summary?.totalCompletes ?? 0,
      terminates: summary?.totalTerminates ?? 0,
      quotaFull: summary?.totalQuotaFull ?? 0,
      qualityRejects: summary?.totalQualityRejects ?? 0,
      revenue: summary?.totalRevenue ?? 0,
      conversionRate: summary?.conversionRate ?? 0,
    }),
    [summary]
  );

  // Chart data adapted to active tab
  const chartData = useMemo<
    Array<{
      name: string;
      Traffic?: number;
      Completes?: number;
      Revenue?: number;
      "Conversion %"?: number;
    }>
  >(() => {
    if (activeTab === "market") {
      return marketRows.slice(0, 12).map((m) => ({
        name: m.market,
        Traffic: m.total.starts,
        Completes: m.total.completes,
      }));
    }
    if (activeTab === "revenue") {
      return dates.map((d) => ({
        name: formatShortDate(d),
        Revenue: dailyTotals[d]?.revenue ?? 0,
      }));
    }
    if (activeTab === "conversion") {
      return dates.map((d) => ({
        name: formatShortDate(d),
        "Conversion %": dailyTotals[d]?.conversionRate ?? 0,
      }));
    }
    // Hour Wise Traffic -> 24-hour distribution
    return hourlyRows.map((r) => ({
      name: `${String(r.hour).padStart(2, "0")}:00`,
      Traffic: r.total.starts,
      Completes: r.total.completes,
    }));
  }, [activeTab, marketRows, dates, dailyTotals, hourlyRows]);

  // Export currently active tab as Excel-compatible CSV
  const handleExport = () => {
    if (!dates.length) return;
    const tabNameMap: Record<ReportTab, string> = {
      hourly: "hour-wise-traffic",
      market: "market-wise-traffic",
      revenue: "revenue-wise-traffic",
      conversion: "conversion-report",
    };

    const firstColHeader = activeTab === "market" ? "Market" : "Hourly Slot";
    const headers = [firstColHeader, ...dates.map(formatColumnDate), "Total"];

    const totalRow = [
      "Total",
      ...dates.map((d) => formatCellDisplay(dailyTotals[d], activeTab)),
      formatCellDisplay(grandTotalCell, activeTab),
    ];

    const bodyRows = tableRows.map((r) => [
      r.label,
      ...dates.map((d) => formatCellDisplay(r.cells[d], activeTab)),
      formatCellDisplay(r.total, activeTab),
    ]);

    downloadCsv(
      `vendor-${tabNameMap[activeTab]}-${data?.dateFrom ?? "report"}-to-${data?.dateTo ?? "now"}.csv`,
      headers,
      [totalRow, ...bodyRows]
    );
  };

  const tabs: Array<{
    id: ReportTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: "hourly", label: "Hour Wise Traffic", icon: BarChart3 },
    { id: "market", label: "Market Wise Traffic", icon: Globe },
    { id: "revenue", label: "Revenue Wise Traffic", icon: Banknote },
    { id: "conversion", label: "Conversion", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 pb-10 text-slate-900">
      {/* Top Executive Header Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white px-5 py-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-base sm:text-lg font-black uppercase tracking-[0.14em] bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
              HOURLY REPORT
            </h1>
            {data?.dateFrom && data?.dateTo && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                <Clock className="h-3 w-3 text-blue-600" />
                {formatColumnDate(data.dateFrom)} — {formatColumnDate(data.dateTo)}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Granular hour-by-hour traffic, market distribution, revenue yield, and conversion
            performance across your campaigns.
          </p>
        </div>

        {/* Action Controls (matching Screenshot 2's iconic Refresh / Excel / Filter toolbar + Date Picker) */}
        <div className="flex flex-wrap items-center gap-2">
          <DateRangeFilter
            value={dateRange}
            onChange={(next) => {
              setDateRange(next);
              setSort({ column: null, direction: "desc" });
            }}
            hideAllTime
          />

          <button
            type="button"
            onClick={() => setShowChart((prev) => !prev)}
            className={cn(
              "h-10 px-3 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm",
              showChart
                ? "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
            title="Toggle visual trend chart"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{showChart ? "Hide Chart" : "Show Chart"}</span>
          </button>

          {/* Refresh Button (Blue) */}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-[#0d6efd] text-white hover:bg-[#0b5ed7] shadow-sm shadow-blue-500/25 transition-all disabled:opacity-60"
            title="Refresh report data"
            aria-label="Refresh report data"
          >
            <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
          </button>

          {/* Export Excel / CSV Button (Green) */}
          <button
            type="button"
            onClick={handleExport}
            disabled={!dates.length}
            className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-[#198754] text-white hover:bg-[#157347] shadow-sm shadow-emerald-600/25 transition-all disabled:opacity-50"
            title="Export active report to Excel / CSV"
            aria-label="Export report"
          >
            <FileSpreadsheet className="h-4 w-4" />
          </button>

          {/* Filter Toggle Button (Orange) */}
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className={cn(
              "relative h-10 w-10 inline-flex items-center justify-center rounded-xl text-white shadow-sm transition-all",
              showFilters || activeFilterCount > 0
                ? "bg-[#ea580c] hover:bg-[#c2410c] shadow-orange-500/30 ring-2 ring-orange-200"
                : "bg-[#f97316] hover:bg-[#ea580c] shadow-orange-500/25"
            )}
            title="Filter by survey, market, or status"
            aria-label="Toggle filters"
          >
            <Filter className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 rounded-full bg-[#091428] text-[9px] font-black text-white flex items-center justify-center border border-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Filter Drawer */}
      {showFilters && (
        <div className="rounded-2xl border border-orange-200/80 bg-gradient-to-br from-orange-50/40 via-white to-slate-50/50 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
              <Filter className="h-3.5 w-3.5 text-orange-600" />
              Report Filters
            </div>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setAllocationId("");
                  setCountry("");
                  setStatus("all");
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear filters
              </button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Assigned Survey
              </label>
              <select
                value={allocationId}
                onChange={(e) => setAllocationId(e.target.value)}
                className={cn(adminFilterSelectClass, "w-full max-w-none")}
              >
                <option value="">All assigned surveys</option>
                {(data?.filtersMeta?.allocations ?? []).map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.allocationCode} — {a.surveyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Market / Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={cn(adminFilterSelectClass, "w-full max-w-none")}
              >
                <option value="">All markets</option>
                {(data?.filtersMeta?.countries ?? []).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Traffic Outcome Filter
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={cn(adminFilterSelectClass, "w-full max-w-none")}
              >
                <option value="all">All Traffic (Clicks / Starts)</option>
                <option value="complete">Completes Only</option>
                <option value="terminate">Terminates Only</option>
                <option value="quota_full">Quota Full Only</option>
                <option value="quality_reject">Quality Rejects Only</option>
                <option value="redirected">Redirected Only</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Executive KPI Summary Strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/80 via-white to-white p-4.5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Activity className="h-5 w-5" />
            </span>
            {summary?.peakHourLabel && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100/80 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                <Sparkles className="h-2.5 w-2.5" />
                Peak {summary.peakHourLabel}
              </span>
            )}
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">Total Traffic</p>
          <p className="mt-0.5 text-2xl font-black text-slate-900 tabular-nums">
            {formatNumber(summary?.totalStarts ?? 0)}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 via-white to-white p-4.5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              Verified
            </span>
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">Total Completes</p>
          <p className="mt-0.5 text-2xl font-black text-emerald-700 tabular-nums">
            {formatNumber(summary?.totalCompletes ?? 0)}
          </p>
        </div>

        <div className="rounded-2xl border border-purple-200/80 bg-gradient-to-br from-purple-50/80 via-white to-white p-4.5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Percent className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-purple-100/80 border border-purple-200 px-2 py-0.5 text-[10px] font-bold text-purple-800">
              Yield
            </span>
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">Conversion Rate</p>
          <p className="mt-0.5 text-2xl font-black text-slate-900 tabular-nums">
            {(summary?.conversionRate ?? 0).toFixed(1)}%
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 via-white to-white p-4.5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <DollarSign className="h-5 w-5" />
            </span>
            {summary?.topMarket && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/80 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                <Globe className="h-2.5 w-2.5" />
                Top: {summary.topMarket}
              </span>
            )}
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">Total Revenue</p>
          <p className="mt-0.5 text-2xl font-black text-slate-900 tabular-nums">
            {formatCurrency(summary?.totalRevenue ?? 0)}
          </p>
        </div>
      </div>

      {/* Optional Visual Trend Chart */}
      {showChart && !isLoading && !isError && chartData.length > 0 && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
                {activeTab === "hourly"
                  ? "24-Hour Traffic Distribution"
                  : activeTab === "market"
                    ? "Market Volume Breakdown"
                    : activeTab === "revenue"
                      ? "Daily Revenue Trend ($)"
                      : "Daily Conversion Trend (%)"}
              </h2>
              <p className="text-[11px] text-slate-400">
                Aggregated across {dates.length} day{dates.length === 1 ? "" : "s"} in your local
                timezone
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
              {(activeTab === "hourly" || activeTab === "market") && (
                <>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-[#0d6efd]" />
                    Traffic
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-[#10b981]" />
                    Completes
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 6, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip tab={activeTab} />} />
                {activeTab === "revenue" ? (
                  <Bar dataKey="Revenue" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={36} />
                ) : activeTab === "conversion" ? (
                  <Bar
                    dataKey="Conversion %"
                    fill="#7c3aed"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={36}
                  />
                ) : (
                  <>
                    <Bar dataKey="Traffic" fill="#0d6efd" radius={[4, 4, 0, 0]} maxBarSize={24} />
                    <Bar dataKey="Completes" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={24} />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Main Tabbed Pivot Matrix Card (Faithful to Screenshot 2 + Executive Styling) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        {/* 4 Tabs Strip */}
        <div className="border-b border-slate-200 bg-white px-4 pt-2 flex items-center gap-1 overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setSort({ column: null, direction: "desc" });
                }}
                className={cn(
                  "relative inline-flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors border-b-2 -mb-px",
                  isActive
                    ? "border-[#0d6efd] text-[#0d6efd]"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-[#0d6efd]" : "text-slate-400")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Table Content */}
        <div className="p-4 sm:p-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Aggregating hourly analytics…
              </p>
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-6 text-center text-sm font-medium text-rose-700">
              Could not load hourly report. Please click Refresh to try again.
            </div>
          ) : activeTab === "market" && tableRows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 py-14 text-center">
              <Layers className="mx-auto h-10 w-10 text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">No market traffic recorded</p>
              <p className="text-xs text-slate-500 mt-1">
                Try expanding your date range or clearing the active report filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar rounded-xl border border-slate-200 bg-white max-h-[640px] overflow-y-auto">
              <table className="w-full text-xs border-collapse">
                <thead className="sticky top-0 z-20">
                  {/* Column Header Row */}
                  <tr className="bg-[#f8fafc] border-b border-slate-200 text-slate-700">
                    <th className="sticky left-0 z-30 bg-[#f8fafc] px-4 py-3 text-left font-extrabold text-[11px] uppercase tracking-wider text-slate-700 whitespace-nowrap border-r border-slate-200 min-w-[130px]">
                      <button
                        type="button"
                        onClick={() => setSort({ column: null, direction: "desc" })}
                        className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors"
                        title="Reset sort order"
                      >
                        <span>{activeTab === "market" ? "Market" : "Hourly Slot"}</span>
                      </button>
                    </th>

                    {dates.map((dateKey) => {
                      const isSorted = sort.column === dateKey;
                      return (
                        <th
                          key={dateKey}
                          className="px-3.5 py-3 text-center font-extrabold text-[11px] text-slate-700 whitespace-nowrap border-r border-slate-100 min-w-[112px]"
                        >
                          <button
                            type="button"
                            onClick={() => handleSortColumn(dateKey)}
                            className={cn(
                              "inline-flex items-center justify-center gap-1.5 hover:text-blue-600 transition-colors",
                              isSorted && "text-blue-600"
                            )}
                          >
                            <span>{formatColumnDate(dateKey)}</span>
                            {isSorted ? (
                              sort.direction === "desc" ? (
                                <ArrowDown className="h-3 w-3 text-blue-600" />
                              ) : (
                                <ArrowUp className="h-3 w-3 text-blue-600" />
                              )
                            ) : (
                              <ArrowUpDown className="h-3 w-3 text-slate-400" />
                            )}
                          </button>
                        </th>
                      );
                    })}

                    <th className="sticky right-0 z-30 bg-[#f1f5f9] px-4 py-3 text-center font-extrabold text-[11px] uppercase tracking-wider text-slate-800 whitespace-nowrap border-l border-slate-200 min-w-[100px]">
                      <button
                        type="button"
                        onClick={() => handleSortColumn("total")}
                        className={cn(
                          "inline-flex items-center justify-center gap-1 hover:text-blue-600 transition-colors",
                          sort.column === "total" && "text-blue-600"
                        )}
                      >
                        <span>Total</span>
                        {sort.column === "total" ? (
                          sort.direction === "desc" ? (
                            <ArrowDown className="h-3 w-3 text-blue-600" />
                          ) : (
                            <ArrowUp className="h-3 w-3 text-blue-600" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        )}
                      </button>
                    </th>
                  </tr>

                  {/* Pinned Total Summary Row (Matches Screenshot 2 directly under column headers!) */}
                  <tr className="bg-[#e5e7eb] border-b border-slate-300 text-slate-900 font-extrabold">
                    <td className="sticky left-0 z-30 bg-[#e5e7eb] px-4 py-2.5 text-left text-xs font-black text-slate-900 border-r border-slate-300/80 whitespace-nowrap">
                      Total
                    </td>
                    {dates.map((dateKey) => (
                      <td
                        key={dateKey}
                        title={getCellTooltip(
                          dailyTotals[dateKey],
                          "Daily Total",
                          formatColumnDate(dateKey)
                        )}
                        className="px-3.5 py-2.5 text-center text-xs font-black tabular-nums text-slate-900 border-r border-slate-300/60 whitespace-nowrap"
                      >
                        {formatCellDisplay(dailyTotals[dateKey], activeTab)}
                      </td>
                    ))}
                    <td
                      title={getCellTooltip(grandTotalCell, "Grand Total", dateRange.label)}
                      className="sticky right-0 z-30 bg-[#dbeafe] px-4 py-2.5 text-center text-xs font-black tabular-nums text-blue-950 border-l border-slate-300 whitespace-nowrap"
                    >
                      {formatCellDisplay(grandTotalCell, activeTab)}
                    </td>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {tableRows.map((row) => (
                    <tr key={row.key} className="hover:bg-blue-50/40 transition-colors group">
                      <td className="sticky left-0 z-10 bg-white group-hover:bg-blue-50/40 px-4 py-2.5 text-left font-mono text-xs font-semibold text-slate-700 border-r border-slate-200/80 whitespace-nowrap transition-colors">
                        {activeTab === "market" ? (
                          <span className="inline-flex items-center gap-1.5 font-sans font-bold text-slate-800">
                            <Globe className="h-3.5 w-3.5 text-blue-500" />
                            {row.label}
                          </span>
                        ) : (
                          row.label
                        )}
                      </td>

                      {dates.map((dateKey) => {
                        const cell = row.cells[dateKey];
                        const val = getMetricValue(cell, activeTab);
                        const heat = getHeatClass(val, maxCellValue, activeTab);
                        return (
                          <td
                            key={dateKey}
                            title={getCellTooltip(cell, row.label, formatColumnDate(dateKey))}
                            className={cn(
                              "px-3.5 py-2.5 text-center text-xs tabular-nums border-r border-slate-100 whitespace-nowrap transition-colors",
                              heat
                            )}
                          >
                            {formatCellDisplay(cell, activeTab)}
                          </td>
                        );
                      })}

                      <td
                        title={getCellTooltip(row.total, row.label, "Period Total")}
                        className="sticky right-0 z-10 bg-slate-50/90 group-hover:bg-blue-50/70 px-4 py-2.5 text-center text-xs font-extrabold tabular-nums text-slate-900 border-l border-slate-200/80 whitespace-nowrap transition-colors"
                      >
                        {formatCellDisplay(row.total, activeTab)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
