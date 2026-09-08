"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber, formatPercent } from "@/utils/format";
import type { RespondentAnalyticsSummary } from "@/types/survey-respondent-profile";

const OUTCOME_COLORS = {
  Completes: "#0b4fd9",
  Terminates: "#f59e0b",
  "Quota full": "#8b5cf6",
  "Quality reject": "#ef4444",
  Redirected: "#06b6d4",
  Pending: "#94a3b8",
} as const;

type OutcomeKey = keyof typeof OUTCOME_COLORS;

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number; name?: string; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-lg shadow-gray-200/50">
      {label ? <p className="mb-1 text-[11px] font-semibold text-gray-500">{label}</p> : null}
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm font-bold text-gray-900 tabular-nums">
          <span
            className="mr-2 inline-block h-2 w-2 rounded-full"
            style={{ background: entry.color }}
          />
          {entry.name}: {formatNumber(Number(entry.value ?? 0))}
        </p>
      ))}
    </div>
  );
}

export function DashboardCharts({
  summary,
  isLoading,
}: {
  summary?: RespondentAnalyticsSummary;
  isLoading?: boolean;
}) {
  const outcomeData = (
    [
      { name: "Completes" as OutcomeKey, value: summary?.completes ?? 0 },
      { name: "Terminates" as OutcomeKey, value: summary?.terminates ?? 0 },
      { name: "Quota full" as OutcomeKey, value: summary?.quotaFull ?? 0 },
      { name: "Quality reject" as OutcomeKey, value: summary?.qualityRejects ?? 0 },
      { name: "Redirected" as OutcomeKey, value: summary?.redirected ?? 0 },
      { name: "Pending" as OutcomeKey, value: summary?.prescreenPending ?? 0 },
    ] as const
  ).filter((d) => d.value > 0);

  const funnelData = [
    { name: "Total", value: summary?.total ?? 0, fill: "#061f5c" },
    { name: "Completes", value: summary?.completes ?? 0, fill: "#0b4fd9" },
    { name: "Terminates", value: summary?.terminates ?? 0, fill: "#f59e0b" },
    { name: "Quota full", value: summary?.quotaFull ?? 0, fill: "#8b5cf6" },
    { name: "Quality", value: summary?.qualityRejects ?? 0, fill: "#ef4444" },
  ];

  const totalOutcomes = outcomeData.reduce((sum, d) => sum + d.value, 0);
  const conversion = summary?.conversionRate ?? 0;
  const fraudRate =
    summary?.fraudRate ??
    (summary && summary.total > 0
      ? Math.round((summary.qualityRejects / summary.total) * 1000) / 10
      : 0);

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2 h-[320px] rounded-2xl border border-gray-100 bg-white animate-pulse" />
        <div className="lg:col-span-3 h-[320px] rounded-2xl border border-gray-100 bg-white animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Outcome mix */}
      <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">Outcome mix</h3>
            <p className="text-xs text-gray-500 mt-0.5">Respondent status distribution</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Conversion
            </p>
            <p className="text-lg font-bold text-brand-primary tabular-nums">
              {formatPercent(conversion)}
            </p>
          </div>
        </div>

        {totalOutcomes === 0 ? (
          <div className="flex h-[220px] items-center justify-center text-sm text-gray-400">
            No respondent data yet
          </div>
        ) : (
          <div className="relative h-[220px] min-w-0 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
              <PieChart>
                <Pie
                  data={outcomeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {outcomeData.map((entry) => (
                    <Cell key={entry.name} fill={OUTCOME_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-gray-900 tabular-nums">
                {formatNumber(summary?.total ?? 0)}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Total
              </p>
            </div>
          </div>
        )}

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
          {outcomeData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ background: OUTCOME_COLORS[entry.name] }}
              />
              <span className="font-medium">{entry.name}</span>
              <span className="font-bold text-gray-900 tabular-nums">
                {formatNumber(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Funnel bars + KPI strip */}
      <div className="lg:col-span-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Traffic funnel</h3>
            <p className="text-xs text-gray-500 mt-0.5">Volume by outcome across all surveys</p>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Fraud rate
              </p>
              <p className="text-sm font-bold text-rose-600 tabular-nums">
                {formatPercent(fraudRate)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Completes
              </p>
              <p className="text-sm font-bold text-brand-primary tabular-nums">
                {formatNumber(summary?.completes ?? 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="h-[240px] min-w-0 min-h-[240px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
            <BarChart
              data={funnelData}
              barCategoryGap="28%"
              margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="value" name="Count" radius={[8, 8, 4, 4]} maxBarSize={48}>
                {funnelData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
