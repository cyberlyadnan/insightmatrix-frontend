"use client";

import { useQuery } from "@tanstack/react-query";
import { getSiteSettings, type SiteSettingsRecord } from "@/services/services-cms/services-cms-api";
import { queryKeys } from "@/services/queries/queryKeys";
import { SITE_CONTACT, BRAND_FOUNDATION, SEO_CONTENT } from "@/constants/site-content";

const FALLBACK_SITE_SETTINGS: SiteSettingsRecord = {
  companyName: BRAND_FOUNDATION.brandName,
  tagline: BRAND_FOUNDATION.tagline,
  statement: BRAND_FOUNDATION.statement,
  shortDescription: BRAND_FOUNDATION.shortDescription,
  longDescription: BRAND_FOUNDATION.longDescription,
  email: SITE_CONTACT.email,
  salesEmail: SITE_CONTACT.salesEmail,
  supportEmail: "help@insightmatrix.online",
  phones: [...SITE_CONTACT.phones],
  businessHours: SITE_CONTACT.businessHours,
  address: {
    street: "123 Data Point Avenue, Suite 800",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    postalCode: "94105",
    hqLabel: "Silicon Valley HQ",
  },
  socialLinks: {
    linkedin: SITE_CONTACT.linkedInUrl,
    instagram: SITE_CONTACT.instagramUrl,
    twitter: "",
    facebook: "",
    youtube: "",
    website: SITE_CONTACT.websiteUrl,
  },
  seoDefaultTitle: SEO_CONTENT.defaultTitle,
  seoDefaultDescription: SEO_CONTENT.defaultDescription,
  seoKeywords: BRAND_FOUNDATION.keywords,
  copyrightText: "InsightMatrix Research. All rights reserved.",
};

export function useSiteSettings() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.siteSettings.profile,
    queryFn: getSiteSettings,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    settings: data || FALLBACK_SITE_SETTINGS,
    isLoading,
  };
}
