"use client";

import { MemberPrescreenForm } from "@/components/dashboard/MemberPrescreenForm";
import type { PrescreenForm } from "@/types/prescreen";

type Props = {
  form: PrescreenForm;
  onSubmit: (answers: Record<string, unknown>) => Promise<void>;
  isSubmitting: boolean;
  submitError?: string | null;
  title?: string;
  subtitle?: string;
};

/** Shared prescreen UI for vendor routing and panel gateway flows */
export function RoutingPrescreenForm({
  form,
  onSubmit,
  isSubmitting,
  submitError,
  title = "Quick profile questions",
  subtitle = "Please answer before continuing to the survey.",
}: Props) {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        {submitError ? (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"
          >
            {submitError}
          </div>
        ) : null}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <MemberPrescreenForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}
