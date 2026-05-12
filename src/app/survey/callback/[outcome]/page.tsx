import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";

import { SURVEY_CALLBACK_SLUG_SET } from "@/constants/survey-callback";
import { SurveyCallbackRecorder } from "./survey-callback-recorder";

function CallbackFallback() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      <p className="text-sm text-gray-500">Loading…</p>
    </div>
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
