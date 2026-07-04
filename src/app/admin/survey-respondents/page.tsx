"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search, Database } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { listSurveyRespondentProfiles } from "@/services/survey-respondent-profile/survey-respondent-profile-api";
import { resolveTrackingParticipantId } from "@/lib/survey-respondent-tracking";
import { queryKeys } from "@/services/queries";

export default function SurveyRespondentsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.surveyRespondentProfiles.list({ search: debouncedSearch, status }),
    queryFn: () =>
      listSurveyRespondentProfiles({
        pageSize: 50,
        search: debouncedSearch || undefined,
        surveyStatus: status || undefined,
      }),
  });

  const items = data?.items ?? [];

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Database className="h-7 w-7 text-brand-primary" />
          Respondent data warehouse
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Universal prescreen answers, tokens, and lifecycle for panel and vendor traffic.
        </p>
      </div>

      <div className="rounded-[2rem] border border-gray-100 bg-white p-4 md:p-5 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Survey name, code, project ID, tracking id, token…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="">All statuses</option>
            <option value="prescreen_pending">Prescreen pending</option>
            <option value="redirected">Redirected</option>
            <option value="complete">Complete</option>
            <option value="terminate">Terminate</option>
            <option value="quota_full">Quota full</option>
            <option value="quality_reject">Quality reject</option>
          </select>
          <Link
            href={ROUTES.admin.respondentExports}
            className="h-11 inline-flex items-center rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Export center
          </Link>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500 py-12 text-center">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-[2rem] border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-[10px] font-black uppercase tracking-widest text-gray-500">
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Vendor / Survey</th>
                <th className="px-4 py-3">Tracking id</th>
                <th className="px-4 py-3">Platform token</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">View</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => {
                const trackingId = resolveTrackingParticipantId(row);
                return (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="px-4 py-4 capitalize text-xs font-bold">
                      {row.respondentOwnerType}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium">
                        {row.vendor?.companyName ?? row.panelSurvey?.surveyName}
                      </p>
                      <p className="text-xs text-gray-500">{row.panelSurvey?.surveyCode}</p>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs font-bold text-brand-primary">
                      {trackingId || "—"}
                    </td>
                    <td className="px-4 py-4 font-mono text-xs">{row.internalSessionToken}</td>
                    <td className="px-4 py-4 text-xs font-semibold">{row.surveyStatus}</td>
                    <td className="px-4 py-4 text-xs text-gray-500">
                      {row.createdAt ? format(new Date(row.createdAt), "MMM d, HH:mm") : "—"}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={ROUTES.admin.surveyRespondent(row.id)}
                        className="text-sm font-semibold text-brand-primary"
                      >
                        Details
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
  );
}
