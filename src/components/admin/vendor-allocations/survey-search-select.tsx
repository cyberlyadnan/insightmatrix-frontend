"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Building2,
  Check,
  CheckSquare,
  ChevronDown,
  ExternalLink,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PanelSurvey } from "@/services/panel-survey/panel-survey-api";

export type SurveyItem = PanelSurvey;

type SurveySearchSelectProps = {
  values: string[];
  onChange: (surveyIds: string[], surveys?: SurveyItem[]) => void;
  surveys: SurveyItem[];
  locked?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: string;
};

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string; dotClass: string }> = {
  active: {
    label: "Active",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    dotClass: "bg-emerald-500",
  },
  paused: {
    label: "Paused",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200/60",
    dotClass: "bg-amber-500",
  },
  draft: {
    label: "Draft",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    dotClass: "bg-slate-400",
  },
  closed: {
    label: "Closed",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200/60",
    dotClass: "bg-rose-500",
  },
  archived: {
    label: "Archived",
    badgeClass: "bg-gray-100 text-gray-600 border-gray-200",
    dotClass: "bg-gray-400",
  },
};

export function SurveySearchSelect({
  values,
  onChange,
  surveys,
  locked = false,
  disabled = false,
  required = false,
  error,
}: SurveySearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedSurveys = useMemo(
    () => surveys.filter((s) => values.includes(s.id)),
    [surveys, values]
  );

  const handleClose = () => {
    setOpen(false);
    setSearch("");
    setStatusFilter("all");
  };

  const handleToggle = () => {
    if (disabled || locked) return;
    if (open) {
      handleClose();
    } else {
      setOpen(true);
    }
  };

  // Close on outside click or ESC
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        handleClose();
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Unique status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: surveys.length };
    for (const s of surveys) {
      const st = s.surveyStatus || "draft";
      counts[st] = (counts[st] || 0) + 1;
    }
    return counts;
  }, [surveys]);

  // Filtered surveys
  const filteredSurveys = useMemo(() => {
    const q = search.trim().toLowerCase();
    return surveys.filter((s) => {
      if (statusFilter !== "all" && s.surveyStatus !== statusFilter) {
        return false;
      }
      if (!q) return true;

      const nameMatch = s.surveyName?.toLowerCase().includes(q);
      const codeMatch = s.surveyCode?.toLowerCase().includes(q);
      const extMatch = s.externalSurveyId?.toLowerCase().includes(q);
      const pidMatch = s.supplierProjectPid?.toLowerCase().includes(q);
      const providerMatch =
        s.provider?.companyName?.toLowerCase().includes(q) ||
        s.provider?.companyCode?.toLowerCase().includes(q);
      const countryMatch = s.targetCountries?.some((c) => c.toLowerCase().includes(q));

      return Boolean(
        nameMatch || codeMatch || extMatch || pidMatch || providerMatch || countryMatch
      );
    });
  }, [surveys, search, statusFilter]);

  // Toggle selection for a survey
  const handleToggleSurvey = (survey: SurveyItem) => {
    if (values.includes(survey.id)) {
      const next = values.filter((id) => id !== survey.id);
      const nextSurveys = surveys.filter((s) => next.includes(s.id));
      onChange(next, nextSurveys);
    } else {
      const next = [...values, survey.id];
      const nextSurveys = surveys.filter((s) => next.includes(s.id));
      onChange(next, nextSurveys);
    }
  };

  // Select all filtered surveys
  const handleSelectAllFiltered = () => {
    const filteredIds = filteredSurveys.map((s) => s.id);
    const set = new Set([...values, ...filteredIds]);
    const next = Array.from(set);
    onChange(
      next,
      surveys.filter((s) => next.includes(s.id))
    );
  };

  // Deselect all
  const handleClearAll = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (locked || disabled) return;
    onChange([], []);
  };

  // Remove individual selected survey
  const handleRemoveSurvey = (idToRemove: string) => {
    if (locked || disabled) return;
    const next = values.filter((id) => id !== idToRemove);
    onChange(
      next,
      surveys.filter((s) => next.includes(s.id))
    );
  };

  return (
    <div ref={containerRef} className="relative space-y-2">
      {/* Hidden input for HTML form validation */}
      {required && (
        <input
          type="text"
          value={values.length > 0 ? "selected" : ""}
          onChange={() => {}}
          required={required}
          className="sr-only"
          tabIndex={-1}
        />
      )}

      {/* Main Trigger Button */}
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls="survey-options-list"
        onClick={handleToggle}
        className={cn(
          "w-full text-left rounded-xl border bg-white transition-all cursor-pointer select-none",
          "focus:outline-none focus:ring-2 focus:ring-brand-primary/20",
          open
            ? "border-brand-primary ring-2 ring-brand-primary/10 shadow-sm"
            : "border-gray-200 hover:border-gray-300 shadow-xs",
          disabled && "bg-gray-50/80 cursor-not-allowed opacity-75",
          locked && "cursor-default bg-slate-50/60",
          error && "border-rose-300 ring-rose-50"
        )}
      >
        {values.length > 0 ? (
          <div className="flex items-center justify-between p-3 min-h-[52px] gap-3">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100">
                <CheckSquare className="h-3.5 w-3.5 text-indigo-600" />
                {values.length} {values.length === 1 ? "Survey" : "Surveys"} Selected
              </span>

              {/* Show chips for selected surveys */}
              {selectedSurveys.slice(0, 3).map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200 max-w-[180px] truncate"
                >
                  <span className="font-mono text-[11px] font-bold text-gray-700">
                    {s.surveyCode}
                  </span>
                  <span className="truncate">{s.surveyName}</span>
                </span>
              ))}

              {values.length > 3 && (
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  +{values.length - 3} more
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {!locked && !disabled && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  title="Clear all selections"
                  className="px-2 py-1 text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md transition"
                >
                  Clear all
                </button>
              )}
              {!locked && (
                <div className="p-1 text-gray-400">
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      open && "rotate-180 text-brand-primary"
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3.5 min-h-[50px]">
            <div className="flex items-center gap-2.5 text-gray-500 text-sm">
              <Search className="h-4 w-4 text-gray-400" />
              <span>Select surveys ({surveys.length} available — click to select multiple)…</span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-gray-400 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </div>
        )}
      </div>

      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

      {/* Floating Search & Dropdown Popover */}
      {open && !disabled && !locked && (
        <div
          id="survey-options-list"
          className="absolute z-50 left-0 right-0 top-full mt-1.5 rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150"
        >
          {/* Search Header */}
          <div className="p-3 border-b border-gray-100 bg-gray-50/80 space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search survey name, code, provider, or PID…"
                className="w-full h-10 pl-9 pr-9 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Quick Status Filter Tabs & Bulk Actions */}
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                  <SlidersHorizontal className="h-3 w-3" />
                  Filter:
                </span>
                {(["all", "active", "draft", "paused", "closed"] as const).map((st) => {
                  const count = statusCounts[st] ?? 0;
                  if (st !== "all" && count === 0) return null;
                  const active = statusFilter === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg font-medium transition whitespace-nowrap flex items-center gap-1.5 text-xs",
                        active
                          ? "bg-gray-900 text-white shadow-xs"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                      )}
                    >
                      <span className="capitalize">{st}</span>
                      <span
                        className={cn(
                          "px-1 py-0.2 rounded-full text-[10px] font-semibold",
                          active ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-500"
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Bulk Selection Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllFiltered}
                  className="text-xs font-semibold text-brand-primary hover:text-brand-hover bg-brand-primary/5 hover:bg-brand-primary/10 px-2.5 py-1 rounded-lg border border-brand-primary/20 transition"
                >
                  Select All Filtered ({filteredSurveys.length})
                </button>
                {values.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleClearAll()}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
                  >
                    Deselect All
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Survey List: Strictly SINGLE ROW Per Option */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 p-1.5">
            {filteredSurveys.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <AlertCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700">No surveys found</p>
                <p className="text-xs text-gray-400 mt-1">
                  {search
                    ? `No surveys match "${search}". Try another term.`
                    : "No surveys available for this status filter."}
                </p>
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("all");
                    }}
                    className="mt-3 text-xs font-semibold text-brand-primary hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              filteredSurveys.map((survey) => {
                const isSelected = values.includes(survey.id);
                const statusCfg =
                  STATUS_CONFIG[survey.surveyStatus || "draft"] || STATUS_CONFIG.draft;
                const remQuota = survey.remainingQuota ?? 0;
                const totQuota = survey.totalQuota ?? 0;

                return (
                  <div
                    key={survey.id}
                    onClick={() => handleToggleSurvey(survey)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all my-0.5",
                      isSelected
                        ? "bg-indigo-50/70 border border-indigo-200/80 text-gray-900"
                        : "hover:bg-gray-50/90 border border-transparent text-gray-700"
                    )}
                  >
                    {/* Checkbox */}
                    <div className="shrink-0 flex items-center justify-center">
                      {isSelected ? (
                        <div className="h-5 w-5 rounded-md bg-brand-primary text-white flex items-center justify-center shadow-2xs">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-md border-2 border-gray-300 bg-white" />
                      )}
                    </div>

                    {/* Survey Code Monospace Badge */}
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-800 border border-gray-200/90 shrink-0">
                      {survey.surveyCode}
                    </span>

                    {/* Survey Name (Takes available width, single line) */}
                    <span className="text-sm font-semibold text-gray-900 truncate flex-1 min-w-0">
                      {survey.surveyName}
                    </span>

                    {/* Provider Name */}
                    <span className="text-xs text-gray-500 shrink-0 inline-flex items-center gap-1 font-medium max-w-[140px] truncate">
                      <Building2 className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{survey.provider?.companyName || "Internal"}</span>
                    </span>

                    {/* Remaining Quota Pill */}
                    <span
                      className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 border",
                        remQuota <= 0
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      )}
                    >
                      {remQuota} rem{totQuota > 0 ? ` / ${totQuota}` : ""}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border shrink-0",
                        statusCfg.badgeClass
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", statusCfg.dotClass)} />
                      {statusCfg.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="font-medium">
              <strong className="text-gray-900">{values.length}</strong> of {surveys.length} surveys
              selected
            </span>
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-1.5 rounded-lg bg-gray-900 text-white font-semibold text-xs hover:bg-black transition shadow-xs"
            >
              Done Selecting
            </button>
          </div>
        </div>
      )}

      {/* Selected Surveys: Collapsible by Default, Fixed Height with Internal Scroll */}
      {selectedSurveys.length > 0 && (
        <div className="mt-2 rounded-xl border border-indigo-100 bg-white shadow-2xs overflow-hidden transition-all">
          {/* Collapsible Bar Header */}
          <div className="px-3 py-2 bg-indigo-50/40 border-b border-indigo-50 flex items-center justify-between gap-2 text-xs">
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="flex items-center gap-2 font-semibold text-indigo-950 hover:text-indigo-700 transition"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-600 text-white text-[11px] font-bold">
                {selectedSurveys.length}
              </span>
              <span>
                {selectedSurveys.length} {selectedSurveys.length === 1 ? "survey" : "surveys"}{" "}
                selected for allocation
              </span>
              <span className="text-indigo-500 font-normal hover:underline ml-0.5">
                {isExpanded ? "(click to collapse)" : "(click to view / edit list)"}
              </span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-indigo-500 transition-transform duration-200",
                  isExpanded && "rotate-180"
                )}
              />
            </button>

            <button
              type="button"
              onClick={() => handleClearAll()}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 hover:underline shrink-0"
            >
              Remove all
            </button>
          </div>

          {/* Expandable Body: Fixed Height with Internal Scroll */}
          {isExpanded && (
            <div className="p-2 space-y-1">
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg max-h-40 overflow-y-auto bg-gray-50/30">
                {selectedSurveys.map((survey) => (
                  <div
                    key={survey.id}
                    className="flex items-center justify-between gap-2 px-2.5 py-1.5 text-xs hover:bg-white transition"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200 shrink-0">
                        {survey.surveyCode}
                      </span>
                      <span className="font-medium text-gray-800 truncate">
                        {survey.surveyName}
                      </span>
                      <span className="text-gray-300 hidden sm:inline text-[11px]">·</span>
                      <span className="text-gray-500 hidden sm:inline truncate text-[11px]">
                        {survey.provider?.companyName || "Internal"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-1.5 py-0.2 rounded">
                        {survey.remainingQuota ?? 0} rem
                      </span>
                      <Link
                        href={`/admin/surveys/${survey.id}`}
                        target="_blank"
                        className="text-gray-400 hover:text-indigo-600 transition p-0.5"
                        title="View Survey"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                      {!locked && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSurvey(survey.id)}
                          className="text-gray-400 hover:text-rose-600 p-0.5 rounded transition"
                          title="Remove survey"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
