"use client";

import React, { useEffect, useRef, useState } from "react";
import { Calendar, Check, ChevronDown, Clock, X } from "lucide-react";
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  subDays,
  subHours,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { cn } from "@/lib/utils";

export type DateRangePreset =
  | "all"
  | "today"
  | "last_7h"
  | "last_15h"
  | "last_24h"
  | "this_week"
  | "last_week"
  | "last_month"
  | "month"
  | "custom";

export type DateRangeValue = {
  preset: DateRangePreset;
  label: string;
  dateFrom?: string;
  dateTo?: string;
  customFrom?: string;
  customTo?: string;
  selectedMonth?: string; // YYYY-MM
};

export function createDateRangeValue(
  preset: DateRangePreset,
  opts?: { customFrom?: string; customTo?: string; selectedMonth?: string }
): DateRangeValue {
  const now = new Date();

  switch (preset) {
    case "all":
      return { preset: "all", label: "All Time" };

    case "today":
      return {
        preset: "today",
        label: "Today",
        dateFrom: startOfDay(now).toISOString(),
        dateTo: endOfDay(now).toISOString(),
      };

    case "last_7h":
      return {
        preset: "last_7h",
        label: "Last 7 Hours",
        dateFrom: subHours(now, 7).toISOString(),
        dateTo: now.toISOString(),
      };

    case "last_15h":
      return {
        preset: "last_15h",
        label: "Last 15 Hours",
        dateFrom: subHours(now, 15).toISOString(),
        dateTo: now.toISOString(),
      };

    case "last_24h":
      return {
        preset: "last_24h",
        label: "Last 24 Hours",
        dateFrom: subHours(now, 24).toISOString(),
        dateTo: now.toISOString(),
      };

    case "this_week": {
      const start = startOfWeek(now, { weekStartsOn: 1 });
      return {
        preset: "this_week",
        label: "This Week",
        dateFrom: startOfDay(start).toISOString(),
        dateTo: endOfDay(now).toISOString(),
      };
    }

    case "last_week": {
      const start = startOfDay(subDays(now, 6));
      return {
        preset: "last_week",
        label: "Last Week",
        dateFrom: start.toISOString(),
        dateTo: endOfDay(now).toISOString(),
      };
    }

    case "last_month": {
      const start = startOfDay(subDays(now, 29));
      return {
        preset: "last_month",
        label: "Last Month",
        dateFrom: start.toISOString(),
        dateTo: endOfDay(now).toISOString(),
      };
    }

    case "month": {
      const ym = opts?.selectedMonth || format(now, "yyyy-MM");
      const [yStr, mStr] = ym.split("-");
      const y = Number(yStr) || now.getFullYear();
      const m = (Number(mStr) || now.getMonth() + 1) - 1;
      const monthDate = new Date(y, m, 1);
      return {
        preset: "month",
        label: format(monthDate, "MMMM yyyy"),
        dateFrom: startOfMonth(monthDate).toISOString(),
        dateTo: endOfMonth(monthDate).toISOString(),
        selectedMonth: ym,
      };
    }

    case "custom": {
      const fromStr = opts?.customFrom || format(subDays(now, 6), "yyyy-MM-dd");
      const toStr = opts?.customTo || format(now, "yyyy-MM-dd");
      const fromDate = new Date(`${fromStr}T00:00:00`);
      const toDate = new Date(`${toStr}T23:59:59.999`);
      const validFrom = !Number.isNaN(fromDate.getTime()) ? fromDate : startOfDay(subDays(now, 6));
      const validTo = !Number.isNaN(toDate.getTime()) ? toDate : endOfDay(now);
      const [start, end] = validFrom <= validTo ? [validFrom, validTo] : [validTo, validFrom];
      return {
        preset: "custom",
        label: `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`,
        dateFrom: start.toISOString(),
        dateTo: end.toISOString(),
        customFrom: format(start, "yyyy-MM-dd"),
        customTo: format(end, "yyyy-MM-dd"),
      };
    }
  }
}

const PRESET_OPTIONS: Array<{
  id: DateRangePreset;
  label: string;
  hint?: string;
}> = [
  { id: "today", label: "Today" },
  { id: "last_7h", label: "Last 7 Hours" },
  { id: "last_15h", label: "Last 15 Hours" },
  { id: "last_24h", label: "Last 24 Hours" },
  { id: "this_week", label: "This Week" },
  { id: "last_week", label: "Last Week", hint: "7 days" },
  { id: "last_month", label: "Last Month", hint: "30 days" },
  { id: "all", label: "All Time" },
];

type DateRangeFilterProps = {
  value: DateRangeValue;
  onChange: (next: DateRangeValue) => void;
  /** Hide "All Time" (e.g. for hourly pivot reports where a bounded window is required) */
  hideAllTime?: boolean;
  /** Visual style for light cards or dark hero banners */
  surface?: "light" | "dark";
  align?: "left" | "right";
  className?: string;
};

export function DateRangeFilter({
  value,
  onChange,
  hideAllTime = false,
  surface = "light",
  align = "right",
  className,
}: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const [subPanel, setSubPanel] = useState<"none" | "month" | "custom">("none");
  const [monthInput, setMonthInput] = useState(
    value.selectedMonth || format(new Date(), "yyyy-MM")
  );
  const [customFrom, setCustomFrom] = useState(
    value.customFrom || format(subDays(new Date(), 6), "yyyy-MM-dd")
  );
  const [customTo, setCustomTo] = useState(value.customTo || format(new Date(), "yyyy-MM-dd"));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const options = hideAllTime ? PRESET_OPTIONS.filter((o) => o.id !== "all") : PRESET_OPTIONS;

  const isHourPreset =
    value.preset === "last_7h" || value.preset === "last_15h" || value.preset === "last_24h";

  const handleSelectPreset = (preset: DateRangePreset) => {
    onChange(createDateRangeValue(preset));
    setSubPanel("none");
    setOpen(false);
  };

  const handleApplyMonth = () => {
    onChange(createDateRangeValue("month", { selectedMonth: monthInput }));
    setOpen(false);
  };

  const handleApplyCustom = () => {
    onChange(createDateRangeValue("custom", { customFrom, customTo }));
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open) {
            if (value.preset === "month") setSubPanel("month");
            else if (value.preset === "custom") setSubPanel("custom");
            else setSubPanel("none");
          }
        }}
        className={cn(
          "inline-flex items-center justify-between gap-2.5 rounded-xl px-3.5 h-10 text-xs font-bold transition-all min-w-[180px] shadow-sm border",
          surface === "dark"
            ? "bg-white/10 hover:bg-white/15 text-white border-white/15 backdrop-blur-md"
            : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 hover:border-slate-300"
        )}
      >
        <span className="inline-flex items-center gap-2 truncate">
          {isHourPreset ? (
            <Clock
              className={cn(
                "h-4 w-4 shrink-0",
                surface === "dark" ? "text-cyan-300" : "text-blue-600"
              )}
            />
          ) : (
            <Calendar
              className={cn(
                "h-4 w-4 shrink-0",
                surface === "dark" ? "text-cyan-300" : "text-blue-600"
              )}
            />
          )}
          <span className="truncate">{value.label}</span>
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
            surface === "dark" ? "text-slate-300" : "text-slate-400",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Popover */}
      {open && (
        <div
          className={cn(
            "absolute z-50 top-full mt-2 w-72 rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/15 overflow-hidden text-left text-slate-800",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {/* Presets List */}
          <div className="p-1.5 divide-y divide-slate-100/80">
            <div className="space-y-0.5 pb-1.5">
              {options.map((opt) => {
                const active = value.preset === opt.id && subPanel === "none";
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectPreset(opt.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors",
                      active
                        ? "bg-[#0088cc] text-white shadow-xs"
                        : "text-slate-700 hover:bg-slate-100/90"
                    )}
                  >
                    <span>{opt.label}</span>
                    <span className="inline-flex items-center gap-1.5">
                      {opt.hint && (
                        <span
                          className={cn(
                            "text-[10px] font-medium",
                            active ? "text-white/80" : "text-slate-400"
                          )}
                        >
                          {opt.hint}
                        </span>
                      )}
                      {active && <Check className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Select Month Option */}
            <div className="pt-1.5 pb-1">
              <button
                type="button"
                onClick={() => setSubPanel(subPanel === "month" ? "none" : "month")}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors",
                  value.preset === "month" || subPanel === "month"
                    ? "bg-[#0088cc] text-white"
                    : "text-slate-700 hover:bg-slate-100/90"
                )}
              >
                <span>Select Month</span>
                <Calendar className="h-3.5 w-3.5 opacity-80" />
              </button>

              {subPanel === "month" && (
                <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Choose Month
                  </label>
                  <input
                    type="month"
                    value={monthInput}
                    onChange={(e) => setMonthInput(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={handleApplyMonth}
                    className="w-full h-8 rounded-lg bg-[#091428] text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    Apply Month
                  </button>
                </div>
              )}
            </div>

            {/* Custom Date Range Option */}
            <div className="pt-1.5">
              <button
                type="button"
                onClick={() => setSubPanel(subPanel === "custom" ? "none" : "custom")}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors",
                  value.preset === "custom" || subPanel === "custom"
                    ? "bg-[#0088cc] text-white"
                    : "text-slate-700 hover:bg-slate-100/90"
                )}
              >
                <span>Custom Date Range</span>
                {subPanel === "custom" ? (
                  <X className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                )}
              </button>

              {subPanel === "custom" && (
                <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                        From
                      </label>
                      <input
                        type="date"
                        value={customFrom}
                        onChange={(e) => setCustomFrom(e.target.value)}
                        className="w-full h-8 rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                        To
                      </label>
                      <input
                        type="date"
                        value={customTo}
                        onChange={(e) => setCustomTo(e.target.value)}
                        className="w-full h-8 rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCustom}
                    className="w-full h-8 rounded-lg bg-[#091428] text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    Apply Date Range
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
