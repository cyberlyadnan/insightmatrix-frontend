import * as z from "zod";

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => !v || /^https?:\/\/.+/i.test(v), "Enter a valid URL (https://…)");

export const vendorCallbackUrlsSchema = z.object({
  complete: optionalUrl,
  terminate: optionalUrl,
  quota_full: optionalUrl,
  quality_reject: optionalUrl,
});

const optionalPassword = z
  .string()
  .max(128)
  .refine((v) => v === "" || v.length >= 8, "Password must be at least 8 characters");

export const vendorFormSchema = z.object({
  companyName: z.string().min(2, "Company name is required").max(200),
  contactPerson: z.string().max(120).optional(),
  email: z.string().trim().email("Enter a valid email").max(254),
  password: optionalPassword.optional(),
  phone: z.string().max(40).optional(),
  website: optionalUrl.optional(),
  callbackUrls: vendorCallbackUrlsSchema,
  notes: z.string().max(16000).optional(),
  status: z.enum(["active", "paused", "suspended"]).optional(),
});

export type VendorFormValues = z.infer<typeof vendorFormSchema>;

export const vendorCreateFormSchema = vendorFormSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export type VendorCreateFormValues = z.infer<typeof vendorCreateFormSchema>;

/** Edit: all fields optional password (blank = unchanged). */
export const vendorEditFormSchema = vendorFormSchema;

export type VendorEditFormValues = z.infer<typeof vendorEditFormSchema>;

export const emptyVendorFormValues: VendorFormValues = {
  companyName: "",
  contactPerson: "",
  email: "",
  password: "",
  phone: "",
  website: "",
  callbackUrls: {
    complete: "",
    terminate: "",
    quota_full: "",
    quality_reject: "",
  },
  notes: "",
  status: "active",
};
