"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { parseApiError } from "@/services/api/errors";
import { approveDeletionRequest, listDeletionRequests } from "@/services/auth";
import { queryKeys } from "@/services/queries";
import { toast } from "sonner";
import { FileText, Users, MessageCircle, Shield, UserX } from "lucide-react";
import { listPanelSurveys } from "@/services/panel-survey/panel-survey-api";
import {
  getRespondentAnalyticsSummary,
  listSurveyRespondentProfiles,
} from "@/services/survey-respondent-profile/survey-respondent-profile-api";
import { listContactQueries } from "@/services/contact-query";
import { getSecurityAnalytics } from "@/services/security-logs/security-logs-api";

export default function AdminOverview() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const { data: deletionRequests = [], isLoading: isDeletionLoading } = useQuery({
    queryKey: queryKeys.admin.deletionRequests,
    queryFn: listDeletionRequests,
  });

  const approveMutation = useMutation({
    mutationFn: approveDeletionRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.deletionRequests });
      toast.success("Account marked inactive.");
    },
    onError: (error) => toast.error(parseApiError(error, "Could not approve deletion request.")),
  });

  const { data: surveysData } = useQuery({
    queryKey: queryKeys.panelSurveys.list({ page: 1, pageSize: 1 }),
    queryFn: () => listPanelSurveys({ page: 1, pageSize: 1 }),
  });

  const { data: respondentsData } = useQuery({
    queryKey: queryKeys.surveyRespondentProfiles.list({ page: 1, pageSize: 1 }),
    queryFn: () => listSurveyRespondentProfiles({ page: 1, pageSize: 1 }),
  });
  const { data: respondentSummary } = useQuery({
    queryKey: queryKeys.surveyRespondentProfiles.analytics({}),
    queryFn: () => getRespondentAnalyticsSummary({}),
  });

  const { data: pendingQueriesData } = useQuery({
    queryKey: queryKeys.contactQueries.list({ status: "pending", page: 1, pageSize: 1 }),
    queryFn: () => listContactQueries({ status: "pending", page: 1, pageSize: 1 }),
  });

  const { data: securityAnalytics } = useQuery({
    queryKey: ["security-analytics", "dashboard"],
    queryFn: () => getSecurityAnalytics({}),
  });

  const stats = [
    {
      label: "Total surveys",
      value: surveysData?.meta?.total ?? 0,
      icon: FileText,
      iconClass: "text-brand-primary",
    },
    {
      label: "Respondents tracked",
      value: respondentsData?.meta?.total ?? 0,
      icon: Users,
      iconClass: "text-violet-500",
    },
    {
      label: "Pending queries",
      value: pendingQueriesData?.meta?.total ?? 0,
      icon: MessageCircle,
      iconClass: "text-amber-500",
    },
    {
      label: "Security block rate",
      value: `${securityAnalytics?.blockRate ?? 0}%`,
      icon: Shield,
      iconClass: "text-rose-500",
    },
  ] as const;

  const recentPlatformRows = [
    {
      metric: "Survey respondents",
      value: respondentsData?.meta?.total ?? 0,
      detail: "Total tracked profiles",
      status: "live",
    },
    {
      metric: "Security checks",
      value: securityAnalytics?.total ?? 0,
      detail: `Blocked: ${securityAnalytics?.blocked ?? 0}`,
      status: "live",
    },
    {
      metric: "Pending contact queries",
      value: pendingQueriesData?.meta?.total ?? 0,
      detail: "Awaiting team action",
      status: "attention",
    },
    {
      metric: "Deletion requests",
      value: deletionRequests.length,
      detail: "Pending approval",
      status: deletionRequests.length > 0 ? "attention" : "normal",
    },
  ] as const;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">System Overview</h1>
        <p className="text-gray-500 font-medium">
          Welcome back, {user?.fullName ?? "Administrator"}. Here{"'"}s what{"'"}s happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <stat.icon size={24} />
              </div>
            </div>
            <div>
              <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">
                {stat.label}
              </div>
              <div className={`text-3xl font-black ${stat.iconClass}`}>{stat.value}</div>
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
                  Approve Deactivation
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm min-w-0">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900">Live Platform Metrics</h2>
            <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">
              Dynamic
            </span>
          </div>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="px-4 py-4">Metric</th>
                  <th className="px-4 py-4">Value</th>
                  <th className="px-4 py-4">Detail</th>
                  <th className="px-4 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentPlatformRows.map((item) => (
                  <tr key={item.metric} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-5 font-bold text-gray-900">{item.metric}</td>
                    <td className="px-4 py-5 text-sm font-black text-gray-900">{item.value}</td>
                    <td className="px-4 py-5 text-sm font-medium text-gray-500">{item.detail}</td>
                    <td className="px-4 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          item.status === "live"
                            ? "bg-emerald-50 text-emerald-600"
                            : item.status === "attention"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-gray-50 text-gray-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-gray-900 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-[60px]" />
            <h3 className="text-xl font-black mb-6 border-b border-white/5 pb-6">
              Platform Health
            </h3>
            <div className="space-y-8">
              {[
                {
                  label: "Security pass rate",
                  value: Math.max(0, 100 - Number(securityAnalytics?.blockRate ?? 0)),
                },
                {
                  label: "Survey conversion rate",
                  value: Number(respondentSummary?.conversionRate ?? 0),
                },
                {
                  label: "Active surveys index",
                  value: Math.min(100, (surveysData?.meta?.total ?? 0) * 5),
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {item.label}
                    </span>
                    <span className="text-lg font-black">{item.value}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary" style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-brand-primary text-white shadow-xl shadow-brand-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-xl font-black mb-2">Security & Routing Summary</h4>
              <p className="text-white/70 text-sm font-medium leading-relaxed mb-6">
                Total checks: {securityAnalytics?.total ?? 0} • Blocked:{" "}
                {securityAnalytics?.blocked ?? 0} • Bot traffic:{" "}
                {securityAnalytics?.botTrafficRate ?? 0}%.
              </p>
              <div className="w-full py-4 bg-white text-brand-primary font-black rounded-2xl shadow-xl shadow-black/10 text-center">
                Live data connected
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
