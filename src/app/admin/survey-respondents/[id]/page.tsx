"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { getSurveyRespondentProfile } from "@/services/survey-respondent-profile/survey-respondent-profile-api";
import { queryKeys } from "@/services/queries";

export default function SurveyRespondentDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.surveyRespondentProfiles.detail(id),
    queryFn: () => getSurveyRespondentProfile(id),
    enabled: Boolean(id),
  });

  const profile = data?.profile;

  if (isLoading || !profile) {
    return <p className="text-sm text-gray-500 py-12">Loading respondent…</p>;
  }

  const answers = profile.prescreenAnswers ?? {};

  return (
    <div className="space-y-8 max-w-4xl">
      <Link
        href={ROUTES.admin.surveyRespondents}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500"
      >
        <ArrowLeft className="h-4 w-4" />
        All respondents
      </Link>

      <div>
        <p className="text-xs font-black uppercase tracking-widest text-brand-primary">
          {profile.respondentOwnerType} respondent
        </p>
        <h1 className="text-2xl font-black mt-1">{profile.panelSurvey?.surveyName}</h1>
        <p className="text-sm text-gray-500">
          Status: <strong>{profile.surveyStatus}</strong> · Token{" "}
          <code className="font-mono">{profile.internalSessionToken}</code>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5 space-y-2 text-sm">
          <h2 className="font-bold">Identity</h2>
          <p>
            Vendor toid: <span className="font-mono">{profile.vendorRespondentToid || "—"}</span>
          </p>
          <p>
            Vendor: {profile.vendor?.companyName ?? "—"} ({profile.vendor?.vendorCode})
          </p>
          <p>Allocation: {profile.allocation?.allocationCode ?? "—"}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 space-y-2 text-sm">
          <h2 className="font-bold">Timestamps</h2>
          <p>
            Prescreen:{" "}
            {profile.prescreenCompletedAt
              ? format(new Date(profile.prescreenCompletedAt), "PPp")
              : "—"}
          </p>
          <p>Created: {profile.createdAt ? format(new Date(profile.createdAt), "PPp") : "—"}</p>
          <p>
            Completed: {profile.completedAt ? format(new Date(profile.completedAt), "PPp") : "—"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6">
        <h2 className="font-bold mb-4">Prescreen answers</h2>
        {Object.keys(answers).length === 0 ? (
          <p className="text-sm text-gray-500">No prescreen answers recorded.</p>
        ) : (
          <ul className="space-y-3 text-sm">
            {Object.entries(answers).map(([qid, val]) => (
              <li key={qid} className="border-b border-gray-50 pb-2">
                <p className="text-xs text-gray-500 font-mono">{qid}</p>
                <p className="font-medium">{Array.isArray(val) ? val.join(", ") : String(val)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border bg-white p-6">
        <h2 className="font-bold mb-4">Lifecycle</h2>
        <ul className="space-y-2 text-sm">
          {profile.lifecycleHistory.map((e, i) => (
            <li key={i} className="flex justify-between gap-4">
              <span>
                {e.status} — {e.note}
              </span>
              <span className="text-gray-500 shrink-0">
                {e.at ? format(new Date(e.at), "PPp") : ""}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {data.webhookLogs?.length ? (
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="font-bold mb-4">Callback logs</h2>
          <pre className="text-xs overflow-auto bg-slate-50 p-3 rounded-lg max-h-64">
            {JSON.stringify(data.webhookLogs, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
