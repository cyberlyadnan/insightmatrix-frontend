"use client";

import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type LoadingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
};

/** Primary action button with spinner — disables while loading to prevent double submit. */
export function LoadingButton({
  loading = false,
  loadingText,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold transition-colors disabled:pointer-events-none disabled:opacity-60",
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          <span>{loadingText ?? "Saving…"}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
