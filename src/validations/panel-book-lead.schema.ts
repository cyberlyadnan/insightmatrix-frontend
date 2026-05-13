import { z } from "zod";

export const panelBookLeadFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  workEmail: z.string().trim().email("Enter a valid work email").max(254),
  companyName: z.string().trim().min(1, "Company name is required").max(200),
  organizationType: z.enum(
    ["media_publisher", "brand_advertiser", "agency", "consultancy", "academic", "other"],
    { message: "Please select an option" }
  ),
  jobTitle: z.string().trim().min(1, "Job title is required").max(120),
  country: z.string().length(2, "Select a country"),
  acceptedTerms: z.boolean().refine((v) => v === true, {
    message: "You must accept the Terms and Privacy Policy",
  }),
});

export type PanelBookLeadFormValues = z.infer<typeof panelBookLeadFormSchema>;
