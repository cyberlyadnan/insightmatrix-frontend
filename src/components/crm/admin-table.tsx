"use client";

import type { ReactNode } from "react";
import { Download, Filter, Search } from "lucide-react";

import { cn } from "@/lib/utils";

type AdminTableToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  onExport?: () => void;
  exportLabel?: string;
  exportDisabled?: boolean;
  className?: string;
};

/** Shared search / filters / export row for admin data tables. */
export function AdminTableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Search…",
  filters,
  onExport,
  exportLabel = "Export",
  exportDisabled,
  className,
}: AdminTableToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 mb-5", className)}>
      <div className="relative flex-1 min-w-[220px] max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 bg-white text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 shadow-sm"
          aria-label="Search"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2.5 max-w-full">
        {filters ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
              <Filter className="h-3 w-3" />
              Filters
            </span>
            {filters}
          </div>
        ) : null}
        {onExport ? (
          <button
            type="button"
            disabled={exportDisabled}
            onClick={onExport}
            className="h-10 px-3.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 inline-flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50 transition-colors shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            {exportLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}

type AdminPaginationProps = {
  page: number;
  totalPages: number;
  total?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
};

/** Shared pagination controls for admin tables. */
export function AdminPagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: AdminPaginationProps) {
  if (totalPages <= 1 && !onPageSizeChange) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-100 mt-4">
      <p className="text-xs text-gray-500 font-medium">
        Page {page} of {Math.max(1, totalPages)}
        {typeof total === "number" ? ` · ${total.toLocaleString("en-IN")} total` : null}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {onPageSizeChange && pageSize != null ? (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900"
            aria-label="Rows per page"
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        ) : null}
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-900 disabled:opacity-40 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-900 disabled:opacity-40 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

type AdminProgressBarProps = {
  percent: number;
  className?: string;
};

/** Compact progress bar with percentage label. */
export function AdminProgressBar({ percent, className }: AdminProgressBarProps) {
  const pct = Math.min(100, Math.max(0, Number.isFinite(percent) ? percent : 0));
  return (
    <div className={cn("flex items-center gap-1.5 min-w-[90px]", className)}>
      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-brand-primary transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] font-bold text-gray-700 tabular-nums w-9 text-right shrink-0">
        {pct.toFixed(0)}%
      </span>
    </div>
  );
}

export function AdminTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-9 bg-gray-100 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

/** Shared select styling for table filters. */
export const adminFilterSelectClass =
  "h-10 rounded-xl border border-gray-200 px-3 text-xs text-gray-800 bg-white max-w-[200px] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 shadow-sm transition-colors";

export const adminTableWrapClass =
  "rounded-2xl border border-slate-200/90 bg-white p-5 md:p-6 shadow-sm";

export const adminTableContainerClass =
  "overflow-x-auto custom-scrollbar rounded-xl border border-slate-200/90 bg-white shadow-sm";

export const adminTableHeadClass =
  "bg-[#091428] text-white text-left text-[10px] font-extrabold uppercase tracking-wider";

export const adminTableHeadCellClass =
  "px-3 py-2 text-white font-extrabold text-[10px] uppercase tracking-wider whitespace-nowrap";

export const adminTableRowClass = "border-b border-slate-100 hover:bg-blue-50/40 transition-colors";

export const adminTableCellClass =
  "px-3 py-1.5 text-xs text-slate-800 align-middle whitespace-nowrap";

export const adminActionRowClass =
  "flex items-center justify-end gap-1 flex-nowrap whitespace-nowrap shrink-0";
