"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { RedirectIfAuthenticated } from "@/components/auth/redirect-if-authenticated";
import { ImxLogo } from "@/components/brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[42%_1fr] bg-white relative">
      <Link
        href="/"
        className="absolute top-5 left-5 z-50 inline-flex items-center gap-1.5 rounded-lg border border-gray-200/80 bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm backdrop-blur-sm transition hover:border-brand-primary/40 hover:text-brand-primary lg:border-white/20 lg:bg-white/10 lg:text-white lg:hover:bg-white/15 lg:hover:text-white"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Home
      </Link>

      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-deep via-brand-accent1 to-brand-primary p-10 xl:p-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-brand-accent2/25 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-brand-light/20 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="relative z-10 pt-8">
          <ImxLogo href="/" size="md" surface="dark" />
        </div>

        <div className="relative z-10 max-w-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55 mb-3">
            InsightMatrix
          </p>
          <h2 className="text-3xl font-bold text-white leading-tight tracking-tight">
            Research operations, built for clarity
          </h2>
          <p className="mt-4 text-sm text-white/75 leading-relaxed">
            Secure access for panel members, partners, and administrators managing live studies.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs text-white/60">
          <ShieldCheck className="h-4 w-4 text-brand-light shrink-0" />
          Encrypted sessions · Role-based access
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-16 sm:px-8 lg:py-10 bg-[#f7f9fc]">
        <div className="w-full max-w-[400px]">
          <div className="mb-6 flex justify-center lg:hidden">
            <ImxLogo href="/" size="sm" surface="light" />
          </div>
          <RedirectIfAuthenticated>{children}</RedirectIfAuthenticated>
        </div>
      </div>
    </div>
  );
}
