"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { ROUTES } from "@/constants/routes";
import {
  SURVEY_PROVIDER_LABELS,
  SURVEY_PROVIDER_TYPES,
  type SurveyProviderType,
} from "@/constants/survey-company";
import type { SurveyCompany } from "@/services/survey-company";
import { useFormHydrateFromDefaults } from "@/hooks/use-form-hydrate-from-defaults";
import { surveyCompanyFormSchema, type SurveyCompanyFormValues } from "@/validations";

export const emptySurveyCompanyFormValues: SurveyCompanyFormValues = {
  companyName: "",
  companyCode: "",
  contactPersonName: "",
  companyEmail: "",
  companyPhone: "",
  websiteUrl: "",
  providerType: "sample_exchange",
  status: "active",
  notes: "",
};

export function surveyCompanyToFormValues(company: SurveyCompany): SurveyCompanyFormValues {
  return {
    companyName: company.companyName,
    companyCode: company.companyCode,
    contactPersonName: company.contactPersonName ?? "",
    companyEmail: company.companyEmail ?? "",
    companyPhone: company.companyPhone ?? "",
    websiteUrl: company.websiteUrl ?? "",
    providerType: company.providerType as SurveyProviderType,
    status: company.status,
    notes: company.notes ?? "",
  };
}

type SurveyCompanyFormProps = {
  mode: "create" | "edit";
  entityId?: string;
  defaultValues: SurveyCompanyFormValues;
  onSubmit: (
    values: SurveyCompanyFormValues,
    options: { continueEditing: boolean }
  ) => void | Promise<void>;
  isSubmitting: boolean;
  cancelHref?: string;
};

export function SurveyCompanyForm({
  mode,
  entityId,
  defaultValues,
  onSubmit,
  isSubmitting,
  cancelHref = ROUTES.admin.companies,
}: SurveyCompanyFormProps) {
  const form = useForm<SurveyCompanyFormValues>({
    resolver: zodResolver(surveyCompanyFormSchema),
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
          <h2 className="text-lg font-black text-gray-900 mb-6 pb-4 border-b border-gray-100">
            Basic information
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-bold">Company name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Dynata"
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
              name="companyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-bold">Company code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. DYNATA"
                      className="rounded-xl border-gray-200 h-11 uppercase"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      disabled={mode === "edit"}
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500">
                    Short unique ID used internally. Cannot be changed after creation.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="providerType"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-gray-700 font-bold">Provider type</FormLabel>
                  <FormControl>
                    <select
                      className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-900 bg-white"
                      {...field}
                    >
                      {SURVEY_PROVIDER_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {SURVEY_PROVIDER_LABELS[t]}
                        </option>
                      ))}
                    </select>
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
                      {...field}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
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
            Contact information
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="contactPersonName"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-gray-700 font-bold">Contact person</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Primary contact name"
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
              name="companyEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-bold">Company email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="partners@example.com"
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
              name="companyPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-bold">Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+1 …"
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
              name="websiteUrl"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-gray-700 font-bold">Website</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://"
                      className="rounded-xl border-gray-200 h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-lg font-black text-gray-900 mb-6 pb-4 border-b border-gray-100">
            Notes
          </h2>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-bold">Internal notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Integration details, SLAs, billing contacts…"
                    rows={5}
                    className="rounded-xl border-gray-200 min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormActionBar isSubmitting={isSubmitting} cancelHref={cancelHref} />
      </form>
    </Form>
  );
}
