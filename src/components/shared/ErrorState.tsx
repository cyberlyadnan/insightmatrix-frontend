"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Try again in a moment.",
  onRetry,
  retryLabel = "Try again",
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/60 px-8 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm border border-red-100">
        <AlertTriangle className="h-7 w-7 text-red-500" />
      </div>
      <h3 className="text-lg font-black text-gray-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-gray-600">{message}</p>
      {onRetry && (
        <Button type="button" variant="outline" className="mt-6" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
