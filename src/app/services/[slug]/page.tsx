import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailView } from "@/components/marketing/service-detail-view";
import { SERVICES_CATALOG } from "@/constants/services";
import { LEGACY_SERVICE_SLUGS } from "@/constants/services-utils";
import { fetchServerServiceBySlug } from "@/lib/server-services";

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
  const service = await fetchServerServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Details | InsightMatrix Research",
      description: "Explore our global market research and data collection solutions.",
    };
  }

  const title = service.seo.page_title || `${service.service_name} | InsightMatrix Research`;
  const description =
    service.seo.meta_description ||
    service.hero.subtitle ||
    "InsightMatrix Research provides global market research and data collection services.";
  const url = `https://www.insightmatrix.online/services/${service.slug}`;

  return {
    title,
    description,
    keywords: Array.isArray(service.seo?.keywords) ? service.seo.keywords : undefined,
    alternates: {
      canonical: service.seo?.canonicalUrl || url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "InsightMatrix Research",
      type: "website",
      images: [
        {
          url: service.seo?.ogImage || "https://www.insightmatrix.online/images/og-image.png",
          width: 1200,
          height: 630,
          alt: service.service_name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await fetchServerServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  // Generate JSON-LD Structured Data for Service & FAQs (SEO Supercharge)
  const jsonLdService = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.service_name,
    description: service.seo.meta_description || service.hero.subtitle,
    provider: {
      "@type": "Organization",
      name: "InsightMatrix Research",
      url: "https://www.insightmatrix.online",
      logo: "https://www.insightmatrix.online/images/logo.png",
      sameAs: [
        "https://www.linkedin.com/company/insightmatrixresearch",
        "https://www.instagram.com/insightmatrix_research",
      ],
    },
    areaServed: service.global_coverage?.regions || ["Global", "Worldwide"],
    serviceType: "Market Research & Data Collection",
    url: `https://www.insightmatrix.online/services/${service.slug}`,
  };

  const jsonLdFaq = service.faqs?.items?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: service.faqs.items.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }}
      />
      {jsonLdFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      )}
      <ServiceDetailView service={service} />
    </>
  );
}
