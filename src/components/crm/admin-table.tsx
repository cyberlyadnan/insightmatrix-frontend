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
    <div className={cn("flex flex-col xl:flex-row gap-3 xl:items-center mb-6", className)}>
      <div className="relative flex-1 min-w-0">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full h-11 pl-10 pr-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          aria-label="Search"
        />
      </div>
      {filters ? (
        <div className="flex flex-col sm:flex-row gap-3 shrink-0 items-stretch sm:items-center">
          <span className="hidden xl:inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Filter className="h-3.5 w-3.5" />
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
          className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 inline-flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {exportLabel}
        </button>
      ) : null}
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
    <div className={cn("flex items-center gap-2 min-w-[120px]", className)}>
      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-brand-primary transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bold text-gray-700 tabular-nums w-12 text-right">
        {pct.toFixed(1)}%
      </span>
    </div>
  );
}

export function AdminTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

/** Shared select styling for table filters. */
export const adminFilterSelectClass =
  "h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-900 bg-white min-w-[140px] focus:outline-none focus:ring-2 focus:ring-brand-primary/20";

export const adminTableWrapClass =
  "rounded-[2rem] border border-gray-100 bg-white p-5 md:p-6 shadow-sm";

export const adminTableHeadClass =
  "border-b border-gray-100 text-left text-[10px] font-black uppercase tracking-widest text-gray-400";

export const adminTableRowClass = "border-b border-gray-50 hover:bg-gray-50/80 transition-colors";
