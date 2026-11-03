"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Building2,
  CheckCircle2,
  Globe,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Radio,
  Save,
  ShieldCheck,
  Store,
  User,
  Zap,
} from "lucide-react";

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
import { emptyVendorCallbackUrls } from "@/constants/vendor-callback";
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
  website: z.string().url("Enter a valid URL (https://…)").or(z.literal("")).optional(),
  callbackUrls: vendorCallbackUrlsSchema,
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password must be at least 8 characters"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function VendorProfilePage() {
  const vendor = useVendorAuthStore((s) => s.vendor);
  const setVendor = useVendorAuthStore((s) => s.setVendor);
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<"company" | "postbacks" | "security">("company");

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
      toast.success("Profile and postback settings saved successfully");
    },
    onError: (e) => toast.error(parseApiError(e, "Could not update profile")),
  });

  const passwordMutation = useMutation({
    mutationFn: changeVendorPassword,
    onSuccess: () => {
      passwordForm.reset();
      toast.success("Password changed successfully");
    },
    onError: (e) => toast.error(parseApiError(e, "Could not change password")),
  });

  const onSaveProfile = profileForm.handleSubmit((values) => {
    profileMutation.mutate({
      ...values,
      callbackUrls: vendorCallbackUrlsToPayload(values.callbackUrls),
    });
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Header Banner */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-indigo-600 text-white shadow-lg shadow-brand-primary/20">
              <Store className="h-8 w-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-brand-subtle px-2.5 py-0.5 text-xs font-mono font-bold text-brand-primary border border-brand-light">
                  {vendor?.vendorCode || "VENDOR"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Partner
                </span>
              </div>
              <h1 className="mt-1 text-2xl font-black text-gray-900 tracking-tight">
                {vendor?.companyName ?? "Partner Profile"}
              </h1>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                <Mail className="h-3 w-3 text-gray-400" />
                {vendor?.email}
              </p>
            </div>
          </div>

          {/* Quick tab switcher */}
          <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1.5 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("company")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === "company"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              Company
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("postbacks")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === "postbacks"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Radio className="h-3.5 w-3.5 text-emerald-600" />
              S2S Postbacks
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === "security"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              Security
            </button>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <Form {...profileForm}>
        <form onSubmit={onSaveProfile} className="space-y-8">
          {/* TAB 1: Company Profile */}
          {activeTab === "company" && (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-brand-primary" />
                  Company Information
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Manage primary business details and representative contact information.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={profileForm.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-700">
                        Company Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Acme Panel Group Inc."
                          className="h-11 rounded-xl border-gray-200 bg-slate-50/50 text-sm focus:bg-white transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                    Vendor Partner Code
                  </label>
                  <Input
                    value={vendor?.vendorCode || ""}
                    disabled
                    className="h-11 rounded-xl border-gray-200 bg-slate-100 text-sm font-mono text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-gray-400">
                    Assigned identifier for campaign routing attribution.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                    Account Email
                  </label>
                  <Input
                    value={vendor?.email || ""}
                    disabled
                    className="h-11 rounded-xl border-gray-200 bg-slate-100 text-sm text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-gray-400">
                    Primary login email. Contact account manager to change.
                  </p>
                </div>

                <FormField
                  control={profileForm.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-700">
                        Primary Contact Person
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          className="h-11 rounded-xl border-gray-200 bg-slate-50/50 text-sm focus:bg-white transition-colors"
                          {...field}
                        />
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
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-700">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1 (555) 000-0000"
                          className="h-11 rounded-xl border-gray-200 bg-slate-50/50 text-sm focus:bg-white transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-700">
                        Official Website
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com"
                          className="h-11 rounded-xl border-gray-200 bg-slate-50/50 text-sm focus:bg-white transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button
                  type="submit"
                  disabled={profileMutation.isPending}
                  className="rounded-xl bg-gray-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-black transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {profileMutation.isPending ? "Saving changes…" : "Save Company Profile"}
                </Button>
              </div>
            </div>
          )}

          {/* TAB 2: S2S Postbacks */}
          {activeTab === "postbacks" && (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                    <Radio className="h-4 w-4 text-emerald-600" />
                    Server-to-Server (S2S) Callback Postbacks
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                    Automatic Webhook Dispatch
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  InsightMatrix automatically makes an HTTP GET request to these endpoints when your
                  respondents finish a research study.
                </p>
              </div>

              {/* Macro Explanation Card */}
              <div className="rounded-2xl border border-brand-light bg-gradient-to-br from-brand-subtle/50 to-white p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-primary">
                  <Zap className="h-4 w-4" />
                  Dynamic URL Macros Supported
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Include these macro tokens anywhere in your callback URLs. Our server replaces
                  them with live session data before calling your server:
                </p>
                <div className="grid gap-2 sm:grid-cols-2 text-xs">
                  <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <code className="font-mono font-bold text-brand-primary">[toid]</code>
                      <span className="text-[10px] uppercase font-bold text-gray-400">
                        Respondent ID
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-gray-500">
                      Replaced with the exact value passed in your routing URL{" "}
                      <code className="font-mono text-gray-700">?toid=...</code>
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <code className="font-mono font-bold text-brand-primary">[status]</code>
                      <span className="text-[10px] uppercase font-bold text-gray-400">
                        Outcome Code
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-gray-500">
                      Outcome code: <code className="font-mono">1</code> (Complete),{" "}
                      <code className="font-mono">2</code> (Terminate),{" "}
                      <code className="font-mono">3</code> (Quota full),{" "}
                      <code className="font-mono">4</code> (Reject).
                    </p>
                  </div>
                </div>
              </div>

              {/* Postback URL Form Fields */}
              <div className="space-y-5">
                <FormField
                  control={profileForm.control}
                  name="callbackUrls.complete"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          Complete Callback URL
                        </FormLabel>
                        <span className="text-[10px] font-bold text-emerald-600">Status: 1</span>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="https://yourdomain.com/postback?user_id=[toid]&status=complete"
                          className="h-11 rounded-xl border-gray-200 bg-slate-50/50 font-mono text-xs focus:bg-white transition-colors"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <p className="text-[11px] text-gray-500">
                        Called when the respondent successfully completes the survey.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="callbackUrls.terminate"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                          <Radio className="h-3.5 w-3.5 text-amber-600" />
                          Terminate / Screenout Callback URL
                        </FormLabel>
                        <span className="text-[10px] font-bold text-amber-600">Status: 2</span>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="https://yourdomain.com/postback?user_id=[toid]&status=terminate"
                          className="h-11 rounded-xl border-gray-200 bg-slate-50/50 font-mono text-xs focus:bg-white transition-colors"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <p className="text-[11px] text-gray-500">
                        Called when the respondent is screened out or does not meet qualification
                        criteria.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="callbackUrls.quota_full"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                          <Radio className="h-3.5 w-3.5 text-sky-600" />
                          Quota Full Callback URL
                        </FormLabel>
                        <span className="text-[10px] font-bold text-sky-600">Status: 3</span>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="https://yourdomain.com/postback?user_id=[toid]&status=quotafull"
                          className="h-11 rounded-xl border-gray-200 bg-slate-50/50 font-mono text-xs focus:bg-white transition-colors"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <p className="text-[11px] text-gray-500">
                        Called when the target survey quota or demographic cell is full.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="callbackUrls.quality_reject"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-rose-600" />
                          Quality Reject Callback URL
                        </FormLabel>
                        <span className="text-[10px] font-bold text-rose-600">Status: 4</span>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="https://yourdomain.com/postback?user_id=[toid]&status=rejected"
                          className="h-11 rounded-xl border-gray-200 bg-slate-50/50 font-mono text-xs focus:bg-white transition-colors"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <p className="text-[11px] text-gray-500">
                        Called when speeder traps or fraud checks reject the respondent.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button
                  type="submit"
                  disabled={profileMutation.isPending}
                  className="rounded-xl bg-gray-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-black transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {profileMutation.isPending ? "Saving changes…" : "Save Postback Endpoints"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>

      {/* TAB 3: Account Security */}
      {activeTab === "security" && (
        <section className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-brand-primary" />
              Account Password
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Ensure your vendor account uses a long, secure password.
            </p>
          </div>

          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit((values) =>
                passwordMutation.mutate({
                  currentPassword: values.currentPassword,
                  newPassword: values.newPassword,
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
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-700">
                        Current Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="current-password"
                          className="h-11 rounded-xl border-gray-200 bg-slate-50/50 text-sm focus:bg-white transition-colors"
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
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-700">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
                          className="h-11 rounded-xl border-gray-200 bg-slate-50/50 text-sm focus:bg-white transition-colors"
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
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-700">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
                          className="h-11 rounded-xl border-gray-200 bg-slate-50/50 text-sm focus:bg-white transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button
                  type="submit"
                  disabled={passwordMutation.isPending}
                  className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-xs font-bold text-gray-700 hover:bg-slate-50 transition-colors"
                >
                  <Lock className="h-4 w-4 mr-2 text-gray-500" />
                  {passwordMutation.isPending ? "Updating password…" : "Change Password"}
                </Button>
              </div>
            </form>
          </Form>
        </section>
      )}
    </div>
  );
}
