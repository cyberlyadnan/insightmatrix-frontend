"use client";

/**
 * Participant-facing survey landing: loads public survey config, captures ?pid= (or configured key),
 * stores context for callback correlation, and redirects with tracking param on the supplier URL.
 */

import { useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Building2, Clock, Gift, Loader2, MapPin, Rocket } from "lucide-react";

import { PANEL_SURVEY_STATUS_LABELS } from "@/constants/panel-survey";
import {
  buildVendorEntryUrl,
  extractParticipantIdFromSearchParams,
  persistParticipantContext,
} from "@/lib/survey-participant";
import { panelPointsFromPayout } from "@/lib/panel-points";
import { getPublicPanelSurvey } from "@/services/panel-survey";
import { queryKeys } from "@/services/queries";

export function SurveyStartClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const surveyId = typeof params.surveyId === "string" ? params.surveyId : "";

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.panelSurveys.public(surveyId),
    queryFn: () => getPublicPanelSurvey(surveyId),
    enabled: Boolean(surveyId),
    retry: false,
  });

  const participantId = useMemo(() => {
    if (!data) return null;
    return extractParticipantIdFromSearchParams(searchParams, data.participantQueryParam ?? "pid");
  }, [data, searchParams]);

  useEffect(() => {
    if (!data || !participantId) return;
    persistParticipantContext({
      surveyId: data.id,
      participantId,
      participantQueryParam: data.participantQueryParam ?? "pid",
      outboundTrackingKey: data.trackingParameterName ?? "toid",
      capturedAt: new Date().toISOString(),
    });
  }, [data, participantId]);

  const handleStart = () => {
    if (!data?.externalSurveyUrl) return;
    try {
      if (participantId) {
        window.location.href = buildVendorEntryUrl(
          data.externalSurveyUrl,
          data.trackingParameterName ?? "toid",
          participantId
        );
      } else {
        window.location.href = data.externalSurveyUrl;
      }
    } catch {
      window.location.href = data.externalSurveyUrl;
    }
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
            This survey could not be loaded. It may have ended, is not yet active, or the link is
            invalid.
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

        {!participantId ? (
          <p className="text-sm text-amber-200/90 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-6 leading-relaxed">
            No participant id was found in this link (
            <span className="font-mono">{data.participantQueryParam ?? "pid"}</span>
            ). Add{" "}
            <span className="font-mono whitespace-nowrap">
              ?{data.participantQueryParam ?? "pid"}=&lt;id&gt;
            </span>{" "}
            for routing-tracked completes; you can still open the supplier URL without it for dry
            runs.
          </p>
        ) : (
          <p className="text-xs text-gray-400 mb-6 font-mono break-all">
            Participant id captured ({data.participantQueryParam ?? "pid"}). Supplier redirect will
            include{" "}
            <span className="text-brand-primary font-bold">
              {data.trackingParameterName ?? "toid"}
            </span>
            <span className="text-gray-500">=…</span>
          </p>
        )}

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
                Points
              </span>
              {data.payoutToUser != null
                ? `${panelPointsFromPayout(data.payoutToUser).toLocaleString()} pts`
                : `${panelPointsFromPayout(null).toLocaleString()} pts`}
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
          You will be sent to the partner survey host. The same participant id can be echoed on your
          callback URL for completion matching when integrations are enabled.
        </p>
      </div>
    </div>
  );
}
