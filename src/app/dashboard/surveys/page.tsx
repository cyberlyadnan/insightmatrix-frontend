"use client";

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

  const surveys = data?.surveys ?? [];
  const profileComplete = data?.profileComplete ?? true;

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="text-brand-primary" size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary/60">
              Matched to your profile
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Available surveys
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1 max-w-xl">
            Studies are filtered using your prescreen (country, age, gender, work, industry, and
            devices). Rewards are credited in points when a complete is recorded for your session.
          </p>
        </div>
      </div>

      {!profileComplete ? (
        <div className="rounded-3xl border border-amber-100 bg-amber-50/90 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <AlertCircle className="w-10 h-10 text-amber-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-black text-gray-900 mb-1">Complete your profile prescreen</p>
            <p className="text-sm text-gray-600">
              We need your profile to match you with eligible surveys.
            </p>
          </div>
          <Link
            href={ROUTES.dashboard.prescreen}
            className="shrink-0 px-6 py-3 rounded-2xl bg-gray-900 text-white text-xs font-black uppercase tracking-widest hover:bg-black text-center"
          >
            Go to prescreen
          </Link>
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
          <p className="text-sm text-gray-500">Loading your surveys…</p>
        </div>
      ) : isError ? (
        <div className="rounded-3xl border border-rose-100 bg-rose-50/80 p-8 text-center">
          <p className="font-bold text-rose-800 mb-2">Could not load surveys</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-sm font-black text-brand-primary underline"
          >
            Try again
          </button>
        </div>
      ) : surveys.length === 0 ? (
        <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <p className="font-black text-gray-900 mb-2">No matching surveys right now</p>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            When admins publish active studies that fit your profile, they will appear here. You can
            refresh after updating your prescreen under settings.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey, i) => (
            <motion.div
              key={survey.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.04, 0.4) }}
              className="group bg-white rounded-[2.5rem] border border-gray-100 p-8 hover:shadow-2xl hover:shadow-brand-primary/5 hover:border-brand-primary/20 transition-all relative overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full">
                  <Gift size={12} className="text-emerald-600" />
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">
                    Eligible
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Points
                  </p>
                  <p className="text-xl font-black text-brand-primary">
                    +{survey.pointsReward.toLocaleString()} pts
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6 flex-1 min-h-0">
                <h3 className="text-lg font-black text-gray-900 leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
                  {survey.surveyName}
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {survey.surveyCode}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span className="text-xs font-bold">
                      {survey.estimatedLOI != null ? `~${survey.estimatedLOI} min` : "Time varies"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Building2 size={14} className="shrink-0" />
                    <span className="text-xs font-bold truncate">
                      {survey.provider?.companyName ?? "Partner"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 flex items-center justify-between gap-3 mt-auto">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">
                  {survey.targetCountries?.length ? survey.targetCountries.join(", ") : "Open"}
                </span>
                <button
                  type="button"
                  disabled={startMutation.isPending}
                  onClick={() => startMutation.mutate(survey.id)}
                  className="h-11 px-4 rounded-2xl bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 shadow-lg shadow-brand-primary/20 hover:opacity-95 disabled:opacity-50 shrink-0"
                >
                  {startMutation.isPending && startMutation.variables === survey.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight size={18} />
                  )}
                  Start
                </button>
              </div>

              <div className="absolute -right-8 -top-8 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
