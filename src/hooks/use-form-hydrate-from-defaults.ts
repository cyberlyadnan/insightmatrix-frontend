import { useEffect, useRef } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

type Options = {
  mode: "create" | "edit";
  /** Survey / vendor / company id — only edit mode resets when this changes */
  entityId?: string;
};

/**
 * Hydrates edit forms once per entity. Create forms are never auto-reset (preserves drafts).
 * Avoids wiping user input when React Query refetches or the parent re-renders.
 */
export function useFormHydrateFromDefaults<T extends FieldValues>(
  form: UseFormReturn<T>,
  defaultValues: T,
  { mode, entityId }: Options
) {
  const hydratedEntityRef = useRef<string | null>(null);

  useEffect(() => {
    if (mode === "create") return;

    const key = entityId?.trim() ?? "";
    if (!key) return;
    if (hydratedEntityRef.current === key) return;

    form.reset(defaultValues);
    hydratedEntityRef.current = key;
  }, [mode, entityId, defaultValues, form]);
}
