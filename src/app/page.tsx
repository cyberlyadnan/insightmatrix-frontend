import { Metadata } from "next";
import Hero from "@/components/hero/Hero";
import TrustSection from "@/components/home/TrustSection";
import WhyInsightMatrix from "@/components/home/WhyInsightMatrix";
import OurServicesSection from "@/components/home/OurServicesSection";
import ResearchProcessSection from "@/components/home/ResearchProcessSection";
import IndustriesSection from "@/components/home/IndustriesSection";
import GlobalCoverageSection from "@/components/home/GlobalCoverageSection";
import QualitySection from "@/components/home/QualitySection";
import CtaSection from "@/components/home/CtaSection";
import { HOME_PAGE_DATA } from "@/constants/site-content";

export const metadata: Metadata = {
  title: HOME_PAGE_DATA.seo.title,
  description: HOME_PAGE_DATA.seo.metaDescription,
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. TRUST SECTION */}
      <TrustSection />

      {/* 3. WHY INSIGHTMATRIX */}
      <WhyInsightMatrix />

      {/* 4. OUR SERVICES */}
      <OurServicesSection />

      {/* 5. RESEARCH PROCESS */}
      <ResearchProcessSection />

      {/* 6. INDUSTRIES WE SERVE */}
      <IndustriesSection />

      {/* 7. GLOBAL COVERAGE */}
      <GlobalCoverageSection />

      {/* 8. QUALITY SECTION */}
      <QualitySection />

      {/* 9. CTA SECTION */}
      <CtaSection />
    </div>
  );
}
