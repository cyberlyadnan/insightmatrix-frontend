"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { PanelSurveyForm } from "@/components/admin/panel-survey-form";
import { ROUTES } from "@/constants/routes";
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
    onSuccess: async () => {
      toast.success("Survey created");
      await qc.invalidateQueries({ queryKey: queryKeys.panelSurveys.all });
      await qc.invalidateQueries({ queryKey: queryKeys.companyPayments.all });
      router.push(ROUTES.admin.surveys);
    },
    onError: (e) => toast.error(parseApiError(e, "Could not create survey")),
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
          Link an external supplier URL, targeting, and quota segments — no form builder required.
        </p>
      </div>

      <PanelSurveyForm
        mode="create"
        defaultValues={emptyPanelSurveyFormValues}
        providers={providers}
        onSubmit={(values: PanelSurveyFormValues) =>
          mutation.mutate(panelSurveyFormToPayload(values))
        }
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}
