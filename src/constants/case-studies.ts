/**
 * Exhaustive Client Content & Case Studies Constants for InsightMatrix Research
 * Generated from complete client dataset without shortcuts or omissions.
 */

import caseStudiesJson from "./case-studies.json";

export interface RawBlock {
  type: string;
  title?: string;
  content?: string[];
  items?: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  step: string;
  description: string;
}

export interface AudienceGroup {
  category: string;
  items: string[];
}

export interface WhyChooseUsItem {
  title: string;
  description: string;
}

export interface CTABanner {
  heading: string;
  text: string;
  button: string;
}

export interface SectionContent {
  id: number;
  title: string;
  slug: string;
  pageTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryCta: string;
  secondaryCta: string;
  overview: { title: string; text: string; items?: string[] }[];
  offerings: string[];
  audiences: AudienceGroup[];
  industries: string[];
  methodologies: string[];
  qualityAssurance: string[];
  whyChooseUs: WhyChooseUsItem[];
  process: ProcessStep[];
  faqs: FAQItem[];
  ctaBanner: CTABanner;
  rawBlocks: RawBlock[];
}

export interface CaseStudyItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  subtitle: string;
  summary: string;
  keyCapabilities: string[];
  targetAudiences: AudienceGroup[];
  methodologies: string[];
  processSteps: ProcessStep[];
  qualityStandards: string[];
  faqs: FAQItem[];
  fullSectionId: number;
}

export interface FullClientDataset {
  version: string;
  client: string;
  lastUpdated: string;
  totalSections: number;
  brandFoundation: SectionContent;
  services: SectionContent[];
  industries: SectionContent[];
  caseStudies: CaseStudyItem[];
  allSections: SectionContent[];
  rawSections: { title: string; blocks: RawBlock[] }[];
}

// Full typed exports
export const CLIENT_DATASET = caseStudiesJson as unknown as FullClientDataset;
export const BRAND_FOUNDATION = CLIENT_DATASET.brandFoundation;
export const ALL_SERVICES = CLIENT_DATASET.services;
export const ALL_INDUSTRIES = CLIENT_DATASET.industries;
export const CASE_STUDIES = CLIENT_DATASET.caseStudies;
export const ALL_SECTIONS = CLIENT_DATASET.allSections;
export const RAW_SECTIONS = CLIENT_DATASET.rawSections;

// Repeatable features extracted from client value propositions
export const REPEATABLE_FEATURES = [
  {
    id: "f1",
    tag: "High Quality Data",
    title: "Rigorous Quality Assurance",
    description:
      "Multi-layered fraud detection, digital fingerprinting, and attention checks ensure accurate data collection across every project.",
    linkText: "Explore Quality Standards",
    href: "/services/quantitative-market-research",
  },
  {
    id: "f2",
    tag: "Global Audience Reach",
    title: "Global Panel & Niche Recruitment",
    description:
      "Access verified B2B decision-makers, healthcare professionals (HCPs), and diverse consumer demographics across 80+ countries.",
    linkText: "View Panel Capabilities",
    href: "/services/respondent-recruitment",
  },
  {
    id: "f3",
    tag: "Advanced Tech Stack",
    title: "Survey Programming & Modern Hosting",
    description:
      "Complex logic routing, mobile-optimized question types, and seamless API integrations with Decipher, Qualtrics, and Confirmit.",
    linkText: "Learn About Survey Tech",
    href: "/services/survey-programming-hosting",
  },
  {
    id: "f4",
    tag: "Expert Methodologies",
    title: "End-to-End Quantitative & Qualitative",
    description:
      "From IDIs, focus groups, and online communities to brand tracking, pricing research, and conjoint analysis.",
    linkText: "Explore Methodologies",
    href: "/services/qualitative-research",
  },
];

// Helper lookups
export function getSectionBySlug(slug: string): SectionContent | undefined {
  return ALL_SECTIONS.find((s) => s.slug === slug || s.slug === slug.toLowerCase());
}

export function getServiceBySlug(slug: string): SectionContent | undefined {
  return ALL_SERVICES.find((s) => s.slug === slug || s.slug === slug.toLowerCase());
}

export function getIndustryBySlug(slug: string): SectionContent | undefined {
  return ALL_INDUSTRIES.find((s) => s.slug === slug || s.slug === slug.toLowerCase());
}

export function getCaseStudyBySlug(slug: string): CaseStudyItem | undefined {
  return CASE_STUDIES.find((cs) => cs.slug === slug || cs.slug === slug.toLowerCase());
}

export default CLIENT_DATASET;
