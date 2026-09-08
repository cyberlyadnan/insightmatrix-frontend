"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ClipboardCheck,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

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
  const formStartedAtMsRef = useRef<number | null>(null);

  const { data: bundle, isLoading } = useQuery({
    queryKey: queryKeys.panelPrescreen.bundle,
    queryFn: getPanelPrescreenBundle,
  });

  useEffect(() => {
    if (formStartedAtMsRef.current === null) {
      formStartedAtMsRef.current = Date.now();
    }
  }, []);

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
      toast.success("Profile prescreen saved successfully!");
      router.push(ROUTES.dashboard.surveys);
    },
    onError: (e) => toast.error(parseApiError(e, "Could not save prescreen")),
  });

  if (isLoading || !bundle) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
        <p className="text-xs font-bold text-gray-500">Loading profile questionnaire…</p>
      </div>
    );
  }

  if (bundle.notConfigured) {
    return (
      <div className="max-w-md mx-auto rounded-2xl border border-amber-200 bg-amber-50/80 p-6 text-center space-y-3">
        <ClipboardCheck className="w-10 h-10 text-amber-600 mx-auto" />
        <h1 className="text-base font-black text-gray-900">Prescreen Not Configured</h1>
        <p className="text-xs text-gray-600 leading-relaxed">
          The administrator has not published a required panel prescreen yet. All matched research
          opportunities are open directly.
        </p>
        <Link
          href={ROUTES.dashboard.surveys}
          className="inline-flex px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold"
        >
          Browse Surveys
        </Link>
      </div>
    );
  }

  if (!bundle.form) {
    return (
      <div className="max-w-md mx-auto rounded-2xl border border-gray-100 bg-white p-6 text-center space-y-3 shadow-sm">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
        <h1 className="text-base font-black text-gray-900">Profile Verified</h1>
        <p className="text-xs text-gray-500 leading-relaxed">
          Your profile prescreen is active and verified.
        </p>
        <Link
          href={ROUTES.dashboard.surveys}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold"
        >
          <span>Explore Surveys</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  const isCompleted = !bundle.needsCompletion;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-brand-subtle text-brand-primary flex items-center justify-center font-bold">
            <ShieldCheck size={14} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">
            Demographic Verification
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          {bundle.form.title || "Profile Prescreen"}
        </h1>
        <p className="text-xs text-gray-500 font-medium leading-relaxed">
          {bundle.form.description ||
            "Answer demographic questions to qualify for relevant research studies and earn points upon completion."}
        </p>
      </div>

      {/* Status Notice */}
      {isCompleted ? (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Lock size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-emerald-950">
                Demographic Responses Verified & Locked
              </p>
              <p className="text-[11px] text-emerald-800 font-medium truncate">
                Your profile answers are locked for research matching integrity.
              </p>
            </div>
          </div>
          <Link
            href={ROUTES.dashboard.surveys}
            className="shrink-0 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold inline-flex items-center gap-1 shadow-xs"
          >
            <span>Surveys</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="text-xs font-black text-amber-950">Complete your profile prescreen</p>
            <p className="text-[11px] text-amber-800 font-medium">
              Fill these demographics once to unlock high-incentive matched research studies.
            </p>
          </div>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-7 shadow-xs">
        <MemberPrescreenForm
          key={`${bundle.form.id}-${isCompleted ? "locked" : "active"}`}
          form={bundle.form}
          initialAnswers={bundle.existingAnswers}
          readOnly={isCompleted}
          isSubmitting={submitMutation.isPending}
          onSubmit={async (answers) => {
            await submitMutation.mutateAsync(answers);
          }}
        />
      </div>
    </div>
  );
}
