"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { MemberPrescreenForm } from "@/components/dashboard/MemberPrescreenForm";
import { ROUTES } from "@/constants/routes";
import { parseApiError } from "@/services/api/errors";
import {
  getPanelPrescreenBundle,
  submitPanelPrescreenAnswers,
} from "@/services/panel-prescreen-api";
import { queryKeys } from "@/services/queries";
import { useAuthStore } from "@/store/authStore";

export default function DashboardPrescreenPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  /** Wall-clock time on the form (for analytics); set when the questionnaire first renders */
  const formStartedAtMsRef = useRef<number | null>(null);

  const { data: bundle, isLoading } = useQuery({
    queryKey: queryKeys.panelPrescreen.bundle,
    queryFn: getPanelPrescreenBundle,
  });

  useEffect(() => {
    if (!bundle) return;
    if (bundle.notConfigured) return;
    if (!bundle.needsCompletion) {
      router.replace(ROUTES.dashboard.root);
    }
  }, [bundle, router]);

  useEffect(() => {
    if (bundle?.needsCompletion && bundle.form && formStartedAtMsRef.current === null) {
      formStartedAtMsRef.current = Date.now();
    }
  }, [bundle?.needsCompletion, bundle?.form]);

  const submitMutation = useMutation({
    mutationFn: async (answers: Record<string, unknown>) => {
      const durationMs =
        formStartedAtMsRef.current != null ? Date.now() - formStartedAtMsRef.current : undefined;
      return submitPanelPrescreenAnswers(answers, durationMs);
    },
    onSuccess: async (user) => {
      setUser(user);
      await qc.invalidateQueries({ queryKey: queryKeys.auth.profile });
      await qc.invalidateQueries({ queryKey: queryKeys.panelPrescreen.bundle });
      await qc.invalidateQueries({ queryKey: queryKeys.memberPanel.available });
      await qc.invalidateQueries({ queryKey: queryKeys.memberPanel.wallet });
      toast.success("Profile saved — you can explore surveys now.");
      router.replace(ROUTES.dashboard.surveys);
    },
    onError: (e) => toast.error(parseApiError(e, "Could not save prescreen")),
  });

  if (isLoading || !bundle) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
        <p className="text-sm text-gray-500">Loading profile questionnaire…</p>
      </div>
    );
  }

  if (bundle.notConfigured) {
    return (
      <div className="max-w-lg mx-auto rounded-3xl border border-amber-100 bg-amber-50/80 p-8 text-center">
        <ClipboardCheck className="w-12 h-12 text-amber-600 mx-auto mb-4" />
        <h1 className="text-xl font-black text-gray-900 mb-2">Prescreen not ready</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          An administrator must publish the required member profile prescreen (Admin →
          Prescreening). Until then, survey matching profiles are unavailable.
        </p>
      </div>
    );
  }

  if (!bundle.needsCompletion || !bundle.form) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
          {bundle.form.title}
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">{bundle.form.description}</p>
        <p className="text-xs font-bold uppercase tracking-widest text-brand-primary">
          Required once — helps match you to relevant surveys
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-sm">
        <MemberPrescreenForm
          form={bundle.form}
          isSubmitting={submitMutation.isPending}
          onSubmit={async (answers) => {
            await submitMutation.mutateAsync(answers);
          }}
        />
      </div>
    </div>
  );
}
