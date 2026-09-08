"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { PANEL_COUNTRY_OPTIONS } from "@/constants/panel-targeting-options";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

function normalizeCountry(value: string): string {
  const v = value.trim().toUpperCase();
  if (v === "UK" || v === "GBR") return "GB";
  return v;
}

export function CountrySearchSelect({
  value,
  onChange,
  onBlur,
  placeholder = "Search and select country…",
  disabled,
  required,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const normalized = value ? normalizeCountry(value) : "";

  const selected = useMemo(
    () => PANEL_COUNTRY_OPTIONS.find((o) => o.value.toUpperCase() === normalized) ?? null,
    [normalized]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PANEL_COUNTRY_OPTIONS;
    return PANEL_COUNTRY_OPTIONS.filter(
      (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className={cn("relative", className)}>
      {/* Keep a native required input for form validation */}
      <input type="hidden" value={normalized} required={required} readOnly />

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 text-left text-xs text-gray-900",
          "hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <span className={cn("truncate", !selected && "text-gray-400")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-gray-400 transition", open && "rotate-180")}
        />
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Close country list"
            onClick={() => {
              setOpen(false);
              setQuery("");
              onBlur?.();
            }}
          />
          <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="border-b border-gray-100 p-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search countries…"
                  className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-8 pr-3 text-xs text-gray-900 placeholder:text-gray-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  autoFocus
                />
              </div>
            </div>
            <ul className="max-h-72 overflow-y-auto py-1" role="listbox">
              {filtered.length === 0 ? (
                <li className="px-3 py-2.5 text-xs text-gray-500">No countries match</li>
              ) : (
                filtered.map((opt) => {
                  const checked = opt.value.toUpperCase() === normalized;
                  return (
                    <li key={opt.value}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={checked}
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-gray-900 hover:bg-gray-50",
                          checked && "bg-brand-subtle"
                        )}
                        onClick={() => {
                          onChange(opt.value);
                          setOpen(false);
                          setQuery("");
                          onBlur?.();
                        }}
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
            <p className="border-t border-gray-100 px-3 py-2 text-[10px] text-gray-500">
              {filtered.length} of {PANEL_COUNTRY_OPTIONS.length} countries
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}
