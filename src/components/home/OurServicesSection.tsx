"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  MessageSquareQuote,
  Building2,
  Users,
  Stethoscope,
  Globe,
  Code2,
  PhoneCall,
  Database,
  ArrowRight,
  Sparkles,
  Layers,
  HeartPulse,
  Laptop,
  Landmark,
  ShoppingBag,
  Zap,
} from "lucide-react";

import { HOME_PAGE_DATA } from "@/constants/site-content";
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
};

export default function OurServicesSection() {
  const { services: fallbackData } = HOME_PAGE_DATA;

  const { data: remoteData } = useQuery({
    queryKey: queryKeys.servicesCms.publicList({ pageSize: 12 }),
    queryFn: () => listPublicServices({ pageSize: 12 }),
    staleTime: 60 * 1000,
  });

  const displayServices = useMemo(() => {
    if (remoteData?.items && remoteData.items.length > 0) {
      // Pick up to 9 featured or first 9
      const featured = remoteData.items.filter((s) => s.featured);
      const list = featured.length >= 6 ? featured : remoteData.items;
      return list.slice(0, 9).map((s) => ({
        title: s.service_name,
        slug: s.slug,
        description:
          s.hero?.subtitle || s.seo?.meta_description || "Comprehensive global research solution.",
        icon: s.icon,
      }));
    }
    return fallbackData.items.map((i) => ({
      title: i.title,
      slug: i.slug,
      description: i.description,
      icon: "Layers",
    }));
  }, [remoteData, fallbackData]);

  return (
    <section className="py-28 bg-white relative overflow-hidden">
      {/* Soft Ambient Background Radiance */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-black uppercase tracking-widest mb-5">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            <span>End-to-End Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6">
            {fallbackData.heading}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            {fallbackData.sub}
          </p>
        </div>

        {/* 9 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((item, idx) => {
            const Icon = iconMap[item.icon] || iconMap[item.slug] || Layers;
            return (
              <Link
                key={item.slug || idx}
                href={`/services/${item.slug}`}
                className="group relative bg-white border border-slate-100 rounded-[2rem] p-8 sm:p-9 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-primary/10 hover:border-brand-primary/30 flex flex-col justify-between hover:-translate-y-1.5"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-brand-subtle text-brand-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 shadow-sm border border-brand-light/30">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight group-hover:text-brand-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm font-medium mb-6 line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between text-xs font-black text-brand-primary group-hover:gap-2 transition-all">
                  <span>Explore Service</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-brand-dark hover:bg-brand-deep text-white font-black text-sm transition-all hover:scale-105 shadow-xl shadow-brand-dark/15 active:scale-95"
          >
            View All Research Solutions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
