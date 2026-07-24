"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";

import { PageHelp } from "@/components/crm/page-help";
import { ADMIN_PAGE_HELP } from "@/constants/admin-page-help";
import { getRespondentAnalyticsSummary } from "@/services/survey-respondent-profile/survey-respondent-profile-api";
import { queryKeys } from "@/services/queries";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[1.5rem] border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</p>
      <p className="text-2xl font-black mt-1">{value}</p>
    </div>
  );
}

export default function RespondentAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.surveyRespondentProfiles.analytics({}),
    queryFn: () => getRespondentAnalyticsSummary({}),
  });

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-2 text-gray-900 tracking-tight">
            <BarChart3 className="h-7 w-7 text-brand-primary" />
            Respondent Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Warehouse aggregates across panel and vendor traffic.
          </p>
        </div>
        <PageHelp content={ADMIN_PAGE_HELP.respondentAnalytics} />
      </div>

      {isLoading || !data ? (
        <div className="rounded-[2rem] border border-gray-100 bg-white p-8 text-sm text-gray-500 shadow-sm">
          Loading analytics…
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Total respondents" value={data.total} />
          <Stat label="Completes" value={data.completes} />
          <Stat label="Terminates" value={data.terminates} />
          <Stat label="Conversion %" value={`${data.conversionRate}%`} />
          <Stat label="Quota full" value={data.quotaFull} />
          <Stat label="Quality rejects" value={data.qualityRejects} />
          <Stat label="Redirected" value={data.redirected} />
          <Stat label="Prescreen pending" value={data.prescreenPending} />
        </div>
      )}
    </div>
  );
}
