"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Sparkles,
  Clock,
  ArrowRight,
  Gift,
  ShieldCheck,
  ChevronRight,
  Target,
  ClipboardList,
  Coins,
  CheckCircle2,
  Building2,
  TrendingUp,
  Loader2,
  Compass,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/authStore";
import {
  getAvailablePanelSurveys,
  startPanelSurveyAttempt,
  getPanelWallet,
} from "@/services/member-panel";
import { queryKeys } from "@/services/queries";
import { parseApiError } from "@/services/api/errors";

export default function DashboardHome() {
  const router = useRouter();
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const { data: surveysData, isLoading: loadingSurveys } = useQuery({
    queryKey: queryKeys.memberPanel.available,
    queryFn: getAvailablePanelSurveys,
    staleTime: 30_000,
  });

  const { data: walletData } = useQuery({
    queryKey: queryKeys.memberPanel.wallet,
    queryFn: getPanelWallet,
    staleTime: 60_000,
  });

  const startMutation = useMutation({
    mutationFn: (surveyId: string) => startPanelSurveyAttempt(surveyId),
    onSuccess: async (res) => {
      await qc.invalidateQueries({ queryKey: queryKeys.memberPanel.available });
      router.push(res.startPath);
    },
    onError: (e) => toast.error(parseApiError(e, "Could not start survey")),
  });

  const surveys = surveysData?.surveys ?? [];
  const pointsBalance = walletData?.balance ?? user?.panelPoints ?? 0;
  const lifetimeEarned = walletData?.lifetimeEarned ?? 0;
  const featuredSurvey = surveys[0] || null;

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-[2rem] bg-gradient-to-br from-[#091428] via-[#0A1A38] to-[#061020] text-white p-6 sm:p-8 lg:p-10 shadow-xl shadow-brand-primary/10 border border-slate-800/80 overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 bg-brand-primary/20 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest shadow-md shadow-brand-primary/30 flex items-center gap-1.5">
                <Sparkles size={12} />
                Featured Research Mission
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-brand-light text-[10px] font-black uppercase tracking-wider backdrop-blur-sm border border-white/10 flex items-center gap-1.5">
                <Clock size={12} />
                {featuredSurvey?.estimatedLOI
                  ? `~${featuredSurvey.estimatedLOI} mins`
                  : "10-15 mins"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-[1.15]">
              {featuredSurvey
                ? featuredSurvey.surveyName
                : "Global Consumer Trends & Technology Audit"}
            </h1>

            <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-xl">
              Share your verified perspective on key market decisions. Instant reward points will be
              credited directly to your wallet upon validated completion.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Reward:
                </span>
                <span className="text-xl font-black text-amber-400 tabular-nums">
                  +{featuredSurvey ? featuredSurvey.pointsReward.toLocaleString() : "1,250"} pts
                </span>
              </div>
              <div className="h-4 w-px bg-slate-700" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Target:
                </span>
                <span className="text-sm font-bold text-white">
                  {featuredSurvey?.targetCountries?.length
                    ? featuredSurvey.targetCountries.join(", ")
                    : "Global"}
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            {featuredSurvey ? (
              <button
                type="button"
                disabled={startMutation.isPending}
                onClick={() => startMutation.mutate(featuredSurvey.id)}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-primary via-blue-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest inline-flex items-center justify-center gap-2.5 shadow-xl shadow-brand-primary/30 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50"
              >
                {startMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Start Survey</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            ) : (
              <Link
                href={ROUTES.dashboard.surveys}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-primary via-blue-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest inline-flex items-center justify-center gap-2.5 shadow-xl shadow-brand-primary/30 hover:opacity-95 active:scale-95 transition-all text-center"
              >
                <span>Browse Studies</span>
                <ArrowRight size={16} />
              </Link>
            )}

            <Link
              href={ROUTES.dashboard.prescreen}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-black uppercase tracking-wider text-center backdrop-blur-sm border border-white/10 transition-all"
            >
              Update Prescreen
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Colorful Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Available Surveys */}
        <Link
          href={ROUTES.dashboard.surveys}
          className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-white border border-blue-200/80 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <ClipboardList size={20} />
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 border border-blue-200/70 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-blue-900/80 mb-1">
              Available Studies
            </div>
            <div className="text-2xl font-black text-blue-700 tabular-nums">
              {loadingSurveys ? "—" : surveys.length}
            </div>
          </div>
        </Link>

        {/* Card 2: Points Balance */}
        <Link
          href={ROUTES.dashboard.wallet}
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white border border-amber-200/80 shadow-sm hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <Coins size={20} />
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 border border-amber-200/70 px-2 py-0.5 rounded-full">
              Wallet
            </span>
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-amber-900/80 mb-1">
              Points Balance
            </div>
            <div className="text-2xl font-black text-amber-700 tabular-nums">
              {pointsBalance.toLocaleString()} pts
            </div>
          </div>
        </Link>

        {/* Card 3: Lifetime Earned */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white border border-emerald-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-200/70 px-2 py-0.5 rounded-full">
              All-Time
            </span>
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-emerald-900/80 mb-1">
              Lifetime Earned
            </div>
            <div className="text-2xl font-black text-emerald-700 tabular-nums">
              {lifetimeEarned.toLocaleString()} pts
            </div>
          </div>
        </div>

        {/* Card 4: Verification Status */}
        <Link
          href={ROUTES.dashboard.prescreen}
          className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/90 via-violet-50/40 to-white border border-purple-200/80 shadow-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform">
              <ShieldCheck size={20} />
            </div>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-100/80 border border-purple-200/70 px-2 py-0.5 rounded-full">
              Verified
            </span>
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-purple-900/80 mb-1">
              Profile Status
            </div>
            <div className="text-2xl font-black text-purple-700">100% Eligible</div>
          </div>
        </Link>
      </div>

      {/* Main Studies Section */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Studies List */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                Recommended For You
              </h2>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                Matched to your demographic and device profile
              </p>
            </div>
            <Link
              href={ROUTES.dashboard.surveys}
              className="text-xs font-black text-brand-primary hover:underline inline-flex items-center gap-1"
            >
              View All ({surveys.length}) <ChevronRight size={14} />
            </Link>
          </div>

          {loadingSurveys ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-100">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-primary mb-2" />
              <p className="text-xs font-bold text-gray-500">Matching surveys to your profile...</p>
            </div>
          ) : surveys.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-subtle text-brand-primary flex items-center justify-center mx-auto">
                <Compass size={24} />
              </div>
              <h3 className="text-base font-black text-gray-900">No Matched Surveys Right Now</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                New studies are posted throughout the day. Check back soon or refine your
                prescreening criteria.
              </p>
              <Link
                href={ROUTES.dashboard.prescreen}
                className="inline-flex px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-black uppercase tracking-wider shadow-sm hover:bg-brand-hover transition-colors"
              >
                Update Profile
              </Link>
            </div>
          ) : (
            <div className="space-y-3.5">
              {surveys.slice(0, 5).map((survey) => {
                const part = survey.memberParticipation;
                const canStart = part.status === "available";

                return (
                  <div
                    key={survey.id}
                    className="p-5 rounded-2xl bg-white border border-gray-100 hover:border-brand-primary/30 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                        <ClipboardList size={22} />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-brand-primary bg-brand-subtle px-2 py-0.5 rounded-md">
                            {survey.surveyCode}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                            <Clock size={11} />{" "}
                            {survey.estimatedLOI ? `${survey.estimatedLOI}m` : "10m"}
                          </span>
                          {survey.provider?.companyName && (
                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                              <Building2 size={11} /> {survey.provider.companyName}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-black text-gray-900 group-hover:text-brand-primary transition-colors truncate max-w-md">
                          {survey.surveyName}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-600 block tabular-nums">
                          +{survey.pointsReward.toLocaleString()} pts
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                          Upon complete
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={!canStart || startMutation.isPending}
                        onClick={() => startMutation.mutate(survey.id)}
                        className="px-4 py-2.5 rounded-xl bg-brand-primary text-white text-[11px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm hover:bg-brand-hover active:scale-95 disabled:opacity-50 transition-all shrink-0"
                      >
                        {startMutation.isPending && startMutation.variables === survey.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : canStart ? (
                          <>
                            <span>Participate</span>
                            <ArrowRight size={13} />
                          </>
                        ) : (
                          <span>Completed</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar Widget */}
        <div className="lg:col-span-4 space-y-6">
          {/* Weekly Rewards Goal */}
          <div className="p-6 rounded-3xl bg-[#091428] text-white space-y-5 border border-slate-800 shadow-lg relative overflow-hidden">
            <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/20 rounded-full blur-2xl" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-brand-light">
                  <Target size={16} />
                </div>
                <h3 className="text-sm font-black tracking-tight">Weekly Goal</h3>
              </div>
              <span className="text-[10px] font-black text-brand-light bg-white/10 px-2 py-0.5 rounded-full uppercase">
                Tier Bonus
              </span>
            </div>

            <div className="relative z-10 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-white tabular-nums">
                  {pointsBalance.toLocaleString()}{" "}
                  <span className="text-xs font-bold text-slate-400">/ 5,000 pts</span>
                </span>
                <span className="text-xs font-black text-emerald-400">
                  {Math.min(100, Math.round((pointsBalance / 5000) * 100))}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-primary to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, (pointsBalance / 5000) * 100))}%` }}
                />
              </div>
            </div>

            <p className="relative z-10 text-[11px] text-slate-400 font-medium leading-relaxed">
              Reach 5,000 points this week to unlock priority invitations to high-incentive B2B
              studies.
            </p>
          </div>

          {/* Verification Badge Box */}
          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-gray-900">Verified Panelist</h4>
              <p className="text-[11px] text-gray-400 font-medium">
                Prescreen active • Matched surveys enabled
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
