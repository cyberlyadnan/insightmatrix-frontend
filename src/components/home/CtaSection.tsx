"use client";

import { HOME_PAGE_DATA } from "@/constants/site-content";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Mail } from "lucide-react";

export default function CtaSection() {
  const { ctaSection } = HOME_PAGE_DATA;

  return (
    <section className="py-24 bg-gradient-to-r from-brand-accent1 via-brand-primary to-brand-accent2 text-white relative overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-accent1/25 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-widest text-white mb-6">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Better Insights. Smarter Decisions.</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6 drop-shadow-sm">
            {ctaSection.heading}
          </h2>

          <p className="text-lg sm:text-xl text-white/90 leading-relaxed font-medium mb-10 max-w-2xl mx-auto drop-shadow-sm">
            {ctaSection.text}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={ctaSection.buttonHref}
              className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 text-base font-black rounded-full text-brand-primary bg-white hover:bg-gray-50 shadow-2xl shadow-black/20 transition-all hover:-translate-y-0.5 hover:scale-105 active:scale-95"
            >
              {ctaSection.buttonText}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-5 text-base font-black rounded-full text-white bg-white/10 border border-white/30 hover:bg-white/20 backdrop-blur-md transition-all active:scale-95"
            >
              <Mail className="mr-2 w-5 h-5" />
              Talk to Our Experts
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 text-xs text-white/80 font-bold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-300" /> Fast Feasibility & Quotes
            </div>
            <span>•</span>
            <div>24/7 Dedicated PM</div>
            <span>•</span>
            <div>Multi-Country Turnkey Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
