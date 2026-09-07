import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import {
  CheckCircle2,
  Target,
  Lightbulb,
  Globe,
  ShieldCheck,
  Zap,
  Award,
  HeartHandshake,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Stethoscope,
  Laptop,
  Landmark,
  ShoppingBag,
  Car,
  Factory,
  GraduationCap,
  Radio,
  Plane,
  Building,
  Pill,
  Shield,
  ShoppingCart,
} from "lucide-react";
import { ABOUT_PAGE_DATA } from "@/constants/site-content";

export const metadata: Metadata = {
  title: ABOUT_PAGE_DATA.seo.title,
  description: ABOUT_PAGE_DATA.seo.metaDescription,
};

const valueIcons = [ShieldCheck, HeartHandshake, Award, Sparkles, Target, TrendingUp];

const industryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Healthcare: Stethoscope,
  Technology: Laptop,
  "Financial Services": Landmark,
  "Retail & FMCG": ShoppingBag,
  Automotive: Car,
  Manufacturing: Factory,
  Telecommunications: Radio,
  Education: GraduationCap,
  "Media & Entertainment": Sparkles,
  "Travel & Hospitality": Plane,
  "Government & Public Sector": Building,
  "Energy & Utilities": Zap,
  Pharmaceuticals: Pill,
  Insurance: Shield,
  "E-commerce": ShoppingCart,
};

export default function AboutPage() {
  const {
    hero,
    companyOverview,
    mission,
    vision,
    values,
    whatWeDo,
    whyClientsChooseUs,
    approach,
    researchProcess,
    globalReach,
    industries,
    finalCta,
  } = ABOUT_PAGE_DATA;

  return (
    <div className="bg-white min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-28 bg-gradient-to-r from-brand-accent1 via-brand-primary to-brand-accent2 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-white/10 blur-3xl mix-blend-overlay" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-accent1/20 blur-3xl mix-blend-overlay" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center lg:text-left">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-widest text-white mb-6">
              About Our Company
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6 drop-shadow-sm">
              {hero.h1}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed font-medium mb-10 drop-shadow-sm">
              {hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-brand-primary font-black rounded-full hover:bg-gray-50 shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                Request a Quote
              </Link>
              <Link
                href="/services"
                className="px-8 py-4 bg-white/10 border border-white/30 text-white font-black rounded-full hover:bg-white/20 backdrop-blur-md transition-all active:scale-95"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMPANY OVERVIEW (Who We Are) */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-black uppercase tracking-widest mb-4">
                Company Overview
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6">
                {companyOverview.title}
              </h2>
              <div className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
                {companyOverview.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
                <div className="p-5 rounded-2xl bg-[#f7faff] border border-blue-100/50">
                  <div className="text-2xl sm:text-3xl font-black text-brand-primary">80+</div>
                  <div className="text-xs font-bold text-slate-500 uppercase mt-1">Countries</div>
                </div>
                <div className="p-5 rounded-2xl bg-[#f7faff] border border-blue-100/50">
                  <div className="text-2xl sm:text-3xl font-black text-brand-primary">100%</div>
                  <div className="text-xs font-bold text-slate-500 uppercase mt-1">Verified QA</div>
                </div>
                <div className="p-5 rounded-2xl bg-[#f7faff] border border-blue-100/50">
                  <div className="text-2xl sm:text-3xl font-black text-brand-primary">24/7</div>
                  <div className="text-xs font-bold text-slate-500 uppercase mt-1">
                    Field Support
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000"
                  alt="InsightMatrix Research Team"
                  className="w-full h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent flex items-end p-8">
                  <div className="text-white">
                    <p className="text-xs font-black uppercase tracking-widest text-brand-light mb-1">
                      Global Data Intelligence
                    </p>
                    <h4 className="text-xl font-bold">
                      Empowering smarter decisions with human truth.
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION */}
      <section className="py-28 bg-gradient-to-b from-white via-[#f8faff] to-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 sm:p-10 shadow-md hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-brand-subtle text-brand-primary flex items-center justify-center mb-6 shadow-sm border border-brand-light/30">
                <Target className="w-7 h-7" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-brand-primary mb-2 block">
                Our Mission
              </span>
              <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
                {mission.title}
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium text-base">{mission.text}</p>
            </div>

            {/* Vision */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 sm:p-10 shadow-md hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mb-6 shadow-sm border border-violet-100">
                <Lightbulb className="w-7 h-7" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-violet-600 mb-2 block">
                Our Vision
              </span>
              <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
                {vision.title}
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium text-base">{vision.text}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR VALUES (6 Core Values) */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-black uppercase tracking-widest mb-4">
              Core Principles
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Our Core Values
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
              The foundational principles guiding every client partnership, research methodology,
              and data deliverable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((val, idx) => {
              const Icon = valueIcons[idx % valueIcons.length];
              return (
                <div
                  key={idx}
                  className="p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-brand-primary/30 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-300 group hover:-translate-y-1.5"
                >
                  <div className="w-13 h-13 rounded-2xl bg-brand-subtle text-brand-primary flex items-center justify-center mb-6 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm border border-brand-light/30">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight group-hover:text-brand-primary transition-colors">
                    {val.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. WHAT WE DO (12 Services) */}
      <section className="py-28 bg-gradient-to-b from-white via-[#f7faff] to-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-black uppercase tracking-widest mb-4">
              Full Spectrum Solutions
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Comprehensive Research Solutions
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
              InsightMatrix Research provides end-to-end market research and data collection
              services across international markets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whatWeDo.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-brand-primary/30 hover:shadow-lg transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-gray-800">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY CLIENTS CHOOSE US (10 Points) & OUR APPROACH */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-black uppercase tracking-widest mb-4">
                Our Methodology
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-6">
                {approach.title}
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium mb-8">
                {approach.text}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-primary text-white font-bold text-sm shadow-xl shadow-brand-primary/20 hover:bg-brand-hover transition-all"
              >
                Talk to Our Research Experts <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-[#f8faff] border border-blue-100/60 rounded-[2.5rem] p-8 sm:p-10 shadow-sm">
                <h3 className="text-2xl font-black text-gray-900 mb-6">Why Clients Choose Us</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {whyClientsChooseUs.map((reason, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. OUR RESEARCH PROCESS (5 Steps) */}
      <section className="py-28 bg-[#0B0F19] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/20 border border-brand-primary/30 text-brand-primary text-xs font-black uppercase tracking-widest mb-4">
              5-Stage Framework
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
              Our Research Process
            </h2>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-medium">
              A systematic approach designed for total data integrity, rapid turnaround, and
              actionable business intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {researchProcess.map((step, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-[2rem] p-7 hover:bg-white/10 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/20 text-brand-primary flex items-center justify-center font-black text-sm mb-6">
                    0{step.number}
                  </div>
                  <h4 className="text-lg font-black text-white mb-2">{step.title}</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Phase {step.number}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. GLOBAL REACH (6 Regions) */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-black uppercase tracking-widest mb-4">
              Global Fieldwork
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Global Reach
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
              Our research capabilities extend across key international markets, enabling seamless
              multi-market fieldwork.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 text-center">
            {globalReach.map((region, idx) => (
              <div
                key={idx}
                className="p-7 rounded-[2rem] bg-white border border-slate-100 hover:border-brand-primary/30 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-13 h-13 rounded-2xl bg-brand-subtle text-brand-primary flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                  <Globe className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-gray-900 group-hover:text-brand-primary transition-colors">
                  {region}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. INDUSTRIES WE SERVE (15 Industries) */}
      <section className="py-28 bg-gradient-to-b from-white via-[#f8faff] to-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-black uppercase tracking-widest mb-4">
              Sector Expertise
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Industries We Serve
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
              Deep industry-specific knowledge and targeted respondent access across top vertical
              sectors.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {industries.map((ind, idx) => {
              const Icon = industryIconMap[ind] || Building;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:border-brand-primary/30 hover:shadow-lg transition-all flex flex-col items-center text-center"
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-800">{ind}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="py-28 bg-gradient-to-r from-brand-accent1 via-brand-primary to-brand-accent2 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-widest text-white mb-6">
            Partner With Us
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
            {finalCta.heading}
          </h2>
          <p className="text-lg sm:text-xl text-white/90 leading-relaxed font-medium mb-10 max-w-2xl mx-auto">
            {finalCta.text}
          </p>
          <Link
            href={finalCta.buttonHref}
            className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-white text-brand-primary font-black text-base shadow-2xl hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all"
          >
            {finalCta.buttonText} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
