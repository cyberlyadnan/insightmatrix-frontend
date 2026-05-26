"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Shield } from "lucide-react";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

type Props = {
  siteKey: string;
  onToken: (token: string) => void;
  action?: string;
};

export function GatewayCaptcha({ siteKey, onToken, action = "routing_start" }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const runCaptcha = useCallback(async () => {
    if (!window.grecaptcha) {
      setError("Security verification could not load. Please refresh the page.");
      return;
    }
    setError(null);
    try {
      await new Promise<void>((resolve) => window.grecaptcha!.ready(() => resolve()));
      const token = await window.grecaptcha!.execute(siteKey, { action });
      onToken(token);
    } catch {
      setError("Verification failed. Please try again.");
      setLoading(false);
    }
  }, [siteKey, action, onToken]);

  useEffect(() => {
    const id = "recaptcha-v3-script";
    if (document.getElementById(id)) {
      queueMicrotask(() => {
        void runCaptcha();
      });
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.onload = () => {
      setLoading(false);
      runCaptcha();
    };
    script.onerror = () => {
      setLoading(false);
      setError("Could not load security verification.");
    };
    document.head.appendChild(script);
  }, [siteKey, runCaptcha]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 gap-4">
      <Shield className="h-10 w-10 text-brand-primary" />
      <p className="text-sm font-medium text-gray-600 text-center max-w-sm">
        Verifying you&apos;re human before continuing…
      </p>
      {loading && <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />}
      {error && (
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            runCaptcha();
          }}
          className="text-sm font-semibold text-brand-primary underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}
