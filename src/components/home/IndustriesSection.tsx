"use client";

import { HOME_PAGE_DATA } from "@/constants/site-content";
import {
  HeartPulse,
  Laptop,
  Landmark,
  ShoppingBag,
  Package,
  Car,
  Factory,
  GraduationCap,
  Radio,
  Plane,
  Film,
  Building,
  Zap,
  Pill,
  Shield,
  Home,
  ShoppingCart,
  Users,
  Sparkles,
} from "lucide-react";

const industryIcons = [
  HeartPulse,
  Laptop,
  Landmark,
  ShoppingBag,
  Package,
  Car,
  Factory,
  GraduationCap,
  Radio,
  Plane,
  Film,
  Building,
  Zap,
  Pill,
  Shield,
  Home,
  ShoppingCart,
  Users,
];

export default function IndustriesSection() {
  const { industries } = HOME_PAGE_DATA;

  return (
    <section className="py-28 bg-gradient-to-b from-white via-[#f8faff] to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-black uppercase tracking-widest mb-5">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            <span>Vertical Expertise</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6">
            Industries We Serve
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            Specialized sample design, verified B2B/B2C audiences, and domain-trained research teams
            across major global industry sectors.
          </p>
        </div>

        {/* 18 Industries Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {industries.map((ind, idx) => {
            const Icon = industryIcons[idx % industryIcons.length];
            return (
              <div
                key={idx}
                className="group bg-white border border-slate-100 hover:border-brand-primary/40 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-brand-primary/10 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1.5"
              >
                <div className="w-13 h-13 rounded-2xl bg-brand-subtle text-brand-primary flex items-center justify-center mb-3 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-brand-primary transition-colors leading-tight">
                  {ind}
                </h4>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
