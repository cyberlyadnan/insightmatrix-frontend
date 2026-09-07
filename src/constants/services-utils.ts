import { SERVICES_CATALOG } from "./services";
import type { ServiceListCategory, ServiceRecord } from "./service-types";

export const INDUSTRY_SLUGS = new Set([
  "healthcare",
  "pharmaceutical-biotechnology",
  "technology-saas",
  "banking-financial-services-fintech",
  "retail-ecommerce",
]);

/** Legacy URL slugs → current catalog slugs */
export const LEGACY_SERVICE_SLUGS: Record<string, string> = {
  "b2b-research": "b2b-market-research",
  "b2c-research": "b2c-market-research",
  "healthcare-research": "healthcare-market-research",
  "qualitative-research": "qualitative-market-research",
  "survey-programming-hosting": "survey-programming",
  "cati-computer-assisted-telephone-interviewing": "cati-services",
  "translation-localization-services": "translation-localization",
  "brand-tracking-services": "brand-tracking",
  "customer-experience-cx-research": "customer-experience-research",
  "product-testing-research": "product-testing",
  "concept-testing-research": "concept-testing",
  "pricing-research-services": "pricing-research",
  "market-segmentation-research": "market-segmentation",
  "usage-attitude-u-a-research": "usage-attitude-research",
  "omnibus-research-services": "omnibus-research",
  "healthcare-industry": "healthcare",
  "pharmaceutical-biotech-market-research": "pharmaceutical-biotechnology",
  "technology-saas-market-research": "technology-saas",
  "banking-financial-services-fintech-bfsi-market-research": "banking-financial-services-fintech",
  "retail-e-commerce-market-research": "retail-ecommerce",
  "survey-participation": "b2c-market-research",
  "market-research-data-collection": "quantitative-market-research",
  "survey-panel-management": "respondent-recruitment",
  "survey-distribution-network": "survey-programming",
};

export function isIndustryService(slug: string): boolean {
  return INDUSTRY_SLUGS.has(slug);
}

export function getAllServices(): ServiceRecord[] {
  return SERVICES_CATALOG;
}

export function getServiceBySlug(slug: string): ServiceRecord | undefined {
  const normalized = slug.trim().toLowerCase();
  const resolved = LEGACY_SERVICE_SLUGS[normalized] ?? normalized;
  return SERVICES_CATALOG.find((s) => s.slug === resolved);
}

export function getServicePreviewItems(service: ServiceRecord, limit = 3): string[] {
  return (service.what_we_offer?.items ?? []).slice(0, limit);
}

export function getServiceCategory(service: ServiceRecord): "Industry" | "Service" {
  return isIndustryService(service.slug) ? "Industry" : "Service";
}

export function matchesServiceTab(service: ServiceRecord, tab: ServiceListCategory): boolean {
  if (tab === "all") return true;

  const slug = service.slug;

  if (tab === "industries") return isIndustryService(slug);
  if (tab === "core") return !isIndustryService(slug);

  if (tab === "b2b-b2c") {
    return (
      slug.includes("b2b") ||
      slug.includes("b2c") ||
      slug.includes("consumer") ||
      slug.includes("online-data")
    );
  }

  if (tab === "healthcare") {
    return slug.includes("healthcare") || slug.includes("pharma") || slug.includes("biotech");
  }

  if (tab === "methodologies") {
    return (
      slug.includes("qualitative") ||
      slug.includes("quantitative") ||
      slug.includes("brand") ||
      slug.includes("pricing") ||
      slug.includes("concept") ||
      slug.includes("product") ||
      slug.includes("segmentation") ||
      slug.includes("usage") ||
      slug.includes("omnibus") ||
      slug.includes("public-opinion") ||
      slug.includes("employee")
    );
  }

  if (tab === "operations") {
    return (
      slug.includes("cati") ||
      slug.includes("programming") ||
      slug.includes("recruitment") ||
      slug.includes("translation") ||
      slug.includes("data-processing") ||
      slug.includes("panel")
    );
  }

  return true;
}

export function filterServices(options: {
  search?: string;
  tab?: ServiceListCategory;
}): ServiceRecord[] {
  const q = options.search?.trim().toLowerCase() ?? "";
  const tab = options.tab ?? "all";

  return SERVICES_CATALOG.filter((service) => {
    if (!matchesServiceTab(service, tab)) return false;
    if (!q) return true;

    const haystack = [
      service.service_name,
      service.slug,
      service.hero.title,
      service.hero.subtitle,
      service.seo.meta_description,
      ...(service.what_we_offer?.items ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}

export function slugFromInternalLink(url: string): string | null {
  const match = url.match(/\/services\/([^/?#]+)/);
  return match?.[1] ?? null;
}
