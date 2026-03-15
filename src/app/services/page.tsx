import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardList, TrendingUp, Users, Share2, Star } from "lucide-react";
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
      description: "Join our global panel and earn rewards by sharing your authentic opinions and feedback on products, services, and trends.",
      icon: <ClipboardList className="h-10 w-10 text-brand-primary" />,
      features: ["Verified Demographics", "Guaranteed Compensation", "Mobile-First Interface", "Data Privacy"],
      bg: "bg-white",
      border: "border-brand-light",
      accent: "bg-brand-subtle",
    },
    {
      title: "Market Research Data",
      slug: "market-research-data-collection",
      description: "Access our vast, diverse panel to rapidly collect high-quality data for your academic, corporate, or independent research projects.",
      icon: <TrendingUp className="h-10 w-10 text-violet-600" />,
      features: ["Targeted Sampling", "Real-Time Tracking", "Fraud Prevention", "Agile Methodology"],
      bg: "bg-white",
      border: "border-violet-100",
      accent: "bg-violet-50",
    },
    {
      title: "Panel Management",
      slug: "survey-panel-management",
      description: "Leverage our robust technology infrastructure to build, manage, and engage your own proprietary custom research panel.",
      icon: <Users className="h-10 w-10 text-sky-600" />,
      features: ["Custom Branding", "Panel Health Metrics", "Automated Rewards", "Compliance Security"],
      bg: "bg-white",
      border: "border-sky-100",
      accent: "bg-sky-50",
    },
    {
      title: "Distribution Network",
      slug: "survey-distribution-network",
      description: "Extend your survey reach beyond traditional boundaries with our programmatic distribution network and API integrations.",
      icon: <Share2 className="h-10 w-10 text-brand-accent1" />,
      features: ["API Connectivity", "Global Publisher Network", "Dynamic Allocation", "Quality Assurance"],
      bg: "bg-white",
      border: "border-pink-100",
      accent: "bg-pink-50",
    }
  ];

  return (
    <div className="bg-[#fafafa]">
      <PageHeader 
        badge="Market Research Services"
        title="Our Research Solutions"
        description="Comprehensive, industry-leading tools designed to streamline data collection and maximize participant engagement with unmatched precision."
        buttonText="View All Solutions"
        buttonHref="/register"
        visual={<GridVisual />}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className={`group flex flex-col h-full rounded-[2.5rem] border ${service.border} ${service.bg} p-10 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden relative`}
            >
              {/* Decorative accent blob */}
              <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full ${service.accent} opacity-40 blur-3xl group-hover:scale-150 transition-transform duration-700`} />

              <div className="relative z-10 flex-1">
                <div className={`w-20 h-20 rounded-3xl ${service.accent} flex items-center justify-center mb-10 shadow-sm border border-white`}>
                  {service.icon}
                </div>
                
                <h3 className="text-3xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                  {service.title}
                </h3>
                
                <p className="text-lg text-gray-500 leading-relaxed mb-10 font-medium">
                  {service.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                   {service.features.map((feature, i) => (
                     <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                           <Star className="w-3 h-3 text-green-600 fill-current" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">{feature}</span>
                     </div>
                   ))}
                </div>
              </div>

              <div className="relative z-10 pt-8 border-t border-gray-100 mt-auto">
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 text-brand-primary font-black text-lg hover:text-brand-hover transition-all group-hover:gap-4"
                >
                  Explore Solution <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA for Enterprise */}
        <div className="mt-24 rounded-[3rem] bg-gray-900 p-1 lg:p-1.5 shadow-2xl">
           <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.8rem] px-10 py-16 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-xl text-center md:text-left">
                 <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Need a custom panel?</h2>
                 <p className="text-gray-400 text-lg font-medium leading-relaxed">
                   Our experts work with major brands and agencies to build high-engagement proprietary research panels tailored to specific niche audiences.
                 </p>
              </div>
              <Link
                href="/contact"
                className="shrink-0 inline-flex items-center justify-center px-10 py-5 text-lg font-black rounded-full text-gray-900 bg-white hover:bg-gray-100 shadow-xl transition-all hover:scale-105"
              >
                Contact Sales
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
