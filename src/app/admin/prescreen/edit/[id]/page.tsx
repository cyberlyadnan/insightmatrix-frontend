"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { BarChart3, Clock, Users } from "lucide-react";

import { getPrescreen, getPrescreenSubmissionStats } from "@/services/prescreen";
import { queryKeys } from "@/services/queries";
import { PrescreenBuilder } from "../../components/prescreen-builder";

export default function EditPrescreenPage() {
  const params = useParams<{ id: string }>();
  const id = String(params?.id || "");

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.prescreens.detail(id),
    queryFn: () => getPrescreen(id),
    enabled: Boolean(id),
  });

  const { data: stats } = useQuery({
    queryKey: queryKeys.prescreens.submissionStats(id),
    queryFn: () => getPrescreenSubmissionStats(id),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-rose-600">
        Could not load this prescreen. Please refresh and try again.
      </p>
    );
  }

  if (!data) return <p className="text-sm text-gray-500">Prescreen not found.</p>;

  return (
    <div className="space-y-6">
      {stats ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-brand-primary" />
            <h2 className="text-lg font-black text-gray-900">Submission analytics</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Each successful submit counts as one submission. Time is measured from when the member
            opens the form until submit (when supported).
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                Submissions
              </p>
              <p className="text-2xl font-black text-gray-900">{stats.totalSubmissions}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1">
                <Users className="w-3 h-3" /> Unique members
              </p>
              <p className="text-2xl font-black text-gray-900">{stats.uniqueSubmitters}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Avg. time
              </p>
              <p className="text-2xl font-black text-gray-900">
                {stats.averageDurationFormatted ?? "—"}
              </p>
              {stats.submissionsWithDuration > 0 ? (
                <p className="text-[11px] text-gray-500 mt-1">
                  from {stats.submissionsWithDuration} timed submission
                  {stats.submissionsWithDuration === 1 ? "" : "s"}
                </p>
              ) : (
                <p className="text-[11px] text-gray-500 mt-1">No duration data yet</p>
              )}
            </div>
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 col-span-2 md:col-span-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                Last activity
              </p>
              <p className="text-sm font-bold text-gray-900">
                {stats.lastSubmittedAt ? new Date(stats.lastSubmittedAt).toLocaleString() : "—"}
              </p>
              {stats.firstSubmittedAt ? (
                <p className="text-[11px] text-gray-500 mt-2">
                  First: {new Date(stats.firstSubmittedAt).toLocaleString()}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <PrescreenBuilder mode="edit" initialData={data} prescreenId={id} />
    </div>
  );
}
