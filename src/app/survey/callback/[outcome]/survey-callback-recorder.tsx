"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Loader2,
  CircleStop,
  ShieldAlert,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";

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

const BADGE_STYLES: Record<string, string> = {
  complete: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  "quota-full": "bg-amber-50 text-amber-900 ring-amber-200",
  terminate: "bg-orange-50 text-orange-900 ring-orange-200",
  quality: "bg-rose-50 text-rose-900 ring-rose-200",
};

type OutcomeVisual = {
  icon: LucideIcon;
  wrapper: string;
  iconClass: string;
};

/** Per-outcome icon + colors — shown for normal callback landings (not API failures). */
const OUTCOME_VISUALS: Record<string, OutcomeVisual> = {
  complete: {
    icon: CheckCircle2,
    wrapper: "bg-gradient-to-br from-emerald-50 to-teal-50 ring-emerald-200",
    iconClass: "text-emerald-600",
  },
  "quota-full": {
    icon: Users,
    wrapper: "bg-gradient-to-br from-amber-50 to-orange-50 ring-amber-200",
    iconClass: "text-amber-600",
  },
  terminate: {
    icon: CircleStop,
    wrapper: "bg-gradient-to-br from-orange-50 to-rose-50 ring-orange-200",
    iconClass: "text-orange-600",
  },
  quality: {
    icon: ShieldAlert,
    wrapper: "bg-gradient-to-br from-sky-50 to-violet-50 ring-brand-light",
    iconClass: "text-brand-primary",
  },
};

const DEFAULT_OUTCOME_VISUAL: OutcomeVisual = {
  icon: CheckCircle2,
  wrapper: "bg-brand-subtle ring-brand-light",
  iconClass: "text-brand-primary",
};

const FAILURE_VISUAL = {
  wrapper: "bg-gradient-to-br from-rose-50 to-red-50 ring-rose-200",
  iconClass: "text-rose-600",
};

function slugToAccent(slug: string): SurveyCallbackAccent {
  if (slug === "complete") return "complete";
  if (slug === "quota-full") return "quota-full";
  if (slug === "terminate") return "terminate";
  if (slug === "quality") return "quality";
  return "neutral";
}

function OutcomeBadge({ slug, label }: { slug: string; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] ring-1 ring-inset",
        BADGE_STYLES[slug] ?? "bg-brand-subtle text-brand-primary ring-brand-light"
      )}
    >
      <ClipboardList className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
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

function OutcomeIcon({
  slug,
  phase,
  className,
}: {
  slug?: string;
  /** loading = spinner; outcome = slug-specific icon; failure = red X (API/invalid URL only) */
  phase: "loading" | "outcome" | "failure";
  className?: string;
}) {
  const visual = (slug && OUTCOME_VISUALS[slug]) || DEFAULT_OUTCOME_VISUAL;
  const wrapper = cn(
    "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl ring-1 sm:h-24 sm:w-24",
    phase === "failure" ? FAILURE_VISUAL.wrapper : visual.wrapper,
    className
  );

  if (phase === "loading") {
    return (
      <div className={wrapper}>
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary sm:h-11 sm:w-11" />
      </div>
    );
  }

  if (phase === "failure") {
    return (
      <div className={wrapper}>
        <XCircle className={cn("h-11 w-11 sm:h-12 sm:w-12", FAILURE_VISUAL.iconClass)} />
      </div>
    );
  }

  const Icon = visual.icon;
  return (
    <div className={wrapper}>
      <Icon className={cn("h-11 w-11 sm:h-12 sm:w-12", visual.iconClass)} />
    </div>
  );
}

function CallbackActions() {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
      <Link
        href={ROUTES.home}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-primary px-5 text-sm font-bold text-white shadow-lg shadow-brand-primary/25 transition hover:bg-brand-hover"
      >
        Visit InsightMatrix
      </Link>
      <Link
        href={ROUTES.login}
        className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 text-sm font-bold text-brand-accent1 shadow-sm transition hover:border-brand-light hover:bg-brand-subtle/60"
      >
        Sign in
      </Link>
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
        <OutcomeIcon
          slug={cfg.slug}
          phase={status === "loading" ? "loading" : status === "err" ? "failure" : "outcome"}
        />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-primary">
          {cfg.shortLabel}
        </p>
        <h1 className="mt-2 text-xl font-extrabold tracking-tight text-brand-accent1 sm:text-2xl">
          {cfg.headline}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          {message}
        </p>
        <p className="mt-4 rounded-xl border border-brand-subtle bg-brand-subtle/50 px-4 py-3 text-sm leading-relaxed text-brand-accent1/90">
          {cfg.supportiveLine}
        </p>
        <p className="mt-5 flex items-start justify-center gap-2 text-left text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-accent2" aria-hidden />
          <span>{cfg.description}</span>
        </p>
        {status !== "loading" ? <CallbackActions /> : null}
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
          <OutcomeIcon phase="failure" />
          <h1 className="text-xl font-extrabold text-brand-accent1 sm:text-2xl">
            Invalid callback
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">This callback URL is not valid.</p>
          <Link
            href={ROUTES.home}
            className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl bg-brand-primary text-sm font-bold text-white shadow-lg transition hover:bg-brand-hover sm:w-auto sm:min-w-[200px]"
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
          <OutcomeIcon slug={cfg.slug} phase="outcome" />
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-primary">
            {cfg.shortLabel}
          </p>
          <h1 className="mt-2 text-xl font-extrabold text-brand-accent1 sm:text-2xl">
            Could not record
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {MISSING_PID_MESSAGE}
          </p>
          <p className="mt-6 text-[11px] text-muted-foreground sm:text-xs">{cfg.label}</p>
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
          <OutcomeIcon slug={cfg.slug} phase="outcome" />
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-primary">
            {cfg.shortLabel}
          </p>
          <h1 className="mt-2 text-xl font-extrabold tracking-tight text-brand-accent1 sm:text-2xl">
            {cfg.headline}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This redirect was already recorded in your browser session.
          </p>
          <p className="mt-4 text-sm text-brand-accent1/85">{cfg.supportiveLine}</p>
          <CallbackActions />
        </SurveyCallbackCard>
      </SurveyCallbackShell>
    );
  }

  return (
    <CallbackPostRecorder pid={pid} searchParams={searchParams} cfg={cfg} dedupeKey={dedupeKey} />
  );
}
