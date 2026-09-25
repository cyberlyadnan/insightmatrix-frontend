import { Metadata } from "next";
import Hero from "@/components/hero/Hero";
import TrendingInsightsSection from "@/components/home/TrendingInsightsSection";
import TrustSection from "@/components/home/TrustSection";
import TrustedBy from "@/components/home/TrustedBy";
import WhyInsightMatrix from "@/components/home/WhyInsightMatrix";
import OurServicesSection from "@/components/home/OurServicesSection";
import ResearchProcessSection from "@/components/home/ResearchProcessSection";
import IndustriesSection from "@/components/home/IndustriesSection";
import GlobalCoverageSection from "@/components/home/GlobalCoverageSection";
import PanelCommunity from "@/components/home/PanelCommunity";
import QualitySection from "@/components/home/QualitySection";
import CtaSection from "@/components/home/CtaSection";
import { HOME_PAGE_DATA } from "@/constants/site-content";

export const metadata: Metadata = {
  title: HOME_PAGE_DATA.seo.title,
  description: HOME_PAGE_DATA.seo.metaDescription,
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. YOUGOV STYLE TRENDING INSIGHTS GRID */}
      <TrendingInsightsSection />

      {/* 3. TRUST & CREDENTIALS SECTION */}
      <TrustSection />

      {/* 4. TRUSTED BY GLOBAL LEADERS & CASE STUDIES */}
      <TrustedBy />

      {/* 5. WHY INSIGHTMATRIX */}
      <WhyInsightMatrix />

      {/* 6. OUR SERVICES & SOLUTIONS */}
      <OurServicesSection />

      {/* 7. RESEARCH PROCESS */}
      <ResearchProcessSection />

      {/* 8. INDUSTRIES WE SERVE */}
      <IndustriesSection />

      {/* 9. GLOBAL COVERAGE */}
      <GlobalCoverageSection />

      {/* 10. PANEL COMMUNITY SHOWCASE */}
      <PanelCommunity />

      {/* 11. QUALITY & FRAUD PREVENTION */}
      <QualitySection />

      {/* 12. CTA BANNER SECTION */}
      <CtaSection />
    </div>
  );
}
