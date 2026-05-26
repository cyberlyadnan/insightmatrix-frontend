"use client";

import { AlertTriangle } from "lucide-react";

type Props = {
  message: string;
  onRetry?: () => void;
};

export function SecurityBlockedScreen({ message, onRetry }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full rounded-2xl border border-amber-100 bg-white p-8 text-center shadow-sm">
        <AlertTriangle className="mx-auto h-10 w-10 text-amber-500 mb-4" />
        <h1 className="text-lg font-black text-gray-900 mb-2">Unable to continue</h1>
        <p className="text-sm text-gray-600">{message}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white"
          >
            Try again
          </button>
        ) : null}
      </div>
    </div>
  );
}
