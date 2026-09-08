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
    icon: "bg-brand-subtle text-brand-primary",
    value: "text-brand-primary",
    ring: "group-hover:border-brand-primary/25 group-hover:shadow-brand-primary/5",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    value: "text-emerald-700",
    ring: "group-hover:border-emerald-200 group-hover:shadow-emerald-500/5",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600",
    value: "text-violet-700",
    ring: "group-hover:border-violet-200 group-hover:shadow-violet-500/5",
  },
  sky: {
    icon: "bg-sky-50 text-sky-600",
    value: "text-sky-700",
    ring: "group-hover:border-sky-200 group-hover:shadow-sky-500/5",
  },
  teal: {
    icon: "bg-teal-50 text-teal-600",
    value: "text-teal-700",
    ring: "group-hover:border-teal-200 group-hover:shadow-teal-500/5",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600",
    value: "text-amber-700",
    ring: "group-hover:border-amber-200 group-hover:shadow-amber-500/5",
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const tone = STAT_TONES[stat.tone];
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className={`group relative h-full min-h-[132px] p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 ${tone.ring}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${tone.icon}`}
                >
                  <stat.icon size={20} strokeWidth={2.25} />
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-gray-300 group-hover:text-brand-primary transition-colors"
                />
              </div>
              <div className="mt-auto">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  {stat.label}
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <div className={`text-2xl font-bold tabular-nums tracking-tight ${tone.value}`}>
                    {cardsLoading ? "—" : formatNumber(stat.value)}
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">{stat.hint}</span>
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
