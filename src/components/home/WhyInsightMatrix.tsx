"use client";

import { HOME_PAGE_DATA } from "@/constants/site-content";
import {
  Users,
  Globe,
  ShieldCheck,
  Zap,
  Sliders,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const iconMap = [Users, Globe, ShieldCheck, Zap, Sliders, MessageSquare];

export default function WhyInsightMatrix() {
  const { whyInsightMatrix } = HOME_PAGE_DATA;

  return (
    <section className="py-28 bg-gradient-to-b from-white via-[#f4f8ff]/60 to-white relative overflow-hidden">
      {/* Radiant Background Accents */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-brand-accent2/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-black uppercase tracking-widest mb-5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            <span>The InsightMatrix Difference</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
            {whyInsightMatrix.heading}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            {whyInsightMatrix.sub}
          </p>
        </div>

        {/* 6 Key Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyInsightMatrix.cards.map((card, idx) => {
            const Icon = iconMap[idx % iconMap.length];
            return (
              <div
                key={card.id || idx}
                className="group relative bg-white border border-slate-100 rounded-[2rem] p-8 sm:p-9 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-primary/10 hover:border-brand-primary/30 flex flex-col justify-between hover:-translate-y-1.5"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-brand-subtle text-brand-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 shadow-sm border border-brand-light/30">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight group-hover:text-brand-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm font-medium">
                    {card.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-brand-primary transition-colors">
                  <span>Advantage 0{idx + 1}</span>
                  <span className="w-2 h-2 rounded-full bg-brand-primary/20 group-hover:bg-brand-primary transition-colors" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="mt-16 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-brand-primary hover:bg-brand-hover text-white font-black text-sm shadow-xl shadow-brand-primary/25 hover:shadow-2xl hover:shadow-brand-primary/30 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            Start Your Research Project <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
