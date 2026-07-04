"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { PanelSurveyForm } from "@/components/admin/panel-survey-form";
import { ROUTES } from "@/constants/routes";
import { panelSurveyConflictToastMessage } from "@/lib/panel-survey-conflict-errors";
import { parseApiError } from "@/services/api/errors";
import { createPanelSurvey } from "@/services/panel-survey";
import { listSurveyCompanies } from "@/services/survey-company";
import { queryKeys } from "@/services/queries";
import {
  emptyPanelSurveyFormValues,
  panelSurveyFormToPayload,
  type PanelSurveyFormValues,
} from "@/validations/panel-survey.schema";

export default function CreatePanelSurveyPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [submitError, setSubmitError] = useState<unknown>(null);

  const { data: companiesData } = useQuery({
    queryKey: queryKeys.surveyCompanies.list({ page: 1, pageSize: 500 }),
    queryFn: () => listSurveyCompanies({ page: 1, pageSize: 500 }),
  });
  const providers =
    companiesData?.items.map((c) => ({
      id: c.id,
      companyName: c.companyName,
      companyCode: c.companyCode,
    })) ?? [];

  const mutation = useMutation({
    mutationFn: createPanelSurvey,
    onMutate: () => setSubmitError(null),
    onSuccess: async (survey) => {
      toast.success("Survey created — copy the share link for your team");
      await qc.invalidateQueries({ queryKey: queryKeys.panelSurveys.all });
      await qc.invalidateQueries({ queryKey: queryKeys.companyPayments.all });
      router.push(ROUTES.admin.survey(survey.id));
    },
    onError: (e) => {
      setSubmitError(e);
      toast.error(
        panelSurveyConflictToastMessage(e) ?? parseApiError(e, "Could not create survey")
      );
    },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <Link
          href={ROUTES.admin.surveys}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to surveys
        </Link>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create routing survey</h1>
        <p className="text-gray-500 font-medium mt-1">
          Start with the Basic tab — only core routing fields are required. Use Advanced for
          targeting, billing, and optional settings. A shareable team link is generated after
          creation.
        </p>
      </div>

      <PanelSurveyForm
        mode="create"
        defaultValues={emptyPanelSurveyFormValues}
        providers={providers}
        submitError={submitError}
        onSubmit={(values: PanelSurveyFormValues) =>
          mutation.mutate(panelSurveyFormToPayload(values))
        }
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}
