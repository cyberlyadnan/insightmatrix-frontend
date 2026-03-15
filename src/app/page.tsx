import Hero from "@/components/hero/Hero";
import WhyInsightMatrix from "@/components/home/WhyInsightMatrix";
import PanelCommunity from "@/components/home/PanelCommunity";
import TrustedBy from "@/components/home/TrustedBy";
import HowItWorks from "@/components/home/HowItWorks";
import Benefits from "@/components/home/Benefits";
import FeaturedSurveys from "@/components/home/FeaturedSurveys";
import TrustStats from "@/components/home/TrustStats";
import CtaSection from "@/components/home/CtaSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <WhyInsightMatrix />
      <PanelCommunity />
      <TrustedBy />
      <HowItWorks />
      <Benefits />
      <FeaturedSurveys />
      <TrustStats />
      <CtaSection />
    </div>
  );
}
