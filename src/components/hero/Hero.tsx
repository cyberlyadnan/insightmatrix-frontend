"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageSquare, ShieldCheck } from "lucide-react";
import { HOME_PAGE_DATA } from "@/constants/site-content";

export default function Hero() {
  const { hero } = HOME_PAGE_DATA;

  return (
    <div className="relative bg-gradient-to-r from-brand-accent1 via-brand-primary to-brand-accent2 overflow-hidden text-white">
      {/* Abstract Background Shapes to add texture */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-white/10 blur-3xl mix-blend-overlay" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-accent1/20 blur-3xl mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="pt-36 pb-20 md:pt-40 md:pb-28 lg:pt-44 lg:pb-32 flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-bold bg-white/10 backdrop-blur-md border border-white/20 shadow-md text-white mb-6">
              <span>{hero.badge}</span>
            </div>

            {/* Main Heading (H1) */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
              {hero.h1}
            </h1>

            {/* Sub Heading */}
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium drop-shadow-sm">
              {hero.subHeading}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Link
                href={hero.primaryCta.href}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-black rounded-full text-brand-primary bg-white hover:bg-gray-50 shadow-xl shadow-black/10 transition-all hover:-translate-y-0.5 hover:shadow-2xl active:scale-95"
              >
                {hero.primaryCta.label}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href={hero.secondaryCta.href}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-black rounded-full text-white bg-white/10 border border-white/30 hover:bg-white/20 backdrop-blur-md transition-all active:scale-95"
              >
                <MessageSquare className="mr-2 w-4 h-4" />
                {hero.secondaryCta.label}
              </Link>
            </div>

            {/* Trust badge */}
            <div className="inline-flex items-center gap-3 py-2 px-4 rounded-xl bg-black/15 backdrop-blur-md border border-white/10 text-white/90 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-green-300" />
              <span>Rigorous Quality Controls & Worldwide Fieldwork Coverage</span>
            </div>
          </div>

          {/* Right Side Statistics & Highlights */}
          <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
            <div className="relative bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/25 p-8 lg:p-10 shadow-2xl shadow-black/20">
              <div className="flex items-center justify-between pb-6 border-b border-white/15 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest text-white/90">
                    Live Fieldwork Operations
                  </span>
                </div>
                <span className="text-xs font-bold text-white/70 bg-white/10 px-3 py-1 rounded-full">
                  Global Panel
                </span>
              </div>

              {/* Statistics Checklist */}
              <div className="space-y-4 mb-8">
                {hero.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/15 transition-all"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    </div>
                    <span className="text-sm md:text-base font-bold text-white tracking-wide">
                      {stat}
                    </span>
                  </div>
                ))}
              </div>

              {/* Metric Highlights Grid */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/15 text-center">
                <div className="p-3 rounded-2xl bg-black/10">
                  <div className="text-xl md:text-2xl font-black text-white">80+</div>
                  <div className="text-[10px] font-bold text-white/75 uppercase tracking-wider mt-1">
                    Markets
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-black/10">
                  <div className="text-xl md:text-2xl font-black text-white">99.8%</div>
                  <div className="text-[10px] font-bold text-white/75 uppercase tracking-wider mt-1">
                    Quality Score
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-black/10">
                  <div className="text-xl md:text-2xl font-black text-white">24/7</div>
                  <div className="text-[10px] font-bold text-white/75 uppercase tracking-wider mt-1">
                    Field PM
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
