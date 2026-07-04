"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { PanelSurvey } from "@/services/panel-survey";

export type PanelSurveyPickerItem = Pick<
  PanelSurvey,
  "id" | "surveyName" | "surveyCode" | "externalSurveyId" | "supplierProjectPid"
>;

type PanelSurveySearchSelectProps = {
  value: string;
  onChange: (surveyId: string) => void;
  surveys: PanelSurveyPickerItem[];
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  emptyLabel?: string;
  onSearchQueryChange?: (query: string) => void;
};

function matchesSurveyQuery(survey: PanelSurveyPickerItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    survey.surveyName.toLowerCase().includes(q) ||
    survey.surveyCode.toLowerCase().includes(q) ||
    survey.externalSurveyId.toLowerCase().includes(q) ||
    survey.supplierProjectPid.toLowerCase().includes(q) ||
    survey.id.toLowerCase().includes(q)
  );
}

export function PanelSurveySearchSelect({
  value,
  onChange,
  surveys,
  loading = false,
  disabled = false,
  placeholder = "Search survey by name, code, project ID, or survey ID…",
  emptyLabel = "All surveys",
  onSearchQueryChange,
}: PanelSurveySearchSelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = surveys.find((s) => s.id === value);

  const filtered = useMemo(
    () => surveys.filter((survey) => matchesSurveyQuery(survey, query)),
    [surveys, query]
  );

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div ref={containerRef} className="space-y-2">
      {selected ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-600">Selected:</span>
          <span className="font-semibold text-gray-900">{selected.surveyName}</span>
          <span className="font-mono text-xs text-gray-500">{selected.surveyCode}</span>
          {selected.supplierProjectPid ? (
            <span className="text-xs text-gray-500">PID {selected.supplierProjectPid}</span>
          ) : null}
          <button
            type="button"
            disabled={disabled}
            className="text-xs font-bold text-brand-primary hover:text-brand-hover disabled:opacity-50"
            onClick={() => onChange("")}
          >
            Clear
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          className="text-xs font-bold text-gray-500 hover:text-gray-800 disabled:opacity-50"
          onClick={() => onChange("")}
        >
          {emptyLabel}
        </button>
      )}

      <div className="relative">
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearchQueryChange?.(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          disabled={disabled}
          className="h-11 rounded-xl border-gray-200 text-sm text-gray-900 placeholder:text-gray-400"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
        />
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
        ) : null}

        {open && !disabled ? (
          <ul
            className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
            role="listbox"
          >
            <li>
              <button
                type="button"
                className={cn(
                  "w-full px-3 py-2 text-left text-sm hover:bg-gray-50",
                  !value && "bg-brand-primary/5 font-semibold text-brand-primary"
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
              >
                {emptyLabel}
              </button>
            </li>
            {filtered.length === 0 ? (
              <li className="px-3 py-3 text-sm text-gray-500">No surveys match your search.</li>
            ) : (
              filtered.map((survey) => (
                <li key={survey.id}>
                  <button
                    type="button"
                    className={cn(
                      "w-full px-3 py-2 text-left hover:bg-gray-50",
                      value === survey.id && "bg-brand-primary/5"
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onChange(survey.id);
                      setQuery("");
                      setOpen(false);
                    }}
                  >
                    <p className="text-sm font-semibold text-gray-900">{survey.surveyName}</p>
                    <p className="text-xs text-gray-500">
                      <span className="font-mono">{survey.surveyCode}</span>
                      {survey.supplierProjectPid ? (
                        <>
                          {" · "}
                          PID {survey.supplierProjectPid}
                        </>
                      ) : null}
                      {survey.externalSurveyId ? (
                        <>
                          {" · "}
                          Ext {survey.externalSurveyId}
                        </>
                      ) : null}
                    </p>
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
