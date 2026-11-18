"use client";

import React, { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

export type CustomDropdownOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  group?: string;
};

export type CustomDropdownGroup = {
  label: string;
  options: CustomDropdownOption[];
};

export type CustomDropdownProps = {
  value?: string | number | readonly string[];
  defaultValue?: string | number;
  onValueChange?: (value: string) => void;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  options?: CustomDropdownOption[];
  groups?: CustomDropdownGroup[];
  children?: React.ReactNode;
  placeholder?: string;
  searchPlaceholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  title?: string;
  "aria-label"?: string;
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  className?: string;
  menuClassName?: string;
};

function extractText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return extractText(node.props.children);
  }
  return "";
}

function parseChildrenToOptions(
  children: React.ReactNode,
  groupLabel?: string
): CustomDropdownOption[] {
  const result: CustomDropdownOption[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === React.Fragment) {
      const props = child.props as { children?: React.ReactNode };
      result.push(...parseChildrenToOptions(props.children, groupLabel));
      return;
    }

    if (child.type === "optgroup") {
      const props = child.props as { label?: string; children?: React.ReactNode };
      result.push(...parseChildrenToOptions(props.children, props.label ?? ""));
      return;
    }

    if (child.type === "option") {
      const props = child.props as {
        value?: string | number;
        disabled?: boolean;
        children?: React.ReactNode;
      };
      const label = extractText(props.children).trim();
      const val = props.value !== undefined && props.value !== null ? String(props.value) : label;
      result.push({
        value: val,
        label: label || val,
        disabled: Boolean(props.disabled),
        group: groupLabel,
      });
    }
  });

  return result;
}

const SIZE_CLASSES: Record<"sm" | "md" | "lg", string> = {
  sm: "h-8 px-2.5 text-xs rounded-lg",
  md: "h-10 px-3 text-xs rounded-xl",
  lg: "h-11 px-3.5 text-sm rounded-xl",
};

type MenuCoords = {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
  placement: "bottom" | "top";
};

export const CustomDropdown = forwardRef<HTMLButtonElement, CustomDropdownProps>(
  function CustomDropdown(
    {
      value,
      defaultValue,
      onValueChange,
      onChange,
      onBlur,
      options,
      groups,
      children,
      placeholder = "Select an option…",
      searchPlaceholder = "Search options…",
      searchable,
      disabled = false,
      required = false,
      name,
      id,
      title,
      "aria-label": ariaLabel,
      size = "md",
      leftIcon,
      className,
      menuClassName,
    },
    forwardedRef
  ) {
    const generatedId = useId();
    const listboxId = `${id ?? generatedId}-listbox`;

    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<string>(() =>
      defaultValue !== undefined ? String(defaultValue) : ""
    );

    const parsedOptions = useMemo<CustomDropdownOption[]>(() => {
      if (groups && groups.length > 0) {
        return groups.flatMap((g) =>
          g.options.map((opt) => ({ ...opt, group: opt.group ?? g.label }))
        );
      }
      if (options && options.length > 0) {
        return options;
      }
      return parseChildrenToOptions(children);
    }, [groups, options, children]);

    const currentValue = isControlled
      ? Array.isArray(value)
        ? String(value[0] ?? "")
        : String(value ?? "")
      : uncontrolledValue || parsedOptions[0]?.value || "";

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const [coords, setCoords] = useState<MenuCoords | null>(null);

    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef]
    );

    const showSearch = searchable ?? parsedOptions.length > 7;

    const filteredOptions = useMemo(() => {
      const q = search.trim().toLowerCase();
      if (!q) return parsedOptions;
      return parsedOptions.filter(
        (opt) =>
          opt.label.toLowerCase().includes(q) ||
          opt.value.toLowerCase().includes(q) ||
          (opt.group && opt.group.toLowerCase().includes(q)) ||
          (opt.description && opt.description.toLowerCase().includes(q))
      );
    }, [parsedOptions, search]);

    const selectedOption = useMemo(
      () => parsedOptions.find((opt) => opt.value === currentValue),
      [parsedOptions, currentValue]
    );

    const computeCoords = useCallback(() => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const spaceBelow = viewportHeight - rect.bottom - 12;
      const spaceAbove = rect.top - 12;
      const desiredHeight = 300;

      const openUpward = spaceBelow < 220 && spaceAbove > spaceBelow;
      const maxHeight = Math.max(
        140,
        Math.min(desiredHeight, openUpward ? spaceAbove - 8 : spaceBelow - 8)
      );
      const width = Math.min(Math.max(rect.width, 196), viewportWidth - 24);
      const left = Math.max(12, Math.min(rect.left, viewportWidth - width - 12));

      if (openUpward) {
        setCoords({
          bottom: viewportHeight - rect.top + 6,
          left,
          width,
          maxHeight,
          placement: "top",
        });
      } else {
        setCoords({
          top: rect.bottom + 6,
          left,
          width,
          maxHeight,
          placement: "bottom",
        });
      }
    }, []);

    const closeMenu = useCallback((restoreFocus = false) => {
      setOpen(false);
      setSearch("");
      setHighlightedIndex(-1);
      if (restoreFocus) {
        triggerRef.current?.focus();
      }
    }, []);

    const openMenu = useCallback(() => {
      if (disabled) return;
      computeCoords();
      setOpen(true);
      const idx = parsedOptions.findIndex((o) => o.value === currentValue && !o.disabled);
      setHighlightedIndex(idx >= 0 ? idx : 0);
    }, [disabled, computeCoords, parsedOptions, currentValue]);

    const handleSelect = useCallback(
      (opt: CustomDropdownOption) => {
        if (opt.disabled) return;
        if (!isControlled) {
          setUncontrolledValue(opt.value);
        }
        onValueChange?.(opt.value);
        if (onChange) {
          const syntheticEvent = {
            target: { value: opt.value, name: name ?? "" },
            currentTarget: { value: opt.value, name: name ?? "" },
          } as React.ChangeEvent<HTMLSelectElement>;
          onChange(syntheticEvent);
        }
        closeMenu(true);
      },
      [isControlled, onValueChange, onChange, name, closeMenu]
    );

    // Reposition on scroll / resize while open
    useEffect(() => {
      if (!open) return;
      computeCoords();
      const handleReposition = () => computeCoords();
      window.addEventListener("scroll", handleReposition, true);
      window.addEventListener("resize", handleReposition);
      return () => {
        window.removeEventListener("scroll", handleReposition, true);
        window.removeEventListener("resize", handleReposition);
      };
    }, [open, computeCoords]);

    // Focus search input when opening searchable menu
    useEffect(() => {
      if (open && showSearch) {
        const timer = window.setTimeout(() => {
          searchInputRef.current?.focus();
        }, 16);
        return () => window.clearTimeout(timer);
      }
    }, [open, showSearch]);

    // Outside click & Escape handling
    useEffect(() => {
      if (!open) return;
      function handleMouseDown(e: MouseEvent) {
        const target = e.target as Node;
        if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) {
          closeMenu(false);
          if (onBlur && triggerRef.current) {
            onBlur({
              target: triggerRef.current,
              currentTarget: triggerRef.current,
            } as unknown as React.FocusEvent<HTMLElement>);
          }
        }
      }
      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") {
          e.preventDefault();
          closeMenu(true);
        }
      }
      document.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [open, closeMenu, onBlur]);

    // Keep highlighted item visible during keyboard navigation
    useEffect(() => {
      if (!open || highlightedIndex < 0) return;
      optionRefs.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
    }, [open, highlightedIndex]);

    const moveHighlight = (delta: number) => {
      if (filteredOptions.length === 0) return;
      let next = highlightedIndex;
      for (let i = 0; i < filteredOptions.length; i += 1) {
        next = (next + delta + filteredOptions.length) % filteredOptions.length;
        if (!filteredOptions[next]?.disabled) {
          setHighlightedIndex(next);
          return;
        }
      }
    };

    const handleKeyNavigation = (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openMenu();
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveHighlight(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        moveHighlight(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        setHighlightedIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setHighlightedIndex(Math.max(0, filteredOptions.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const chosen = filteredOptions[highlightedIndex];
        if (chosen && !chosen.disabled) {
          handleSelect(chosen);
        }
      } else if (e.key === "Tab") {
        closeMenu(false);
      }
    };

    // Group filtered options while preserving order
    const renderedSections = useMemo(() => {
      const sections: Array<{
        group: string | undefined;
        items: Array<{ opt: CustomDropdownOption; flatIndex: number }>;
      }> = [];
      let currentSection: (typeof sections)[number] | null = null;

      filteredOptions.forEach((opt, flatIndex) => {
        if (!currentSection || currentSection.group !== opt.group) {
          currentSection = { group: opt.group, items: [] };
          sections.push(currentSection);
        }
        currentSection.items.push({ opt, flatIndex });
      });

      return sections;
    }, [filteredOptions]);

    const isPlaceholderActive = !selectedOption || selectedOption.value === "";
    const displayLabel = selectedOption ? selectedOption.label : placeholder;

    return (
      <>
        {/* Hidden input for native HTML form submission / required validation */}
        {(name || required) && (
          <input
            type="text"
            name={name}
            value={currentValue}
            required={required}
            onChange={() => {}}
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only"
          />
        )}

        <button
          ref={setRefs}
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-label={ariaLabel}
          title={title ?? displayLabel}
          disabled={disabled}
          onClick={() => (open ? closeMenu(false) : openMenu())}
          onKeyDown={handleKeyNavigation}
          className={cn(
            "group inline-flex items-center justify-between gap-2 border border-slate-200/90 bg-white font-medium text-slate-800 shadow-xs transition-all text-left select-none",
            "hover:border-slate-300 hover:bg-slate-50/60",
            "focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20",
            open && "border-brand-primary ring-2 ring-brand-primary/20 bg-white",
            disabled && "cursor-not-allowed opacity-55 bg-slate-50 hover:border-slate-200",
            SIZE_CLASSES[size],
            className
          )}
        >
          <span className="flex items-center gap-2 min-w-0 flex-1">
            {leftIcon && <span className="shrink-0 text-slate-400">{leftIcon}</span>}
            <span className={cn("truncate", isPlaceholderActive && "text-slate-500 font-normal")}>
              {displayLabel}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-hover:text-slate-600",
              open && "rotate-180 text-brand-primary"
            )}
          />
        </button>

        {open &&
          coords &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              ref={menuRef}
              id={listboxId}
              role="listbox"
              onKeyDown={handleKeyNavigation}
              style={{
                position: "fixed",
                top: coords.top,
                bottom: coords.bottom,
                left: coords.left,
                width: coords.width,
                zIndex: 9999,
              }}
              className={cn(
                "rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/15 overflow-hidden text-slate-800 animate-in fade-in-0 zoom-in-95 duration-150",
                menuClassName
              )}
            >
              {/* Search Box (Auto-enabled for long lists) */}
              {showSearch && (
                <div className="p-2 border-b border-slate-100 bg-slate-50/80">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setHighlightedIndex(0);
                      }}
                      placeholder={searchPlaceholder}
                      className="w-full h-8 pl-8 pr-7 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                    />
                    {search && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          searchInputRef.current?.focus();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label="Clear search"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Options List */}
              <div
                style={{ maxHeight: coords.maxHeight - (showSearch ? 49 : 0) }}
                className="overflow-y-auto custom-scrollbar p-1.5 space-y-0.5"
              >
                {filteredOptions.length === 0 ? (
                  <div className="py-6 px-3 text-center">
                    <p className="text-xs font-semibold text-slate-500">No matching options</p>
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="mt-2 text-[11px] font-bold text-brand-primary hover:underline"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                ) : (
                  renderedSections.map((section, sIdx) => (
                    <div key={section.group ?? `section-${sIdx}`}>
                      {section.group && (
                        <div className="px-2.5 pt-2 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400 select-none">
                          {section.group}
                        </div>
                      )}
                      {section.items.map(({ opt, flatIndex }) => {
                        const isSelected = opt.value === currentValue;
                        const isHighlighted = flatIndex === highlightedIndex;
                        return (
                          <button
                            key={`${section.group ?? ""}-${opt.value}-${flatIndex}`}
                            ref={(el) => {
                              optionRefs.current[flatIndex] = el;
                            }}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            disabled={opt.disabled}
                            onMouseEnter={() => setHighlightedIndex(flatIndex)}
                            onClick={() => handleSelect(opt)}
                            className={cn(
                              "w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs transition-colors text-left",
                              isSelected
                                ? "bg-brand-primary/10 text-brand-primary font-bold"
                                : isHighlighted
                                  ? "bg-slate-100/90 text-slate-900 font-medium"
                                  : "text-slate-700 font-medium hover:bg-slate-50",
                              opt.disabled && "opacity-45 cursor-not-allowed hover:bg-transparent"
                            )}
                          >
                            <span className="min-w-0 flex-1">
                              <span className="block truncate">{opt.label}</span>
                              {opt.description && (
                                <span className="block text-[10px] text-slate-400 truncate mt-0.5 font-normal">
                                  {opt.description}
                                </span>
                              )}
                            </span>
                            {isSelected && (
                              <span className="h-4 w-4 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0">
                                <Check className="h-2.5 w-2.5 stroke-[3]" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
            </div>,
            document.body
          )}
      </>
    );
  }
);
