import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardList, TrendingUp, Users, Share2, CheckCircle2, Globe, Shield, Zap, Sparkles } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { GridVisual } from "@/components/common/HeaderVisuals";

export const metadata: Metadata = {
  title: "Solutions | InsightMatrix",
  description: "Explore our comprehensive suite of market research services and solutions.",
};

export default function ServicesPage() {
  const services = [
    {
      title: "Survey Participation",
      slug: "survey-participation",
      description: "Join our global panel and earn rewards by sharing your authentic opinions on products, services, and trends.",
      icon: ClipboardList,
      features: ["Verified Demographics", "Guaranteed Compensation", "Mobile-First Interface", "Strict Privacy"],
      color: "text-pink-600",
      bg: "bg-pink-50/50",
      border: "group-hover:border-pink-200"
    },
    {
      title: "Market Insight Data",
      slug: "market-research-data-collection",
      description: "Access our vast, diverse panel to rapidly collect high-quality data for your corporate or independent research projects.",
      icon: TrendingUp,
      features: ["Targeted Sampling", "Real-Time Tracking", "Fraud Prevention", "Agile Methodology"],
      color: "text-violet-600",
      bg: "bg-violet-50/50",
      border: "group-hover:border-violet-200"
    },
    {
      title: "Panel Management",
      slug: "survey-panel-management",
      description: "Leverage our robust technology infrastructure to build, manage, and engage your own custom research panel.",
      icon: Users,
      features: ["Custom Branding", "Panel Health Metrics", "Automated Rewards", "Compliance Security"],
      color: "text-sky-600",
      bg: "bg-sky-50/50",
      border: "group-hover:border-sky-200"
    },
    {
      title: "Distribution Network",
      slug: "survey-distribution-network",
      description: "Extend your survey reach beyond traditional boundaries with our programmatic distribution network and API integrations.",
      icon: Share2,
      features: ["API Connectivity", "Global Publisher Network", "Dynamic Allocation", "Quality Assurance"],
      color: "text-rose-600",
      bg: "bg-rose-50/50",
      border: "group-hover:border-rose-200"
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <PageHeader 
        badge="Market Research Services"
        title="Solutions built on reality"
        description="Comprehensive, industry-leading tools designed to streamline data collection and maximize participant engagement with unmatched precision."
        buttonText="View All Solutions"
        buttonHref="/register"
        visual={<GridVisual />}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <Link 
                key={idx} 
                href={`/services/${service.slug}`}
                className={`group relative bg-white border border-gray-100 rounded-3xl p-8 lg:p-10 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 ${service.border} block`}
              >
                <div className="flex flex-col h-full">
                  {/* Icon & Category */}
                  <div className="flex items-center justify-between mb-8">
                    <div className={`w-14 h-14 rounded-2xl ${service.bg} ${service.color} flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {service.slug.replace(/-/g, ' ')}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight group-hover:text-brand-primary transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-500 leading-relaxed mb-8 flex-grow">
                    {service.description}
                  </p>

                  {/* Feature List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 mb-10 pt-8 border-t border-gray-50">
                     {service.features.map((feature, i) => (
                       <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-brand-primary/60" />
                          <span className="text-sm font-semibold text-gray-600">{feature}</span>
                       </div>
                     ))}
                  </div>

                  {/* Footer Link */}
                  <div className="mt-auto">
                    <div className="inline-flex items-center gap-2 text-gray-900 font-black text-sm transition-all group-hover:gap-3 group-hover:text-brand-primary">
                      Learn more <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
                
                {/* Subtle Hover Decoration */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${service.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
              </Link>
            );
          })}
        </div>

        {/* Simplified Status Bar */}
        <div className="mt-20 flex flex-wrap justify-between items-center bg-gray-50 rounded-2xl p-6 border border-gray-100 gap-8">
            {[
             { label: "Global Reach", icon: Globe, value: "140+ countries" },
             { label: "Real People", icon: Users, value: "Millions verified" },
             { label: "Data Security", icon: Shield, value: "GDPR Compliant" },
             { label: "Quality Control", icon: Sparkles, value: "AI Verified" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <stat.icon className="w-5 h-5 text-gray-400" />
                 </div>
                 <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">{stat.label}</div>
                    <div className="text-xs font-bold text-gray-900 leading-none">{stat.value}</div>
                 </div>
              </div>
            ))}
        </div>

        {/* Classic Professional CTA */}
        <div className="mt-24 bg-gray-900 rounded-[2.5rem] p-12 lg:p-16 text-center relative overflow-hidden">
           {/* Decorative Background Glows */}
           <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/10 blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-1/2 h-full bg-violet-600/10 blur-[100px]" />
           </div>

           <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 tracking-tight">Need a custom panel solution?</h2>
              <p className="text-gray-400 text-lg font-medium leading-relaxed mb-10">
                Our experts work with major brands to build high-engagement proprietary research panels tailored to your specific audience requirements.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-10 py-4 text-base font-black rounded-full text-gray-900 bg-white hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
              >
                Get in touch with us <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
