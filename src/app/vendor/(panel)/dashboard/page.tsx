"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  DollarSign,
  Layers,
  TrendingUp,
  XCircle,
} from "lucide-react";

import { getVendorDashboardSummary } from "@/services/vendor-portal";
import { queryKeys } from "@/services/queries";
import { useVendorAuthStore } from "@/store/vendorAuthStore";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = "brand",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "brand" | "emerald" | "amber" | "rose" | "sky";
}) {
  const accents = {
    brand: "from-brand-primary/10 to-brand-subtle text-brand-primary ring-brand-light",
    emerald: "from-emerald-50 to-teal-50 text-emerald-600 ring-emerald-100",
    amber: "from-amber-50 to-orange-50 text-amber-600 ring-amber-100",
    rose: "from-rose-50 to-red-50 text-rose-600 ring-rose-100",
    sky: "from-sky-50 to-cyan-50 text-sky-600 ring-sky-100",
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div
        className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ${accents[accent]}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <p className="mt-1 text-2xl font-black tracking-tight text-brand-accent1">{value}</p>
      {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}

export default function VendorDashboardPage() {
  const vendor = useVendorAuthStore((s) => s.vendor);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.vendorAuth.dashboard,
    queryFn: getVendorDashboardSummary,
  });

  const summary = data ?? {
    activeAssignments: 0,
    totalCompletes: 0,
    totalTerminates: 0,
    totalQuotaFull: 0,
    totalQualityRejects: 0,
    conversionRate: 0,
    terminationRate: 0,
    todayCompletes: 0,
    weeklyCompletes: 0,
    monthlyCompletes: 0,
    totalRevenueGenerated: 0,
    totalPayoutDue: 0,
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">
          Overview
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-brand-accent1">
          {vendor?.companyName ?? "Vendor dashboard"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          Routing assignments and live traffic metrics will appear here in the next release.
          Counters below reflect your account totals and placeholder time-series fields.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading metrics…</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Active assignments"
              value={summary.activeAssignments}
              subtitle="Survey allocations (coming soon)"
              icon={Layers}
              accent="sky"
            />
            <StatCard
              title="Total completes"
              value={summary.totalCompletes.toLocaleString()}
              subtitle={`Today: ${summary.todayCompletes} · Week: ${summary.weeklyCompletes}`}
              icon={CheckCircle2}
              accent="emerald"
            />
            <StatCard
              title="Conversion rate"
              value={`${summary.conversionRate}%`}
              subtitle="Completes / all outcomes"
              icon={TrendingUp}
              accent="brand"
            />
            <StatCard
              title="Termination rate"
              value={`${summary.terminationRate}%`}
              subtitle={`${summary.totalTerminates} terminates`}
              icon={XCircle}
              accent="amber"
            />
            <StatCard
              title="Quality rejects"
              value={summary.totalQualityRejects}
              subtitle="Speeders & quality flags"
              icon={AlertTriangle}
              accent="rose"
            />
            <StatCard
              title="Quota full"
              value={summary.totalQuotaFull}
              subtitle="Cells closed"
              icon={BarChart3}
              accent="amber"
            />
            <StatCard
              title="Earnings"
              value={`$${summary.totalRevenueGenerated.toLocaleString()}`}
              subtitle="Revenue generated"
              icon={DollarSign}
              accent="emerald"
            />
            <StatCard
              title="Payout due"
              value={`$${summary.totalPayoutDue.toLocaleString()}`}
              subtitle="Pending settlement"
              icon={Activity}
              accent="brand"
            />
            <StatCard
              title="Monthly completes"
              value={summary.monthlyCompletes}
              subtitle="Placeholder until assignment flow"
              icon={BarChart3}
              accent="sky"
            />
          </div>

          <div className="rounded-2xl border border-dashed border-brand-light bg-brand-subtle/40 p-6">
            <p className="text-sm font-bold text-brand-accent1">Coming next</p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Survey assignment, vendor-specific start links, callback relay, gateway verification
              (IP, country, VPN, fingerprint), and session-level tracking will plug into this
              dashboard without changing your vendor account.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
