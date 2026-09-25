"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, TrendingUp, Sparkles, Flame } from "lucide-react";

const INSIGHTS_DATA = [
  {
    id: "brands-2026",
    category: "Brand Index",
    title: "Global Most Recommended Brands 2026 Benchmark",
    badge: "FEATURED REPORT",
    metric: "+18.4% YoY",
    metricLabel: "Brand Affinity Growth",
    description:
      "Multi-market consumer research analyzing top FMCG, Tech, and Automotive brands across 80+ international regions.",
    tag: "FMCG & Consumer",
    gradient: "from-brand-accent1 via-brand-primary to-brand-accent2",
    link: "/panel-book",
  },
  {
    id: "healthcare-kol",
    category: "Healthcare",
    title: "Physician & Specialist Prescribing Insights 2026",
    badge: "LIVE PANEL DATA",
    metric: "94.8% Field Precision",
    metricLabel: "Verified KOL Responses",
    description:
      "In-depth quantitative and qualitative analysis targeting verified oncologists, cardiologists, and hospital decision-makers.",
    tag: "Pharma & MedTech",
    gradient: "from-brand-dark via-brand-accent1 to-brand-primary",
    link: "/services/healthcare-market-research",
  },
  {
    id: "b2b-saas",
    category: "B2B Tech",
    title: "Enterprise SaaS & Cyber Security Procurement Barometer",
    badge: "DECISION MAKERS",
    metric: "1,200+ Vetted C-Suite",
    metricLabel: "IT Directors Surveyed",
    description:
      "Understanding enterprise budget allocation, software renewal cycles, and cloud migration priorities across North America & Europe.",
    tag: "Enterprise IT",
    gradient: "from-blue-900 via-indigo-900 to-brand-accent1",
    link: "/services/b2b-market-research",
  },
  {
    id: "consumer-behavior",
    category: "Consumer Insights",
    title: "Inflation & E-Commerce Shopping Habits Index",
    badge: "GLOBAL BAROMETER",
    metric: "100,000+ Sample",
    metricLabel: "Active Respondents",
    description:
      "Tracking shifts in retail spending, buy-now-pay-later adoption, and online channel loyalty across APAC & LATAM.",
    tag: "Retail & E-Commerce",
    gradient: "from-slate-900 via-brand-dark to-blue-950",
    link: "/services/b2c-market-research",
  },
];

export default function TrendingInsightsSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Brand Index", "Healthcare", "B2B Tech", "Consumer Insights"];

  const filtered = INSIGHTS_DATA.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  );

  return (
    <section className="py-24 bg-brand-dark text-white relative overflow-hidden border-t border-b border-white/10">
      {/* Background Radiance */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-primary/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-brand-accent2/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/20 border border-brand-primary/30 text-brand-light text-xs font-black uppercase tracking-widest mb-4">
              <Flame className="w-3.5 h-3.5 text-brand-light animate-bounce" />
              <span>Public Research & Data Highlights</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Explore Trending Market Intelligence
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mt-3 font-medium">
              Real-time consumer data, B2B benchmarks, and healthcare panel insights powered by
              InsightMatrix global operations.
            </p>
          </div>

          {/* Category Pills in Brand Theme */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30 scale-105"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative bg-brand-deep/90 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl hover:border-brand-primary/50 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
            >
              <div className="p-8 sm:p-10">
                {/* Banner Gradient Header strip */}
                <div
                  className={`rounded-2xl bg-gradient-to-r ${item.gradient} p-6 text-white mb-6 shadow-md relative overflow-hidden`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      {item.badge}
                    </span>
                    <span className="text-xs font-bold text-white/90 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black leading-snug drop-shadow-sm">
                    {item.title}
                  </h3>
                </div>

                {/* Metric pill */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/20 text-brand-light flex items-center justify-center shrink-0 font-bold">
                    <BarChart3 className="w-5 h-5 text-brand-light" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-white">{item.metric}</div>
                    <div className="text-xs text-slate-400 font-semibold">{item.metricLabel}</div>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed font-medium mb-6">
                  {item.description}
                </p>
              </div>

              {/* Card Footer CTA */}
              <div className="px-8 pb-8 sm:px-10 sm:pb-10 pt-0">
                <Link
                  href={item.link}
                  className="inline-flex items-center justify-between w-full py-4 px-6 rounded-2xl bg-white/10 hover:bg-brand-primary hover:text-white text-white text-xs font-black uppercase tracking-wider transition-all duration-300 group-hover:shadow-lg"
                >
                  <span>Explore Research Data</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 p-8 rounded-[2rem] bg-gradient-to-r from-brand-accent1 via-brand-dark to-brand-primary border border-white/15 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center shrink-0 border border-white/20">
              <Sparkles className="w-6 h-6 text-brand-light" />
            </div>
            <div>
              <h4 className="text-lg font-black text-white">Need Custom Fieldwork Feasibility?</h4>
              <p className="text-xs text-slate-300 mt-1">
                Get sample estimates, IR calculations, and project quotes within 2 hours.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="px-8 py-3.5 rounded-full bg-brand-primary hover:bg-brand-hover text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-primary/30 shrink-0"
          >
            Request Feasibility Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
