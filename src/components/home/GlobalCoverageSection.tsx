"use client";

import { HOME_PAGE_DATA } from "@/constants/site-content";
import { Globe, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function GlobalCoverageSection() {
  const { globalCoverage } = HOME_PAGE_DATA;

  const regionDetails = [
    { name: "North America", markets: "USA, Canada, Mexico", coverage: "35M+ Panel Reach" },
    {
      name: "Europe",
      markets: "UK, Germany, France, Italy, Spain, Nordics",
      coverage: "40M+ Panel Reach",
    },
    {
      name: "Asia-Pacific",
      markets: "India, Japan, Australia, Singapore, SE Asia",
      coverage: "50M+ Panel Reach",
    },
    {
      name: "Middle East",
      markets: "UAE, Saudi Arabia, Qatar, Egypt",
      coverage: "10M+ Panel Reach",
    },
    {
      name: "Latin America",
      markets: "Brazil, Colombia, Argentina, Chile",
      coverage: "15M+ Panel Reach",
    },
    { name: "Africa", markets: "South Africa, Nigeria, Kenya, Ghana", coverage: "8M+ Panel Reach" },
  ];

  return (
    <section className="py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-black uppercase tracking-widest mb-5">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
              <span>Worldwide Fieldwork</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
              {globalCoverage.heading}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium mb-8">
              {globalCoverage.text}
            </p>

            <div className="p-6 sm:p-7 rounded-[2rem] bg-[#f7faff] border border-blue-100/60 mb-8 space-y-3.5 shadow-sm">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0" />
                <span className="text-sm font-bold text-gray-800">
                  Native language translation & localization
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0" />
                <span className="text-sm font-bold text-gray-800">
                  Multi-market synchronized fielding
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0" />
                <span className="text-sm font-bold text-gray-800">
                  Local compliance & privacy standards
                </span>
              </div>
            </div>

            <Link
              href="/panel-book"
              className="inline-flex items-center gap-2 text-sm font-black text-brand-primary hover:text-brand-hover hover:gap-3 transition-all"
            >
              Explore Global Panel Book <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right 6 Regions Visual Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {regionDetails.map((region, idx) => (
              <div
                key={idx}
                className="group p-7 rounded-[2rem] bg-white border border-slate-100 hover:border-brand-primary/40 hover:shadow-xl hover:shadow-brand-primary/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-subtle text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                    <Globe className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-primary bg-brand-subtle border border-brand-light/30 px-3 py-1 rounded-full">
                    {region.coverage}
                  </span>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1 group-hover:text-brand-primary transition-colors">
                  {region.name}
                </h3>
                <p className="text-xs font-semibold text-slate-500">{region.markets}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
