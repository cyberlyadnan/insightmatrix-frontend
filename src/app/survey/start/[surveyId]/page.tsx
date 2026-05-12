"use client";

/**
 * Participant-facing survey landing (placeholder).
 * Future: validation gateway, attempts, fraud checks — see project routing roadmap.
 */

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Building2, Clock, Gift, Loader2, MapPin, Rocket } from "lucide-react";

import { PANEL_SURVEY_STATUS_LABELS } from "@/constants/panel-survey";
import { getPublicPanelSurvey } from "@/services/panel-survey";
import { queryKeys } from "@/services/queries";

export default function SurveyStartPage() {
  const params = useParams();
  const surveyId = typeof params.surveyId === "string" ? params.surveyId : "";

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.panelSurveys.public(surveyId),
    queryFn: () => getPublicPanelSurvey(surveyId),
    enabled: Boolean(surveyId),
    retry: false,
  });

  const handleStart = () => {
    if (!data?.externalSurveyUrl) return;
    window.location.href = data.externalSurveyUrl;
  };

  if (!surveyId) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <p className="text-gray-500">Invalid survey link.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
        <p className="text-sm font-medium text-gray-500">Loading survey…</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center rounded-3xl border border-gray-100 bg-white p-10 shadow-sm">
          <p className="font-black text-gray-900 text-lg mb-2">Survey unavailable</p>
          <p className="text-sm text-gray-500">
            This survey could not be loaded. It may have ended or the link is invalid.
          </p>
        </div>
      </div>
    );
  }

  const countries = data.targetCountries?.length > 0 ? data.targetCountries.join(", ") : "Open";

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-2xl p-8 md:p-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest text-brand-primary mb-6">
          {PANEL_SURVEY_STATUS_LABELS[data.surveyStatus]}
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight mb-6">
          {data.surveyName}
        </h1>

        <ul className="space-y-4 mb-10 text-sm text-gray-300">
          <li className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
            <span>
              <span className="font-black text-white block text-xs uppercase tracking-widest mb-0.5">
                Estimated time
              </span>
              {data.estimatedLOI != null ? `About ${data.estimatedLOI} minutes` : "Varies by study"}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Gift className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
            <span>
              <span className="font-black text-white block text-xs uppercase tracking-widest mb-0.5">
                Reward
              </span>
              {data.payoutToUser != null ? `$${data.payoutToUser.toFixed(2)}` : "See panel wallet"}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
            <span>
              <span className="font-black text-white block text-xs uppercase tracking-widest mb-0.5">
                Markets
              </span>
              {countries}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
            <span>
              <span className="font-black text-white block text-xs uppercase tracking-widest mb-0.5">
                Provider
              </span>
              {data.providerName ?? "Partner"} {data.providerCode ? `(${data.providerCode})` : ""}
            </span>
          </li>
        </ul>

        <button
          type="button"
          onClick={handleStart}
          disabled={!data.externalSurveyUrl}
          className="w-full h-14 rounded-2xl bg-brand-primary text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-primary/25 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 transition-opacity"
        >
          <Rocket className="w-5 h-5" />
          Start survey
        </button>

        <p className="text-[11px] text-gray-500 text-center mt-6 leading-relaxed">
          You will be sent to the partner survey host. Completion validation and rewards are handled
          by your panel account once distribution features are enabled.
        </p>
      </div>
    </div>
  );
}
