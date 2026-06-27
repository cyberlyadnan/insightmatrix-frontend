"use client";

import { useEffect, useRef } from "react";
import type { Control, Path, UseFormGetValues, UseFormSetValue } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { PanelSurveyFormValues } from "@/validations/panel-survey.schema";

type QuotaPairFieldsProps = {
  control: Control<PanelSurveyFormValues>;
  setValue: UseFormSetValue<PanelSurveyFormValues>;
  getValues: UseFormGetValues<PanelSurveyFormValues>;
  totalName: Path<PanelSurveyFormValues>;
  remainingName: Path<PanelSurveyFormValues>;
  totalLabel?: string;
  remainingLabel?: string;
  /** Changes when form defaults load — re-detect whether remaining was customized */
  syncResetKey?: string;
  compact?: boolean;
};

function sanitizeQuotaDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function QuotaPairFields({
  control,
  setValue,
  getValues,
  totalName,
  remainingName,
  totalLabel = "Total quota",
  remainingLabel = "Remaining quota",
  syncResetKey,
  compact = false,
}: QuotaPairFieldsProps) {
  const remainingUnlinkedRef = useRef(false);

  useEffect(() => {
    const total = String(getValues(totalName) ?? "").trim();
    const remaining = String(getValues(remainingName) ?? "").trim();
    remainingUnlinkedRef.current = total !== remaining;
  }, [syncResetKey, getValues, totalName, remainingName]);

  const inputClass = compact ? "rounded-xl border-gray-200" : "rounded-xl h-11 border-gray-200";

  return (
    <>
      <FormField
        control={control}
        name={totalName}
        render={({ field }) => (
          <FormItem className={compact ? undefined : undefined}>
            <FormLabel className={compact ? "text-gray-700 font-bold" : "font-bold text-gray-700"}>
              {totalLabel}
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                className={inputClass}
                placeholder="0"
                name={field.name}
                ref={field.ref}
                value={typeof field.value === "string" ? field.value : String(field.value ?? "")}
                onBlur={field.onBlur}
                onChange={(e) => {
                  const next = sanitizeQuotaDigits(e.target.value);
                  field.onChange(next);
                  if (!remainingUnlinkedRef.current) {
                    setValue(remainingName, next, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={remainingName}
        render={({ field }) => (
          <FormItem>
            <FormLabel className={compact ? "text-gray-700 font-bold" : "font-bold text-gray-700"}>
              {remainingLabel}
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                className={inputClass}
                placeholder="0"
                name={field.name}
                ref={field.ref}
                value={typeof field.value === "string" ? field.value : String(field.value ?? "")}
                onBlur={field.onBlur}
                onChange={(e) => {
                  const next = sanitizeQuotaDigits(e.target.value);
                  field.onChange(next);
                  const total = String(getValues(totalName) ?? "").trim();
                  remainingUnlinkedRef.current = next !== total;
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
