export const PANEL_BOOK_ORG_TYPES = [
  "media_publisher",
  "brand_advertiser",
  "agency",
  "consultancy",
  "academic",
  "other",
] as const;

export type PanelBookOrgType = (typeof PANEL_BOOK_ORG_TYPES)[number];

export const PANEL_BOOK_ORG_LABELS: Record<PanelBookOrgType, string> = {
  media_publisher: "Media publisher",
  brand_advertiser: "Brand / advertiser",
  agency: "Agency",
  consultancy: "Consultancy",
  academic: "Academic",
  other: "Other",
};
