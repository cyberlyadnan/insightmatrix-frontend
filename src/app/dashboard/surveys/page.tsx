"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ClipboardList,
  Clock,
  Loader2,
  ArrowRight,
  Gift,
  Building2,
  AlertCircle,
  CheckCircle2,
  Ban,
  Search,
  RefreshCw,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { ROUTES } from "@/constants/routes";
import { parseApiError } from "@/services/api/errors";
import { getAvailablePanelSurveys, startPanelSurveyAttempt } from "@/services/member-panel";
import { queryKeys } from "@/services/queries";

export default function PanelSurveys() {
  const router = useRouter();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "available" | "completed">("all");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.memberPanel.available,
    queryFn: getAvailablePanelSurveys,
    staleTime: 30_000,
  });

  const startMutation = useMutation({
    mutationFn: (surveyId: string) => startPanelSurveyAttempt(surveyId),
    onSuccess: async (res) => {
      await qc.invalidateQueries({ queryKey: queryKeys.memberPanel.available });
      router.push(res.startPath);
    },
    onError: (e) => toast.error(parseApiError(e, "Could not start survey")),
  });

  const allSurveys = data?.surveys;
  const profileComplete = data?.profileComplete ?? true;

  const filteredSurveys = useMemo(() => {
    const list = allSurveys ?? [];
    return list.filter((s) => {
      const matchSearch =
        !search.trim() ||
        s.surveyName.toLowerCase().includes(search.toLowerCase()) ||
        s.surveyCode.toLowerCase().includes(search.toLowerCase()) ||
        (s.provider?.companyName &&
          s.provider.companyName.toLowerCase().includes(search.toLowerCase()));

      if (!matchSearch) return false;

      if (filterTab === "available") return s.memberParticipation.status === "available";
      if (filterTab === "completed") return s.memberParticipation.status === "completed";
      return true;
    });
  }, [allSurveys, search, filterTab]);

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-md bg-brand-subtle text-brand-primary flex items-center justify-center font-bold">
              <ClipboardList size={14} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">
              Matched Research Opportunities
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Available Surveys
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5 max-w-xl leading-relaxed">
            Participate in vetted studies matched to your verified profile. Earn instant points upon
            completion.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-2xs self-start md:self-auto transition-all"
        >
          <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
          <span>Refresh Studies</span>
        </button>
      </div>

      {/* Profile Incomplete Warning Banner */}
      {!profileComplete ? (
        <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertCircle size={18} />
            </div>
            <div>
              <p className="font-black text-xs text-amber-950">Complete your demographic profile</p>
              <p className="text-[11px] text-amber-800/80 font-medium">
                Surveys are matched to your country, age, industry, and other profile answers.
              </p>
            </div>
          </div>
          <Link
            href={ROUTES.dashboard.prescreen}
            className="shrink-0 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-black uppercase tracking-wider text-center shadow-xs transition-colors"
          >
            Start Prescreen
          </Link>
        </div>
      ) : null}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search studies by title, code or sponsor..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200/80 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl w-full sm:w-auto justify-center sm:justify-start">
          {(
            [
              { id: "all", label: "All Studies" },
              { id: "available", label: "Available" },
              { id: "completed", label: "Completed" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilterTab(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterTab === t.id
                  ? "bg-white text-gray-900 shadow-2xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Surveys List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2.5 bg-white rounded-2xl border border-gray-100">
          <Loader2 className="w-7 h-7 animate-spin text-brand-primary" />
          <p className="text-xs font-bold text-gray-400">Loading matched surveys…</p>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center space-y-2">
          <p className="font-black text-rose-900 text-xs">Could not load available surveys</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors"
          >
            Try again
          </button>
        </div>
      ) : filteredSurveys.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto">
            <ClipboardList size={20} />
          </div>
          <p className="font-black text-gray-900 text-sm">No Matching Surveys Found</p>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            {search
              ? "Try adjusting your search query or clearing filters."
              : "When new research studies matching your demographic criteria are published, they will appear here automatically."}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurveys.map((survey, i) => {
            const part = survey.memberParticipation;
            const canStart = part.status === "available";

            return (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.2) }}
                className="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:shadow-brand-primary/5 hover:border-brand-primary/30 transition-all duration-200 relative flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges Row */}
                  <div className="flex items-center justify-between mb-3">
                    {part.status === "completed" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                        <CheckCircle2 size={10} className="text-emerald-600" />
                        Completed
                      </span>
                    ) : part.status === "no_attempts_left" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                        <Ban size={10} />
                        No attempts left
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Gift size={10} />
                        Eligible
                      </span>
                    )}

                    <span className="text-[9px] font-black uppercase tracking-wider text-brand-primary bg-brand-subtle px-1.5 py-0.5 rounded">
                      {survey.surveyCode}
                    </span>
                  </div>

                  {/* Title & Info */}
                  <h3 className="text-xs sm:text-sm font-black text-gray-900 leading-snug group-hover:text-brand-primary transition-colors line-clamp-2 mb-2.5">
                    {survey.surveyName}
                  </h3>

                  <div className="space-y-1 mb-4 text-gray-500 text-xs font-semibold">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock size={12} className="text-brand-primary shrink-0" />
                      <span className="text-[11px]">
                        {survey.estimatedLOI != null
                          ? `~${survey.estimatedLOI} minutes`
                          : "Time varies"}
                      </span>
                    </div>
                    {survey.provider?.companyName && (
                      <div className="flex items-center gap-1.5 text-slate-600 truncate">
                        <Building2 size={12} className="text-brand-primary shrink-0" />
                        <span className="text-[11px] truncate">{survey.provider.companyName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                      <Globe size={12} className="shrink-0" />
                      <span className="truncate">
                        {survey.targetCountries?.length
                          ? survey.targetCountries.join(", ")
                          : "Global"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Reward & CTA Row */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3 mt-auto">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 block">
                      Reward
                    </span>
                    <span className="text-sm sm:text-base font-black text-amber-600 tabular-nums">
                      +{survey.pointsReward.toLocaleString()} pts
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={!canStart || startMutation.isPending}
                    onClick={() => startMutation.mutate(survey.id)}
                    className="h-9 px-3.5 rounded-xl bg-gradient-to-r from-brand-primary to-blue-600 text-white text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs hover:opacity-95 disabled:opacity-50 transition-all shrink-0 active:scale-95"
                  >
                    {startMutation.isPending && startMutation.variables === survey.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : canStart ? (
                      <>
                        <span>Start</span>
                        <ArrowRight size={12} />
                      </>
                    ) : part.status === "completed" ? (
                      <span>Done</span>
                    ) : (
                      <span>Closed</span>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
