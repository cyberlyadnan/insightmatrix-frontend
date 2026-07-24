"use client";

import { useEffect, useRef, useState } from "react";
import { HelpCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export type PageHelpContent = {
  title?: string;
  /** What this page is used for */
  about: string;
  /** What users can do here */
  actions: string;
  /** Short usage tips (1–3 lines) */
  tips: string;
};

type PageHelpProps = {
  content: PageHelpContent;
  className?: string;
};

/** Small (?) control — non-intrusive help popover for admin pages. */
export function PageHelp({ content, className }: PageHelpProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        aria-label="Page help"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-brand-primary hover:border-brand-primary/30 transition-colors"
      >
        <HelpCircle className="h-4 w-4" />
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label={content.title ?? "Help"}
          className="absolute right-0 top-full z-40 mt-2 w-[min(100vw-2rem,22rem)] rounded-2xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-200/50"
        >
          {content.title ? (
            <p className="text-sm font-black text-gray-900 mb-2">{content.title}</p>
          ) : null}
          <p className="text-sm text-gray-600 leading-relaxed">{content.about}</p>
          <p className="text-sm text-gray-600 leading-relaxed mt-2">{content.actions}</p>
          <p className="text-xs text-gray-500 leading-relaxed mt-3 border-t border-gray-50 pt-3">
            {content.tips}
          </p>
        </div>
      ) : null}
    </div>
  );
}

type PageHeaderProps = {
  title: string;
  description?: string;
  help?: PageHelpContent;
  actions?: React.ReactNode;
  className?: string;
};

/** Standard page title row with optional help (?) on the top-right. */
export function PageHeader({ title, description, help, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}
    >
      <div className="min-w-0">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">{title}</h1>
        {description ? (
          <p className="text-sm text-gray-500 mt-1 font-medium">{description}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
        {actions}
        {help ? <PageHelp content={help} /> : null}
      </div>
    </div>
  );
}
