"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  children?: ReactNode;
}

/** Shared empty state for admin tables and lists. */
export function EmptyState({
  icon: Icon = Inbox,
  title = "No data found",
  description = "There are no records available yet.",
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 px-8 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
        <Icon className="h-7 w-7 text-brand-primary" />
      </div>
      <h3 className="text-lg font-black text-gray-900">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-gray-600">{description}</p> : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}
