import { z } from "zod";
import { SURVEY_PROVIDER_TYPES } from "@/constants/survey-company";

const providerEnum = z.enum(SURVEY_PROVIDER_TYPES);

export const surveyCompanyFormSchema = z.object({
  companyName: z.string().min(2, "Name must be at least 2 characters").max(200),
  companyCode: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(40)
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/, "Use letters, numbers, hyphen or underscore"),
  contactPersonName: z.string().max(120),
  companyEmail: z
    .string()
    .max(254)
    .refine((v) => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Invalid email"),
  companyPhone: z.string().max(40),
  websiteUrl: z
    .string()
    .max(500)
    .refine((v) => {
      if (!v.trim()) return true;
      try {
        new URL(v);
        return true;
      } catch {
        return false;
      }
    }, "Enter a valid URL"),
  providerType: providerEnum,
  status: z.enum(["active", "inactive"]),
  notes: z.string().max(8000),
});

export type SurveyCompanyFormValues = z.infer<typeof surveyCompanyFormSchema>;
