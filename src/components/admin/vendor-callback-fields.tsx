"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  VENDOR_CALLBACK_OUTCOMES,
  VENDOR_CALLBACK_OUTCOME_CONFIG,
  VENDOR_CALLBACK_RELAY_EXPLANATION,
  type VendorCallbackOutcome,
} from "@/constants/vendor-callback";
import { vendorInputClass } from "@/constants/vendor-ui";

type VendorCallbackFieldsProps<T extends FieldValues> = {
  control: Control<T>;
  namePrefix?: string;
};

function fieldName<T extends FieldValues>(
  prefix: string | undefined,
  outcome: VendorCallbackOutcome
): FieldPath<T> {
  return (prefix ? `${prefix}.${outcome}` : outcome) as FieldPath<T>;
}

export function VendorCallbackFields<T extends FieldValues>({
  control,
  namePrefix = "callbackUrls",
}: VendorCallbackFieldsProps<T>) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-brand-primary/15 bg-brand-primary/5 p-4 text-sm text-gray-700 md:col-span-2">
        <p className="font-bold text-gray-900 mb-1">Outcome callback relay (future)</p>
        <p>{VENDOR_CALLBACK_RELAY_EXPLANATION}</p>
        <p className="mt-2 text-xs text-gray-500">
          Flow: Supplier → InsightMatrix → Vendor panel → respondent → supplier callback to us → we
          forward to your URLs below.
        </p>
      </div>

      {VENDOR_CALLBACK_OUTCOMES.map((outcome) => {
        const config = VENDOR_CALLBACK_OUTCOME_CONFIG[outcome];
        return (
          <FormField
            key={outcome}
            control={control}
            name={fieldName<T>(namePrefix, outcome)}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold">{config.label}</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    inputMode="url"
                    placeholder={config.placeholder}
                    className={`${vendorInputClass} font-mono text-sm`}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <p className="text-xs text-gray-500">{config.description}</p>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      })}
    </div>
  );
}
