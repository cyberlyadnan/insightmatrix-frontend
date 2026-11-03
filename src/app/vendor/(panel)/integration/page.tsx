"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Layers,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Store,
} from "lucide-react";
import { toast } from "sonner";

import { ROUTES } from "@/constants/routes";
import { useVendorAuthStore } from "@/store/vendorAuthStore";

export default function VendorIntegrationPage() {
  const vendor = useVendorAuthStore((s) => s.vendor);
  const [testToid, setTestToid] = useState("USR_982410");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const sampleBaseRouting = `https://insightmatrix.online/vendor/start/SURVEY_CODE?toid=${testToid}`;
  const completeSample = (
    vendor?.callbackUrls?.complete ||
    "https://yourdomain.com/postback?user_id=[toid]&status=complete"
  )
    .replace(/\[toid\]/g, testToid)
    .replace(/\[status\]/g, "1");

  const terminateSample = (
    vendor?.callbackUrls?.terminate ||
    "https://yourdomain.com/postback?user_id=[toid]&status=terminate"
  )
    .replace(/\[toid\]/g, testToid)
    .replace(/\[status\]/g, "2");

  const quotaFullSample = (
    vendor?.callbackUrls?.quota_full ||
    "https://yourdomain.com/postback?user_id=[toid]&status=quotafull"
  )
    .replace(/\[toid\]/g, testToid)
    .replace(/\[status\]/g, "3");

  const rejectSample = (
    vendor?.callbackUrls?.quality_reject ||
    "https://yourdomain.com/postback?user_id=[toid]&status=rejected"
  )
    .replace(/\[toid\]/g, testToid)
    .replace(/\[status\]/g, "4");

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-[#080F1D] via-[#0C1527] to-[#080F1D] p-6 md:p-8 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute right-32 -bottom-20 h-56 w-56 rounded-full bg-cyan-500/15 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-light border border-brand-primary/30">
                <Code2 className="h-3.5 w-3.5" />
                Integration Specs & API
              </span>
              {vendor?.vendorCode && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-mono font-bold text-slate-200 border border-white/10">
                  <Store className="h-3 w-3" />
                  {vendor.vendorCode}
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Partner Integration Specifications
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Technical protocol specifications for inbound respondent routing and real-time
              Server-to-Server (S2S) postback webhooks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.vendor.profile}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-primary/30 hover:brightness-110 transition-all"
            >
              Configure S2S Postbacks
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Part 1: Inbound Routing Protocol */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">
              1
            </span>
            <h2 className="text-lg font-black text-gray-900 tracking-tight">
              Inbound Traffic Routing Link Specification
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            When directing respondents from your subpanel or partner network into an allocated
            campaign, use your assigned routing link and append your unique respondent tracking
            identifier.
          </p>
        </div>

        {/* URL Format Box */}
        <div className="rounded-2xl border border-gray-800 bg-[#0A101D] p-5 text-slate-100 font-mono text-xs shadow-inner space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Routing Endpoint Structure</span>
            <span className="text-emerald-400">HTTPS GET</span>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-slate-800 text-slate-200 break-all leading-relaxed">
            <span className="text-slate-400">https://insightmatrix.online/vendor/start/</span>
            <span className="text-indigo-400 font-bold">[ROUTING_SLUG]</span>
            <span className="text-amber-400 font-bold">?toid=[RESPONDENT_ID]</span>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => copyToClipboard(sampleBaseRouting, "base-routing")}
              className="inline-flex items-center gap-1.5 text-[11px] font-sans font-bold text-brand-light hover:text-white transition-colors"
            >
              {copiedKey === "base-routing" ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              Copy Example URL
            </button>
          </div>
        </div>

        {/* Parameter Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-gray-100 rounded-2xl overflow-hidden">
            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-gray-500 border-b border-gray-100">
              <tr>
                <th className="p-3.5">Parameter</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Requirement</th>
                <th className="p-3.5">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-3.5 font-mono font-bold text-brand-primary">toid</td>
                <td className="p-3.5 font-mono text-gray-600">string (max 128)</td>
                <td className="p-3.5">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Mandatory
                  </span>
                </td>
                <td className="p-3.5 text-gray-600">
                  Your unique user ID or transaction tracking ID. This ID will be recorded and
                  injected into your outcome postback callback when the user finishes.
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-mono font-bold text-gray-700">ROUTING_SLUG</td>
                <td className="p-3.5 font-mono text-gray-600">URL path</td>
                <td className="p-3.5">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                    Automatic
                  </span>
                </td>
                <td className="p-3.5 text-gray-600">
                  Unique routing slug generated specifically for your vendor allocation on that
                  survey. Supplier survey URLs are never exposed.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Part 2: S2S Webhook Postback Protocol */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs">
              2
            </span>
            <h2 className="text-lg font-black text-gray-900 tracking-tight">
              Server-to-Server (S2S) Postback Protocol
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            When a respondent concludes a survey (Complete, Terminate, Quota Full, or Quality
            Reject), InsightMatrix triggers an automated HTTP GET webhook to your configured
            endpoint.
          </p>
        </div>

        {/* Dynamic Macros Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-slate-50/70 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-brand-primary text-sm">[toid]</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                Macro Parameter
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Substituted with the exact respondent tracking ID you passed into the inbound routing
              link query string (`?toid=...`).
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-slate-50/70 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-brand-primary text-sm">[status]</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                Macro Parameter
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Substituted with the numeric outcome status code representing the respondent finish
              state: <code className="font-mono font-bold">1</code> (Complete),{" "}
              <code className="font-mono font-bold">2</code> (Terminate),{" "}
              <code className="font-mono font-bold">3</code> (Quota full),{" "}
              <code className="font-mono font-bold">4</code> (Quality reject).
            </p>
          </div>
        </div>

        {/* Outcome States Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-gray-100 rounded-2xl overflow-hidden">
            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-gray-500 border-b border-gray-100">
              <tr>
                <th className="p-3.5">Outcome</th>
                <th className="p-3.5">Code</th>
                <th className="p-3.5">Postback Trigger Triggered</th>
                <th className="p-3.5">Vendor Payout Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-3.5 font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Complete
                </td>
                <td className="p-3.5 font-mono font-bold">1</td>
                <td className="p-3.5 text-gray-600">
                  Respondent answered all survey questions successfully.
                </td>
                <td className="p-3.5 font-bold text-gray-900">Credited (Vendor CPI earned)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-amber-600 flex items-center gap-1.5">
                  <Radio className="h-4 w-4" />
                  Terminate
                </td>
                <td className="p-3.5 font-mono font-bold">2</td>
                <td className="p-3.5 text-gray-600">
                  Screened out or failed demographic targeting criteria.
                </td>
                <td className="p-3.5 text-gray-400">No payout</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-sky-600 flex items-center gap-1.5">
                  <Layers className="h-4 w-4" />
                  Quota Full
                </td>
                <td className="p-3.5 font-mono font-bold">3</td>
                <td className="p-3.5 text-gray-600">
                  The quota cell or overall survey completed while in progress.
                </td>
                <td className="p-3.5 text-gray-400">No payout</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-rose-600 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4" />
                  Quality Reject
                </td>
                <td className="p-3.5 font-mono font-bold">4</td>
                <td className="p-3.5 text-gray-600">
                  Flagged by speeder traps, duplicate checks, or fraud filters.
                </td>
                <td className="p-3.5 text-gray-400">No payout</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Part 3: Live Postback Preview & Tester */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs">
                3
              </span>
              <h2 className="text-lg font-black text-gray-900 tracking-tight">
                Live Postback URL Preview
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Test how macros are replaced using your account&apos;s configured callback URLs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-gray-600 whitespace-nowrap">Sample ID:</label>
            <input
              type="text"
              value={testToid}
              onChange={(e) => setTestToid(e.target.value || "USR_982410")}
              className="h-9 w-40 rounded-xl border border-gray-200 bg-slate-50 px-3 text-xs font-mono font-bold text-brand-primary focus:bg-white"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-gray-100 bg-slate-50/80 p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Complete Callback Dispatch
              </span>
              <span className="text-[10px] font-mono text-gray-400">HTTP GET</span>
            </div>
            <p className="font-mono text-xs text-slate-800 break-all bg-white p-2.5 rounded-lg border border-gray-200">
              {completeSample}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-slate-50/80 p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Terminate Callback Dispatch
              </span>
              <span className="text-[10px] font-mono text-gray-400">HTTP GET</span>
            </div>
            <p className="font-mono text-xs text-slate-800 break-all bg-white p-2.5 rounded-lg border border-gray-200">
              {terminateSample}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-slate-50/80 p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-800 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
                Quota Full Callback Dispatch
              </span>
              <span className="text-[10px] font-mono text-gray-400">HTTP GET</span>
            </div>
            <p className="font-mono text-xs text-slate-800 break-all bg-white p-2.5 rounded-lg border border-gray-200">
              {quotaFullSample}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-slate-50/80 p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Quality Reject Callback Dispatch
              </span>
              <span className="text-[10px] font-mono text-gray-400">HTTP GET</span>
            </div>
            <p className="font-mono text-xs text-slate-800 break-all bg-white p-2.5 rounded-lg border border-gray-200">
              {rejectSample}
            </p>
          </div>
        </div>
      </section>

      {/* Part 4: Security & Technical SLA */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm space-y-5">
        <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          Technical Requirements & Delivery Guarantees
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-slate-50/60 p-4 space-y-1">
            <span className="text-xs font-bold text-gray-900 block">HTTPS Enforced</span>
            <p className="text-xs text-gray-500 leading-relaxed">
              All postback callback endpoints must support SSL/TLS encryption. Non-HTTPS endpoints
              will be rejected.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-slate-50/60 p-4 space-y-1">
            <span className="text-xs font-bold text-gray-900 block">5s Timeout Threshold</span>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your server must return an HTTP <code className="font-mono font-bold">200 OK</code>{" "}
              within 5 seconds to confirm receipt of the webhook.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-slate-50/60 p-4 space-y-1">
            <span className="text-xs font-bold text-gray-900 block">Idempotent Delivery</span>
            <p className="text-xs text-gray-500 leading-relaxed">
              Design your endpoint to handle potential duplicate pings gracefully by referencing the
              unique <code className="font-mono font-bold">[toid]</code> parameter.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
