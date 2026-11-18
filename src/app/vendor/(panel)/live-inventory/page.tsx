"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart3,
  Clock,
  DollarSign,
  FileSpreadsheet,
  Globe,
  Layers,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { AdminTableSkeleton, adminTableContainerClass } from "@/components/crm/admin-table";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { COUNTRY_SELECT_OPTIONS, formatCountryName } from "@/constants/country-iso-codes";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { queryKeys } from "@/services/queries";
import { getVendorLiveInventory } from "@/services/vendor-portal/vendor-portal-api";
import { downloadCsv } from "@/utils/download-csv";
import { formatNumber } from "@/utils/format";

export default function VendorLiveInventoryPage() {
  const [country, setCountry] = useState("");

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: queryKeys.vendorPortalReports.liveInventory({ country: country || undefined }),
    queryFn: () => getVendorLiveInventory({ country: country || undefined }),
    placeholderData: (prev) => prev,
  });

  const items = useMemo(() => {
    const raw = data?.items ?? [];
    return [...raw].sort((a, b) => {
      const aName = a.countryCode === "GLOBAL" ? "Global" : formatCountryName(a.countryCode);
      const bName = b.countryCode === "GLOBAL" ? "Global" : formatCountryName(b.countryCode);
      return aName.localeCompare(bName);
    });
  }, [data?.items]);

  const summary = data?.summary;

  const countryOptions = useMemo(() => {
    const present = new Set((data?.availableCountries ?? []).map((c) => c.toUpperCase()));
    const presentList = Array.from(present)
      .filter((c) => c !== "GLOBAL")
      .map((code) => ({ code, name: formatCountryName(code) }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const otherList = COUNTRY_SELECT_OPTIONS.filter((c) => !present.has(c.code));
    return { presentList, otherList, hasGlobal: present.has("GLOBAL") };
  }, [data?.availableCountries]);

  const handleExportExcel = () => {
    if (items.length === 0) return;
    downloadCsv(
      `live-inventory-${Date.now()}.csv`,
      [
        "S.R.",
        "Country Name",
        "Country Code",
        "Live Inventories",
        "Live Surveys",
        "Avg CPI ($)",
        "Avg LOI (min)",
        "Avg IR (%)",
      ],
      items.map((row, idx) => [
        idx + 1,
        row.countryCode === "GLOBAL" ? "Global" : formatCountryName(row.countryCode),
        row.countryCode,
        row.liveInventories,
        row.liveSurveys,
        row.avgCpi.toFixed(2),
        row.avgLoi ?? "",
        row.avgIr ?? "",
      ])
    );
  };

  return (
    <div className="space-y-6 pb-10 text-slate-900">
      {/* KPI Summary Strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/80 via-white to-white p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Globe className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-indigo-100/80 border border-indigo-200 px-2 py-0.5 text-[10px] font-bold text-indigo-800">
              Active Markets
            </span>
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">Available Countries</p>
          <p className="mt-0.5 text-2xl font-black text-slate-900 tabular-nums">
            {formatNumber(summary?.totalCountries ?? 0)}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 via-white to-white p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <Layers className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              Open Quota
            </span>
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">Total Live Inventories</p>
          <p className="mt-0.5 text-2xl font-black text-emerald-700 tabular-nums">
            {formatNumber(summary?.totalLiveInventories ?? 0)}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/80 via-white to-white p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <BarChart3 className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-blue-100/80 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-800">
              Live Studies
            </span>
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">Live Surveys</p>
          <p className="mt-0.5 text-2xl font-black text-slate-900 tabular-nums">
            {formatNumber(summary?.totalLiveSurveys ?? 0)}
          </p>
        </div>

        <div className="rounded-2xl border border-purple-200/80 bg-gradient-to-br from-purple-50/80 via-white to-white p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-purple-100/80 border border-purple-200 px-2 py-0.5 text-[10px] font-bold text-purple-800">
              Highest Capacity
            </span>
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">Top Market</p>
          <p className="mt-0.5 text-xl font-black text-slate-900 truncate">
            {summary?.topCountryCode
              ? summary.topCountryCode === "GLOBAL"
                ? "Global"
                : formatCountryName(summary.topCountryCode)
              : "—"}
          </p>
        </div>
      </div>

      {/* Main Live Inventory Card (Matches Screenshot 3) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        {/* Card Header Bar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h1 className="inline-flex items-center gap-2 text-base font-black uppercase tracking-[0.1em] text-indigo-600">
              <BarChart3 className="h-4.5 w-4.5" />
              LIVE INVENTORY
            </h1>
            <p className="text-xs text-slate-500">
              Latest inventory available for each country across your active survey allocations
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <CustomDropdown
              value={country}
              onValueChange={setCountry}
              leftIcon={<Globe className="h-3.5 w-3.5 text-indigo-500" />}
              searchPlaceholder="Search country…"
              className="min-w-[200px]"
              aria-label="Filter live inventory by country"
            >
              <option value="">All Countries</option>
              {countryOptions.presentList.length > 0 && (
                <optgroup label="Available Markets">
                  {countryOptions.presentList.map((c) => (
                    <option key={`avail-${c.code}`} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                  {countryOptions.hasGlobal && (
                    <option value="GLOBAL">Global / Multi-Country</option>
                  )}
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

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs transition-colors disabled:opacity-50"
              title="Refresh live inventory"
              aria-label="Refresh live inventory"
            >
              <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              disabled={items.length === 0}
              className="h-10 px-4 rounded-xl bg-[#198754] hover:bg-[#157347] text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm shadow-emerald-600/20 transition-colors disabled:opacity-50"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Excel</span>
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="p-4 sm:p-5">
          {isLoading ? (
            <AdminTableSkeleton rows={7} />
          ) : isError ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-6 text-center text-sm font-medium text-rose-700">
              Could not load live inventory. Please try refreshing.
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 py-14 text-center">
              <Globe className="mx-auto h-10 w-10 text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-700">No live inventory available</p>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {country
                  ? `There are currently no active surveys with remaining quota for ${formatCountryName(country)}.`
                  : "No active surveys with remaining quota are currently assigned to your account."}
              </p>
              {country && (
                <button
                  type="button"
                  onClick={() => setCountry("")}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
                >
                  Show All Countries
                </button>
              )}
            </div>
          ) : (
            <div className={adminTableContainerClass}>
              <table className="w-full min-w-[720px] text-left text-xs text-slate-800">
                <thead className="bg-[#091428] text-white">
                  <tr className="text-[10px] font-extrabold uppercase tracking-wider text-slate-100">
                    <th className="px-4 py-3 whitespace-nowrap w-20">S.R.</th>
                    <th className="px-4 py-3 whitespace-nowrap">Country Name</th>
                    <th className="px-4 py-3 whitespace-nowrap">Live Inventories</th>
                    <th className="px-4 py-3 whitespace-nowrap">Live Surveys</th>
                    <th className="px-4 py-3 whitespace-nowrap">Avg CPI</th>
                    <th className="px-4 py-3 whitespace-nowrap">Avg LOI / IR</th>
                    <th className="px-4 py-3 text-right whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((row, idx) => {
                    const countryName =
                      row.countryCode === "GLOBAL"
                        ? "Global / Multi-Country"
                        : formatCountryName(row.countryCode);
                    const surveysHref =
                      row.countryCode === "GLOBAL"
                        ? ROUTES.vendor.surveys
                        : `${ROUTES.vendor.surveys}?country=${encodeURIComponent(row.countryCode)}`;

                    return (
                      <tr key={row.countryCode} className="hover:bg-blue-50/40 transition-colors">
                        <td className="px-4 py-3.5 font-mono text-xs font-bold text-slate-500">
                          {idx + 1}
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
                              <Globe className="h-3.5 w-3.5" />
                            </span>
                            <span className="text-sm font-bold text-slate-900">{countryName}</span>
                            {row.countryCode !== "GLOBAL" && (
                              <span className="rounded bg-slate-100 border border-slate-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600">
                                {row.countryCode}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-sm font-black text-slate-900 tabular-nums">
                            {formatNumber(row.liveInventories)}
                          </span>
                          <span className="ml-1.5 text-[11px] text-slate-400 font-medium">
                            available
                          </span>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700 tabular-nums">
                            {formatNumber(row.liveSurveys)}{" "}
                            {row.liveSurveys === 1 ? "survey" : "surveys"}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap font-bold text-emerald-700 tabular-nums">
                          <span className="inline-flex items-center gap-0.5">
                            <DollarSign className="h-3 w-3" />
                            {row.avgCpi.toFixed(2)}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 font-medium tabular-nums">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            {row.avgLoi != null ? `${row.avgLoi} min` : "—"}
                          </span>
                          <span className="mx-1.5 text-slate-300">·</span>
                          <span className="text-indigo-700 font-semibold">
                            {row.avgIr != null ? `${row.avgIr}% IR` : "—"}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <Link
                            href={surveysHref}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-600 hover:text-white transition-colors"
                          >
                            <span>View Surveys</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
