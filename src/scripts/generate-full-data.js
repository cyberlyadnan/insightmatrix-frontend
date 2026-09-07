/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const parsedPath = path.join(__dirname, "../constants/parsed-content.json");
const rawData = JSON.parse(fs.readFileSync(parsedPath, "utf8"));

// Build detailed structured sections
const sections = rawData.sections.map((sec, idx) => {
  const cleanTitle = sec.title.trim();
  const slug = cleanTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  let pageTitle = "";
  let metaDescription = "";
  let heroTitle = "";
  let heroSubtitle = "";
  let primaryCta = "";
  let secondaryCta = "";
  let overview = [];
  let offerings = [];
  let audiences = [];
  let industries = [];
  let methodologies = [];
  let qualityAssurance = [];
  let whyChooseUs = [];
  let process = [];
  let faqs = [];
  let ctaBanner = { heading: "", text: "", button: "" };

  sec.blocks.forEach((block) => {
    const t = (block.title || "").trim();
    const contentArr = block.content || [];
    const text = contentArr.join("\n").trim();
    const items = block.items || [];

    if (/page\s*title|seo\s*title/i.test(t)) {
      pageTitle = text;
    } else if (/meta\s*description/i.test(t)) {
      metaDescription = text;
    } else if (/subtitle/i.test(t)) {
      heroSubtitle = text;
    } else if (/primary\s*cta/i.test(t)) {
      primaryCta = text.replace(/\*\*/g, "");
    } else if (/secondary\s*cta/i.test(t)) {
      secondaryCta = text.replace(/\*\*/g, "");
    } else if (/^cta$/i.test(t) && !primaryCta) {
      primaryCta = text.replace(/\*\*/g, "");
    } else if (
      t === "H1" ||
      /hero\s*section/i.test(t) ||
      (!heroTitle &&
        block.type === "h1" &&
        !/OVERVIEW|OFFER|SERVICE|AUDIENCE|METHOD|QUALITY|WHY|PROCESS|FAQ|CTA|LINK|DEVELOPER|LAYOUT/i.test(
          t
        ))
    ) {
      if (t !== "H1" && !/hero\s*section/i.test(t)) {
        heroTitle = t;
      }
    } else if (/overview|introduction|brand statement|vision|mission/i.test(t)) {
      if (text || items.length > 0) {
        overview.push({ title: t, text, items });
      }
    } else if (t.includes("?") || /faq|frequently\s*asked/i.test(t)) {
      if (t.includes("?")) {
        faqs.push({ question: t, answer: text || items.join("\n") });
      }
    } else if (/offer|service|what we offer|our .* services/i.test(t)) {
      if (items.length > 0) {
        offerings.push(...items);
      } else if (text) {
        offerings.push(text);
      }
    } else if (/audience/i.test(t)) {
      audiences.push({ category: t, items: items.length > 0 ? items : [text] });
    } else if (/methodolog/i.test(t)) {
      methodologies.push(...(items.length > 0 ? items : [text]));
    } else if (/quality/i.test(t)) {
      qualityAssurance.push(...(items.length > 0 ? items : [text]));
    } else if (/industr/i.test(t)) {
      industries.push(...(items.length > 0 ? items : [text]));
    } else if (
      /step\s*\d+|discovery|feasibility|project setup|recruitment|live monitoring|data validation|final delivery/i.test(
        t
      )
    ) {
      process.push({ step: t, description: text || items.join("\n") });
    } else if (/why\s*insightmatrix|why\s*choose|why\s*clients/i.test(t)) {
      if (items.length > 0) {
        whyChooseUs.push({ title: t, description: items.join("; ") });
      }
    } else if (block.type === "h3" && text) {
      whyChooseUs.push({ title: t, description: text });
    } else if (/final\s*cta|looking for/i.test(t)) {
      ctaBanner = {
        heading: t,
        text: text,
        button: primaryCta || "Contact Us",
      };
    }
  });

  return {
    id: idx + 1,
    title: cleanTitle,
    slug,
    pageTitle: pageTitle || cleanTitle,
    metaDescription: metaDescription || "",
    heroTitle: heroTitle || cleanTitle,
    heroSubtitle: heroSubtitle || "",
    primaryCta: primaryCta || "Get Started",
    secondaryCta: secondaryCta || "Contact Sales",
    overview,
    offerings,
    audiences,
    industries,
    methodologies,
    qualityAssurance,
    whyChooseUs,
    process,
    faqs,
    ctaBanner,
    rawBlocks: sec.blocks,
  };
});

// Case studies structure extracted from all research and industry sections
const caseStudies = sections
  .filter((s) => s.offerings.length > 0 || s.audiences.length > 0 || s.methodologies.length > 0)
  .map((s, idx) => ({
    id: `cs-${idx + 1}`,
    slug: s.slug,
    title: s.heroTitle || s.title,
    category:
      s.title.includes("INDUSTRY") ||
      s.title.includes("PHARMA") ||
      s.title.includes("TECH") ||
      s.title.includes("BANKING") ||
      s.title.includes("RETAIL")
        ? "Industry Vertical"
        : "Research Methodology",
    subtitle: s.heroSubtitle,
    summary: s.metaDescription || s.heroSubtitle,
    keyCapabilities: s.offerings.slice(0, 8),
    targetAudiences: s.audiences,
    methodologies: s.methodologies,
    processSteps: s.process,
    qualityStandards: s.qualityAssurance,
    faqs: s.faqs,
    fullSectionId: s.id,
  }));

const fullDataset = {
  version: "2.0.0",
  client: "InsightMatrix Research",
  lastUpdated: new Date().toISOString(),
  totalSections: sections.length,
  brandFoundation: sections.find((s) => s.slug === "general") || sections[0],
  services: sections.filter(
    (s) =>
      !["general", "about-us"].includes(s.slug) &&
      !s.slug.includes("industry") &&
      ![
        "pharmaceutical-biotech-market-research",
        "technology-saas-market-research",
        "banking-financial-services-fintech-bfsi-market-research",
        "retail-e-commerce-market-research",
      ].includes(s.slug)
  ),
  industries: sections.filter(
    (s) =>
      s.slug.includes("industry") ||
      [
        "pharmaceutical-biotech-market-research",
        "technology-saas-market-research",
        "banking-financial-services-fintech-bfsi-market-research",
        "retail-e-commerce-market-research",
      ].includes(s.slug)
  ),
  caseStudies: caseStudies,
  allSections: sections,
  rawSections: rawData.sections,
};

const jsonOutPath = path.join(__dirname, "../constants/case-studies.json");
const clientContentJsonPath = path.join(__dirname, "../constants/client-content.json");
fs.writeFileSync(jsonOutPath, JSON.stringify(fullDataset, null, 2), "utf8");
fs.writeFileSync(clientContentJsonPath, JSON.stringify(fullDataset, null, 2), "utf8");

console.log(
  "Saved case-studies.json and client-content.json. Size in bytes:",
  fs.statSync(jsonOutPath).size
);
