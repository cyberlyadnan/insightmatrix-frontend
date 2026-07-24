"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import { FormActionBar, getFormSubmitIntent } from "@/components/crm/form-action-bar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VendorCallbackFields } from "@/components/admin/vendor-callback-fields";
import { ROUTES } from "@/constants/routes";
import { useFormHydrateFromDefaults } from "@/hooks/use-form-hydrate-from-defaults";
import type { Vendor } from "@/types/vendor";
import { normalizeVendorCallbackUrls } from "@/utils/vendor-callback";
import { vendorCreateFormSchema, vendorEditFormSchema, type VendorFormValues } from "@/validations";

export { emptyVendorFormValues } from "@/validations";

export function vendorToFormValues(vendor: Vendor): VendorFormValues {
  return {
    companyName: vendor.companyName,
    contactPerson: vendor.contactPerson ?? "",
    email: vendor.email,
    password: "",
    phone: vendor.phone ?? "",
    website: vendor.website ?? "",
    callbackUrls: normalizeVendorCallbackUrls(vendor.callbackUrls),
    notes: vendor.notes ?? "",
    status: vendor.status,
  };
}

type VendorFormProps = {
  mode: "create" | "edit";
  entityId?: string;
  defaultValues: VendorFormValues;
  vendorCode?: string;
  onSubmit: (
    values: VendorFormValues,
    options: { continueEditing: boolean }
  ) => void | Promise<void>;
  isSubmitting: boolean;
  cancelHref?: string;
};

export function VendorForm({
  mode,
  entityId,
  defaultValues,
  vendorCode,
  onSubmit,
  isSubmitting,
  cancelHref = ROUTES.admin.vendors,
}: VendorFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<VendorFormValues>({
    resolver: zodResolver(mode === "create" ? vendorCreateFormSchema : vendorEditFormSchema),
    defaultValues,
  });

  useFormHydrateFromDefaults(form, defaultValues, { mode, entityId });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          const continueEditing = getFormSubmitIntent(e) === "continue";
          void form.handleSubmit((values) => onSubmit(values, { continueEditing }))(e);
        }}
        className="space-y-8"
      >
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-lg font-black text-gray-900 mb-2 pb-4 border-b border-gray-100">
            Account & company
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {mode === "create"
              ? "A unique internal vendor code (VND-*) is generated automatically on create."
              : "Vendor code cannot be changed after creation."}{" "}
            This is not the supplier{" "}
            <code className="text-xs font-mono bg-gray-100 px-1 rounded">vid</code> on external
            survey URLs.
          </p>
          {mode === "edit" && vendorCode ? (
            <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Vendor code
              </p>
              <p className="mt-1 font-mono text-sm font-bold text-brand-primary">{vendorCode}</p>
            </div>
          ) : null}
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-gray-700 font-bold">Company name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Acme Subpanel Ltd"
                      className="rounded-xl border-gray-200 h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-bold">Contact person</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Primary contact"
                      className="rounded-xl border-gray-200 h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-bold">Login email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="off"
                      className="rounded-xl border-gray-200 h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-gray-700 font-bold">
                    {mode === "create" ? "Password" : "New password"}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder={
                          mode === "create" ? "Min. 8 characters" : "Leave blank to keep current"
                        }
                        className="rounded-xl border-gray-200 h-11 pr-11"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  {mode === "edit" ? (
                    <p className="text-xs text-gray-500">
                      Set a new portal login password for this vendor. Leave empty to keep the
                      existing password.
                    </p>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-bold">Phone</FormLabel>
                  <FormControl>
                    <Input className="rounded-xl border-gray-200 h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-bold">Status</FormLabel>
                  <FormControl>
                    <select
                      className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-900 bg-white"
                      value={field.value ?? "active"}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    >
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-lg font-black text-gray-900 mb-6 pb-4 border-b border-gray-100">
            Callback configuration
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Separate outcome URLs for vendor callback relay (same concept as supplier callbacks).
          </p>
          <VendorCallbackFields control={form.control} />
        </div>

        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-lg font-black text-gray-900 mb-6 pb-4 border-b border-gray-100">
            Other
          </h2>
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-bold">Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      className="rounded-xl border-gray-200 h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-bold">Internal notes</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      className="rounded-xl border-gray-200 resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormActionBar isSubmitting={isSubmitting} cancelHref={cancelHref} />
      </form>
    </Form>
  );
}
