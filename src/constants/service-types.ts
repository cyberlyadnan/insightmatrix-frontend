export type ServiceCta = {
  label: string;
  link: string;
};

export type ServiceCategoryGroup = {
  title: string;
  items: string[];
};

export type ServiceWhyItem = {
  title: string;
  description: string;
};

export type ServiceProcessStep = {
  step?: number | string;
  title: string;
  description?: string;
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceInternalLink = {
  title: string;
  url: string;
};

/** Full service / industry page record from `services.ts` catalog. */
export type ServiceRecord = {
  id: string;
  slug: string;
  service_name: string;
  seo: {
    page_title: string;
    meta_description: string;
    url: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctas?: ServiceCta[];
  };
  introduction?: {
    title?: string;
    paragraphs?: string[];
  };
  what_we_offer?: {
    title?: string;
    description?: string;
    items?: string[];
  };
  target_audiences?: {
    title?: string;
    description?: string;
    categories?: ServiceCategoryGroup[];
  };
  research_types?: {
    title?: string;
    description?: string;
    items?: string[];
  };
  quality_assurance?: {
    title?: string;
    description?: string;
    quality_measures?: string[];
  };
  global_coverage?: {
    title?: string;
    description?: string;
    regions?: string[];
  };
  why_insightmatrix?: {
    title?: string;
    items?: ServiceWhyItem[];
  };
  process?: {
    title?: string;
    steps?: ServiceProcessStep[];
  };
  why_clients_trust_us?: {
    title?: string;
    items?: string[];
  };
  faqs?: {
    title?: string;
    items?: ServiceFaq[];
  };
  final_cta?: {
    title?: string;
    description?: string;
    buttons?: ServiceCta[];
  };
  internal_links?: ServiceInternalLink[];
};

export type ServiceListCategory =
  | "all"
  | "core"
  | "industries"
  | "b2b-b2c"
  | "healthcare"
  | "methodologies"
  | "operations";
