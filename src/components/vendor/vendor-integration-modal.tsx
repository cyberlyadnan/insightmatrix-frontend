"use client";

import React, { useState } from "react";
import {
  Code2,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export function VendorIntegrationModal({
  isOpen,
  onClose,
  vendorCode,
}: {
  isOpen: boolean;
  onClose: () => void;
  vendorCode?: string;
}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleUrl = `https://insightmatrix.online/vendor/start/SURVEY_SLUG?toid=[RESPONDENT_ID]`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-[2rem] border border-gray-100 bg-white p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-indigo-600 text-white shadow-md shadow-brand-primary/20">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-gray-900 text-lg sm:text-xl">
                  Vendor Integration Guide
                </h3>
                {vendorCode && (
                  <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary">
                    {vendorCode}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Specifications for routing traffic, tracking parameters, and postback callbacks
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 1. Traffic Routing Format */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-brand-primary" />
              1. Routing Entry Link Format
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              HTTPS Enabled
            </span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            When directing your respondents into InsightMatrix, append your unique
            respondent/session ID to the allocation link using the{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-brand-primary font-bold">
              toid
            </code>{" "}
            query parameter.
          </p>
          <div className="relative rounded-2xl border border-gray-200 bg-slate-900 p-3.5 text-xs text-slate-100 font-mono flex items-center justify-between gap-2 overflow-x-auto">
            <span className="truncate">{sampleUrl}</span>
            <button
              type="button"
              onClick={() => copyText(sampleUrl, "sample")}
              className="shrink-0 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Copy URL"
            >
              {copiedKey === "sample" ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* 2. Supported Parameters */}
        <div className="space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-brand-primary" />
            2. Parameter Specifications
          </span>
          <div className="rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100 text-xs">
            <div className="p-3 bg-gray-50/70 grid grid-cols-12 font-bold text-gray-700">
              <span className="col-span-3">Parameter</span>
              <span className="col-span-3">Required?</span>
              <span className="col-span-6">Description</span>
            </div>
            <div className="p-3 grid grid-cols-12 items-center bg-white">
              <span className="col-span-3 font-mono font-bold text-brand-primary">toid</span>
              <span className="col-span-3">
                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                  Required
                </span>
              </span>
              <span className="col-span-6 text-gray-600">
                Your unique respondent token or click ID. Preserved and echoed in postback
                callbacks.
              </span>
            </div>
            <div className="p-3 grid grid-cols-12 items-center bg-gray-50/30">
              <span className="col-span-3 font-mono font-bold text-gray-700">subid</span>
              <span className="col-span-3">
                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-gray-100 text-gray-600">
                  Optional
                </span>
              </span>
              <span className="col-span-6 text-gray-600">
                Sub-publisher, affiliate, or source campaign identifier for internal sub-tracking.
              </span>
            </div>
          </div>
        </div>

        {/* 3. Postbacks & Callback Outcomes */}
        <div className="space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-primary" />
            3. Server Postback Macros
          </span>
          <p className="text-xs text-gray-600 leading-relaxed">
            Configure your outcome URLs in your{" "}
            <strong className="text-gray-900">Vendor Profile</strong>. When respondents reach a
            terminal disposition, InsightMatrix relays back to your endpoint with these macros
            replaced:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 space-y-1">
              <span className="font-mono text-xs font-black text-gray-900">[toid]</span>
              <p className="text-[11px] text-gray-500">
                Replaced with the exact token passed on entry.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 space-y-1">
              <span className="font-mono text-xs font-black text-gray-900">[status]</span>
              <p className="text-[11px] text-gray-500">
                Outcome disposition: complete, terminate, quota_full, quality_reject.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-gray-100">
          <span className="text-xs text-gray-400">
            Need custom integration support? Contact desk.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gray-900 hover:bg-black text-white px-5 py-2 text-xs font-bold transition shadow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
