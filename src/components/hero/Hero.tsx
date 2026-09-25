"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Globe, Sparkles } from "lucide-react";
import { HOME_PAGE_DATA } from "@/constants/site-content";

export default function Hero() {
  const { hero } = HOME_PAGE_DATA;

  return (
    <div className="relative bg-gradient-to-br from-brand-deep via-brand-dark to-brand-accent1 overflow-hidden text-white pt-28 pb-20 md:pt-36 md:pb-28 lg:pt-40 lg:pb-32 border-b border-white/10">
      {/* Background Radiance & Lighting Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-brand-primary/20 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-brand-accent2/20 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Hero Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Brand Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-white/10 backdrop-blur-md border border-white/20 text-brand-light mb-6 shadow-md">
              <Sparkles className="w-4 h-4 text-brand-light" />
              <span>{hero.badge}</span>
            </div>

            {/* Main H1 Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] mb-6 drop-shadow">
              {hero.h1}
            </h1>

            {/* Sub Heading */}
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              {hero.subHeading}
            </p>

            {/* Action Buttons in Brand Primary Theme */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-black rounded-full text-white bg-brand-primary hover:bg-brand-hover shadow-xl shadow-brand-primary/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>Request Feasibility Quote</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/panel-book"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-black rounded-full text-white bg-white/10 border border-white/25 hover:bg-white/20 backdrop-blur-md transition-all active:scale-95"
              >
                <Globe className="mr-2 w-4 h-4 text-brand-light" />
                <span>Explore Panel Book</span>
              </Link>
            </div>

            {/* Trust badge strip */}
            <div className="inline-flex items-center gap-3 py-2.5 px-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-slate-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-brand-light shrink-0" />
              <span>9-Stage Quality Controls • 80+ Markets Fieldwork Coverage • ISO Compliant</span>
            </div>
          </div>

          {/* Right Side Showcase */}
          <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
            <div className="relative bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-8 lg:p-10 shadow-2xl">
              <div className="flex items-center justify-between pb-6 border-b border-white/15 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-light animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest text-white/90">
                    Live Global Field Operations
                  </span>
                </div>
                <span className="text-xs font-bold text-brand-light bg-brand-primary/20 border border-brand-primary/30 px-3 py-1 rounded-full">
                  80+ MARKETS
                </span>
              </div>

              {/* Operations Checklist */}
              <div className="space-y-4 mb-8">
                {hero.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/15 transition-all"
                  >
                    <div className="w-8 h-8 rounded-xl bg-brand-primary/30 text-brand-light flex items-center justify-center shrink-0 border border-brand-primary/30">
                      <CheckCircle2 className="w-5 h-5 text-brand-light" />
                    </div>
                    <span className="text-sm md:text-base font-bold text-white tracking-wide">
                      {stat}
                    </span>
                  </div>
                ))}
              </div>

              {/* Metrics Bar */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/15 text-center">
                <div className="p-3.5 rounded-2xl bg-black/20 border border-white/10">
                  <div className="text-2xl font-black text-white">80+</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    Countries
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/20 border border-white/10">
                  <div className="text-2xl font-black text-brand-light">99.8%</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    Data Accuracy
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/20 border border-white/10">
                  <div className="text-2xl font-black text-white">2h</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    Turnaround
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
