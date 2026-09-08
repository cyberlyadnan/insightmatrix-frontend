"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Code2,
  Database,
  Globe,
  HeartPulse,
  Landmark,
  Layers,
  Laptop,
  MessageSquareQuote,
  PhoneCall,
  Search,
  ShoppingBag,
  Stethoscope,
  Users,
  Zap,
  Sparkles,
} from "lucide-react";

import { SERVICES_CATALOG } from "@/constants/services";
import type { ServiceListCategory, ServiceRecord } from "@/constants/service-types";
import {
  getServiceCategory,
  getServicePreviewItems,
  isIndustryService,
} from "@/constants/services-utils";
import { listPublicServices } from "@/services/services-cms/services-cms-api";
import { queryKeys } from "@/services/queries/queryKeys";

const iconMap: Record<string, typeof Layers> = {
  Database,
  Building2,
  Users,
  Stethoscope,
  Code2,
  PhoneCall,
  Layers,
  BarChart3,
  Globe,
  Zap,
  HeartPulse,
  Laptop,
  Landmark,
  ShoppingBag,
  MessageSquareQuote,
  Sparkles,
  "online-data-collection": Database,
  "b2b-market-research": Building2,
  "b2c-market-research": Users,
  "healthcare-market-research": Stethoscope,
  "qualitative-market-research": MessageSquareQuote,
  "survey-programming": Code2,
  "cati-services": PhoneCall,
  "data-processing": Layers,
  "online-panel-solutions": Users,
  "respondent-recruitment": Users,
  "quantitative-market-research": BarChart3,
  "translation-localization": Globe,
  "brand-tracking": Zap,
  "product-testing": Layers,
  "concept-testing": Zap,
  "pricing-research": BarChart3,
  "market-segmentation": Layers,
  "usage-attitude-research": Users,
  "employee-engagement-research": HeartPulse,
  "public-opinion-research": Globe,
  "omnibus-research": Database,
  healthcare: Stethoscope,
  "pharmaceutical-biotechnology": HeartPulse,
  "technology-saas": Laptop,
  "banking-financial-services-fintech": Landmark,
  "retail-ecommerce": ShoppingBag,
};

const TABS: { id: ServiceListCategory; label: string }[] = [
  { id: "all", label: "All Services" },
  { id: "core", label: "Core Services" },
  { id: "b2b-b2c", label: "B2B & B2C" },
  { id: "healthcare", label: "Healthcare" },
  { id: "methodologies", label: "Methodologies" },
  { id: "operations", label: "Operations & Tech" },
  { id: "industries", label: "Industries" },
];

function matchesTab(service: ServiceRecord, tab: ServiceListCategory): boolean {
  if (tab === "all") return true;
  const slug = service.slug.toLowerCase();

  if (tab === "industries") return isIndustryService(slug);
  if (tab === "core") return !isIndustryService(slug);

  if (tab === "b2b-b2c") {
    return (
      slug.includes("b2b") ||
      slug.includes("b2c") ||
      slug.includes("consumer") ||
      slug.includes("online-data")
    );
  }

  if (tab === "healthcare") {
    return slug.includes("healthcare") || slug.includes("pharma") || slug.includes("biotech");
  }

  if (tab === "methodologies") {
    return (
      slug.includes("qualitative") ||
      slug.includes("quantitative") ||
      slug.includes("brand") ||
      slug.includes("pricing") ||
      slug.includes("concept") ||
      slug.includes("product") ||
      slug.includes("segmentation") ||
      slug.includes("usage") ||
      slug.includes("omnibus") ||
      slug.includes("public-opinion") ||
      slug.includes("employee")
    );
  }

  if (tab === "operations") {
    return (
      slug.includes("cati") ||
      slug.includes("programming") ||
      slug.includes("recruitment") ||
      slug.includes("translation") ||
      slug.includes("data-processing") ||
      slug.includes("panel")
    );
  }

  return true;
}

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<ServiceListCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: remoteData } = useQuery({
    queryKey: queryKeys.servicesCms.publicList({ pageSize: 100 }),
    queryFn: () => listPublicServices({ pageSize: 100 }),
    staleTime: 60 * 1000,
  });

  const allServices: ServiceRecord[] = useMemo(() => {
    if (remoteData?.items && remoteData.items.length > 0) {
      return remoteData.items;
    }
    return SERVICES_CATALOG;
  }, [remoteData]);

  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return allServices.filter((service) => {
      if (!matchesTab(service, activeTab)) return false;
      if (!q) return true;

      const haystack = [
        service.service_name,
        service.slug,
        service.hero?.title,
        service.hero?.subtitle,
        service.seo?.meta_description,
        ...(service.what_we_offer?.items ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [allServices, searchQuery, activeTab]);

  return (
    <div className="bg-white min-h-screen">
      <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-28 bg-gradient-to-r from-brand-accent1 via-brand-primary to-brand-accent2 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-white/10 blur-3xl mix-blend-overlay" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-accent1/20 blur-3xl mix-blend-overlay" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center lg:text-left">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-widest text-white mb-6">
              Global Research Services
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6 drop-shadow-sm">
              Comprehensive Research & Data Collection Solutions
            </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed font-medium mb-10 drop-shadow-sm">
              End-to-end quantitative, qualitative, B2B, consumer, healthcare, and survey operations
              delivered with rigorous quality standards worldwide.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-brand-primary font-black rounded-full hover:bg-gray-50 shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                Request a Custom Proposal
              </Link>
              <a
                href="#services-catalog"
                className="px-8 py-4 bg-white/10 border border-white/30 text-white font-black rounded-full hover:bg-white/20 backdrop-blur-md transition-all active:scale-95"
              >
                Browse All Services ({allServices.length})
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="services-catalog"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20"
      >
        <div className="bg-white rounded-[2rem] p-4 lg:p-6 shadow-xl border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services (e.g. B2B, Healthcare, CATI, Panel)..."
              className="w-full pl-12 pr-6 py-4 bg-[#f8faff] border border-blue-100/60 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                  activeTab === tab.id
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                    : "bg-[#f8faff] text-slate-600 hover:bg-slate-100 border border-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Showing {filteredServices.length} Solutions
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Select any capability to explore methodology, audiences, and delivery process.
            </p>
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-brand-primary bg-brand-subtle px-3 py-1.5 rounded-full border border-brand-light/30">
            100% Quality Guaranteed
          </span>
        </div>

        {filteredServices.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 px-8 py-16 text-center">
            <p className="text-lg font-black text-gray-900">No services match your search</p>
            <p className="text-sm text-slate-500 mt-2">Try another keyword or clear the filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => {
              const iconKey = service.icon || service.slug;
              const Icon = iconMap[iconKey] || iconMap[service.slug] || Layers;
              const previewItems = getServicePreviewItems(service);
              const category = getServiceCategory(service);

              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group relative bg-white border border-slate-100 rounded-[2rem] p-8 sm:p-9 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-primary/10 hover:border-brand-primary/30 flex flex-col justify-between hover:-translate-y-1.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-brand-subtle text-brand-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 shadow-sm border border-brand-light/30">
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                        {category}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight group-hover:text-brand-primary transition-colors">
                      {service.service_name}
                    </h3>

                    <p className="text-slate-600 leading-relaxed text-sm font-medium mb-6 line-clamp-3">
                      {service.hero?.subtitle || service.seo?.meta_description}
                    </p>

                    {previewItems.length > 0 ? (
                      <div className="space-y-2 mb-6 pt-5 border-t border-slate-100">
                        {previewItems.map((item) => (
                          <div
                            key={item}
                            className="flex items-center gap-2 text-xs font-semibold text-slate-700"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                            <span className="truncate">{item}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="pt-5 border-t border-slate-100 flex items-center justify-between text-xs font-black text-brand-primary group-hover:gap-2 transition-all">
                    <span>View Full Solution</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-r from-brand-dark via-brand-accent1 to-brand-dark text-white grid grid-cols-2 md:grid-cols-4 gap-8 text-center shadow-2xl shadow-brand-dark/20">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-white mb-1">80+</div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Global Markets
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-white mb-1">99.8%</div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Data Accuracy
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-white mb-1">500+</div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Daily Projects
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-white mb-1">24/7</div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Field Support
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
