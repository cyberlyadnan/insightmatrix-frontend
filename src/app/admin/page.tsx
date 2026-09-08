"use client";

import React from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { parseApiError } from "@/services/api/errors";
import { approveDeletionRequest, listDeletionRequests } from "@/services/auth";
import { queryKeys } from "@/services/queries";
import { crmToast } from "@/lib/crm-toast";
import { toast } from "sonner";
import {
  ClipboardList,
  Store,
  Building2,
  Users,
  CheckCircle2,
  MessageCircle,
  UserX,
  ArrowUpRight,
} from "lucide-react";
import { PageHelp } from "@/components/crm/page-help";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { ADMIN_PAGE_HELP } from "@/constants/admin-page-help";
import { ROUTES } from "@/constants/routes";
import { listPanelSurveys } from "@/services/panel-survey/panel-survey-api";
import { listVendors } from "@/services/vendor/vendor-api";
import { listSurveyCompanies } from "@/services/survey-company";
import {
  getRespondentAnalyticsSummary,
  listSurveyRespondentProfiles,
} from "@/services/survey-respondent-profile/survey-respondent-profile-api";
import { listContactQueries } from "@/services/contact-query";
import { formatNumber } from "@/utils/format";

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

const STAT_TONES = {
  blue: {
    cardBg: "bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-white",
    cardBorder: "border-blue-200/80 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10",
    iconBox:
      "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30",
    arrowColor: "text-blue-400 group-hover:text-blue-700",
    labelColor: "text-blue-900/80",
    valueColor: "text-blue-700",
    hintBadge: "text-blue-700 bg-blue-100/80 border border-blue-200/70",
    glowBlob: "bg-blue-400/20",
  },
  emerald: {
    cardBg: "bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white",
    cardBorder:
      "border-emerald-200/80 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/10",
    iconBox:
      "bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30",
    arrowColor: "text-emerald-400 group-hover:text-emerald-700",
    labelColor: "text-emerald-900/80",
    valueColor: "text-emerald-700",
    hintBadge: "text-emerald-700 bg-emerald-100/80 border border-emerald-200/70",
    glowBlob: "bg-emerald-400/20",
  },
  violet: {
    cardBg: "bg-gradient-to-br from-purple-50/90 via-violet-50/40 to-white",
    cardBorder:
      "border-purple-200/80 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/10",
    iconBox:
      "bg-gradient-to-br from-purple-600 to-violet-600 text-white shadow-md shadow-purple-500/30",
    arrowColor: "text-purple-400 group-hover:text-purple-700",
    labelColor: "text-purple-900/80",
    valueColor: "text-purple-700",
    hintBadge: "text-purple-700 bg-purple-100/80 border border-purple-200/70",
    glowBlob: "bg-purple-400/20",
  },
  sky: {
    cardBg: "bg-gradient-to-br from-sky-50/90 via-cyan-50/40 to-white",
    cardBorder: "border-sky-200/80 hover:border-sky-400 hover:shadow-xl hover:shadow-sky-500/10",
    iconBox: "bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-md shadow-sky-500/30",
    arrowColor: "text-sky-400 group-hover:text-sky-700",
    labelColor: "text-sky-900/80",
    valueColor: "text-sky-700",
    hintBadge: "text-sky-700 bg-sky-100/80 border border-sky-200/70",
    glowBlob: "bg-sky-400/20",
  },
  teal: {
    cardBg: "bg-gradient-to-br from-teal-50/90 via-emerald-50/40 to-white",
    cardBorder: "border-teal-200/80 hover:border-teal-400 hover:shadow-xl hover:shadow-teal-500/10",
    iconBox:
      "bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/30",
    arrowColor: "text-teal-400 group-hover:text-teal-700",
    labelColor: "text-teal-900/80",
    valueColor: "text-teal-700",
    hintBadge: "text-teal-700 bg-teal-100/80 border border-teal-200/70",
    glowBlob: "bg-teal-400/20",
  },
  amber: {
    cardBg: "bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white",
    cardBorder:
      "border-amber-200/80 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10",
    iconBox:
      "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30",
    arrowColor: "text-amber-400 group-hover:text-amber-700",
    labelColor: "text-amber-900/80",
    valueColor: "text-amber-700",
    hintBadge: "text-amber-800 bg-amber-100/80 border border-amber-200/70",
    glowBlob: "bg-amber-400/20",
  },
} as const;

export default function AdminOverview() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const today = todayIsoDate();

  const { data: deletionRequests = [], isLoading: isDeletionLoading } = useQuery({
    queryKey: queryKeys.admin.deletionRequests,
    queryFn: listDeletionRequests,
  });

  const approveMutation = useMutation({
    mutationFn: approveDeletionRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.deletionRequests });
      crmToast.updated();
    },
    onError: (error) => toast.error(parseApiError(error, "Could not approve deletion request.")),
  });

  const { data: activeSurveysData, isLoading: loadingSurveys } = useQuery({
    queryKey: queryKeys.panelSurveys.list({ page: 1, pageSize: 1, surveyStatus: "active" }),
    queryFn: () => listPanelSurveys({ page: 1, pageSize: 1, surveyStatus: "active" }),
  });

  const { data: activeVendorsData, isLoading: loadingVendors } = useQuery({
    queryKey: queryKeys.vendors.list({ page: 1, pageSize: 1, status: "active" }),
    queryFn: () => listVendors({ page: 1, pageSize: 1, status: "active" }),
  });

  const { data: providersData, isLoading: loadingProviders } = useQuery({
    queryKey: queryKeys.surveyCompanies.list({ page: 1, pageSize: 1 }),
    queryFn: () => listSurveyCompanies({ page: 1, pageSize: 1 }),
  });

  const { data: todayRespondentsData, isLoading: loadingToday } = useQuery({
    queryKey: queryKeys.surveyRespondentProfiles.list({
      page: 1,
      pageSize: 1,
      dateFrom: today,
      dateTo: today,
    }),
    queryFn: () =>
      listSurveyRespondentProfiles({
        page: 1,
        pageSize: 1,
        dateFrom: today,
        dateTo: today,
      }),
  });

  const { data: respondentSummary, isLoading: loadingSummary } = useQuery({
    queryKey: queryKeys.surveyRespondentProfiles.analytics({}),
    queryFn: () => getRespondentAnalyticsSummary({}),
  });

  const { data: pendingQueriesData, isLoading: loadingQueries } = useQuery({
    queryKey: queryKeys.contactQueries.list({ status: "pending", page: 1, pageSize: 1 }),
    queryFn: () => listContactQueries({ status: "pending", page: 1, pageSize: 1 }),
  });

  const cardsLoading =
    loadingSurveys ||
    loadingVendors ||
    loadingProviders ||
    loadingToday ||
    loadingSummary ||
    loadingQueries;

  const stats = [
    {
      label: "Active Surveys",
      value: activeSurveysData?.meta?.total ?? 0,
      icon: ClipboardList,
      tone: "blue" as const,
      href: ROUTES.admin.surveys,
      hint: "Live studies",
    },
    {
      label: "Active Vendors",
      value: activeVendorsData?.meta?.total ?? 0,
      icon: Store,
      tone: "emerald" as const,
      href: ROUTES.admin.vendors,
      hint: "Partner network",
    },
    {
      label: "Survey Providers",
      value: providersData?.meta?.total ?? 0,
      icon: Building2,
      tone: "violet" as const,
      href: ROUTES.admin.companies,
      hint: "Client companies",
    },
    {
      label: "Today's Respondents",
      value: todayRespondentsData?.meta?.total ?? 0,
      icon: Users,
      tone: "sky" as const,
      href: ROUTES.admin.surveyRespondents,
      hint: "Traffic today",
    },
    {
      label: "Total Completes",
      value: respondentSummary?.completes ?? 0,
      icon: CheckCircle2,
      tone: "teal" as const,
      href: ROUTES.admin.respondentAnalytics,
      hint: "All-time completes",
    },
    {
      label: "Pending Queries",
      value: pendingQueriesData?.meta?.total ?? 0,
      icon: MessageCircle,
      tone: "amber" as const,
      href: ROUTES.admin.queries,
      hint: "Needs attention",
    },
  ] as const;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-brand-primary/10 bg-gradient-to-br from-brand-accent1 via-brand-primary to-brand-accent2 px-6 py-7 text-white shadow-lg shadow-brand-primary/15 sm:px-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-brand-light/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-2">
              Operations overview
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {user?.fullName?.split(" ")[0] ?? "Administrator"}
            </h1>
            <p className="mt-2 text-sm text-white/80 leading-relaxed">
              Monitor surveys, vendors, and respondent performance from one place.
            </p>
          </div>
          <div className="flex items-end gap-4 shrink-0">
            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-3 min-w-[100px]">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                Conversion
              </p>
              <p className="text-xl font-bold tabular-nums mt-0.5">
                {loadingSummary ? "—" : `${(respondentSummary?.conversionRate ?? 0).toFixed(1)}%`}
              </p>
            </div>
            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-3 min-w-[100px]">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                Completes
              </p>
              <p className="text-xl font-bold tabular-nums mt-0.5">
                {loadingSummary ? "—" : formatNumber(respondentSummary?.completes ?? 0)}
              </p>
            </div>
            <div className="pb-0.5">
              <PageHelp content={ADMIN_PAGE_HELP.dashboard} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {stats.map((stat) => {
          const tone = STAT_TONES[stat.tone];
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className={`group relative h-full min-h-[148px] p-5 rounded-[1.5rem] ${tone.cardBg} border ${tone.cardBorder} shadow-sm transition-all duration-300 flex flex-col justify-between overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 hover:-translate-y-1`}
            >
              {/* Decorative background glow blob */}
              <div
                className={`pointer-events-none absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl transition-opacity duration-300 opacity-60 group-hover:opacity-100 ${tone.glowBlob}`}
              />

              <div className="flex justify-between items-start mb-3 relative z-10">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${tone.iconBox}`}
                >
                  <stat.icon size={22} strokeWidth={2.2} />
                </div>
                <div
                  className={`p-1.5 rounded-xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-xs ${tone.arrowColor}`}
                >
                  <ArrowUpRight
                    size={16}
                    strokeWidth={2.5}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </div>

              <div className="relative z-10">
                <div
                  className={`text-[11px] font-black uppercase tracking-wider mb-1.5 ${tone.labelColor}`}
                >
                  {stat.label}
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <div
                    className={`text-3xl font-black tabular-nums tracking-tight ${tone.valueColor}`}
                  >
                    {cardsLoading ? "—" : formatNumber(stat.value)}
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${tone.hintBadge}`}
                  >
                    {stat.hint}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <DashboardCharts summary={respondentSummary} isLoading={loadingSummary} />

      <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-5 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <UserX size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Account deletion requests</h2>
              <p className="text-xs text-gray-500 font-medium">
                Approving marks the account inactive — it does not hard-delete the user.
              </p>
            </div>
          </div>
          <span className="shrink-0 inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600">
            {deletionRequests.length} pending
          </span>
        </div>
        {isDeletionLoading ? (
          <p className="text-sm text-gray-500">Loading requests…</p>
        ) : deletionRequests.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-8 text-center">
            <p className="text-sm text-gray-500">No pending account deletion requests.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {deletionRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <p className="font-bold text-gray-900">{request.fullName}</p>
                  <p className="text-xs text-gray-500">{request.email}</p>
                  {request.deletionRequestReason ? (
                    <p className="text-xs text-gray-600 mt-2">
                      Reason: {request.deletionRequestReason}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  disabled={approveMutation.isPending}
                  onClick={() => approveMutation.mutate(request.id)}
                  className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 disabled:opacity-60 transition-colors"
                >
                  {approveMutation.isPending ? "Approving…" : "Approve deactivation"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
