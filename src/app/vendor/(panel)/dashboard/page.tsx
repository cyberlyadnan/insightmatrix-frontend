"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  Layers,
  Radio,
  RefreshCw,
  ShieldCheck,
  Store,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { getVendorDashboardSummary } from "@/services/vendor-portal";
import { listVendorPortalSurveys } from "@/services/vendor-portal/vendor-surveys-api";
import { queryKeys } from "@/services/queries";
import { useVendorAuthStore } from "@/store/vendorAuthStore";
import { CopyRoutingLinkButton } from "@/components/vendor/copy-routing-link-button";
import {
  VENDOR_ALLOCATION_STATUS_LABELS,
  VENDOR_ALLOCATION_STATUS_STYLES,
} from "@/constants/vendor-allocation";

const STAT_TONES = {
  emerald: {
    cardBg: "bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white",
    cardBorder:
      "border-emerald-200/80 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/10",
    iconBox:
      "bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30",
    labelColor: "text-emerald-900/80",
    valueColor: "text-emerald-700",
    hintBadge: "text-emerald-700 bg-emerald-100/80 border border-emerald-200/70",
  },
  blue: {
    cardBg: "bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-white",
    cardBorder: "border-blue-200/80 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10",
    iconBox:
      "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30",
    labelColor: "text-blue-900/80",
    valueColor: "text-blue-700",
    hintBadge: "text-blue-700 bg-blue-100/80 border border-blue-200/70",
  },
  violet: {
    cardBg: "bg-gradient-to-br from-purple-50/90 via-violet-50/40 to-white",
    cardBorder:
      "border-purple-200/80 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/10",
    iconBox:
      "bg-gradient-to-br from-purple-600 to-violet-600 text-white shadow-md shadow-purple-500/30",
    labelColor: "text-purple-900/80",
    valueColor: "text-purple-700",
    hintBadge: "text-purple-700 bg-purple-100/80 border border-purple-200/70",
  },
  sky: {
    cardBg: "bg-gradient-to-br from-sky-50/90 via-cyan-50/40 to-white",
    cardBorder: "border-sky-200/80 hover:border-sky-400 hover:shadow-xl hover:shadow-sky-500/10",
    iconBox: "bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-md shadow-sky-500/30",
    labelColor: "text-sky-900/80",
    valueColor: "text-sky-700",
    hintBadge: "text-sky-700 bg-sky-100/80 border border-sky-200/70",
  },
  amber: {
    cardBg: "bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white",
    cardBorder:
      "border-amber-200/80 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10",
    iconBox:
      "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30",
    labelColor: "text-amber-900/80",
    valueColor: "text-amber-700",
    hintBadge: "text-amber-800 bg-amber-100/80 border border-amber-200/70",
  },
  rose: {
    cardBg: "bg-gradient-to-br from-rose-50/90 via-red-50/40 to-white",
    cardBorder: "border-rose-200/80 hover:border-rose-400 hover:shadow-xl hover:shadow-rose-500/10",
    iconBox: "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/30",
    labelColor: "text-rose-900/80",
    valueColor: "text-rose-700",
    hintBadge: "text-rose-800 bg-rose-100/80 border border-rose-200/70",
  },
} as const;

function MetricCard({
  title,
  value,
  subtitle,
  badge,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: keyof typeof STAT_TONES;
}) {
  const t = STAT_TONES[tone];
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 ${t.cardBg} ${t.cardBorder}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${t.iconBox}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        {badge && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${t.hintBadge}`}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className={`text-xs font-bold uppercase tracking-wider ${t.labelColor}`}>{title}</p>
        <p className={`mt-1 text-3xl font-black tracking-tight ${t.valueColor}`}>{value}</p>
        {subtitle && <p className="mt-1 text-xs text-gray-500 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function VendorDashboardPage() {
  const vendor = useVendorAuthStore((s) => s.vendor);

  const {
    data: summaryData,

    refetch: refetchSummary,
    isRefetching,
  } = useQuery({
    queryKey: queryKeys.vendorAuth.dashboard,
    queryFn: getVendorDashboardSummary,
  });

  const { data: surveysData, isLoading: isSurveysLoading } = useQuery({
    queryKey: queryKeys.vendorPortalSurveys.list({ pageSize: 5 }),
    queryFn: () => listVendorPortalSurveys({ pageSize: 5 }),
  });

  const summary = summaryData ?? {
    activeAssignments: 0,
    totalCompletes: 0,
    totalTerminates: 0,
    totalQuotaFull: 0,
    totalQualityRejects: 0,
    conversionRate: 0,
    terminationRate: 0,
    todayCompletes: 0,
    weeklyCompletes: 0,
    monthlyCompletes: 0,
    totalRevenueGenerated: 0,
    totalPayoutDue: 0,
  };

  const recentSurveys = surveysData?.items ?? [];

  // Calculate outcome percentages for the visual distribution bar
  const totalOutcomes =
    summary.totalCompletes +
    summary.totalTerminates +
    summary.totalQuotaFull +
    summary.totalQualityRejects;

  const completesPct = totalOutcomes > 0 ? (summary.totalCompletes / totalOutcomes) * 100 : 0;
  const terminatesPct = totalOutcomes > 0 ? (summary.totalTerminates / totalOutcomes) * 100 : 0;
  const quotaFullPct = totalOutcomes > 0 ? (summary.totalQuotaFull / totalOutcomes) * 100 : 0;
  const rejectsPct = totalOutcomes > 0 ? (summary.totalQualityRejects / totalOutcomes) * 100 : 0;

  // Postback configuration health
  const hasCompleteCallback = Boolean(vendor?.callbackUrls?.complete);
  const hasTerminateCallback = Boolean(vendor?.callbackUrls?.terminate);
  const hasQuotaFullCallback = Boolean(vendor?.callbackUrls?.quota_full);
  const hasRejectCallback = Boolean(vendor?.callbackUrls?.quality_reject);
  const configuredCallbacksCount = [
    hasCompleteCallback,
    hasTerminateCallback,
    hasQuotaFullCallback,
    hasRejectCallback,
  ].filter(Boolean).length;

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="absolute right-32 -bottom-20 h-56 w-56 rounded-full bg-cyan-500/15 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-md border border-white/10">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Routing Exchange
              </span>
              {vendor?.vendorCode && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-primary/30 px-3 py-1 text-[11px] font-mono font-bold text-brand-light border border-brand-light/30">
                  <Store className="h-3 w-3" />
                  {vendor.vendorCode}
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              {vendor?.companyName ? `Welcome, ${vendor.companyName}` : "Vendor Partner Portal"}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Monitor incoming respondent routing traffic, live quota delivery, conversion yields,
              and automated S2S postback health across assigned research campaigns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => refetchSummary()}
              disabled={isRefetching}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-3.5 py-2.5 text-xs font-bold text-white backdrop-blur-md border border-white/10 transition-colors shadow-sm disabled:opacity-50"
              title="Refresh live metrics"
            >
              <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
              Sync
            </button>
            <Link
              href={ROUTES.vendor.integration}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-primary/30 hover:brightness-110 transition-all"
            >
              <Zap className="h-4 w-4 text-amber-300" />
              Integration Specs
            </Link>
          </div>
        </div>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Total Completes"
          value={summary.totalCompletes.toLocaleString()}
          subtitle={`Today: ${summary.todayCompletes} · This week: ${summary.weeklyCompletes}`}
          badge="Verified"
          icon={CheckCircle2}
          tone="emerald"
        />

        <MetricCard
          title="Conversion Rate (CR)"
          value={`${summary.conversionRate}%`}
          subtitle="Completes / all traffic outcomes"
          badge="Yield"
          icon={TrendingUp}
          tone="blue"
        />

        <MetricCard
          title="Total Revenue"
          value={`$${summary.totalRevenueGenerated.toLocaleString()}`}
          subtitle={`Pending settlement: $${summary.totalPayoutDue.toLocaleString()}`}
          badge="Earnings"
          icon={DollarSign}
          tone="violet"
        />

        <MetricCard
          title="Active Allocations"
          value={summary.activeAssignments}
          subtitle={`${summary.monthlyCompletes} completes this month`}
          badge="Campaigns"
          icon={Layers}
          tone="sky"
        />

        <MetricCard
          title="Terminates"
          value={summary.totalTerminates.toLocaleString()}
          subtitle={`${summary.terminationRate}% of total respondents`}
          badge="Screenout"
          icon={XCircle}
          tone="amber"
        />

        <MetricCard
          title="Quality & Quota Filters"
          value={(summary.totalQuotaFull + summary.totalQualityRejects).toLocaleString()}
          subtitle={`${summary.totalQuotaFull} Quota Full · ${summary.totalQualityRejects} Quality Flags`}
          badge="Protection"
          icon={AlertTriangle}
          tone="rose"
        />
      </div>

      {/* Outcome Distribution & Integration Health */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Outcome Breakdown Bar */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-brand-primary" />
                Traffic Outcome Breakdown
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Distribution of all {totalOutcomes.toLocaleString()} processed respondent routing
                attempts
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
              {totalOutcomes > 0 ? "100% Processed" : "No traffic yet"}
            </span>
          </div>

          {totalOutcomes > 0 ? (
            <div className="space-y-4">
              {/* Stacked Progress Bar */}
              <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden flex">
                <div
                  style={{ width: `${completesPct}%` }}
                  className="bg-emerald-500 transition-all duration-500 hover:opacity-90"
                  title={`Completes: ${summary.totalCompletes} (${completesPct.toFixed(1)}%)`}
                />
                <div
                  style={{ width: `${terminatesPct}%` }}
                  className="bg-amber-400 transition-all duration-500 hover:opacity-90"
                  title={`Terminates: ${summary.totalTerminates} (${terminatesPct.toFixed(1)}%)`}
                />
                <div
                  style={{ width: `${quotaFullPct}%` }}
                  className="bg-sky-400 transition-all duration-500 hover:opacity-90"
                  title={`Quota Full: ${summary.totalQuotaFull} (${quotaFullPct.toFixed(1)}%)`}
                />
                <div
                  style={{ width: `${rejectsPct}%` }}
                  className="bg-rose-500 transition-all duration-500 hover:opacity-90"
                  title={`Quality Rejects: ${summary.totalQualityRejects} (${rejectsPct.toFixed(1)}%)`}
                />
              </div>

              {/* Legend & Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    Completes
                  </div>
                  <p className="mt-1 text-lg font-black text-emerald-900">
                    {summary.totalCompletes.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-semibold text-emerald-700">
                    {completesPct.toFixed(1)}% of volume
                  </p>
                </div>

                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    Terminates
                  </div>
                  <p className="mt-1 text-lg font-black text-amber-900">
                    {summary.totalTerminates.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-semibold text-amber-700">
                    {terminatesPct.toFixed(1)}% of volume
                  </p>
                </div>

                <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800">
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                    Quota Full
                  </div>
                  <p className="mt-1 text-lg font-black text-sky-900">
                    {summary.totalQuotaFull.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-semibold text-sky-700">
                    {quotaFullPct.toFixed(1)}% of volume
                  </p>
                </div>

                <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    Quality Rejects
                  </div>
                  <p className="mt-1 text-lg font-black text-rose-900">
                    {summary.totalQualityRejects.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-semibold text-rose-700">
                    {rejectsPct.toFixed(1)}% of volume
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center">
              <Activity className="mx-auto h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm font-bold text-gray-700">No traffic recordings yet</p>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                Route respondents using your unique campaign routing links. Live conversions and
                metrics will reflect here immediately.
              </p>
            </div>
          )}
        </div>

        {/* Postback / S2S Health Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Postback Status
              </h2>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  configuredCallbacksCount === 4
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : configuredCallbacksCount > 0
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-rose-100 text-rose-800 border border-rose-200"
                }`}
              >
                {configuredCallbacksCount}/4 Configured
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Automated server-to-server callbacks notify your systems when respondents reach an
              outcome.
            </p>

            <ul className="space-y-2.5">
              <li className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-slate-50/70 text-xs">
                <span className="font-semibold text-gray-700">Complete Postback</span>
                {hasCompleteCallback ? (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-medium text-amber-600">
                    Not set
                  </span>
                )}
              </li>

              <li className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-slate-50/70 text-xs">
                <span className="font-semibold text-gray-700">Terminate Postback</span>
                {hasTerminateCallback ? (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-medium text-amber-600">
                    Not set
                  </span>
                )}
              </li>

              <li className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-slate-50/70 text-xs">
                <span className="font-semibold text-gray-700">Quota Full Postback</span>
                {hasQuotaFullCallback ? (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-medium text-amber-600">
                    Not set
                  </span>
                )}
              </li>

              <li className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-slate-50/70 text-xs">
                <span className="font-semibold text-gray-700">Quality Reject Postback</span>
                {hasRejectCallback ? (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-medium text-amber-600">
                    Not set
                  </span>
                )}
              </li>
            </ul>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <Link
              href={ROUTES.vendor.profile}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-800 shadow-sm hover:bg-slate-50 transition-colors"
            >
              Configure Postback URLs
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Active Survey Allocations Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black tracking-tight text-gray-900 flex items-center gap-2">
              <Layers className="h-4 w-4 text-brand-primary" />
              Active Survey Allocations
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Top assigned campaigns with quota caps and live routing links
            </p>
          </div>

          <Link
            href={ROUTES.vendor.surveys}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-accent1 transition-colors"
          >
            View all surveys
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isSurveysLoading ? (
          <div className="py-12 text-center text-xs text-gray-500">Loading assigned surveys…</div>
        ) : recentSurveys.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-slate-50/50 p-8 text-center">
            <Layers className="mx-auto h-8 w-8 text-gray-300 mb-2" />
            <p className="font-bold text-sm text-gray-700">No campaigns assigned yet</p>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Your account manager will allocate research quotas to your account. You can also view
              all records in the surveys catalog.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  <th className="pb-3 pl-1">Campaign</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Quota Progress</th>
                  <th className="pb-3 text-center">CPI</th>
                  <th className="pb-3 text-center">CR</th>
                  <th className="pb-3 pr-1 text-right">Routing Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentSurveys.map((alloc) => {
                  const pct =
                    alloc.allocatedQuota > 0
                      ? Math.min(
                          100,
                          Math.round((alloc.completedCount / alloc.allocatedQuota) * 100)
                        )
                      : 0;

                  return (
                    <tr key={alloc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 pl-1 max-w-[240px]">
                        <p className="text-[10px] font-mono font-bold text-brand-primary">
                          {alloc.allocationCode}
                        </p>
                        <Link
                          href={ROUTES.vendor.survey(alloc.id)}
                          className="font-bold text-gray-900 hover:text-brand-primary line-clamp-1"
                        >
                          {alloc.surveyName}
                        </Link>
                        <p className="text-[11px] text-gray-400">{alloc.surveyCode}</p>
                      </td>

                      <td className="py-3.5">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            VENDOR_ALLOCATION_STATUS_STYLES[alloc.status]
                          }`}
                        >
                          {VENDOR_ALLOCATION_STATUS_LABELS[alloc.status]}
                        </span>
                      </td>

                      <td className="py-3.5 min-w-[160px]">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700 mb-1">
                          <span>
                            {alloc.completedCount} / {alloc.allocatedQuota}
                          </span>
                          <span className="text-gray-400">{pct}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-primary to-indigo-600"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 text-center font-bold text-gray-900">
                        ${alloc.vendorCpi}
                      </td>

                      <td className="py-3.5 text-center font-bold text-emerald-600">
                        {alloc.conversionRate}%
                      </td>

                      <td className="py-3.5 pr-1 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <CopyRoutingLinkButton
                            routingLink={alloc.routingLink}
                            className="h-8 px-2.5 text-xs"
                          />
                          <Link
                            href={ROUTES.vendor.survey(alloc.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-slate-100 hover:text-gray-900 transition-colors"
                            title="Allocation Details"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Developer Parameter Help Card */}
      <div className="rounded-2xl border border-brand-light bg-gradient-to-br from-brand-subtle/50 via-white to-slate-50 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary uppercase tracking-wider">
            <Radio className="h-3.5 w-3.5" />
            Partner Integration Guide
          </span>
          <h3 className="text-base font-black text-gray-900">
            Routing Format: Always append your respondent tracking ID
          </h3>
          <p className="text-xs text-gray-600 max-w-2xl leading-relaxed">
            Append{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono font-bold text-brand-accent1 border border-border">
              ?toid=[RESPONDENT_ID]
            </code>{" "}
            to your allocated campaign routing links. When the user finishes, InsightMatrix fires
            your postback URL replacing{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-brand-accent1 border border-border">
              [toid]
            </code>{" "}
            with that exact ID.
          </p>
        </div>

        <Link
          href={ROUTES.vendor.integration}
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-black transition-colors shadow-sm"
        >
          View Documentation
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
