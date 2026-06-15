"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import {
  SurveyCompanyForm,
  surveyCompanyToFormValues,
} from "@/components/admin/survey-company-form";
import { ROUTES } from "@/constants/routes";
import { parseApiError } from "@/services/api/errors";
import {
  getSurveyCompany,
  updateSurveyCompany,
  type SurveyCompanyPayload,
} from "@/services/survey-company";
import { queryKeys } from "@/services/queries";
import type { SurveyCompanyFormValues } from "@/validations";

function toUpdatePayload(values: SurveyCompanyFormValues): Partial<SurveyCompanyPayload> {
  return {
    companyName: values.companyName.trim(),
    contactPersonName: values.contactPersonName.trim() || undefined,
    companyEmail: values.companyEmail.trim() || undefined,
    companyPhone: values.companyPhone.trim() || undefined,
    websiteUrl: values.websiteUrl.trim() || undefined,
    providerType: values.providerType,
    status: values.status,
    notes: values.notes.trim() || undefined,
  };
}

export default function EditSurveyCompanyPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const router = useRouter();
  const qc = useQueryClient();

  const {
    data: company,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.surveyCompanies.detail(id),
    queryFn: () => getSurveyCompany(id),
    enabled: Boolean(id),
  });

  const mutation = useMutation({
    mutationFn: (payload: Partial<SurveyCompanyPayload>) => updateSurveyCompany(id, payload),
    onSuccess: async () => {
      toast.success("Company updated");
      await qc.invalidateQueries({ queryKey: queryKeys.surveyCompanies.all });
      router.push(ROUTES.admin.companies);
    },
    onError: (error) => toast.error(parseApiError(error, "Could not update company")),
  });

  if (!id) {
    return <p className="text-sm text-gray-500">Invalid company.</p>;
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-gray-100 rounded-xl w-1/3" />
        <div className="h-40 bg-gray-100 rounded-[2rem]" />
        <div className="h-40 bg-gray-100 rounded-[2rem]" />
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-gray-600 font-medium">Company not found.</p>
        <Link
          href={ROUTES.admin.companies}
          className="text-brand-primary font-bold mt-2 inline-block"
        >
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Link
          href={ROUTES.admin.company(id)}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to details
        </Link>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Edit company</h1>
        <p className="text-gray-500 font-medium mt-1">{company.companyName}</p>
      </div>

      <SurveyCompanyForm
        mode="edit"
        entityId={id}
        defaultValues={surveyCompanyToFormValues(company)}
        onSubmit={(values) => mutation.mutate(toUpdatePayload(values))}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}
