"use client";

import { HOME_PAGE_DATA } from "@/constants/site-content";
import {
  Fingerprint,
  MapPin,
  CopyX,
  Gauge,
  Eye,
  FileCheck,
  ShieldAlert,
  UserCheck,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const qualityIcons = [
  Fingerprint,
  MapPin,
  CopyX,
  Gauge,
  Eye,
  FileCheck,
  ShieldAlert,
  UserCheck,
  Activity,
];

export default function QualitySection() {
  const { qualitySection } = HOME_PAGE_DATA;

  return (
    <section className="py-28 bg-gradient-to-b from-white via-[#f4f8ff]/50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-black uppercase tracking-widest mb-5">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            <span>Zero-Tolerance Data Fraud</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6">
            {qualitySection.heading}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            {qualitySection.text} Every participant is screened, validated, and monitored through
            our proprietary 9-point verification stack.
          </p>
        </div>

        {/* 9 Quality Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {qualitySection.controls.map((control, idx) => {
            const Icon = qualityIcons[idx % qualityIcons.length];
            return (
              <div
                key={idx}
                className="bg-white border border-slate-100 rounded-[2rem] p-7 shadow-sm hover:shadow-xl hover:shadow-brand-primary/10 hover:border-brand-primary/30 transition-all duration-300 flex items-center gap-5 group hover:-translate-y-1"
              >
                <div className="w-13 h-13 rounded-2xl bg-brand-subtle text-brand-primary flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm border border-brand-light/30">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-black text-gray-900 group-hover:text-brand-primary transition-colors">
                    {control}
                  </h4>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Continuous automated check
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quality Guarantee Banner */}
        <div className="mt-20 p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-r from-brand-dark via-brand-accent1 to-brand-dark text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-brand-dark/20">
          <div className="flex items-center gap-5 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                99.8% Certified Clean Data Guarantee
              </h3>
              <p className="text-sm text-slate-300 font-medium mt-1">
                Invalid or fraudulent completes are replaced immediately at zero cost.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 text-xs font-black uppercase tracking-wider text-white border border-white/20 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ISO Quality Aligned
          </div>
        </div>
      </div>
    </section>
  );
}
