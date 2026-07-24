"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import {
  SurveyCompanyForm,
  emptySurveyCompanyFormValues,
} from "@/components/admin/survey-company-form";
import { ROUTES } from "@/constants/routes";
import { crmToast } from "@/lib/crm-toast";
import { parseApiError } from "@/services/api/errors";
import { createSurveyCompany, type SurveyCompanyPayload } from "@/services/survey-company";
import { queryKeys } from "@/services/queries";
import type { SurveyCompanyFormValues } from "@/validations";

function toPayload(values: SurveyCompanyFormValues): SurveyCompanyPayload {
  return {
    companyName: values.companyName.trim(),
    companyCode: values.companyCode.trim(),
    contactPersonName: values.contactPersonName.trim() || undefined,
    companyEmail: values.companyEmail.trim() || undefined,
    companyPhone: values.companyPhone.trim() || undefined,
    websiteUrl: values.websiteUrl.trim() || undefined,
    providerType: values.providerType,
    status: values.status,
    notes: values.notes.trim() || undefined,
  };
}

export default function CreateSurveyCompanyPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const continueRef = useRef(false);

  const mutation = useMutation({
    mutationFn: (payload: SurveyCompanyPayload) => createSurveyCompany(payload),
    onSuccess: async (company) => {
      crmToast.saved();
      await qc.invalidateQueries({ queryKey: queryKeys.surveyCompanies.all });
      if (continueRef.current) {
        router.push(ROUTES.admin.companyEdit(company.id));
      } else {
        router.push(ROUTES.admin.company(company.id));
      }
    },
    onError: (error) => toast.error(parseApiError(error, "Could not create company")),
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Link
          href={ROUTES.admin.companies}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to companies
        </Link>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Add survey provider</h1>
        <p className="text-gray-500 font-medium mt-1">
          Register an external survey company or router you receive inventory from.
        </p>
      </div>

      <SurveyCompanyForm
        mode="create"
        defaultValues={emptySurveyCompanyFormValues}
        onSubmit={(values, { continueEditing }) => {
          continueRef.current = continueEditing;
          mutation.mutate(toPayload(values));
        }}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}
