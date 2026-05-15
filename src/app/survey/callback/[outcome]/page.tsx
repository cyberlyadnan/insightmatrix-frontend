import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";

import { SurveyCallbackCard, SurveyCallbackShell } from "@/components/survey/survey-callback-shell";
import { SURVEY_CALLBACK_SLUG_SET } from "@/constants/survey-callback";
import { SurveyCallbackRecorder } from "./survey-callback-recorder";

function CallbackFallback() {
  return (
    <SurveyCallbackShell accent="neutral">
      <SurveyCallbackCard className="flex flex-col items-center justify-center py-4 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 sm:h-24 sm:w-24">
          <Loader2 className="h-10 w-10 animate-spin text-brand-primary sm:h-11 sm:w-11" />
        </div>
        <p className="text-base font-bold text-white sm:text-lg">Loading callback…</p>
        <p className="mt-2 max-w-xs text-sm text-white/55">
          Securing your session with InsightMatrix.
        </p>
      </SurveyCallbackCard>
    </SurveyCallbackShell>
  );
}

export default async function SurveyCallbackPage({
  params,
}: {
  params: Promise<{ outcome: string }>;
}) {
  const { outcome } = await params;
  if (!SURVEY_CALLBACK_SLUG_SET.has(outcome)) {
    notFound();
  }

  return (
    <Suspense fallback={<CallbackFallback />}>
      <SurveyCallbackRecorder outcome={outcome} />
    </Suspense>
  );
}
