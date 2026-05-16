import { COUNTRIES } from "@/constants/countries-data";
import { COUNTRY_ISO_BY_NAME } from "@/constants/country-iso-codes";

export type TargetingOption = { value: string; label: string };

/** Countries for survey targeting (ISO code stored, full name shown). */
export const PANEL_COUNTRY_OPTIONS: TargetingOption[] = COUNTRIES.map((name) => {
  const code = COUNTRY_ISO_BY_NAME[name] ?? name.slice(0, 2).toUpperCase();
  return { value: code, label: `${name} (${code})` };
}).sort((a, b) => a.label.localeCompare(b.label));

/** Employment / profession tokens (aligned with panel matching & seeds). */
export const PANEL_PROFESSION_OPTIONS: TargetingOption[] = [
  { value: "employed_full_time", label: "Employed full-time" },
  { value: "employed_part_time", label: "Employed part-time" },
  { value: "part_time", label: "Part-time" },
  { value: "full_time", label: "Full-time" },
  { value: "self_employed", label: "Self-employed / freelancer" },
  { value: "freelancer", label: "Freelancer" },
  { value: "student", label: "Student" },
  { value: "it", label: "IT / technology" },
  { value: "security", label: "Security" },
  { value: "operations", label: "Operations" },
  { value: "homemaker", label: "Homemaker" },
  { value: "retired", label: "Retired" },
  { value: "unemployed", label: "Not employed" },
  { value: "prefer_not", label: "Prefer not to say" },
];

/** Industry slugs used in routing surveys & member prescreen. */
export const PANEL_INDUSTRY_OPTIONS: TargetingOption[] = [
  { value: "retail", label: "Retail" },
  { value: "cpg", label: "Consumer packaged goods (CPG)" },
  { value: "luxury_goods", label: "Luxury goods" },
  { value: "fashion", label: "Fashion" },
  { value: "automotive", label: "Automotive" },
  { value: "banking", label: "Banking / financial services" },
  { value: "finance", label: "Finance / insurance" },
  { value: "saas", label: "SaaS / software" },
  { value: "enterprise_software", label: "Enterprise software" },
  { value: "technology", label: "Technology / IT" },
  { value: "tech", label: "Technology (general)" },
  { value: "healthcare", label: "Healthcare / life sciences" },
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  { value: "government", label: "Government / public sector" },
  { value: "gov", label: "Government" },
  { value: "media", label: "Media / marketing / advertising" },
  { value: "hospitality", label: "Hospitality / travel" },
  { value: "mfg", label: "Manufacturing / industrial" },
  { value: "energy", label: "Energy / utilities" },
  { value: "real_estate", label: "Real estate" },
  { value: "telecom", label: "Telecommunications" },
  { value: "agriculture", label: "Agriculture" },
  { value: "other", label: "Other / not applicable" },
];

export const PANEL_COMPANY_SIZE_OPTIONS: TargetingOption[] = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-1000", label: "201–1,000 employees" },
  { value: "1000+", label: "1,000+ employees" },
  { value: "enterprise", label: "Enterprise (1,000+)" },
];

export const PANEL_LANGUAGE_OPTIONS: TargetingOption[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "it", label: "Italian" },
  { value: "nl", label: "Dutch" },
  { value: "pl", label: "Polish" },
  { value: "ru", label: "Russian" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
  { value: "tr", label: "Turkish" },
  { value: "vi", label: "Vietnamese" },
  { value: "th", label: "Thai" },
  { value: "id", label: "Indonesian" },
  { value: "ms", label: "Malay" },
  { value: "sv", label: "Swedish" },
  { value: "no", label: "Norwegian" },
  { value: "da", label: "Danish" },
  { value: "fi", label: "Finnish" },
  { value: "el", label: "Greek" },
  { value: "he", label: "Hebrew" },
  { value: "uk", label: "Ukrainian" },
];
