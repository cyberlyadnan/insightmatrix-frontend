import { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceDetailView } from "@/components/marketing/service-detail-view";
import { SERVICES_CATALOG } from "@/constants/services";
import { getServiceBySlug, LEGACY_SERVICE_SLUGS } from "@/constants/services-utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = SERVICES_CATALOG.map((service) => ({ slug: service.slug }));
  const legacy = Object.keys(LEGACY_SERVICE_SLUGS).map((slug) => ({ slug }));
  return [...slugs, ...legacy];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Details | InsightMatrix Research",
      description: "Explore our global market research and data collection solutions.",
    };
  }

  return {
    title: service.seo.page_title,
    description: service.seo.meta_description,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return <ServiceDetailView service={service} />;
}
