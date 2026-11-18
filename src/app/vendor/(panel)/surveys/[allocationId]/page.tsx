"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  DollarSign,
  FileText,
  Globe,
  Info,
  Languages,
  Layers,
  Link as LinkIcon,
  Loader2,
  Lock,
  Monitor,
  ShieldCheck,
  TrendingUp,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/crm/confirm-dialog";
import {
  AllocationStatusBadge,
  VendorResponseStatusBadge,
} from "@/components/admin/vendor-allocations/allocation-status-badge";
import { ROUTES } from "@/constants/routes";
import { parseApiError } from "@/services/api/errors";
import {
  acceptVendorPortalSurvey,
  getVendorPortalSurvey,
  rejectVendorPortalSurvey,
} from "@/services/vendor-portal/vendor-surveys-api";
import { queryKeys } from "@/services/queries";
import { useVendorAuthStore } from "@/store/vendorAuthStore";
import { formatNumber } from "@/utils/format";

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

function SpecTagList({
  items,
  emptyLabel = "Any / All",
}: {
  items: string[];
  emptyLabel?: string;
}) {
  if (!items || items.length === 0) {
    return <span className="text-xs font-medium text-slate-400">{emptyLabel}</span>;
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-700"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function VendorSurveyDetailPage() {
  const params = useParams();
  const qc = useQueryClient();
  const allocationId = typeof params.allocationId === "string" ? params.allocationId : "";
  const vendor = useVendorAuthStore((s) => s.vendor);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.vendorPortalSurveys.detail(allocationId),
    queryFn: () => getVendorPortalSurvey(allocationId),
    enabled: Boolean(allocationId),
  });

  const invalidate = async () => {
    await qc.invalidateQueries({ queryKey: queryKeys.vendorPortalSurveys.detail(allocationId) });
    await qc.invalidateQueries({ queryKey: queryKeys.vendorPortalSurveys.all });
    await qc.invalidateQueries({ queryKey: queryKeys.vendorAuth.dashboard });
  };

  const acceptMut = useMutation({
    mutationFn: () => acceptVendorPortalSurvey(allocationId),
    onSuccess: async () => {
      toast.success("Allocation accepted! Your live routing link is now unlocked.");
      await invalidate();
    },
    onError: (err) => toast.error(parseApiError(err, "Could not accept allocation")),
  });

  const rejectMut = useMutation({
    mutationFn: () => rejectVendorPortalSurvey(allocationId),
    onSuccess: async () => {
      toast.success("Allocation rejected.");
      setRejectConfirmOpen(false);
      await invalidate();
    },
    onError: (err) => toast.error(parseApiError(err, "Could not reject allocation")),
  });

  const allocation = data?.allocation;

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
  const isAccepted = allocation.vendorResponseStatus === "accepted";
  const isRejected = allocation.vendorResponseStatus === "rejected";
  const isPending = allocation.vendorResponseStatus === "pending";
  const canRespond =
    isPending && allocation.status !== "closed" && allocation.status !== "completed";

  const routingUrlWithParam =
    isAccepted && allocation.routingLink ? `${allocation.routingLink}?toid=[RESPONDENT_ID]` : "";

  const ageLabel =
    allocation.targetAgeMin != null && allocation.targetAgeMax != null
      ? `${allocation.targetAgeMin} – ${allocation.targetAgeMax} years`
      : allocation.targetAgeMin != null
        ? `${allocation.targetAgeMin}+ years`
        : allocation.targetAgeMax != null
          ? `Up to ${allocation.targetAgeMax} years`
          : "All ages";

  const genderLabel =
    allocation.targetGender && allocation.targetGender !== "all"
      ? allocation.targetGender.charAt(0).toUpperCase() + allocation.targetGender.slice(1)
      : "All genders";

  const copyUrl = async (url: string) => {
    if (!url) return;
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
              <AllocationStatusBadge status={allocation.status} />
              <VendorResponseStatusBadge status={allocation.vendorResponseStatus} />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              {allocation.surveyName}
            </h1>
            {(allocation.startDate || allocation.endDate) && (
              <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span>
                  Allocation Window:{" "}
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

          <div className="flex flex-wrap items-center gap-2">
            {canRespond && (
              <>
                <button
                  type="button"
                  disabled={acceptMut.isPending || rejectMut.isPending}
                  onClick={() => acceptMut.mutate()}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {acceptMut.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Accept Allocation
                </button>
                <button
                  type="button"
                  disabled={acceptMut.isPending || rejectMut.isPending}
                  onClick={() => setRejectConfirmOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
              </>
            )}
          </div>
        </div>

        {/* Quota Progress Bar */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2">
            <span className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-gray-900">
                {formatNumber(allocation.completedCount)} /{" "}
                {formatNumber(allocation.allocatedQuota)} Completes
              </span>
              <span className="text-xs text-gray-400">
                ({formatNumber(allocation.liveRemainingQuota)} remaining)
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

      {/* Routing Link Gate: Pending / Rejected vs Accepted */}
      {isAccepted && allocation.routingLink ? (
        <div className="rounded-3xl border border-brand-light bg-gradient-to-br from-brand-subtle/40 via-white to-slate-50 p-6 md:p-8 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-brand-primary" />
                <h2 className="text-base font-black text-gray-900">Live Traffic Routing URL</h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Append your user tracking parameter{" "}
                <code className="font-mono font-bold text-brand-primary">?toid=YOUR_ID</code> to
                track completes.
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

          <div className="relative rounded-2xl border border-gray-200 bg-slate-900 p-4 text-slate-100 font-mono text-xs break-all shadow-inner">
            <div className="flex items-center justify-between gap-2 mb-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Routing Endpoint</span>
              <span className="text-emerald-400">HTTPS GET</span>
            </div>
            <span className="text-slate-300">{allocation.routingLink}</span>
            <span className="text-amber-400 font-bold">?toid=[RESPONDENT_ID]</span>
          </div>

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
                <code className="rounded bg-indigo-100 px-1 py-0.5 font-mono font-bold">
                  [toid]
                </code>{" "}
                with this value.
              </p>
            </div>
          </div>
        </div>
      ) : isRejected ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/60 p-6 md:p-8 shadow-sm flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
            <XCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-black text-rose-900">Allocation Rejected</h2>
            <p className="text-xs text-rose-700 leading-relaxed max-w-2xl">
              You declined this survey allocation
              {allocation.vendorRespondedAt
                ? ` on ${format(new Date(allocation.vendorRespondedAt), "PPP p")}`
                : ""}
              . Survey routing links are hidden and traffic routing is disabled for rejected
              allocations.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50/80 via-white to-slate-50 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Lock className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-black text-gray-900">
                Survey Routing Link Locked Until Acceptance
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
                Review the full survey specifications, targeting criteria, CPI, LOI, and quota
                below. Click <strong>Accept Allocation</strong> to unlock your live traffic routing
                URL, or <strong>Reject</strong> if you cannot fulfill this campaign.
              </p>
            </div>
          </div>

          {canRespond && (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                disabled={acceptMut.isPending || rejectMut.isPending}
                onClick={() => acceptMut.mutate()}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {acceptMut.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Accept & Unlock Link
              </button>
              <button
                type="button"
                disabled={acceptMut.isPending || rejectMut.isPending}
                onClick={() => setRejectConfirmOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </button>
            </div>
          )}
        </div>
      )}

      {/* Full Survey Specifications & Targeting */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-primary" />
              Survey Specifications & Targeting
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Complete campaign criteria, country targeting, LOI, incidence rate, and quota limits
            </p>
          </div>
          {allocation.surveyStatus && (
            <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
              Survey Status: {allocation.surveyStatus}
            </span>
          )}
        </div>

        {/* Core Study Specs Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
              Vendor CPI
            </p>
            <p className="mt-1.5 text-xl font-black text-emerald-700">
              ${Number(allocation.vendorCpi ?? 0).toFixed(2)}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Per verified complete</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-blue-600" />
              Estimated LOI
            </p>
            <p className="mt-1.5 text-xl font-black text-slate-900">
              {allocation.estimatedLOI != null ? `${allocation.estimatedLOI} min` : "Not specified"}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Length of interview</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-indigo-600" />
              Expected IR
            </p>
            <p className="mt-1.5 text-xl font-black text-indigo-700">
              {allocation.surveyIncidenceRate != null
                ? `${allocation.surveyIncidenceRate}%`
                : `${allocation.incidenceRate}%`}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Survey incidence rate</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-amber-600" />
              Survey Quota
            </p>
            <p className="mt-1.5 text-xl font-black text-slate-900">
              {formatNumber(allocation.surveyRemainingQuota)}{" "}
              <span className="text-xs font-semibold text-slate-400">
                / {formatNumber(allocation.surveyTotalQuota)}
              </span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Your allocation: {formatNumber(allocation.allocatedQuota)} (
              {formatNumber(allocation.liveRemainingQuota)} left)
            </p>
          </div>
        </div>

        {/* Targeting Details Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 p-4 space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-brand-primary" />
              Target Countries
            </p>
            <SpecTagList items={allocation.targetCountries} emptyLabel="Global / All Countries" />
          </div>

          <div className="rounded-2xl border border-slate-200/80 p-4 space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Languages className="h-3.5 w-3.5 text-brand-primary" />
              Target Languages
            </p>
            <SpecTagList items={allocation.targetLanguages} emptyLabel="Any Language" />
          </div>

          <div className="rounded-2xl border border-slate-200/80 p-4 space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-brand-primary" />
              Demographics (Gender & Age)
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                {genderLabel}
              </span>
              <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                {ageLabel}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 p-4 space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Monitor className="h-3.5 w-3.5 text-brand-primary" />
              Allowed Devices
            </p>
            <SpecTagList items={allocation.targetDevices} emptyLabel="All Devices" />
          </div>

          <div className="rounded-2xl border border-slate-200/80 p-4 space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-brand-primary" />
              Target Professions & Industries
            </p>
            <SpecTagList
              items={[
                ...(allocation.targetProfessions ?? []),
                ...(allocation.targetIndustries ?? []),
              ]}
              emptyLabel="All Professions & Industries"
            />
          </div>

          <div className="rounded-2xl border border-slate-200/80 p-4 space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-brand-primary" />
              Company Sizes & Schedule
            </p>
            <SpecTagList items={allocation.targetCompanySizes} emptyLabel="All Company Sizes" />
            {(allocation.surveyStartDate || allocation.surveyEndDate) && (
              <p className="text-[11px] text-slate-500 pt-1">
                Study Window:{" "}
                {allocation.surveyStartDate
                  ? format(new Date(allocation.surveyStartDate), "MMM d, yyyy")
                  : "Open"}
                {" → "}
                {allocation.surveyEndDate
                  ? format(new Date(allocation.surveyEndDate), "MMM d, yyyy")
                  : "Ongoing"}
              </p>
            )}
          </div>
        </div>

        {/* Dynamic Quota Groups (if any) */}
        {allocation.dynamicQuotaGroups && allocation.dynamicQuotaGroups.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Quota Groups ({allocation.dynamicQuotaGroups.length})
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-[#091428] text-white">
                  <tr className="text-[10px] font-extrabold uppercase tracking-wider text-slate-100">
                    <th className="px-3 py-2">Quota Group</th>
                    <th className="px-3 py-2">Description</th>
                    <th className="px-3 py-2 text-right">Total</th>
                    <th className="px-3 py-2 text-right">Remaining</th>
                    <th className="px-3 py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allocation.dynamicQuotaGroups.map((g, idx) => (
                    <tr key={g.id || idx} className="hover:bg-blue-50/40">
                      <td className="px-3 py-2 font-bold text-slate-900">{g.groupName}</td>
                      <td className="px-3 py-2 text-slate-600">{g.groupDescription || "—"}</td>
                      <td className="px-3 py-2 text-right font-mono font-semibold tabular-nums">
                        {formatNumber(g.totalQuota)}
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-bold tabular-nums text-emerald-700">
                        {formatNumber(g.remainingQuota)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-700">
                          {g.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notes */}
        {(allocation.surveyNotes || allocation.allocationNotes) && (
          <div className="grid gap-3 sm:grid-cols-2 pt-2">
            {allocation.surveyNotes && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Survey Brief / Notes
                </p>
                <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {allocation.surveyNotes}
                </p>
              </div>
            )}
            {allocation.allocationNotes && (
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-indigo-500 mb-1">
                  Allocation Instructions
                </p>
                <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {allocation.allocationNotes}
                </p>
              </div>
            )}
          </div>
        )}
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
            label="Live Incidence Rate (IR)"
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
              {vendor?.callbackUrls?.quota_full || "Not configured (Set in Profile)"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-slate-50 p-3.5">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-gray-800">Quality Reject Callback</span>
              <span className="text-[10px] font-bold uppercase text-rose-600">Status 4</span>
            </div>
            <p className="font-mono text-[11px] text-gray-500 truncate">
              {vendor?.callbackUrls?.quality_reject || "Not configured (Set in Profile)"}
            </p>
          </div>
        </div>
      </div>

      {/* Confirm Reject Dialog */}
      <ConfirmDialog
        open={rejectConfirmOpen}
        onOpenChange={setRejectConfirmOpen}
        title="Reject survey allocation?"
        description={`Are you sure you want to reject "${allocation.surveyName}" (${allocation.allocationCode})? The survey routing link will remain locked and unavailable.`}
        confirmLabel="Reject allocation"
        destructive
        loading={rejectMut.isPending}
        onConfirm={() => rejectMut.mutate()}
      />
    </div>
  );
}
