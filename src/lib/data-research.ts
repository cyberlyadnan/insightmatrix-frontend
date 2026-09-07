import { CASE_STUDIES, CaseStudyItem } from "@/constants/case-studies";

export interface CaseStudy {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  client: string;
  duration: string;
  results: {
    label: string;
    value: string;
    iconName: string;
  }[];
  challenge: string;
  solution: string;
  fullStory: string;
  capabilities?: string[];
  faqs?: { question: string; answer: string }[];
}

const sampleImages = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
];

// Map all 25+ client research case studies dynamically from CASE_STUDIES
export const caseStudies: CaseStudy[] = CASE_STUDIES.map((cs: CaseStudyItem, idx: number) => {
  const isIndustry = cs.category === "Industry Vertical";
  const audienceList = cs.targetAudiences
    .flatMap((a) => a.items)
    .slice(0, 3)
    .join(", ");

  return {
    id: cs.id,
    slug: cs.slug,
    category: cs.category,
    title: cs.title,
    excerpt:
      cs.summary ||
      cs.subtitle ||
      `Comprehensive research intelligence study covering ${cs.title}.`,
    image: sampleImages[idx % sampleImages.length],
    client: isIndustry ? "Global Enterprise Partner" : "InsightMatrix Research Intelligence",
    duration: isIndustry ? "Multi-Phase Study" : "Continuous Longitudinal Track",
    results: [
      { label: "Data Quality", value: "99.8%", iconName: "ShieldCheck" },
      { label: "Markets Covered", value: "80+", iconName: "Globe" },
      { label: "Response Speed", value: "2.5x", iconName: "Zap" },
    ],
    challenge:
      cs.subtitle || `Executing precision data collection and audience recruitment in ${cs.title}.`,
    solution:
      cs.keyCapabilities.length > 0
        ? `Deployed specialized multi-methodology framework: ${cs.keyCapabilities.slice(0, 4).join(", ")}.`
        : "Multi-market sampling across verified decision-makers and specialized demographics.",
    fullStory: `${cs.summary}\n\nKey Audiences Covered: ${audienceList || "Verified Global Panelists"}.\n\nMethodologies: ${cs.methodologies.join(", ") || "Quantitative & Qualitative Mix"}.`,
    capabilities: cs.keyCapabilities,
    faqs: cs.faqs,
  };
});
