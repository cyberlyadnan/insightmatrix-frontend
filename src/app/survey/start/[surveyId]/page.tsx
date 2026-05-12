import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { SurveyStartClient } from "./survey-start-client";

function SurveyStartFallback() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      <p className="text-sm font-medium text-gray-500">Loading survey…</p>
    </div>
  );
}

export default function SurveyStartPage() {
  return (
    <Suspense fallback={<SurveyStartFallback />}>
      <SurveyStartClient />
    </Suspense>
  );
}
