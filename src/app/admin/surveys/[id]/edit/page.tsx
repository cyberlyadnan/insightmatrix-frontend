"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { PanelSurveyForm } from "@/components/admin/panel-survey-form";
import { ROUTES } from "@/constants/routes";
import { parseApiError } from "@/services/api/errors";
import { getPanelSurvey, updatePanelSurvey } from "@/services/panel-survey";
import { listSurveyCompanies } from "@/services/survey-company";
import { queryKeys } from "@/services/queries";
import {
  panelSurveyFormToPayload,
  panelSurveyToFormValues,
  type PanelSurveyFormValues,
} from "@/validations/panel-survey.schema";

export default function EditPanelSurveyPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const router = useRouter();
  const qc = useQueryClient();

  const {
    data: survey,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.panelSurveys.detail(id),
    queryFn: () => getPanelSurvey(id),
    enabled: Boolean(id),
  });

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
    mutationFn: (payload: Parameters<typeof updatePanelSurvey>[1]) =>
      updatePanelSurvey(id, payload),
    onSuccess: async () => {
      toast.success("Survey updated");
      await qc.invalidateQueries({ queryKey: queryKeys.panelSurveys.all });
      await qc.invalidateQueries({ queryKey: queryKeys.companyPayments.all });
      router.push(ROUTES.admin.surveys);
    },
    onError: (e) => toast.error(parseApiError(e, "Could not update survey")),
  });

  if (!id) {
    return <p className="text-sm text-gray-500">Invalid survey.</p>;
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-gray-100 rounded-xl w-1/3" />
        <div className="h-96 bg-gray-100 rounded-[2rem]" />
      </div>
    );
  }

  if (isError || !survey) {
    return (
      <div className="max-w-5xl mx-auto">
        <p className="text-gray-600 font-medium">Survey not found.</p>
        <Link
          href={ROUTES.admin.surveys}
          className="text-brand-primary font-bold mt-2 inline-block"
        >
          Back to list
        </Link>
      </div>
    );
  }

  const defaults = panelSurveyToFormValues(survey);

  const handleSubmit = (values: PanelSurveyFormValues) => {
    const payload = panelSurveyFormToPayload(values);
    delete (payload as { surveyCode?: string }).surveyCode;
    mutation.mutate(payload);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <Link
          href={ROUTES.admin.survey(id)}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to details
        </Link>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Edit survey</h1>
        <p className="text-gray-500 font-medium mt-1">{survey.surveyName}</p>
      </div>

      <PanelSurveyForm
        mode="edit"
        entityId={id}
        defaultValues={defaults}
        providers={providers}
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}
