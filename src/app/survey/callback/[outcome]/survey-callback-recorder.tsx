"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import {
  SurveyCallbackCard,
  SurveyCallbackShell,
  type SurveyCallbackAccent,
} from "@/components/survey/survey-callback-shell";
import { ROUTES } from "@/constants/routes";
import { getCallbackConfig } from "@/constants/survey-callback";
import {
  pickSupplierParticipantRef,
  postPublicRoutingCallback,
  searchParamsToObject,
} from "@/lib/survey-callback-api";
import { cn } from "@/lib/utils";

const MISSING_PID_MESSAGE =
  "Missing partner project id. Suppliers must append the same pid= value as on the survey entry URL (stored as Partner project ID in admin).";

function slugToAccent(slug: string): SurveyCallbackAccent {
  if (slug === "complete") return "complete";
  if (slug === "quota-full") return "quota-full";
  if (slug === "terminate") return "terminate";
  if (slug === "quality") return "quality";
  return "neutral";
}

function OutcomeBadge({ slug, label }: { slug: string; label: string }) {
  const styles: Record<string, string> = {
    complete: "bg-emerald-500/15 text-emerald-100 ring-emerald-400/35",
    "quota-full": "bg-amber-500/15 text-amber-100 ring-amber-400/35",
    terminate: "bg-orange-500/12 text-orange-100 ring-orange-400/30",
    quality: "bg-rose-500/15 text-rose-100 ring-rose-400/35",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] ring-1 ring-inset",
        styles[slug] ?? "bg-white/10 text-white/85 ring-white/15"
      )}
    >
      {label}
    </span>
  );
}

function useSessionDedupeRecorded(dedupeKey: string): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return sessionStorage.getItem(dedupeKey) !== null;
      } catch {
        return false;
      }
    },
    () => false
  );
}

function StatusIcon({
  status,
  className,
}: {
  status: "loading" | "ok" | "err";
  className?: string;
}) {
  if (status === "loading") {
    return (
      <div
        className={cn(
          "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 sm:h-24 sm:w-24",
          className
        )}
      >
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary sm:h-11 sm:w-11" />
      </div>
    );
  }
  if (status === "ok") {
    return (
      <div
        className={cn(
          "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/25 to-teal-600/20 ring-1 ring-emerald-400/35 sm:h-24 sm:w-24",
          className
        )}
      >
        <CheckCircle2 className="h-11 w-11 text-emerald-200 sm:h-12 sm:w-12" />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-900/30 ring-1 ring-rose-400/35 sm:h-24 sm:w-24",
        className
      )}
    >
      <XCircle className="h-11 w-11 text-rose-200 sm:h-12 sm:w-12" />
    </div>
  );
}

function CallbackPostRecorder({
  pid,
  searchParams,
  cfg,
  dedupeKey,
}: {
  pid: string;
  searchParams: ReturnType<typeof useSearchParams>;
  cfg: NonNullable<ReturnType<typeof getCallbackConfig>>;
  dedupeKey: string;
}) {
  const [status, setStatus] = useState<"loading" | "ok" | "err">("loading");
  const [message, setMessage] = useState("Recording your session…");
  const accent = slugToAccent(cfg.slug);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const ref = pickSupplierParticipantRef(searchParams);
        const quotaGroupId =
          searchParams.get("quotaGroupId")?.trim() || searchParams.get("gid")?.trim() || null;

        await postPublicRoutingCallback({
          supplierProjectPid: pid,
          eventType: cfg.eventType,
          quotaGroupId,
          supplierParticipantRef: ref || null,
          meta: { query: searchParamsToObject(searchParams) },
        });

        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem(dedupeKey, "1");
        }
        if (!cancelled) {
          setStatus("ok");
          setMessage("Thank you — your outcome has been recorded. You can close this page.");
        }
      } catch (e) {
        if (!cancelled) {
          setStatus("err");
          setMessage(e instanceof Error ? e.message : "Could not record callback.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [cfg.eventType, dedupeKey, pid, searchParams]);

  return (
    <SurveyCallbackShell
      accent={accent}
      badge={<OutcomeBadge slug={cfg.slug} label={cfg.shortLabel} />}
    >
      <SurveyCallbackCard className="text-center">
        <StatusIcon status={status} />
        <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
          {cfg.shortLabel}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-[15px]">{message}</p>
        <p className="mt-6 text-[11px] leading-relaxed text-white/35 sm:text-xs">
          {cfg.description}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={ROUTES.home}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-white/90"
          >
            InsightMatrix home
          </Link>
          <Link
            href={ROUTES.login}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-bold text-white/90 backdrop-blur-sm transition hover:bg-white/10"
          >
            Sign in
          </Link>
        </div>
      </SurveyCallbackCard>
    </SurveyCallbackShell>
  );
}

export function SurveyCallbackRecorder({ outcome }: { outcome: string }) {
  const searchParams = useSearchParams();
  const cfg = getCallbackConfig(outcome);
  const pid = searchParams.get("pid")?.trim();
  const dedupeKey = `im-routing-cb:${outcome}:${searchParams.toString()}`;
  const alreadyRecorded = useSessionDedupeRecorded(dedupeKey);

  if (!cfg) {
    return (
      <SurveyCallbackShell accent="neutral">
        <SurveyCallbackCard className="text-center">
          <StatusIcon status="err" />
          <h1 className="text-xl font-black text-white sm:text-2xl">Invalid callback</h1>
          <p className="mt-3 text-sm text-white/70">This callback URL is not valid.</p>
          <Link
            href={ROUTES.home}
            className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl bg-white/10 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15 sm:w-auto sm:min-w-[200px]"
          >
            Go to home
          </Link>
        </SurveyCallbackCard>
      </SurveyCallbackShell>
    );
  }

  const accent = slugToAccent(cfg.slug);

  if (!pid) {
    return (
      <SurveyCallbackShell
        accent={accent}
        badge={<OutcomeBadge slug={cfg.slug} label={cfg.shortLabel} />}
      >
        <SurveyCallbackCard className="text-center">
          <StatusIcon status="err" />
          <h1 className="text-xl font-black text-white sm:text-2xl">Could not record</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/70">{MISSING_PID_MESSAGE}</p>
          <p className="mt-6 text-[11px] text-white/40 sm:text-xs">{cfg.label}</p>
        </SurveyCallbackCard>
      </SurveyCallbackShell>
    );
  }

  if (alreadyRecorded) {
    return (
      <SurveyCallbackShell
        accent={accent}
        badge={<OutcomeBadge slug={cfg.slug} label={cfg.shortLabel} />}
      >
        <SurveyCallbackCard className="text-center">
          <StatusIcon status="ok" />
          <h1 className="text-xl font-black text-white sm:text-2xl">{cfg.shortLabel}</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            This redirect was already recorded in your browser session.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={ROUTES.home}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-white/90"
            >
              InsightMatrix home
            </Link>
            <Link
              href={ROUTES.login}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-bold text-white/90 backdrop-blur-sm transition hover:bg-white/10"
            >
              Sign in
            </Link>
          </div>
        </SurveyCallbackCard>
      </SurveyCallbackShell>
    );
  }

  return (
    <CallbackPostRecorder pid={pid} searchParams={searchParams} cfg={cfg} dedupeKey={dedupeKey} />
  );
}
