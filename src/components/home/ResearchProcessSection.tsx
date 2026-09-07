"use client";

import { HOME_PAGE_DATA } from "@/constants/site-content";
import {
  MessageSquare,
  FileSpreadsheet,
  PlayCircle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

const stepIcons = [MessageSquare, FileSpreadsheet, PlayCircle, ShieldCheck, CheckCircle2];

export default function ResearchProcessSection() {
  const { researchProcess } = HOME_PAGE_DATA;

  return (
    <section className="py-24 bg-[#0B0F19] text-white relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-primary/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-accent2/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/20 border border-brand-primary/30 text-brand-primary text-xs font-black uppercase tracking-widest mb-4">
            Structured Execution
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6">
            {researchProcess.heading}
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed font-medium">
            From initial consultation to final data validation, our proven 5-stage lifecycle ensures
            flawless data integrity and actionable business results.
          </p>
        </div>

        {/* 5 Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {researchProcess.steps.map((s, idx) => {
            const Icon = stepIcons[idx % stepIcons.length];
            return (
              <div
                key={idx}
                className="relative bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-brand-primary/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-black uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
                      {s.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                      <Icon className="w-5 h-5 text-brand-light" />
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-white mb-3 tracking-tight">{s.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed font-medium">
                    {s.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Stage {idx + 1} of 5
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
