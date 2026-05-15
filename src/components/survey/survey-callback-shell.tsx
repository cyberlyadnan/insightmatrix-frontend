"use client";

import { type ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";

export type SurveyCallbackAccent = "complete" | "quota-full" | "terminate" | "quality" | "neutral";

const ACCENT_ORBS: Record<SurveyCallbackAccent, { a: string; b: string }> = {
  complete: {
    a: "from-emerald-400/25 via-teal-500/10",
    b: "from-cyan-400/15 to-transparent",
  },
  "quota-full": {
    a: "from-amber-400/25 via-orange-500/10",
    b: "from-yellow-300/10 to-transparent",
  },
  terminate: {
    a: "from-orange-400/20 via-rose-500/10",
    b: "from-rose-400/10 to-transparent",
  },
  quality: {
    a: "from-rose-400/25 via-fuchsia-500/10",
    b: "from-pink-400/10 to-transparent",
  },
  neutral: {
    a: "from-brand-primary/20 via-brand-accent2/10",
    b: "from-brand-light/10 to-transparent",
  },
};

function InsightMatrixLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent2 shadow-lg shadow-brand-primary/35",
        className
      )}
      aria-hidden
    >
      <svg viewBox="0 0 32 32" className="h-6 w-6 text-white" fill="currentColor">
        <rect x="4" y="4" width="10" height="10" rx="2" className="opacity-95" />
        <rect x="18" y="4" width="10" height="10" rx="2" className="opacity-75" />
        <rect x="4" y="18" width="10" height="10" rx="2" className="opacity-75" />
        <rect x="18" y="18" width="10" height="10" rx="2" className="opacity-95" />
      </svg>
    </div>
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
      className="fixed inset-0 z-[200] overflow-y-auto overscroll-y-contain bg-slate-950 text-slate-100"
      role="presentation"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,#0f172a_0%,#1e1b4b_45%,#0f172a_100%)]"
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute -left-1/4 top-0 h-[min(80vw,480px)] w-[min(80vw,480px)] rounded-full bg-gradient-to-br blur-3xl",
          orbs.a
        )}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute -right-1/4 bottom-0 h-[min(70vw,420px)] w-[min(70vw,420px)] rounded-full bg-gradient-to-tl blur-3xl",
          orbs.b
        )}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:48px_48px]"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <header className="border-b border-white/5 bg-slate-950/40 px-4 py-5 backdrop-blur-xl sm:px-8 sm:py-6">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <InsightMatrixLogo />
              <div className="min-w-0">
                <p className="text-lg font-black tracking-tight text-white sm:text-xl">
                  InsightMatrix
                  <span className="text-base font-normal text-white/70 sm:text-lg">®</span>
                </p>
                <p className="truncate text-xs font-semibold uppercase tracking-[0.2em] text-white/45 sm:text-[11px]">
                  InsightMatrix Global · Panel routing
                </p>
              </div>
            </div>
            {badge ? (
              <div className="flex shrink-0 justify-start sm:justify-end">{badge}</div>
            ) : null}
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
          <div className="w-full max-w-lg">{children}</div>
        </main>

        <footer className="border-t border-white/5 px-4 py-6 text-center sm:px-8">
          <p className="text-[11px] font-medium leading-relaxed text-white/40 sm:text-xs">
            © {new Date().getFullYear()} InsightMatrix Global. Secure supplier callback endpoint.
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
        "rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:rounded-[2rem] sm:p-8 md:p-10",
        className
      )}
    >
      {children}
    </div>
  );
}
