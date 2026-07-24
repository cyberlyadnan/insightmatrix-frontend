"use client";

import Link from "next/link";
import type { FormEvent } from "react";

import { LoadingButton } from "@/components/crm/loading-button";
import { cn } from "@/lib/utils";

export type FormSubmitIntent = "save" | "continue";

/** Read Save vs Save & Continue from the clicked submit button (`data-intent`). */
export function getFormSubmitIntent(e: FormEvent<HTMLFormElement>): FormSubmitIntent {
  const submitter = (e.nativeEvent as SubmitEvent).submitter;
  if (submitter instanceof HTMLElement && submitter.dataset.intent === "continue") {
    return "continue";
  }
  return "save";
}

type FormActionBarProps = {
  isSubmitting?: boolean;
  cancelHref: string;
  saveLabel?: string;
  continueLabel?: string;
  cancelLabel?: string;
  className?: string;
  sticky?: boolean;
};

/**
 * Standard create/edit actions in order: Save → Save & Continue → Cancel.
 * Place inside a `<form>`; Save / Save & Continue are `type="submit"`.
 */
export function FormActionBar({
  isSubmitting = false,
  cancelHref,
  saveLabel = "Save",
  continueLabel = "Save & Continue",
  cancelLabel = "Cancel",
  className,
  sticky = true,
}: FormActionBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-end",
        sticky && "sticky bottom-0 z-20 -mx-1 bg-gray-50/95 px-1 py-4 backdrop-blur-sm sm:border-t",
        className
      )}
    >
      <LoadingButton
        type="submit"
        data-intent="save"
        loading={isSubmitting}
        loadingText="Saving…"
        className="bg-gray-900 text-white hover:bg-black"
      >
        {saveLabel}
      </LoadingButton>
      <LoadingButton
        type="submit"
        data-intent="continue"
        loading={isSubmitting}
        loadingText="Saving…"
        className="border border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
      >
        {continueLabel}
      </LoadingButton>
      <Link
        href={cancelHref}
        className={cn(
          "inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-6 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors",
          isSubmitting && "pointer-events-none opacity-60"
        )}
        aria-disabled={isSubmitting}
      >
        {cancelLabel}
      </Link>
    </div>
  );
}
