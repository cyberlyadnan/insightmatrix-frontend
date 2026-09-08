"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Globe,
  Layers,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Users,
  Settings,
  Database,
  Building2,
  Stethoscope,
  Code2,
  PhoneCall,
  BarChart3,
  Zap,
  HeartPulse,
  Laptop,
  Landmark,
  ShoppingBag,
  MessageSquareQuote,
  Eye,
} from "lucide-react";
import type { ServiceCmsRecord } from "@/services/services-cms/services-cms-api";

const ICON_OPTIONS = [
  { name: "Database", icon: Database },
  { name: "Building2", icon: Building2 },
  { name: "Users", icon: Users },
  { name: "Stethoscope", icon: Stethoscope },
  { name: "Code2", icon: Code2 },
  { name: "PhoneCall", icon: PhoneCall },
  { name: "Layers", icon: Layers },
  { name: "BarChart3", icon: BarChart3 },
  { name: "Globe", icon: Globe },
  { name: "Zap", icon: Zap },
  { name: "HeartPulse", icon: HeartPulse },
  { name: "Laptop", icon: Laptop },
  { name: "Landmark", icon: Landmark },
  { name: "ShoppingBag", icon: ShoppingBag },
  { name: "MessageSquareQuote", icon: MessageSquareQuote },
  { name: "Sparkles", icon: Sparkles },
];

export const CATEGORY_OPTIONS = [
  { value: "core", label: "Core Research Service" },
  { value: "industries", label: "Industry Expertise" },
  { value: "b2b-b2c", label: "B2B & B2C Research" },
  { value: "healthcare", label: "Healthcare & Life Sciences" },
  { value: "methodologies", label: "Methodologies" },
  { value: "operations", label: "Operations & Tech" },
];

type TabKey =
  | "general"
  | "seo"
  | "hero"
  | "offerings"
  | "qa_coverage"
  | "benefits_process"
  | "faqs_cta";

type ServiceFormProps = {
  initialData?: Partial<ServiceCmsRecord>;
  onSubmit: (data: Partial<ServiceCmsRecord>) => Promise<void>;
  isSubmitting: boolean;
  mode: "create" | "edit";
};

export function ServiceForm({ initialData, onSubmit, isSubmitting, mode }: ServiceFormProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("general");

  // Form State
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [serviceName, setServiceName] = useState(initialData?.service_name ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "core");
  const [status, setStatus] = useState<"published" | "draft">(initialData?.status ?? "published");
  const [order, setOrder] = useState(initialData?.order ?? 1);
  const [icon, setIcon] = useState(initialData?.icon ?? "Layers");
  const [featured, setFeatured] = useState(initialData?.featured ?? false);

  // SEO
  const [pageTitle, setPageTitle] = useState(initialData?.seo?.page_title ?? "");
  const [metaDescription, setMetaDescription] = useState(initialData?.seo?.meta_description ?? "");
  const [keywordsStr, setKeywordsStr] = useState(
    Array.isArray(initialData?.seo?.keywords) ? initialData.seo.keywords.join(", ") : ""
  );
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.seo?.canonicalUrl ?? "");

  // Hero & Intro
  const [heroTitle, setHeroTitle] = useState(initialData?.hero?.title ?? "");
  const [heroSubtitle, setHeroSubtitle] = useState(initialData?.hero?.subtitle ?? "");
  const [primaryCtaLabel, setPrimaryCtaLabel] = useState(
    initialData?.hero?.ctas?.[0]?.label ?? "Request a Quote"
  );
  const [primaryCtaLink, setPrimaryCtaLink] = useState(
    initialData?.hero?.ctas?.[0]?.link ?? "/contact"
  );
  const [secondaryCtaLabel, setSecondaryCtaLabel] = useState(
    initialData?.hero?.ctas?.[1]?.label ?? "Talk to Our Research Team"
  );
  const [secondaryCtaLink, setSecondaryCtaLink] = useState(
    initialData?.hero?.ctas?.[1]?.link ?? "/contact"
  );

  // Introduction
  const [introTitle, setIntroTitle] = useState(initialData?.introduction?.title ?? "");
  const [paragraphs, setParagraphs] = useState<string[]>(
    initialData?.introduction?.paragraphs?.length ? initialData.introduction.paragraphs : [""]
  );

  // What we offer
  const [offerTitle, setOfferTitle] = useState(
    initialData?.what_we_offer?.title ?? "What We Offer"
  );
  const [offerDesc, setOfferDesc] = useState(
    initialData?.what_we_offer?.description ?? "We provide complete solutions including:"
  );
  const [offerItems, setOfferItems] = useState<string[]>(
    initialData?.what_we_offer?.items?.length ? initialData.what_we_offer.items : [""]
  );

  // Target audiences
  const [audienceTitle, setAudienceTitle] = useState(
    initialData?.target_audiences?.title ?? "Target Audiences"
  );
  const [audienceDesc, setAudienceDesc] = useState(
    initialData?.target_audiences?.description ?? ""
  );
  const [audienceGroups, setAudienceGroups] = useState<{ title: string; itemsStr: string }[]>(
    initialData?.target_audiences?.categories?.map((cat) => ({
      title: cat.title,
      itemsStr: (cat.items || []).join(", "),
    })) || []
  );

  // Quality Assurance
  const [qaTitle, setQaTitle] = useState(
    initialData?.quality_assurance?.title ?? "Quality Assurance"
  );
  const [qaDesc, setQaDesc] = useState(initialData?.quality_assurance?.description ?? "");
  const [qaMeasures, setQaMeasures] = useState<string[]>(
    initialData?.quality_assurance?.quality_measures?.length
      ? initialData.quality_assurance.quality_measures
      : [""]
  );

  // Global Coverage
  const [coverageTitle, setCoverageTitle] = useState(
    initialData?.global_coverage?.title ?? "Global Coverage"
  );
  const [coverageDesc, setCoverageDesc] = useState(initialData?.global_coverage?.description ?? "");
  const [coverageRegions, setCoverageRegions] = useState<string[]>(
    initialData?.global_coverage?.regions?.length
      ? initialData.global_coverage.regions
      : ["North America", "Europe", "Asia-Pacific", "Latin America", "Middle East & Africa"]
  );

  // Why InsightMatrix
  const [whyTitle, setWhyTitle] = useState(
    initialData?.why_insightmatrix?.title ?? "Why InsightMatrix"
  );
  const [whyItems, setWhyItems] = useState<{ title: string; description: string }[]>(
    initialData?.why_insightmatrix?.items?.length
      ? initialData.why_insightmatrix.items
      : [{ title: "", description: "" }]
  );

  // Process
  const [processTitle, setProcessTitle] = useState(initialData?.process?.title ?? "Our Process");
  const [processSteps, setProcessSteps] = useState<
    { step: string | number; title: string; description: string }[]
  >(
    initialData?.process?.steps?.length
      ? initialData.process.steps.map((s, idx) => ({
          step: s.step ?? idx + 1,
          title: s.title,
          description: s.description ?? "",
        }))
      : [{ step: 1, title: "", description: "" }]
  );

  // FAQs
  const [faqTitle, setFaqTitle] = useState(
    initialData?.faqs?.title ?? "Frequently Asked Questions"
  );
  const [faqItems, setFaqItems] = useState<{ question: string; answer: string }[]>(
    initialData?.faqs?.items?.length ? initialData.faqs.items : [{ question: "", answer: "" }]
  );

  // Final CTA
  const [finalCtaTitle, setFinalCtaTitle] = useState(
    initialData?.final_cta?.title ?? "Looking for a Reliable Research Partner?"
  );
  const [finalCtaDesc, setFinalCtaDesc] = useState(
    initialData?.final_cta?.description ??
      "Let's discuss your research requirements and build a solution tailored to your project."
  );
  const [finalCtaBtnLabel, setFinalCtaBtnLabel] = useState(
    initialData?.final_cta?.buttons?.[0]?.label ?? "Request a Quote"
  );
  const [finalCtaBtnLink, setFinalCtaBtnLink] = useState(
    initialData?.final_cta?.buttons?.[0]?.link ?? "/contact"
  );

  // Auto-generate slug from title
  const generateSlugFromName = () => {
    if (!serviceName) return;
    const generated = serviceName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setSlug(generated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<ServiceCmsRecord> = {
      slug: slug.trim().toLowerCase(),
      service_name: serviceName.trim(),
      category,
      status,
      order: Number(order),
      icon,
      featured,
      seo: {
        page_title: pageTitle.trim() || `${serviceName} | InsightMatrix Research`,
        meta_description: metaDescription.trim(),
        url: `/services/${slug.trim().toLowerCase()}`,
        keywords: keywordsStr
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        canonicalUrl: canonicalUrl.trim(),
      },
      hero: {
        title: heroTitle.trim() || serviceName,
        subtitle: heroSubtitle.trim(),
        ctas: [
          { label: primaryCtaLabel.trim(), link: primaryCtaLink.trim() },
          { label: secondaryCtaLabel.trim(), link: secondaryCtaLink.trim() },
        ].filter((c) => c.label && c.link),
      },
      introduction: {
        title: introTitle.trim() || serviceName,
        paragraphs: paragraphs.map((p) => p.trim()).filter(Boolean),
      },
      what_we_offer: {
        title: offerTitle.trim(),
        description: offerDesc.trim(),
        items: offerItems.map((i) => i.trim()).filter(Boolean),
      },
      target_audiences: {
        title: audienceTitle.trim(),
        description: audienceDesc.trim(),
        categories: audienceGroups.map((g) => ({
          title: g.title.trim(),
          items: g.itemsStr
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean),
        })),
      },
      quality_assurance: {
        title: qaTitle.trim(),
        description: qaDesc.trim(),
        quality_measures: qaMeasures.map((m) => m.trim()).filter(Boolean),
      },
      global_coverage: {
        title: coverageTitle.trim(),
        description: coverageDesc.trim(),
        regions: coverageRegions.map((r) => r.trim()).filter(Boolean),
      },
      why_insightmatrix: {
        title: whyTitle.trim(),
        items: whyItems.filter((w) => w.title.trim() && w.description.trim()),
      },
      process: {
        title: processTitle.trim(),
        steps: processSteps.filter((s) => s.title.trim()),
      },
      faqs: {
        title: faqTitle.trim(),
        items: faqItems.filter((f) => f.question.trim() && f.answer.trim()),
      },
      final_cta: {
        title: finalCtaTitle.trim(),
        description: finalCtaDesc.trim(),
        buttons: [{ label: finalCtaBtnLabel.trim(), link: finalCtaBtnLink.trim() }],
      },
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/services"
            className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              {mode === "create" ? "Create New Service" : `Edit Service: ${serviceName}`}
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Configure SEO meta tags, audience reach, methodologies, and dynamic content.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {mode === "edit" && slug ? (
            <Link
              href={`/services/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye size={14} /> View Live
            </Link>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-primary text-white font-bold text-xs shadow-lg shadow-brand-primary/20 hover:bg-brand-hover active:scale-95 transition-all disabled:opacity-60"
          >
            <Save size={14} />
            <span>
              {isSubmitting ? "Saving..." : mode === "create" ? "Create Service" : "Save Changes"}
            </span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {[
          { id: "general" as const, label: "General & Identity", icon: Settings },
          { id: "seo" as const, label: "SEO & Social Meta", icon: Globe },
          { id: "hero" as const, label: "Hero & Intro", icon: Sparkles },
          { id: "offerings" as const, label: "Offerings & Audiences", icon: Users },
          { id: "qa_coverage" as const, label: "Quality & Coverage", icon: ShieldCheck },
          { id: "benefits_process" as const, label: "Benefits & Process", icon: Layers },
          { id: "faqs_cta" as const, label: "FAQs & Final CTA", icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#091428] text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <Icon size={14} className={isActive ? "text-brand-primary" : "text-gray-400"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: General & Identity */}
      {activeTab === "general" && (
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-base font-black text-gray-900 pb-3 border-b border-gray-100">
            Service Identification & Layout Controls
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Service Name *
              </label>
              <input
                type="text"
                required
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="e.g. Online Data Collection"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  URL Slug * (Unique)
                </label>
                <button
                  type="button"
                  onClick={generateSlugFromName}
                  className="text-[11px] font-bold text-brand-primary hover:underline"
                >
                  Generate from title
                </button>
              </div>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. online-data-collection"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 lowercase"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Public URL: <code className="text-gray-600">/services/{slug || "slug"}</code>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Publishing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "published" | "draft")}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <option value="published">Published (Live on Website)</option>
                <option value="draft">Draft (Hidden from Public)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Display Order (Weight)
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-5 h-5 rounded text-brand-primary border-gray-300 focus:ring-brand-primary"
              />
              <label htmlFor="featured" className="text-sm font-bold text-gray-800 cursor-pointer">
                Show as Featured Service on Home Page
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
              Service Icon
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {ICON_OPTIONS.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = icon === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setIcon(opt.name)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? "bg-brand-subtle border-brand-primary text-brand-primary shadow-sm"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <IconComponent size={22} className="mb-1" />
                    <span className="text-[10px] font-bold truncate max-w-full">{opt.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: SEO & Social Meta */}
      {activeTab === "seo" && (
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-base font-black text-gray-900">
              Search Engine Optimization (SEO) & OpenGraph
            </h2>
            <span className="text-xs font-black uppercase text-brand-primary bg-brand-subtle px-3 py-1 rounded-full">
              High SEO Impact
            </span>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                SEO Page Title *
              </label>
              <input
                type="text"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                placeholder="e.g. Online Data Collection Services | Global Survey Sample Provider | InsightMatrix Research"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Recommended length: 50–65 characters.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Meta Description *
              </label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="InsightMatrix Research provides reliable online data collection services for B2B, B2C, healthcare..."
                className="w-full p-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Recommended length: 140–160 characters.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                SEO Keywords (Comma Separated)
              </label>
              <input
                type="text"
                value={keywordsStr}
                onChange={(e) => setKeywordsStr(e.target.value)}
                placeholder="Online Data Collection, B2B Research, Healthcare Sample, Quantitative Survey"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Canonical URL (Optional override)
              </label>
              <input
                type="url"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="https://www.insightmatrix.online/services/online-data-collection"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            {/* Google Search Result Live Preview */}
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
                Google Search Result Preview
              </span>
              <div className="text-xs text-emerald-800 font-medium">
                https://www.insightmatrix.online › services › {slug || "slug"}
              </div>
              <div className="text-lg font-bold text-[#1a0dab] hover:underline cursor-pointer">
                {pageTitle || serviceName || "Service Title"}
              </div>
              <div className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                {metaDescription ||
                  "InsightMatrix Research delivers reliable market research and data collection services..."}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Hero & Intro */}
      {activeTab === "hero" && (
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-base font-black text-gray-900 pb-3 border-b border-gray-100">
            Hero Banner & Introduction Section
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Hero Main Headline (H1)
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="Global Online Data Collection Services"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Hero Subtitle / Value Proposition
              </label>
              <textarea
                rows={2}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="Reliable online survey sample and high-quality respondent recruitment for quantitative market research..."
                className="w-full p-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Primary CTA Label
                </label>
                <input
                  type="text"
                  value={primaryCtaLabel}
                  onChange={(e) => setPrimaryCtaLabel(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Primary CTA Link
                </label>
                <input
                  type="text"
                  value={primaryCtaLink}
                  onChange={(e) => setPrimaryCtaLink(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Secondary CTA Label
                </label>
                <input
                  type="text"
                  value={secondaryCtaLabel}
                  onChange={(e) => setSecondaryCtaLabel(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Secondary CTA Link
                </label>
                <input
                  type="text"
                  value={secondaryCtaLink}
                  onChange={(e) => setSecondaryCtaLink(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Overview Section Title
              </label>
              <input
                type="text"
                value={introTitle}
                onChange={(e) => setIntroTitle(e.target.value)}
                placeholder="e.g. Online Data Collection Services"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 mb-4"
              />

              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Introduction Paragraphs
                </label>
                {paragraphs.map((p, idx) => (
                  <div key={idx} className="flex gap-2">
                    <textarea
                      rows={3}
                      value={p}
                      onChange={(e) => {
                        const next = [...paragraphs];
                        next[idx] = e.target.value;
                        setParagraphs(next);
                      }}
                      placeholder={`Paragraph ${idx + 1}...`}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={() => setParagraphs(paragraphs.filter((_, i) => i !== idx))}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="Remove paragraph"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setParagraphs([...paragraphs, ""])}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100"
                >
                  <Plus size={14} /> Add Paragraph
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Offerings & Audiences */}
      {activeTab === "offerings" && (
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm space-y-8">
          {/* What We Offer */}
          <div>
            <h2 className="text-base font-black text-gray-900 pb-3 border-b border-gray-100 mb-4">
              What We Offer Items
            </h2>
            <div className="grid gap-4 md:grid-cols-2 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Section Description
                </label>
                <input
                  type="text"
                  value={offerDesc}
                  onChange={(e) => setOfferDesc(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Offer Bullet Points
              </label>
              {offerItems.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const next = [...offerItems];
                      next[idx] = e.target.value;
                      setOfferItems(next);
                    }}
                    placeholder={`e.g. Consumer Surveys, Healthcare Studies...`}
                    className="w-full h-10 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setOfferItems(offerItems.filter((_, i) => i !== idx))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setOfferItems([...offerItems, ""])}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                <Plus size={14} /> Add Offering Item
              </button>
            </div>
          </div>

          {/* Target Audiences */}
          <div className="pt-6 border-t border-gray-100">
            <h2 className="text-base font-black text-gray-900 pb-3 border-b border-gray-100 mb-4">
              Target Audience Categories
            </h2>
            <div className="grid gap-4 md:grid-cols-2 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Audience Section Title
                </label>
                <input
                  type="text"
                  value={audienceTitle}
                  onChange={(e) => setAudienceTitle(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Audience Description
                </label>
                <input
                  type="text"
                  value={audienceDesc}
                  onChange={(e) => setAudienceDesc(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold"
                />
              </div>
            </div>

            <div className="space-y-4">
              {audienceGroups.map((group, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">
                      Audience Group {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAudienceGroups(audienceGroups.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      value={group.title}
                      onChange={(e) => {
                        const next = [...audienceGroups];
                        next[idx].title = e.target.value;
                        setAudienceGroups(next);
                      }}
                      placeholder="Category Title (e.g. Consumer Audiences)"
                      className="w-full h-10 px-4 rounded-xl border border-gray-200 text-sm font-semibold"
                    />
                    <input
                      type="text"
                      value={group.itemsStr}
                      onChange={(e) => {
                        const next = [...audienceGroups];
                        next[idx].itemsStr = e.target.value;
                        setAudienceGroups(next);
                      }}
                      placeholder="Items comma-separated (e.g. General Pop, Parents, Students)"
                      className="w-full h-10 px-4 rounded-xl border border-gray-200 text-sm font-semibold"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setAudienceGroups([...audienceGroups, { title: "", itemsStr: "" }])}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                <Plus size={14} /> Add Audience Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Quality & Coverage */}
      {activeTab === "qa_coverage" && (
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm space-y-8">
          {/* QA */}
          <div>
            <h2 className="text-base font-black text-gray-900 pb-3 border-b border-gray-100 mb-4">
              Quality Assurance & Validation Standards
            </h2>
            <div className="grid gap-4 md:grid-cols-2 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  QA Title
                </label>
                <input
                  type="text"
                  value={qaTitle}
                  onChange={(e) => setQaTitle(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  QA Subtitle / Description
                </label>
                <input
                  type="text"
                  value={qaDesc}
                  onChange={(e) => setQaDesc(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Quality Measures (Badges)
              </label>
              {qaMeasures.map((measure, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={measure}
                    onChange={(e) => {
                      const next = [...qaMeasures];
                      next[idx] = e.target.value;
                      setQaMeasures(next);
                    }}
                    placeholder="e.g. Digital Fingerprinting, Duplicate Detection..."
                    className="w-full h-10 px-4 rounded-xl border border-gray-200 text-sm font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setQaMeasures(qaMeasures.filter((_, i) => i !== idx))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setQaMeasures([...qaMeasures, ""])}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                <Plus size={14} /> Add QA Measure
              </button>
            </div>
          </div>

          {/* Global Coverage */}
          <div className="pt-6 border-t border-gray-100">
            <h2 className="text-base font-black text-gray-900 pb-3 border-b border-gray-100 mb-4">
              Global Coverage & Regions
            </h2>
            <div className="mb-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Coverage Section Title
                </label>
                <input
                  type="text"
                  value={coverageTitle}
                  onChange={(e) => setCoverageTitle(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Coverage Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={coverageDesc}
                  onChange={(e) => setCoverageDesc(e.target.value)}
                  placeholder="e.g. Robust coverage across over 90+ global markets..."
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm font-semibold"
                />
              </div>
            </div>
            <div className="space-y-2">
              {coverageRegions.map((region, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => {
                      const next = [...coverageRegions];
                      next[idx] = e.target.value;
                      setCoverageRegions(next);
                    }}
                    placeholder="e.g. North America, Europe, Asia-Pacific..."
                    className="w-full h-10 px-4 rounded-xl border border-gray-200 text-sm font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverageRegions(coverageRegions.filter((_, i) => i !== idx))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setCoverageRegions([...coverageRegions, ""])}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                <Plus size={14} /> Add Region
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Benefits & Process */}
      {activeTab === "benefits_process" && (
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm space-y-8">
          {/* Why Choose Us */}
          <div>
            <h2 className="text-base font-black text-gray-900 pb-3 border-b border-gray-100 mb-4">
              Why Choose InsightMatrix (Benefits)
            </h2>
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Benefits Section Title
              </label>
              <input
                type="text"
                value={whyTitle}
                onChange={(e) => setWhyTitle(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold"
              />
            </div>
            <div className="space-y-4">
              {whyItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">Benefit Card {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => setWhyItems(whyItems.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const next = [...whyItems];
                      next[idx].title = e.target.value;
                      setWhyItems(next);
                    }}
                    placeholder="Benefit Title (e.g. Dedicated Project Managers)"
                    className="w-full h-10 px-4 rounded-xl border border-gray-200 text-sm font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => {
                      const next = [...whyItems];
                      next[idx].description = e.target.value;
                      setWhyItems(next);
                    }}
                    placeholder="Benefit Description..."
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm font-semibold"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setWhyItems([...whyItems, { title: "", description: "" }])}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                <Plus size={14} /> Add Benefit Card
              </button>
            </div>
          </div>

          {/* Process Steps */}
          <div className="pt-6 border-t border-gray-100">
            <h2 className="text-base font-black text-gray-900 pb-3 border-b border-gray-100 mb-4">
              Step-by-Step Delivery Process
            </h2>
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Process Section Title
              </label>
              <input
                type="text"
                value={processTitle}
                onChange={(e) => setProcessTitle(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold"
              />
            </div>
            <div className="space-y-4">
              {processSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">Step {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => setProcessSteps(processSteps.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <input
                      type="text"
                      value={step.step}
                      onChange={(e) => {
                        const next = [...processSteps];
                        next[idx].step = e.target.value;
                        setProcessSteps(next);
                      }}
                      placeholder="Step (e.g. 1)"
                      className="h-10 px-4 rounded-xl border border-gray-200 text-sm font-semibold"
                    />
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const next = [...processSteps];
                        next[idx].title = e.target.value;
                        setProcessSteps(next);
                      }}
                      placeholder="Step Title (e.g. Project Consultation)"
                      className="sm:col-span-2 h-10 px-4 rounded-xl border border-gray-200 text-sm font-semibold"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={(e) => {
                      const next = [...processSteps];
                      next[idx].description = e.target.value;
                      setProcessSteps(next);
                    }}
                    placeholder="Step Description (Optional)..."
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm font-semibold"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setProcessSteps([
                    ...processSteps,
                    { step: processSteps.length + 1, title: "", description: "" },
                  ])
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                <Plus size={14} /> Add Delivery Step
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: FAQs & Final CTA */}
      {activeTab === "faqs_cta" && (
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm space-y-8">
          {/* FAQs */}
          <div>
            <h2 className="text-base font-black text-gray-900 pb-3 border-b border-gray-100 mb-4">
              Frequently Asked Questions (FAQs)
            </h2>
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                FAQ Section Heading
              </label>
              <input
                type="text"
                value={faqTitle}
                onChange={(e) => setFaqTitle(e.target.value)}
                placeholder="Frequently Asked Questions"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold"
              />
            </div>
            <div className="space-y-4">
              {faqItems.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">FAQ {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => setFaqItems(faqItems.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => {
                      const next = [...faqItems];
                      next[idx].question = e.target.value;
                      setFaqItems(next);
                    }}
                    placeholder="Question (e.g. Which markets do you support?)"
                    className="w-full h-10 px-4 rounded-xl border border-gray-200 text-sm font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => {
                      const next = [...faqItems];
                      next[idx].answer = e.target.value;
                      setFaqItems(next);
                    }}
                    placeholder="Answer..."
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm font-semibold"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFaqItems([...faqItems, { question: "", answer: "" }])}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                <Plus size={14} /> Add FAQ
              </button>
            </div>
          </div>

          {/* Final CTA */}
          <div className="pt-6 border-t border-gray-100">
            <h2 className="text-base font-black text-gray-900 pb-3 border-b border-gray-100 mb-4">
              Final Bottom CTA Section
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  CTA Title
                </label>
                <input
                  type="text"
                  value={finalCtaTitle}
                  onChange={(e) => setFinalCtaTitle(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  CTA Description
                </label>
                <textarea
                  rows={2}
                  value={finalCtaDesc}
                  onChange={(e) => setFinalCtaDesc(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm font-semibold"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={finalCtaBtnLabel}
                    onChange={(e) => setFinalCtaBtnLabel(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={finalCtaBtnLink}
                    onChange={(e) => setFinalCtaBtnLink(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
