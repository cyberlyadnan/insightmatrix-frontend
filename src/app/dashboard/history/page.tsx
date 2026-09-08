"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  History,
  Loader2,
  CheckCircle2,
  Clock,
  Ban,
  AlertTriangle,
  Search,
  RefreshCw,
  ArrowRight,
  Coins,
  ClipboardList,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { ROUTES } from "@/constants/routes";
import {
  getPanelSurveyHistory,
  type MemberAttemptOutcome,
  type MemberSurveyHistoryItem,
} from "@/services/member-panel";
import { queryKeys } from "@/services/queries";

type FilterTab = "all" | "completed" | "in_progress" | "not_qualified";

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function outcomeStyles(outcome: MemberAttemptOutcome) {
  switch (outcome) {
    case "completed":
      return {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
        icon: CheckCircle2,
      };
    case "in_progress":
      return {
        badge: "bg-sky-50 text-sky-700 border-sky-200",
        dot: "bg-sky-500",
        icon: Clock,
      };
    case "quota_full":
      return {
        badge: "bg-amber-50 text-amber-800 border-amber-200",
        dot: "bg-amber-500",
        icon: AlertTriangle,
      };
    case "quality_reject":
    case "terminated":
    case "screenout":
      return {
        badge: "bg-rose-50 text-rose-700 border-rose-200",
        dot: "bg-rose-500",
        icon: Ban,
      };
    default:
      return {
        badge: "bg-gray-50 text-gray-600 border-gray-200",
        dot: "bg-gray-400",
        icon: Clock,
      };
  }
}

function isNotQualified(outcome: MemberAttemptOutcome) {
  return ["terminated", "screenout", "quota_full", "quality_reject"].includes(outcome);
}

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
      <p className={`mt-1.5 text-2xl font-black tabular-nums tracking-tight ${accent}`}>{value}</p>
      <p className="mt-1 text-[11px] text-gray-500 font-medium">{hint}</p>
    </div>
  );
}

function AttemptRow({ item }: { item: MemberSurveyHistoryItem }) {
  const style = outcomeStyles(item.outcome);
  const Icon = style.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="group rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm hover:border-brand-primary/20 hover:shadow-md transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${style.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
              {item.outcomeLabel}
            </span>
            {item.surveyCode ? (
              <span className="text-[10px] font-mono font-semibold text-gray-400">
                {item.surveyCode}
              </span>
            ) : null}
          </div>

          <h3 className="text-sm sm:text-base font-black text-gray-900 tracking-tight truncate">
            {item.surveyName}
          </h3>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500 font-medium">
            {item.providerName ? (
              <span className="inline-flex items-center gap-1">
                <Building2 size={12} className="text-gray-400" />
                {item.providerName}
              </span>
            ) : null}
            {item.estimatedLOI != null ? (
              <span className="inline-flex items-center gap-1">
                <Clock size={12} className="text-gray-400" />~{item.estimatedLOI} min
              </span>
            ) : null}
            <span>Started {formatWhen(item.startedAt)}</span>
            {item.resolvedAt ? <span>Resolved {formatWhen(item.resolvedAt)}</span> : null}
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
          <div
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black tabular-nums ${
              item.pointsAwarded > 0
                ? "bg-amber-50 text-amber-800 border border-amber-200"
                : "bg-gray-50 text-gray-500 border border-gray-100"
            }`}
          >
            <Coins size={13} />
            {item.pointsAwarded > 0
              ? `+${item.pointsAwarded.toLocaleString()} pts`
              : item.outcome === "in_progress"
                ? `Up to ${item.pointsPotential.toLocaleString()} pts`
                : "0 pts"}
          </div>
          <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 group-hover:bg-brand-subtle group-hover:text-brand-primary transition-colors">
            <Icon size={15} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SurveyHistoryPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<FilterTab>("all");

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: queryKeys.memberPanel.history,
    queryFn: getPanelSurveyHistory,
    staleTime: 20_000,
    refetchOnWindowFocus: true,
  });

  const summary = data?.summary;
  const items = data?.items ?? [];

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.surveyName.toLowerCase().includes(q) ||
        item.surveyCode.toLowerCase().includes(q) ||
        (item.providerName && item.providerName.toLowerCase().includes(q));

      if (!matchSearch) return false;
      if (tab === "completed") return item.outcome === "completed";
      if (tab === "in_progress") return item.outcome === "in_progress";
      if (tab === "not_qualified") return isNotQualified(item.outcome);
      return true;
    });
  }, [items, search, tab]);

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: "all", label: "All", count: summary?.totalAttempts ?? 0 },
    { id: "completed", label: "Completed", count: summary?.completed ?? 0 },
    { id: "in_progress", label: "In progress", count: summary?.inProgress ?? 0 },
    { id: "not_qualified", label: "Not qualified", count: summary?.notQualified ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-md bg-brand-subtle text-brand-primary flex items-center justify-center">
              <History size={14} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">
              Participation log
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Survey History
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5 max-w-xl leading-relaxed">
            Track every study you started — completions, points earned, and outcomes that did not
            qualify.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link
            href={ROUTES.dashboard.surveys}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-black uppercase tracking-wider hover:bg-brand-hover active:scale-95 transition-all"
          >
            Find surveys
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2.5 bg-white rounded-2xl border border-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
          <p className="text-xs font-bold text-gray-500">Loading your survey history…</p>
        </div>
      ) : isError ? (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2">
          <p className="text-xs font-black text-rose-700">Could not load survey history.</p>
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs"
            onClick={() => void refetch()}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              label="Attempts"
              value={summary?.totalAttempts ?? 0}
              hint="Surveys you started"
              accent="text-gray-900"
            />
            <StatCard
              label="Completed"
              value={summary?.completed ?? 0}
              hint="Successfully finished"
              accent="text-emerald-700"
            />
            <StatCard
              label="Not qualified"
              value={summary?.notQualified ?? 0}
              hint="Terminated / quota / quality"
              accent="text-rose-700"
            />
            <StatCard
              label="Points earned"
              value={(summary?.pointsFromSurveys ?? 0).toLocaleString()}
              hint="From completed studies"
              accent="text-amber-700"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by study name or code…"
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200/80 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${
                    tab === t.id
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {t.label}
                  <span className="ml-1 tabular-nums text-gray-400">{t.count}</span>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-subtle text-brand-primary">
                  <ClipboardList size={22} />
                </div>
                <p className="text-sm font-black text-gray-900">No attempts in this view</p>
                <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
                  {items.length === 0
                    ? "When you start a matched survey, it will appear here with status and points."
                    : "Try another filter or clear your search."}
                </p>
                {items.length === 0 ? (
                  <Link
                    href={ROUTES.dashboard.surveys}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-hover"
                  >
                    Browse surveys
                    <ArrowRight size={13} />
                  </Link>
                ) : null}
              </motion.div>
            ) : (
              <div className="space-y-3">
                {filtered.map((item) => (
                  <AttemptRow key={item.id} item={item} />
                ))}
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
