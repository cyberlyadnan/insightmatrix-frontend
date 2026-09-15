"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Building2,
  Check,
  ChevronDown,
  Mail,
  Search,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Vendor } from "@/types/vendor";

export type VendorItem = Vendor;

type VendorSearchSelectProps = {
  value: string;
  onChange: (vendorId: string, vendor?: VendorItem) => void;
  vendors: VendorItem[];
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
  suspended: {
    label: "Suspended",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200/60",
    dotClass: "bg-rose-500",
  },
  inactive: {
    label: "Inactive",
    badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
    dotClass: "bg-gray-400",
  },
};

export function VendorSearchSelect({
  value,
  onChange,
  vendors,
  disabled = false,
  required = false,
  error,
}: VendorSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedVendor = useMemo(() => vendors.find((v) => v.id === value), [vendors, value]);

  const handleClose = () => {
    setOpen(false);
    setSearch("");
    setStatusFilter("all");
  };

  const handleToggle = () => {
    if (disabled) return;
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
    const counts: Record<string, number> = { all: vendors.length };
    for (const v of vendors) {
      const st = v.status || "active";
      counts[st] = (counts[st] || 0) + 1;
    }
    return counts;
  }, [vendors]);

  // Filtered vendors
  const filteredVendors = useMemo(() => {
    const q = search.trim().toLowerCase();
    return vendors.filter((v) => {
      if (statusFilter !== "all" && v.status !== statusFilter) {
        return false;
      }
      if (!q) return true;

      const nameMatch = v.companyName?.toLowerCase().includes(q);
      const codeMatch = v.vendorCode?.toLowerCase().includes(q);
      const contactMatch = v.contactPerson?.toLowerCase().includes(q);
      const emailMatch = v.email?.toLowerCase().includes(q);
      const phoneMatch = v.phone?.toLowerCase().includes(q);

      return Boolean(nameMatch || codeMatch || contactMatch || emailMatch || phoneMatch);
    });
  }, [vendors, search, statusFilter]);

  const handleSelect = (vendor: VendorItem) => {
    onChange(vendor.id, vendor);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange("", undefined);
  };

  return (
    <div ref={containerRef} className="relative space-y-2">
      {/* Hidden input for HTML form validation */}
      {required && (
        <input
          type="text"
          value={value}
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
        aria-controls="vendor-options-list"
        onClick={handleToggle}
        className={cn(
          "w-full text-left rounded-xl border bg-white transition-all cursor-pointer select-none",
          "focus:outline-none focus:ring-2 focus:ring-brand-primary/20",
          open
            ? "border-brand-primary ring-2 ring-brand-primary/10 shadow-sm"
            : "border-gray-200 hover:border-gray-300 shadow-xs",
          disabled && "bg-gray-50/80 cursor-not-allowed opacity-75",
          error && "border-rose-300 ring-rose-50"
        )}
      >
        {selectedVendor ? (
          <div className="flex items-center justify-between p-3 min-h-[56px] gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-teal-50 border border-teal-100/80 flex items-center justify-center text-teal-600 font-bold text-xs">
                <Building2 className="h-5 w-5 text-teal-600" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                    {selectedVendor.vendorCode}
                  </span>
                  <span className="font-semibold text-gray-900 text-sm truncate">
                    {selectedVendor.companyName}
                  </span>
                  {selectedVendor.status && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border",
                        STATUS_CONFIG[selectedVendor.status]?.badgeClass ||
                          "bg-gray-100 text-gray-700"
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          STATUS_CONFIG[selectedVendor.status]?.dotClass || "bg-gray-400"
                        )}
                      />
                      {STATUS_CONFIG[selectedVendor.status]?.label || selectedVendor.status}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 flex-wrap">
                  {selectedVendor.contactPerson && (
                    <span className="flex items-center gap-1 text-gray-600">
                      <User className="h-3.5 w-3.5 text-gray-400" />
                      {selectedVendor.contactPerson}
                    </span>
                  )}
                  {selectedVendor.email && (
                    <span className="flex items-center gap-1 text-gray-500">
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      {selectedVendor.email}
                    </span>
                  )}
                  {typeof selectedVendor.totalCompletes === "number" && (
                    <span className="font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                      {selectedVendor.totalCompletes.toLocaleString()} completes
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {!disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  title="Clear vendor selection"
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <div className="p-1 text-gray-400">
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    open && "rotate-180 text-brand-primary"
                  )}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3.5 min-h-[50px]">
            <div className="flex items-center gap-2.5 text-gray-500 text-sm">
              <Search className="h-4 w-4 text-gray-400" />
              <span>Select vendor partner ({vendors.length} available)…</span>
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
      {open && !disabled && (
        <div
          id="vendor-options-list"
          className="absolute z-50 left-0 right-0 top-full mt-1.5 rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150"
        >
          {/* Search Header */}
          <div className="p-3 border-b border-gray-100 bg-gray-50/70 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by vendor name, code, contact person, or email…"
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

            {/* Quick Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none pt-0.5">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                <SlidersHorizontal className="h-3 w-3" />
                Status:
              </span>
              {(["all", "active", "paused", "suspended"] as const).map((st) => {
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
                        : "bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-100"
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
          </div>

          {/* Vendor List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 p-1.5">
            {filteredVendors.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <AlertCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700">No vendors found</p>
                <p className="text-xs text-gray-400 mt-1">
                  {search
                    ? `No vendors match "${search}". Try adjusting your search query.`
                    : "No vendors available for this status filter."}
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
              filteredVendors.map((vendor) => {
                const isSelected = vendor.id === value;
                const statusCfg = STATUS_CONFIG[vendor.status || "active"] || STATUS_CONFIG.active;

                return (
                  <div
                    key={vendor.id}
                    onClick={() => handleSelect(vendor)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all my-0.5",
                      isSelected
                        ? "bg-teal-50/70 border border-teal-200/80 text-gray-900"
                        : "hover:bg-gray-50/90 border border-transparent text-gray-700"
                    )}
                  >
                    {/* Radio Checkmark */}
                    <div className="shrink-0 flex items-center justify-center">
                      {isSelected ? (
                        <div className="h-5 w-5 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-2xs">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300 bg-white" />
                      )}
                    </div>

                    {/* Monospace Vendor Code Badge */}
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 shrink-0">
                      {vendor.vendorCode}
                    </span>

                    {/* Company Name */}
                    <span className="text-sm font-semibold text-gray-900 truncate flex-1 min-w-0">
                      {vendor.companyName}
                    </span>

                    {/* Contact & Email */}
                    <span className="text-xs text-gray-500 shrink-0 inline-flex items-center gap-2 font-medium max-w-[200px] truncate hidden sm:inline-flex">
                      {vendor.contactPerson && (
                        <span className="truncate">{vendor.contactPerson}</span>
                      )}
                      {vendor.email && (
                        <span className="text-gray-400 truncate">({vendor.email})</span>
                      )}
                    </span>

                    {/* Completes count */}
                    {typeof vendor.totalCompletes === "number" ? (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 shrink-0 border border-slate-200">
                        {vendor.totalCompletes.toLocaleString()} completes
                      </span>
                    ) : null}

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

          {/* Footer showing total info */}
          <div className="p-2.5 px-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing {filteredVendors.length} of {vendors.length} vendors
            </span>
            <span className="text-gray-400 text-[11px]">Click any vendor to select</span>
          </div>
        </div>
      )}
    </div>
  );
}
