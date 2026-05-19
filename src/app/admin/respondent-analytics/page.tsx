"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";

import { getRespondentAnalyticsSummary } from "@/services/survey-respondent-profile/survey-respondent-profile-api";
import { queryKeys } from "@/services/queries";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border bg-white p-5">
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

  if (isLoading || !data) {
    return <p className="text-sm text-gray-500 py-12">Loading analytics…</p>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-brand-primary" />
          Respondent analytics
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Warehouse aggregates across panel and vendor traffic.
        </p>
      </div>

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
    </div>
  );
}
