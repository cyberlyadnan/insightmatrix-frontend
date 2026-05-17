"use client";

import { type ReactNode, useEffect } from "react";
import { BarChart3, Globe2, ShieldCheck, Sparkles, Users } from "lucide-react";

import { ImxLogo } from "@/components/brand";
import { cn } from "@/lib/utils";

export type SurveyCallbackAccent = "complete" | "quota-full" | "terminate" | "quality" | "neutral";

const ACCENT_ORBS: Record<SurveyCallbackAccent, { a: string; b: string; ring: string }> = {
  complete: {
    a: "from-emerald-200/50 via-teal-100/40",
    b: "from-cyan-100/60 to-transparent",
    ring: "ring-emerald-200/80",
  },
  "quota-full": {
    a: "from-amber-200/50 via-orange-100/40",
    b: "from-yellow-100/50 to-transparent",
    ring: "ring-amber-200/80",
  },
  terminate: {
    a: "from-orange-200/45 via-rose-100/35",
    b: "from-rose-100/45 to-transparent",
    ring: "ring-orange-200/80",
  },
  quality: {
    a: "from-brand-light/45 via-sky-100/40",
    b: "from-violet-100/40 to-transparent",
    ring: "ring-brand-light/90",
  },
  neutral: {
    a: "from-brand-light/40 via-brand-subtle",
    b: "from-sky-100/50 to-transparent",
    ring: "ring-brand-light/80",
  },
};

const INSIGHT_HIGHLIGHTS = [
  {
    icon: Users,
    title: "Real people, real opinions",
    description: "A global panel sharing lived experiences researchers can trust.",
  },
  {
    icon: BarChart3,
    title: "Accurate, actionable data",
    description: "Insights delivered with rigor so your strategy moves with confidence.",
  },
  {
    icon: ShieldCheck,
    title: "Secure routing",
    description: "Encrypted supplier callbacks keep every session traceable and compliant.",
  },
] as const;

const TRUST_STATS = [
  { value: "2M+", label: "Panelists" },
  { value: "40+", label: "Markets" },
  { value: "24/7", label: "Fielding" },
] as const;

function CallbackInsightPanel({
  accent,
  className,
}: {
  accent: SurveyCallbackAccent;
  className?: string;
}) {
  const orbs = ACCENT_ORBS[accent];

  return (
    <aside className={cn("flex flex-col gap-8 lg:gap-10", className)}>
      <div className="space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-light bg-brand-subtle/90 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-primary">
          <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
          InsightMatrix Global
        </span>
        <h2 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-brand-accent1 sm:text-4xl lg:text-[2.35rem]">
          Insight from{" "}
          <span className="bg-gradient-to-r from-brand-primary via-brand-accent2 to-brand-accent1 bg-clip-text text-transparent">
            real people
          </span>
          , delivered in real time
        </h2>
        <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-[17px]">
          InsightMatrix connects brands and researchers with engaged panelists worldwide — turning
          honest feedback into data you can act on.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:gap-3.5">
        {INSIGHT_HIGHLIGHTS.map((item) => (
          <li
            key={item.title}
            className={cn(
              "flex gap-3.5 rounded-2xl border border-border/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition hover:border-brand-light hover:shadow-md",
              orbs.ring
            )}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent2 text-white shadow-md shadow-brand-primary/20">
              <item.icon className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-bold text-brand-accent1">{item.title}</p>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border bg-white/90 p-4 shadow-sm sm:gap-4 sm:p-5">
        {TRUST_STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-xl font-black tracking-tight text-brand-primary sm:text-2xl">
              {stat.value}
            </p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <p className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
        <Globe2 className="h-4 w-4 shrink-0 text-brand-accent2" aria-hidden />
        Award-winning research experts · AI-augmented fieldwork · Enterprise-grade quality
      </p>
    </aside>
  );
}

export function SurveyCallbackShell({
  children,
  accent = "neutral",
  badge,
}: {
  children: ReactNode;
  accent?: SurveyCallbackAccent;
  badge?: ReactNode;
}) {
  const orbs = ACCENT_ORBS[accent];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[200] overflow-y-auto overscroll-y-contain bg-surface text-foreground"
      role="presentation"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,#f7faff_0%,#ffffff_42%,#eef5ff_100%)]"
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute -left-1/4 top-0 h-[min(85vw,520px)] w-[min(85vw,520px)] rounded-full bg-gradient-to-br blur-3xl",
          orbs.a
        )}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute -right-1/4 bottom-0 h-[min(75vw,460px)] w-[min(75vw,460px)] rounded-full bg-gradient-to-tl blur-3xl",
          orbs.b
        )}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_1px_1px,#0b4fd9_0.5px,transparent_0)] [background-size:28px_28px]"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <header className="border-b border-border/80 bg-white/70 px-4 py-4 backdrop-blur-xl sm:px-8 sm:py-5">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex min-w-0 flex-col gap-2">
              <ImxLogo href="/" size="lg" surface="light" priority />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Panel routing · secure supplier callback
              </p>
            </div>
            {badge ? (
              <div className="flex shrink-0 justify-start sm:justify-end">{badge}</div>
            ) : null}
          </div>
        </header>

        <main className="flex flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 lg:py-14">
          <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
            <CallbackInsightPanel accent={accent} className="order-2 lg:order-1" />
            <div className="order-1 w-full lg:order-2 lg:max-w-xl lg:justify-self-end">
              {children}
            </div>
          </div>
        </main>

        <footer className="border-t border-border/80 bg-white/60 px-4 py-5 text-center backdrop-blur-sm sm:px-8">
          <p className="text-[11px] font-medium leading-relaxed text-muted-foreground sm:text-xs">
            © {new Date().getFullYear()} InsightMatrix Global · Secure supplier callback endpoint
          </p>
        </footer>
      </div>
    </div>
  );
}

export function SurveyCallbackCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-white p-6 shadow-xl shadow-brand-primary/[0.06] ring-1 ring-brand-subtle/80 sm:rounded-[2rem] sm:p-8 md:p-10",
        className
      )}
    >
      {children}
    </div>
  );
}
