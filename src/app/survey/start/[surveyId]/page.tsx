import { Suspense } from "react";
import type { Metadata } from "next";
import { Loader2 } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { gatewayPathWithSearch, routingGatewayMetadata } from "@/lib/routing-link-metadata";

import { SurveyStartClient } from "./survey-start-client";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ surveyId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { surveyId } = await params;
  const sp = await searchParams;
  const path = gatewayPathWithSearch(ROUTES.surveyStart(surveyId), sp);
  return routingGatewayMetadata(path);
}

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
