"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { toast } from "sonner";

import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { Button } from "@/components/ui/button";
import { env } from "@/config";
import { SURVEY_CALLBACK_CONFIG } from "@/constants/survey-callback";
import { ROUTES } from "@/constants/routes";

function useClientOrigin(): string {
  return useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => ""
  );
}

function usePublicSiteBase(): string {
  const fromEnv = env.publicSiteUrl;
  const clientOrigin = useClientOrigin();
  return fromEnv || clientOrigin;
}

function CopyUrlButton({ fullUrl }: { fullUrl: string }) {
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setDone(true);
      toast.success("URL copied");
      setTimeout(() => setDone(false), 2000);
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="shrink-0 min-w-[2.25rem] border-gray-200 bg-white text-gray-900 hover:bg-gray-50 hover:text-gray-900 [&_svg]:text-gray-800"
      onClick={copy}
      title="Copy URL"
      aria-label="Copy URL"
    >
      {done ? <Check className="w-4 h-4 text-emerald-600" aria-hidden /> : <Copy className="w-4 h-4" aria-hidden />}
    </Button>
  );
}

export function SurveyRoutingCallbacksSection() {
  const base = usePublicSiteBase();

  return (
    <DashboardSection
      title="Survey routing callbacks"
      description="Give these URLs to your sample provider. They open a short page in the member’s browser, then our app POSTs the outcome to the server (same JSON you can use later for direct server-to-server POST if the partner supports it). Every URL must include the same partner project id: ?pid=… as in your configured survey."
      actions={null}
    >
      <div className="space-y-4">
        {!env.publicSiteUrl ? (
          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2">
            Set <code className="font-mono">NEXT_PUBLIC_APP_URL</code> in production so copied links
            show your public domain. Until then we use the current origin ({base || "—"}).
          </p>
        ) : null}

        <p className="text-sm text-gray-600">
          <strong>POST API (for direct integration):</strong>{" "}
          <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded break-all">
            {env.apiUrl.startsWith("http")
              ? `${env.apiUrl.replace(/\/$/, "")}/public/panel-routing-callback`
              : `${base}${env.apiUrl.replace(/\/$/, "")}/public/panel-routing-callback`}
          </code>{" "}
          with JSON body{" "}
          <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">
            {"{ supplierProjectPid, eventType, … }"}
          </code>
          .
        </p>

        <ul className="space-y-3">
          {SURVEY_CALLBACK_CONFIG.map((c) => {
            const path = ROUTES.surveyCallback(c.slug);
            const fullUrl = `${base || ""}${path}`;
            return (
              <li
                key={c.slug}
                className="flex flex-col sm:flex-row sm:items-stretch gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 p-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-2">
                    <Link2 className="w-3.5 h-3.5" />
                    {c.label}
                  </p>
                  <p className="text-xs text-gray-600 mb-2">{c.description}</p>
                  <code className="block text-xs font-mono text-gray-900 break-all bg-white border border-gray-100 rounded-xl px-3 py-2">
                    {fullUrl || path}
                    <span className="text-gray-400">?pid=…&amp;toid=…</span>
                  </code>
                </div>
                <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                  <CopyUrlButton fullUrl={`${fullUrl}?pid=YOUR_PROJECT_PID&toid=RESPONDENT_REF`} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </DashboardSection>
  );
}
