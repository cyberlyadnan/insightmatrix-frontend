"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

import { splitLines } from "@/validations/panel-survey.schema";
import type { TargetingOption } from "@/constants/panel-targeting-options";
import { cn } from "@/lib/utils";

function joinValues(values: string[]): string {
  return values.join(", ");
}

type TargetingMultiSelectProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: TargetingOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
};

export function TargetingMultiSelect({
  value,
  onChange,
  onBlur,
  options,
  placeholder = "Select one or more…",
  searchPlaceholder = "Search…",
  emptyMessage = "No matches",
  disabled,
  className,
}: TargetingMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = useMemo(() => splitLines(value), [value]);
  const selectedSet = useMemo(() => new Set(selected.map((v) => v.toLowerCase())), [selected]);

  const optionByValue = useMemo(() => {
    const m = new Map<string, TargetingOption>();
    for (const o of options) m.set(o.value.toLowerCase(), o);
    return m;
  }, [options]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
    );
  }, [options, query]);

  const toggle = (optionValue: string) => {
    const key = optionValue.toLowerCase();
    const next = new Set(selected);
    const existing = [...next].find((v) => v.toLowerCase() === key);
    if (existing) next.delete(existing);
    else next.add(optionValue);
    onChange(joinValues([...next]));
  };

  const remove = (optionValue: string) => {
    const key = optionValue.toLowerCase();
    onChange(joinValues(selected.filter((v) => v.toLowerCase() !== key)));
  };

  const labelFor = (v: string) => optionByValue.get(v.toLowerCase())?.label ?? v;

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onBlur={onBlur}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={cn(
          "flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-900 shadow-sm transition",
          "hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <span className="flex-1 truncate text-gray-500">
          {selected.length === 0 ? placeholder : `${selected.length} selected`}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-gray-400 transition", open && "rotate-180")}
        />
      </button>

      {selected.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {selected.map((v) => (
            <span
              key={v}
              className="inline-flex max-w-full items-center gap-1 rounded-full border border-brand-light bg-brand-subtle px-2.5 py-1 text-xs font-semibold text-gray-800"
            >
              <span className="truncate">{labelFor(v)}</span>
              <button
                type="button"
                disabled={disabled}
                onClick={() => remove(v)}
                className="rounded-full p-0.5 hover:bg-brand-light"
                aria-label={`Remove ${labelFor(v)}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Close"
            onClick={() => {
              setOpen(false);
              setQuery("");
              onBlur?.();
            }}
          />
          <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="border-b border-gray-100 p-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  autoFocus
                />
              </div>
            </div>
            <ul className="max-h-80 overflow-y-auto py-1" role="listbox">
              {filtered.length === 0 ? (
                <li className="px-3 py-2.5 text-sm text-gray-500">{emptyMessage}</li>
              ) : (
                filtered.map((opt) => {
                  const checked = selectedSet.has(opt.value.toLowerCase());
                  return (
                    <li key={`${opt.value}-${opt.label}`}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={checked}
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-gray-900 hover:bg-gray-50",
                          checked && "bg-brand-subtle"
                        )}
                        onClick={() => toggle(opt.value)}
                      >
                        <span
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                            checked
                              ? "border-brand-primary bg-brand-primary text-white"
                              : "border-gray-300 bg-white"
                          )}
                        >
                          {checked ? <Check className="h-3 w-3" /> : null}
                        </span>
                        <span className="truncate">{opt.label}</span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
            {filtered.length > 0 ? (
              <p className="border-t border-gray-100 px-3 py-2 text-xs text-gray-500">
                {filtered.length === options.length
                  ? `${options.length} countries — scroll or search`
                  : `${filtered.length} of ${options.length} countries`}
              </p>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
