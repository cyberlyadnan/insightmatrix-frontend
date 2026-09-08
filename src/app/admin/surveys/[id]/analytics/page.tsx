"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  ExternalLink,
  Loader2,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  PANEL_ROUTING_EVENT_LABELS,
  type PanelRoutingEventType,
} from "@/constants/panel-survey-routing";
import { ROUTES } from "@/constants/routes";
import { getPanelSurveyAnalytics } from "@/services/panel-survey";
import { queryKeys } from "@/services/queries";

function pct(part: number, whole: number): string {
  if (whole <= 0) return "0";
  return Math.min(100, Math.round((part / whole) * 100)).toString();
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const w = max > 0 ? pct(value, max) : "0";
  return (
    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
      <div
        className="h-full rounded-full bg-brand-primary transition-all"
        style={{ width: `${w}%` }}
      />
    </div>
  );
}

export default function PanelSurveyAnalyticsPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.panelSurveys.analytics(id),
    queryFn: () => getPanelSurveyAnalytics(id),
    enabled: Boolean(id),
  });

  if (!id) {
    return <p className="text-sm text-gray-500">Invalid survey.</p>;
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-20 flex flex-col items-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
        <p className="text-sm font-medium text-gray-500">Loading analytics…</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-6xl mx-auto">
        <p className="text-gray-600 font-medium">Could not load analytics.</p>
        <Link
          href={ROUTES.admin.surveys}
          className="text-brand-primary font-bold mt-2 inline-block"
        >
          Back to surveys
        </Link>
      </div>
    );
  }

  const { summary } = data;
  const eventMixDenominator = Math.max(1, summary.totalEvents);

  const kpiCards: Array<{
    label: string;
    value: number;
    hint?: string;
    tone?: "up" | "down" | "neutral";
  }> = [
    { label: "Completes", value: summary.completes, tone: "up" },
    { label: "Terminated", value: summary.terminates, tone: "down" },
    { label: "Screen-outs", value: summary.screenouts, tone: "neutral" },
    { label: "Quota full", value: summary.quotaFull, tone: "neutral" },
    { label: "Quality reject", value: summary.qualityReject, tone: "down" },
    { label: "Duplicate", value: summary.duplicate, tone: "neutral" },
    {
      label: "Total routing events",
      value: summary.totalEvents,
      hint: data.summary.lastEventAt
        ? `Last: ${new Date(data.summary.lastEventAt).toLocaleString()}`
        : "No events logged yet",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div>
          <Link
            href={ROUTES.admin.surveys}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-primary mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Surveys
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <BarChart3 className="w-8 h-8 text-brand-primary hidden sm:block" />
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Survey analytics</h1>
              <p className="text-gray-500 font-medium mt-1">{data.surveyName}</p>
              <p className="text-xs font-mono text-gray-400 mt-0.5">{data.surveyCode}</p>
            </div>
          </div>
          <Link
            href={ROUTES.admin.survey(id)}
            className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-brand-primary hover:underline"
          >
            Survey details <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-950">
        <strong className="font-black">Routing outcomes</strong> are recorded when supplier
        callbacks post to your integration (or via API{" "}
        <span className="font-mono text-xs">POST …/analytics/events</span>). Quota{" "}
        <strong>filled slots</strong> below come from quota configuration (total − remaining).
      </div>

      <section>
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Summary
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((k) => (
            <div
              key={k.label}
              className="rounded-[1.5rem] border border-gray-100 bg-white p-5 shadow-sm"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                {k.label}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900 tabular-nums">{k.value}</span>
                {k.tone === "up" ? (
                  <TrendingUp className="w-5 h-5 text-emerald-500 shrink-0" aria-hidden />
                ) : k.tone === "down" ? (
                  <TrendingDown className="w-5 h-5 text-rose-500 shrink-0" aria-hidden />
                ) : null}
              </div>
              {k.hint ? <p className="text-xs text-gray-500 mt-2 leading-snug">{k.hint}</p> : null}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Outcome mix
        </h2>
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm space-y-4">
          {(
            [
              "complete",
              "terminate",
              "screenout",
              "quota_full",
              "quality_reject",
              "duplicate",
            ] as PanelRoutingEventType[]
          ).map((key) => {
            const count =
              key === "complete"
                ? summary.completes
                : key === "terminate"
                  ? summary.terminates
                  : key === "screenout"
                    ? summary.screenouts
                    : key === "quota_full"
                      ? summary.quotaFull
                      : key === "quality_reject"
                        ? summary.qualityReject
                        : summary.duplicate;
            const label = PANEL_ROUTING_EVENT_LABELS[key];
            return (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-bold text-gray-700">{label}</span>
                  <span className="font-mono tabular-nums text-gray-600">
                    {count}{" "}
                    <span className="text-gray-400 font-sans font-medium">
                      ({pct(count, eventMixDenominator)}%)
                    </span>
                  </span>
                </div>
                <ProgressBar value={count} max={eventMixDenominator} />
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
          Quota segments
        </h2>
        <div className="rounded-xl border border-slate-200/90 bg-white shadow-sm overflow-hidden overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[920px] text-xs text-left text-slate-800">
            <thead className="bg-[#091428] text-white">
              <tr className="text-[10px] font-extrabold uppercase tracking-wider text-slate-100">
                <th className="py-2 px-3 whitespace-nowrap">Segment</th>
                <th className="py-2 px-3 whitespace-nowrap">Total Cap</th>
                <th className="py-2 px-3 whitespace-nowrap">Remaining</th>
                <th className="py-2 px-3 whitespace-nowrap">Filled Slots</th>
                <th className="py-2 px-3 whitespace-nowrap">Completes</th>
                <th className="py-2 px-3 whitespace-nowrap">Terminated</th>
                <th className="py-2 px-3 whitespace-nowrap">Screen-Outs</th>
                <th className="py-2 px-3 whitespace-nowrap">Other Events</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.quotaGroups.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-6 px-3 text-center text-slate-500 font-medium text-xs"
                  >
                    No quota groups — configure segments on the survey edit form.
                  </td>
                </tr>
              ) : (
                data.quotaGroups.map((row) => (
                  <tr
                    key={row.groupId || row.groupName}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="py-1.5 px-3 font-bold text-slate-900 whitespace-nowrap align-middle">
                      {row.groupName || "—"}
                    </td>
                    <td className="py-1.5 px-3 font-mono font-semibold text-slate-900 tabular-nums whitespace-nowrap align-middle">
                      {row.totalQuota}
                    </td>
                    <td className="py-1.5 px-3 font-mono font-bold text-blue-600 tabular-nums whitespace-nowrap align-middle">
                      {row.remainingQuota}
                    </td>
                    <td className="py-1.5 px-3 font-mono font-bold text-emerald-700 tabular-nums whitespace-nowrap align-middle">
                      {row.filledSlots}
                    </td>
                    <td className="py-1.5 px-3 font-mono font-semibold text-slate-800 tabular-nums whitespace-nowrap align-middle">
                      {row.completes}
                    </td>
                    <td className="py-1.5 px-3 font-mono text-slate-600 tabular-nums whitespace-nowrap align-middle">
                      {row.terminates}
                    </td>
                    <td className="py-1.5 px-3 font-mono text-slate-600 tabular-nums whitespace-nowrap align-middle">
                      {row.screenouts}
                    </td>
                    <td className="py-1.5 px-3 font-mono text-slate-600 tabular-nums whitespace-nowrap align-middle">
                      {row.otherRoutingEvents}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
          Recent activity
        </h2>
        <div className="rounded-xl border border-slate-200/90 bg-white shadow-sm overflow-hidden overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[720px] text-xs text-slate-800">
            <thead className="bg-[#091428] text-white">
              <tr className="text-[10px] font-extrabold uppercase tracking-wider text-slate-100">
                <th className="text-left py-2 px-3 whitespace-nowrap">When</th>
                <th className="text-left py-2 px-3 whitespace-nowrap">Outcome</th>
                <th className="text-left py-2 px-3 whitespace-nowrap">Segment</th>
                <th className="text-left py-2 px-3 whitespace-nowrap">Respondent Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.recentEvents.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 px-3 text-center text-slate-500 font-medium text-xs"
                  >
                    No routing events yet. Completes and terminations will appear here once
                    callbacks are wired.
                  </td>
                </tr>
              ) : (
                data.recentEvents.map((ev, i) => (
                  <tr
                    key={`${ev.createdAt}-${i}`}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="py-1.5 px-3 text-slate-600 whitespace-nowrap text-xs align-middle">
                      {ev.createdAt ? new Date(ev.createdAt).toLocaleString() : "—"}
                    </td>
                    <td className="py-1.5 px-3 whitespace-nowrap align-middle">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200 leading-none">
                        {PANEL_ROUTING_EVENT_LABELS[ev.eventType]}
                      </span>
                    </td>
                    <td className="py-1.5 px-3 font-semibold text-slate-800 whitespace-nowrap align-middle">
                      {ev.quotaGroupName || "—"}
                    </td>
                    <td
                      className="py-1.5 px-3 font-mono text-xs text-blue-600 font-bold whitespace-nowrap truncate max-w-[280px] align-middle"
                      title={ev.supplierParticipantRef || ""}
                    >
                      {ev.supplierParticipantRef || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
