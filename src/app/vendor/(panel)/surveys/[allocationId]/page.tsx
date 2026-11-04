"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  DollarSign,
  HelpCircle,
  Info,
  Layers,
  Link as LinkIcon,
  Loader2,
  Radio,
  ShieldCheck,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { CopyRoutingLinkButton } from "@/components/vendor/copy-routing-link-button";
import {
  VENDOR_ALLOCATION_STATUS_LABELS,
  VENDOR_ALLOCATION_STATUS_STYLES,
  type VendorAllocationStatus,
} from "@/constants/vendor-allocation";
import { ROUTES } from "@/constants/routes";
import { getVendorPortalSurvey } from "@/services/vendor-portal/vendor-surveys-api";
import { queryKeys } from "@/services/queries";
import { useVendorAuthStore } from "@/store/vendorAuthStore";

function StatusBadge({ status }: { status: VendorAllocationStatus }) {
  const isActive = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${VENDOR_ALLOCATION_STATUS_STYLES[status]}`}
    >
      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
      {VENDOR_ALLOCATION_STATUS_LABELS[status]}
    </span>
  );
}

function MetricCard({
  label,
  value,
  sublabel,
  icon: Icon,
  color = "default",
}: {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: "default" | "emerald" | "blue" | "amber" | "rose" | "purple";
}) {
  const colors = {
    default: "border-gray-200 bg-white text-gray-900",
    emerald: "border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 to-white text-emerald-950",
    blue: "border-blue-200/80 bg-gradient-to-br from-blue-50/70 to-white text-blue-950",
    amber: "border-amber-200/80 bg-gradient-to-br from-amber-50/70 to-white text-amber-950",
    rose: "border-rose-200/80 bg-gradient-to-br from-rose-50/70 to-white text-rose-950",
    purple: "border-purple-200/80 bg-gradient-to-br from-purple-50/70 to-white text-purple-950",
  };

  const iconColors = {
    default: "text-gray-400 bg-gray-100",
    emerald: "text-emerald-600 bg-emerald-100",
    blue: "text-blue-600 bg-blue-100",
    amber: "text-amber-600 bg-amber-100",
    rose: "text-rose-600 bg-rose-100",
    purple: "text-purple-600 bg-purple-100",
  };

  return (
    <div className={`rounded-2xl border p-4.5 shadow-sm transition-all ${colors[color]}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
        {Icon && (
          <div className={`p-1.5 rounded-lg ${iconColors[color]}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <p className="mt-2 text-2xl font-black tracking-tight">{value}</p>
      {sublabel && <p className="mt-0.5 text-xs text-gray-500 font-medium">{sublabel}</p>}
    </div>
  );
}

export default function VendorSurveyDetailPage() {
  const params = useParams();
  const allocationId = typeof params.allocationId === "string" ? params.allocationId : "";
  const vendor = useVendorAuthStore((s) => s.vendor);
  const [copiedRaw, setCopiedRaw] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.vendorPortalSurveys.detail(allocationId),
    queryFn: () => getVendorPortalSurvey(allocationId),
    enabled: Boolean(allocationId),
  });

  const allocation = data?.allocation;
  const analytics = data?.analytics;

  if (!allocationId) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        Invalid allocation parameter.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary mb-3" />
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Loading campaign details…
        </p>
      </div>
    );
  }

  if (isError || !allocation) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
        <p className="font-bold text-base">Campaign allocation not found</p>
        <p className="text-xs mt-1 text-rose-600">
          The requested allocation may have been unassigned or moved.
        </p>
        <Link
          href={ROUTES.vendor.surveys}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold underline"
        >
          Return to surveys
        </Link>
      </div>
    );
  }

  const pct =
    allocation.allocatedQuota > 0
      ? Math.min(100, Math.round((allocation.completedCount / allocation.allocatedQuota) * 100))
      : 0;

  const totalEarned = (allocation.completedCount * (allocation.vendorCpi || 0)).toFixed(2);
  const routingUrlWithParam = `${allocation.routingLink}?toid=[RESPONDENT_ID]`;

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedRaw(true);
      toast.success("Routing URL copied to clipboard");
      setTimeout(() => setCopiedRaw(false), 2000);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Back button */}
      <div>
        <Link
          href={ROUTES.vendor.surveys}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all surveys
        </Link>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-brand-subtle px-2.5 py-1 text-xs font-mono font-bold text-brand-primary border border-brand-light">
                {allocation.allocationCode}
              </span>
              <span className="text-xs font-mono text-gray-400">Code: {allocation.surveyCode}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              {allocation.surveyName}
            </h1>
            {(allocation.startDate || allocation.endDate) && (
              <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span>
                  Active Window:{" "}
                  {allocation.startDate
                    ? format(new Date(allocation.startDate), "PPP")
                    : "Immediate"}
                  {" → "}
                  {allocation.endDate
                    ? format(new Date(allocation.endDate), "PPP")
                    : "Until quota met"}
                </span>
              </div>
            )}
          </div>

          <div>
            <StatusBadge status={allocation.status} />
          </div>
        </div>

        {/* Quota Progress Bar */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2">
            <span className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-gray-900">
                {allocation.completedCount} / {allocation.allocatedQuota} Completes
              </span>
              <span className="text-xs text-gray-400">
                ({allocation.liveRemainingQuota} remaining)
              </span>
            </span>
            <span className="text-brand-primary font-black text-sm">{pct}% Delivered</span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-primary via-indigo-600 to-teal-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Campaign Routing Link Card */}
      <div className="rounded-3xl border border-brand-light bg-gradient-to-br from-brand-subtle/40 via-white to-slate-50 p-6 md:p-8 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-brand-primary" />
              <h2 className="text-base font-black text-gray-900">Live Traffic Routing URL</h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Append your user tracking parameter{" "}
              <code className="font-mono font-bold text-brand-primary">?toid=YOUR_ID</code> to track
              completes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => copyUrl(routingUrlWithParam)}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-black transition-colors shadow-sm"
            >
              {copiedRaw ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copiedRaw ? "Copied Link" : "Copy Routing Link"}
            </button>
          </div>
        </div>

        {/* Code container */}
        <div className="relative rounded-2xl border border-gray-200 bg-slate-900 p-4 text-slate-100 font-mono text-xs break-all shadow-inner">
          <div className="flex items-center justify-between gap-2 mb-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Routing Endpoint</span>
            <span className="text-emerald-400">HTTPS GET</span>
          </div>
          <span className="text-slate-300">{allocation.routingLink}</span>
          <span className="text-amber-400 font-bold">?toid=[RESPONDENT_ID]</span>
        </div>

        {/* Integration Parameter Notice */}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-xs text-indigo-900 flex items-start gap-3">
          <Info className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Required Parameter: [RESPONDENT_ID]</p>
            <p className="text-indigo-800 leading-relaxed">
              When routing traffic from your subpanel or partner network, replace{" "}
              <code className="rounded bg-indigo-100 px-1 py-0.5 font-mono font-bold">
                [RESPONDENT_ID]
              </code>{" "}
              with your internal unique user session ID. When the respondent reaches an outcome,
              InsightMatrix executes your postback URL and substitutes{" "}
              <code className="rounded bg-indigo-100 px-1 py-0.5 font-mono font-bold">[toid]</code>{" "}
              with this value.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Matrix */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-4">
          Performance Analytics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Total Starts"
            value={allocation.startedCount.toLocaleString()}
            sublabel="Incoming clicks recorded"
            icon={Activity}
            color="default"
          />

          <MetricCard
            label="Verified Completes"
            value={allocation.completedCount.toLocaleString()}
            sublabel="Delivered quotas"
            icon={CheckCircle2}
            color="emerald"
          />

          <MetricCard
            label="Conversion Rate (CR)"
            value={`${allocation.conversionRate}%`}
            sublabel="Completes / starts"
            icon={TrendingUp}
            color="blue"
          />

          <MetricCard
            label="Incidence Rate (IR)"
            value={`${allocation.incidenceRate}%`}
            sublabel="Targeting qualification"
            icon={Zap}
            color="purple"
          />

          <MetricCard
            label="Terminates"
            value={allocation.terminateCount.toLocaleString()}
            sublabel="Screened out respondents"
            icon={XCircle}
            color="amber"
          />

          <MetricCard
            label="Quota Full"
            value={allocation.quotaFullCount.toLocaleString()}
            sublabel="Cells already filled"
            icon={Layers}
            color="amber"
          />

          <MetricCard
            label="Quality Rejects"
            value={allocation.qualityRejectCount.toLocaleString()}
            sublabel="Speeders & fraud flags"
            icon={AlertTriangle}
            color="rose"
          />

          <MetricCard
            label="Total Accrued"
            value={`$${totalEarned}`}
            sublabel={`CPI: $${allocation.vendorCpi} per complete`}
            icon={DollarSign}
            color="emerald"
          />
        </div>
      </div>

      {/* Postback Notification Mapping */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Outcome Postback Delivery
          </h2>
          <Link
            href={ROUTES.vendor.profile}
            className="text-xs font-bold text-brand-primary hover:underline"
          >
            Manage Postback URLs →
          </Link>
        </div>

        <p className="text-xs text-gray-500">
          When respondents complete, terminate, or screen out on this study, InsightMatrix triggers
          your registered postback endpoints:
        </p>

        <div className="grid gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-xl border border-gray-100 bg-slate-50 p-3.5">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-gray-800">Complete Callback</span>
              <span className="text-[10px] font-bold uppercase text-emerald-600">Status 1</span>
            </div>
            <p className="font-mono text-[11px] text-gray-500 truncate">
              {vendor?.callbackUrls?.complete || "Not configured (Set in Profile)"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-slate-50 p-3.5">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-gray-800">Terminate Callback</span>
              <span className="text-[10px] font-bold uppercase text-amber-600">Status 2</span>
            </div>
            <p className="font-mono text-[11px] text-gray-500 truncate">
              {vendor?.callbackUrls?.terminate || "Not configured (Set in Profile)"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-slate-50 p-3.5">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-gray-800">Quota Full Callback</span>
              <span className="text-[10px] font-bold uppercase text-sky-600">Status 3</span>
            </div>
            <p className="font-mono text-[11px] text-gray-500 truncate">
              {vendor?.callbackUrls?.quotafull || "Not configured (Set in Profile)"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-slate-50 p-3.5">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-gray-800">Quality Reject Callback</span>
              <span className="text-[10px] font-bold uppercase text-rose-600">Status 4</span>
            </div>
            <p className="font-mono text-[11px] text-gray-500 truncate">
              {vendor?.callbackUrls?.qualityreject || "Not configured (Set in Profile)"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
