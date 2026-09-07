import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Globe,
  HelpCircle,
  Layers,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import type { ServiceRecord } from "@/constants/service-types";
import { getServiceBySlug, slugFromInternalLink } from "@/constants/services-utils";

type ServiceDetailViewProps = {
  service: ServiceRecord;
};

function ListGrid({ items, title }: { items: string[]; title?: string }) {
  if (!items.length) return null;
  return (
    <div>
      {title ? <h3 className="text-2xl font-black text-gray-900 mb-6">{title}</h3> : null}
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 p-4 rounded-2xl bg-[#f8faff] border border-blue-100/50 shadow-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0" />
            <span className="text-sm font-bold text-gray-800">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ServiceDetailView({ service }: ServiceDetailViewProps) {
  const primaryCta = service.hero.ctas?.[0];
  const secondaryCta = service.hero.ctas?.[1];
  const qualityItems = service.quality_assurance?.quality_measures ?? [];
  const relatedLinks =
    service.internal_links?.filter((link) => slugFromInternalLink(link.url)) ?? [];

  return (
    <div className="bg-white min-h-screen">
      <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-28 bg-gradient-to-r from-brand-accent1 via-brand-primary to-brand-accent2 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-white/10 blur-3xl mix-blend-overlay" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-accent1/20 blur-3xl mix-blend-overlay" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-xs font-bold text-white/70 mb-8 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link href="/services" className="hover:text-white transition-colors">
              Services
            </Link>
            <ChevronRight size={12} />
            <span className="text-white truncate max-w-xs">{service.service_name}</span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-widest text-white mb-6">
              {service.service_name}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6 drop-shadow-sm">
              {service.hero.title}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed font-medium mb-10 drop-shadow-sm">
              {service.hero.subtitle}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href={primaryCta?.link ?? "/contact"}
                className="px-8 py-4 bg-white text-brand-primary font-black rounded-full hover:bg-gray-50 shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                {primaryCta?.label ?? "Request a Quote"}
              </Link>
              <Link
                href={secondaryCta?.link ?? "/contact"}
                className="px-8 py-4 bg-white/10 border border-white/30 text-white font-black rounded-full hover:bg-white/20 backdrop-blur-md transition-all active:scale-95"
              >
                {secondaryCta?.label ?? "Talk to Our Experts"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-10">
              {service.introduction?.paragraphs?.length ? (
                <div>
                  <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-black uppercase tracking-widest mb-4">
                    Service Overview
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-6">
                    {service.introduction.title ?? service.service_name}
                  </h2>
                  <div className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
                    {service.introduction.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              ) : null}

              {service.what_we_offer?.items?.length ? (
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    {service.what_we_offer.title ?? "What We Offer"}
                  </h3>
                  {service.what_we_offer.description ? (
                    <p className="text-slate-600 font-medium mb-6">
                      {service.what_we_offer.description}
                    </p>
                  ) : null}
                  <ListGrid items={service.what_we_offer.items} />
                </div>
              ) : null}
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-brand-primary/5 sticky top-28 space-y-8">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">
                    {service.quality_assurance?.title ?? "Quality Standards"}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {service.quality_assurance?.description ??
                      "ISO-compliant validation procedures"}
                  </p>
                </div>

                <div className="space-y-3">
                  {(qualityItems.length
                    ? qualityItems
                    : [
                        "Digital Fingerprinting & Bot Elimination",
                        "Geographic & Demographic Validation",
                        "Real-Time Speed & Attention Checks",
                        "Manual Open-End Response Auditing",
                        "Dedicated 24/7 Field Project Manager",
                      ]
                  ).map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-xs font-bold text-slate-700"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-brand-primary hover:bg-brand-hover text-white font-black text-sm shadow-xl shadow-brand-primary/25 transition-all"
                  >
                    Request Feasibility & Pricing <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {service.target_audiences?.categories?.length ? (
        <section className="py-24 bg-gradient-to-b from-white via-[#f8faff] to-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-black uppercase tracking-widest mb-4">
                Audience Reach
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
                {service.target_audiences.title ?? "Target Audiences"}
              </h2>
              {service.target_audiences.description ? (
                <p className="text-base text-slate-600 font-medium">
                  {service.target_audiences.description}
                </p>
              ) : null}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.target_audiences.categories.map((aud) => (
                <div
                  key={aud.title}
                  className="bg-white border border-slate-100 rounded-[2rem] p-7 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-black text-gray-900">{aud.title}</h4>
                  </div>
                  <div className="space-y-2">
                    {aud.items.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-600"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {service.research_types?.items?.length ? (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-black uppercase tracking-widest mb-4">
                Research Methodologies
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
                {service.research_types.title ?? "Research Types"}
              </h2>
              {service.research_types.description ? (
                <p className="text-base text-slate-600 font-medium">
                  {service.research_types.description}
                </p>
              ) : null}
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {service.research_types.items.map((item) => (
                <div
                  key={item}
                  className="p-6 rounded-2xl bg-[#f8faff] border border-blue-100/50 flex items-center gap-3 shadow-sm hover:border-brand-primary/30 transition-all"
                >
                  <Layers className="w-5 h-5 text-brand-primary shrink-0" />
                  <span className="text-sm font-bold text-gray-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {service.global_coverage?.regions?.length ? (
        <section className="py-20 bg-[#f8faff] border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-black uppercase tracking-widest mb-4">
              <Globe className="w-3.5 h-3.5" />
              Global Coverage
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              {service.global_coverage.title ?? "Global Coverage"}
            </h2>
            {service.global_coverage.description ? (
              <p className="text-slate-600 font-medium mb-8 max-w-2xl mx-auto">
                {service.global_coverage.description}
              </p>
            ) : null}
            <div className="flex flex-wrap justify-center gap-3">
              {service.global_coverage.regions.map((region) => (
                <span
                  key={region}
                  className="px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-bold text-gray-800"
                >
                  {region}
                </span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {service.process?.steps?.length ? (
        <section className="py-24 bg-[#0B0F19] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/20 border border-brand-primary/30 text-brand-primary text-xs font-black uppercase tracking-widest mb-4">
                Step-by-Step Delivery
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
                {service.process.title ?? "Our Process"}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.process.steps.map((step, idx) => (
                <div
                  key={`${step.title}-${idx}`}
                  className="bg-white/5 border border-white/10 rounded-[2rem] p-7 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full mb-4 inline-block">
                      Step {step.step ?? idx + 1}
                    </span>
                    <h4 className="text-sm font-black text-white mb-2">{step.title}</h4>
                    {step.description ? (
                      <p className="text-xs text-slate-300 font-medium leading-relaxed">
                        {step.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {service.why_insightmatrix?.items?.length ? (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                {service.why_insightmatrix.title ?? "Why InsightMatrix"}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.why_insightmatrix.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[2rem] border border-slate-100 p-7 shadow-sm"
                >
                  <h4 className="text-base font-black text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {service.faqs?.items?.length ? (
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-black uppercase tracking-widest mb-4">
                Knowledge Base
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
                {service.faqs.title ?? "Frequently Asked Questions"}
              </h2>
            </div>

            <div className="space-y-4">
              {service.faqs.items.map((faq) => (
                <div
                  key={faq.question}
                  className="p-6 sm:p-7 rounded-2xl bg-[#f8faff] border border-blue-100/50"
                >
                  <h4 className="text-base font-black text-gray-900 mb-2 flex items-start gap-2">
                    <HelpCircle className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                    <span>{faq.question}</span>
                  </h4>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed pl-7">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {relatedLinks.length ? (
        <section className="py-16 bg-[#f8faff] border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-gray-900 mb-8">Related Services</h2>
            <div className="flex flex-wrap gap-3">
              {relatedLinks.map((link) => {
                const slug = slugFromInternalLink(link.url);
                if (!slug || slug === service.slug) return null;
                const related = getServiceBySlug(slug);
                if (!related) return null;
                return (
                  <Link
                    key={link.url}
                    href={`/services/${related.slug}`}
                    className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-brand-primary hover:border-brand-primary/30 hover:bg-brand-subtle/40 transition-all"
                  >
                    {link.title}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-28 bg-gradient-to-r from-brand-accent1 via-brand-primary to-brand-accent2 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-widest text-white mb-6">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Ready for Accurate Insights?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
            {service.final_cta?.title ?? "Looking for a Reliable Research Partner?"}
          </h2>

          <p className="text-lg sm:text-xl text-white/90 leading-relaxed font-medium mb-10 max-w-2xl mx-auto">
            {service.final_cta?.description ??
              "Partner with InsightMatrix Research for fast feasibility, verified global respondents, and dedicated project management."}
          </p>

          <Link
            href={service.final_cta?.buttons?.[0]?.link ?? "/contact"}
            className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-white text-brand-primary font-black text-base shadow-2xl hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all"
          >
            {service.final_cta?.buttons?.[0]?.label ?? "Request a Quote"}{" "}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
