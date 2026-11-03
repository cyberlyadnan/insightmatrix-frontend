"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowRight, Calendar, ClipboardList, Layers, Loader2, Search, X } from "lucide-react";

import { CopyRoutingLinkButton } from "@/components/vendor/copy-routing-link-button";
import {
  VENDOR_ALLOCATION_STATUS_LABELS,
  VENDOR_ALLOCATION_STATUS_STYLES,
  type VendorAllocationStatus,
} from "@/constants/vendor-allocation";
import { ROUTES } from "@/constants/routes";
import { listVendorPortalSurveys } from "@/services/vendor-portal/vendor-surveys-api";
import { queryKeys } from "@/services/queries";
import { Input } from "@/components/ui/input";

function QuotaProgress({
  completed,
  allocated,
  remaining,
}: {
  completed: number;
  allocated: number;
  remaining?: number;
}) {
  const pct = allocated > 0 ? Math.min(100, Math.round((completed / allocated) * 100)) : 0;
  return (
    <div className="mt-3">
      <div className="flex justify-between items-center text-[11px] font-bold text-gray-700 mb-1.5">
        <span className="flex items-center gap-1">
          <span className="text-gray-900 font-extrabold">{completed}</span>
          <span className="text-gray-400 font-normal">/ {allocated} completes</span>
        </span>
        <span className="text-[10px] uppercase font-bold text-brand-primary">
          {pct}% · {remaining ?? Math.max(0, allocated - completed)} left
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-primary to-indigo-600 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: VendorAllocationStatus }) {
  const isActive = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${VENDOR_ALLOCATION_STATUS_STYLES[status]}`}
    >
      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
      {VENDOR_ALLOCATION_STATUS_LABELS[status]}
    </span>
  );
}

export default function VendorSurveysPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.vendorPortalSurveys.list({}),
    queryFn: () => listVendorPortalSurveys({ pageSize: 100 }),
  });

  const items = data?.items ?? [];

  // Filter items based on search and status
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.surveyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.surveyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.allocationCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [items, searchTerm, statusFilter]);

  // Aggregate stats
  const totalAllocated = items.reduce((acc, curr) => acc + (curr.allocatedQuota || 0), 0);
  const totalCompleted = items.reduce((acc, curr) => acc + (curr.completedCount || 0), 0);
  const activeCount = items.filter((i) => i.status === "active").length;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary">
            <Layers className="h-4 w-4" />
            Campaign Inventory
          </span>
          <h1 className="mt-1 text-2xl md:text-3xl font-black tracking-tight text-gray-900">
            Assigned Surveys
          </h1>
          <p className="mt-1.5 text-sm text-gray-500 max-w-2xl leading-relaxed">
            All active research campaigns allocated to your vendor account. Route traffic with your
            unique routing links with respondent tracking parameters.
          </p>
        </div>

        {/* Quick Summary Pill Strip */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs shadow-sm">
            <span className="text-gray-400 font-medium">Total: </span>
            <span className="font-extrabold text-gray-900">{items.length} campaigns</span>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-2 text-xs shadow-sm">
            <span className="text-emerald-700 font-medium">Active: </span>
            <span className="font-extrabold text-emerald-900">{activeCount}</span>
          </div>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 px-3.5 py-2 text-xs shadow-sm">
            <span className="text-indigo-700 font-medium">Quota Delivered: </span>
            <span className="font-extrabold text-indigo-900">
              {totalCompleted} / {totalAllocated}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by survey name, code, or allocation..."
            className="pl-10 pr-9 h-10 rounded-xl border-gray-200 bg-slate-50/50 text-xs focus:bg-white transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Status:
          </span>
          {(["all", "active", "paused", "closed"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition-all ${
                statusFilter === st
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-slate-100 text-gray-600 hover:bg-slate-200/80"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary mb-3" />
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Loading assigned campaigns…
          </p>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-center text-sm text-rose-700 font-medium">
          Could not load surveys. Please try refreshing the page.
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
          <ClipboardList className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="font-bold text-base text-gray-800">No matching surveys found</p>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== "all"
              ? "Try clearing your search query or switching status filters."
              : "No campaign allocations are currently active on your vendor account. Contact your account manager for allocations."}
          </p>
          {(searchTerm || statusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-slate-100"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-brand-primary/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1 rounded-md bg-brand-subtle px-2 py-0.5 text-[10px] font-mono font-bold text-brand-primary border border-brand-light">
                      {item.allocationCode}
                    </span>
                    <h2 className="font-black text-gray-900 mt-2 text-base leading-snug line-clamp-1 group-hover:text-brand-primary transition-colors">
                      {item.surveyName}
                    </h2>
                    <p className="text-xs font-mono text-gray-400 mt-0.5">{item.surveyCode}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                {/* Quota Progress */}
                <QuotaProgress
                  completed={item.completedCount}
                  allocated={item.allocatedQuota}
                  remaining={item.liveRemainingQuota}
                />

                {/* Metrics Matrix */}
                <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-50/80 p-3 border border-gray-100 text-center">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                      CPI
                    </span>
                    <span className="text-base font-black text-gray-900">${item.vendorCpi}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                      CR
                    </span>
                    <span className="text-base font-black text-emerald-600">
                      {item.conversionRate}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                      IR
                    </span>
                    <span className="text-base font-black text-indigo-600">
                      {item.incidenceRate}%
                    </span>
                  </div>
                </div>

                {/* Date Window */}
                {(item.startDate || item.endDate) && (
                  <div className="mt-3.5 flex items-center gap-1.5 text-[11px] text-gray-500">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    <span>
                      {item.startDate ? format(new Date(item.startDate), "MMM d, yyyy") : "Open"}
                      {" → "}
                      {item.endDate ? format(new Date(item.endDate), "MMM d, yyyy") : "Ongoing"}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap gap-2.5">
                <CopyRoutingLinkButton
                  routingLink={item.routingLink}
                  className="flex-1 min-w-[150px] text-xs h-9"
                />
                <Link
                  href={ROUTES.vendor.survey(item.id)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-slate-50 hover:text-gray-900 transition-colors"
                >
                  Details
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
