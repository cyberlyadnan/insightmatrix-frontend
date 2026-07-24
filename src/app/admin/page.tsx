"use client";

import React from "react";
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
} from "lucide-react";
import { PageHeader } from "@/components/crm/page-help";
import { ADMIN_PAGE_HELP } from "@/constants/admin-page-help";
import { listPanelSurveys } from "@/services/panel-survey/panel-survey-api";
import { listVendors } from "@/services/vendor/vendor-api";
import { listSurveyCompanies } from "@/services/survey-company";
import {
  getRespondentAnalyticsSummary,
  listSurveyRespondentProfiles,
} from "@/services/survey-respondent-profile/survey-respondent-profile-api";
import { listContactQueries } from "@/services/contact-query";

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

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
      iconClass: "text-brand-primary",
    },
    {
      label: "Active Vendors",
      value: activeVendorsData?.meta?.total ?? 0,
      icon: Store,
      iconClass: "text-emerald-600",
    },
    {
      label: "Total Survey Providers",
      value: providersData?.meta?.total ?? 0,
      icon: Building2,
      iconClass: "text-violet-500",
    },
    {
      label: "Today's Respondents",
      value: todayRespondentsData?.meta?.total ?? 0,
      icon: Users,
      iconClass: "text-sky-600",
    },
    {
      label: "Total Completes",
      value: respondentSummary?.completes ?? 0,
      icon: CheckCircle2,
      iconClass: "text-teal-600",
    },
    {
      label: "Pending Queries",
      value: pendingQueriesData?.meta?.total ?? 0,
      icon: MessageCircle,
      iconClass: "text-amber-500",
    },
  ] as const;

  return (
    <div className="space-y-10">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user?.fullName ?? "Administrator"}. Here's what's happening today.`}
        help={ADMIN_PAGE_HELP.dashboard}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="h-full min-h-[148px] p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all group flex flex-col"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <stat.icon size={24} className={stat.iconClass} />
              </div>
            </div>
            <div className="mt-auto">
              <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">
                {stat.label}
              </div>
              <div className={`text-3xl font-black ${stat.iconClass}`}>
                {cardsLoading ? "—" : stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <UserX size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">Account Deletion Requests</h2>
              <p className="text-xs text-gray-500 font-medium">
                Approving marks account inactive (`isActive = false`) and does not hard delete user.
              </p>
            </div>
          </div>
          <span className="text-sm font-black text-rose-600">
            {deletionRequests.length} pending
          </span>
        </div>
        {isDeletionLoading ? (
          <p className="text-sm text-gray-500">Loading requests...</p>
        ) : deletionRequests.length === 0 ? (
          <p className="text-sm text-gray-500">No pending account deletion requests.</p>
        ) : (
          <div className="space-y-3">
            {deletionRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 rounded-2xl border border-gray-100 bg-gray-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <p className="font-black text-gray-900">{request.fullName}</p>
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
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-black hover:bg-rose-700 disabled:opacity-60"
                >
                  {approveMutation.isPending ? "Approving…" : "Approve Deactivation"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
