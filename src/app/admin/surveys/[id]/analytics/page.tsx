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
        <div className="rounded-[2rem] border border-gray-100 bg-white shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[920px] text-sm text-left">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50/80">
                <th className="py-3 px-4">Segment</th>
                <th className="py-3 px-4">Total cap</th>
                <th className="py-3 px-4">Remaining</th>
                <th className="py-3 px-4">Filled slots</th>
                <th className="py-3 px-4">Completes</th>
                <th className="py-3 px-4">Terminated</th>
                <th className="py-3 px-4">Screen-outs</th>
                <th className="py-3 px-4">Other events</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.quotaGroups.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 px-4 text-center text-gray-500">
                    No quota groups — configure segments on the survey edit form.
                  </td>
                </tr>
              ) : (
                data.quotaGroups.map((row) => (
                  <tr key={row.groupId || row.groupName} className="hover:bg-gray-50/80">
                    <td className="py-3 px-4 font-bold text-gray-900">{row.groupName || "—"}</td>
                    <td className="py-3 px-4 font-mono tabular-nums">{row.totalQuota}</td>
                    <td className="py-3 px-4 font-mono tabular-nums">{row.remainingQuota}</td>
                    <td className="py-3 px-4 font-mono tabular-nums text-brand-primary font-bold">
                      {row.filledSlots}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums">{row.completes}</td>
                    <td className="py-3 px-4 font-mono tabular-nums">{row.terminates}</td>
                    <td className="py-3 px-4 font-mono tabular-nums">{row.screenouts}</td>
                    <td className="py-3 px-4 font-mono tabular-nums">{row.otherRoutingEvents}</td>
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
        <div className="rounded-[2rem] border border-gray-100 bg-white shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50/80">
                <th className="text-left py-3 px-4">When</th>
                <th className="text-left py-3 px-4">Outcome</th>
                <th className="text-left py-3 px-4">Segment</th>
                <th className="text-left py-3 px-4">Respondent ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.recentEvents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 px-4 text-center text-gray-500">
                    No routing events yet. Completes and terminations will appear here once
                    callbacks are wired.
                  </td>
                </tr>
              ) : (
                data.recentEvents.map((ev, i) => (
                  <tr key={`${ev.createdAt}-${i}`}>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap text-xs">
                      {ev.createdAt ? new Date(ev.createdAt).toLocaleString() : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-800">
                        {PANEL_ROUTING_EVENT_LABELS[ev.eventType]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{ev.quotaGroupName || "—"}</td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-600 break-all max-w-[280px]">
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
