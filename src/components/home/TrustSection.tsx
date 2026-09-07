"use client";

import { HOME_PAGE_DATA } from "@/constants/site-content";
import { Award, Globe, ShieldCheck, Users } from "lucide-react";

export default function TrustSection() {
  const { trustSection } = HOME_PAGE_DATA;

  return (
    <section className="py-20 bg-white border-b border-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-black uppercase tracking-widest mb-4">
            Global Reliability
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-6">
            {trustSection.heading}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            {trustSection.text}
          </p>
        </div>

        {/* Global Credentials Badges */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "B2B & B2C Reach", desc: "Decision Makers & Consumers", icon: Users },
            { label: "Healthcare Panels", desc: "HCPs, KOLs & Patients", icon: ShieldCheck },
            { label: "Worldwide Fieldwork", desc: "Multi-Country Studies", icon: Globe },
            { label: "Rigorous QA", desc: "ISO-Grade Data Standards", icon: Award },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-brand-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand-primary/10 group hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-subtle shadow-sm flex items-center justify-center mx-auto mb-5 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                  <Icon className="w-7 h-7" />
                </div>
                <h4 className="text-base font-black text-gray-900 mb-1.5">{item.label}</h4>
                <p className="text-xs font-semibold text-slate-500">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
