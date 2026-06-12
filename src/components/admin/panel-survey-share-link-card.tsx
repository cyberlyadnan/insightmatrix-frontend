"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

import type { PanelSurveyStatus } from "@/constants/panel-survey";
import { buildPanelSurveyShareLink } from "@/lib/panel-survey-share-link";

type Props = {
  surveyId: string;
  surveyName: string;
  surveyStatus: PanelSurveyStatus;
  panelShareLink?: string;
};

export function PanelSurveyShareLinkCard({
  surveyId,
  surveyName,
  surveyStatus,
  panelShareLink,
}: Props) {
  const [copied, setCopied] = useState(false);

  const shareLink = panelShareLink ?? buildPanelSurveyShareLink(surveyId);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success("Survey link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-slate-50/80 p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0">
          <Share2 className="h-6 w-6 text-brand-primary" />
        </div>
        <div className="flex-1 min-w-0 space-y-4">
          <div>
            <h3 className="text-lg font-black text-gray-900">Internal team survey link</h3>
            <p className="text-sm text-gray-500 mt-1">
              Share this link with your internal team for <strong>{surveyName}</strong>. No login
              required — a tracking session is created automatically when someone opens the link.
            </p>
          </div>

          {surveyStatus !== "active" ? (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2">
              Set the survey status to <strong>Active</strong> before sharing. Draft or paused
              surveys return &quot;Survey unavailable&quot; on the public link.
            </p>
          ) : null}

          <p className="text-xs font-mono text-gray-600 break-all bg-white border border-gray-100 rounded-lg p-3">
            {shareLink}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-black"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-300" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied" : "Copy survey link"}
            </button>
            <a
              href={shareLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Open landing page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
