"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VendorCallbackFields } from "@/components/admin/vendor-callback-fields";
import { emptyVendorCallbackUrls } from "@/constants/vendor-callback";
import {
  vendorFormLabelClass,
  vendorInputClass,
  vendorOutlineButtonClass,
  vendorPrimaryButtonClass,
} from "@/constants/vendor-ui";
import { parseApiError } from "@/services/api/errors";
import { normalizeVendorCallbackUrls, vendorCallbackUrlsToPayload } from "@/utils/vendor-callback";
import { vendorCallbackUrlsSchema } from "@/validations/vendor.schema";
import { changeVendorPassword, updateVendorProfile } from "@/services/vendor-portal";
import { queryKeys } from "@/services/queries";
import { useVendorAuthStore } from "@/store/vendorAuthStore";

const profileSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactPerson: z.string().max(120).optional(),
  phone: z.string().max(40).optional(),
  website: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
  callbackUrls: vendorCallbackUrlsSchema,
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(8),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function VendorProfilePage() {
  const vendor = useVendorAuthStore((s) => s.vendor);
  const setVendor = useVendorAuthStore((s) => s.setVendor);
  const qc = useQueryClient();

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      phone: "",
      website: "",
      callbackUrls: emptyVendorCallbackUrls(),
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (!vendor) return;
    profileForm.reset({
      companyName: vendor.companyName,
      contactPerson: vendor.contactPerson ?? "",
      phone: vendor.phone ?? "",
      website: vendor.website ?? "",
      callbackUrls: normalizeVendorCallbackUrls(vendor.callbackUrls),
    });
  }, [vendor, profileForm]);

  const profileMutation = useMutation({
    mutationFn: updateVendorProfile,
    onSuccess: async (updated) => {
      setVendor(updated);
      await qc.invalidateQueries({ queryKey: queryKeys.vendorAuth.profile });
      toast.success("Profile updated");
    },
    onError: (e) => toast.error(parseApiError(e, "Could not update profile")),
  });

  const passwordMutation = useMutation({
    mutationFn: changeVendorPassword,
    onSuccess: () => {
      passwordForm.reset();
      toast.success("Password changed");
    },
    onError: (e) => toast.error(parseApiError(e, "Could not change password")),
  });

  return (
    <div className="w-full space-y-8">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">
          Account
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-900">Profile</h1>
        <p className="mt-2 text-sm text-gray-500">
          Vendor code{" "}
          <span className="font-mono font-bold text-gray-900">{vendor?.vendorCode}</span> ·{" "}
          {vendor?.email}
        </p>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-500">
          Company details
        </h2>
        <Form {...profileForm}>
          <form
            onSubmit={profileForm.handleSubmit((v) =>
              profileMutation.mutate({
                ...v,
                callbackUrls: vendorCallbackUrlsToPayload(v.callbackUrls),
              })
            )}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={profileForm.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className={vendorFormLabelClass}>Company name</FormLabel>
                    <FormControl>
                      <Input className={vendorInputClass} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={vendorFormLabelClass}>Contact person</FormLabel>
                    <FormControl>
                      <Input className={vendorInputClass} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={vendorFormLabelClass}>Phone</FormLabel>
                    <FormControl>
                      <Input className={vendorInputClass} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={vendorFormLabelClass}>Website</FormLabel>
                    <FormControl>
                      <Input className={vendorInputClass} placeholder="https://" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <VendorCallbackFields control={profileForm.control} />
            <div className="flex justify-end border-t border-gray-100 pt-6">
              <Button
                type="submit"
                disabled={profileMutation.isPending}
                className={vendorPrimaryButtonClass}
              >
                {profileMutation.isPending ? "Saving…" : "Save profile"}
              </Button>
            </div>
          </form>
        </Form>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-500">Security</h2>
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit((v) =>
              passwordMutation.mutate({
                currentPassword: v.currentPassword,
                newPassword: v.newPassword,
              })
            )}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={vendorFormLabelClass}>Current password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        className={vendorInputClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={vendorFormLabelClass}>New password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        className={vendorInputClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={vendorFormLabelClass}>Confirm new password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        className={vendorInputClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end border-t border-gray-100 pt-6">
              <Button
                type="submit"
                disabled={passwordMutation.isPending}
                className={vendorOutlineButtonClass}
              >
                {passwordMutation.isPending ? "Updating…" : "Change password"}
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
}
